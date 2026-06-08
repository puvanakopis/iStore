import re
from langchain_classic.agents import AgentExecutor, create_tool_calling_agent
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.tools import tool
from typing import List, Any, Optional

from app.core.config import get_llm
from app.agent.tools.auth import chat_history_var
from app.agent.agents.product_agent import get_product_agent_executor
from app.agent.agents.order_agent import get_order_agent_executor
from app.agent.agents.wishlist_agent import get_wishlist_agent_executor

WISHLIST_ROUTE_PATTERN = re.compile(
    r"\b(wishlist|wish list|favorites?|favourites?)\b",
    re.IGNORECASE,
)
ORDER_ROUTE_PATTERN = re.compile(
    r"\b(order|orders|buy|purchase|checkout|track(?:ing)?|cancel(?:led|lation)?)\b",
    re.IGNORECASE,
)
PRODUCT_ROUTE_PATTERN = re.compile(
    r"\b(search|find|browse|product|products|iphone|ipad|mac|price|spec|specs?|"
    r"recommend|trending|available|show me|list|catalog|detail|details|explain|"
    r"tell me about|what are|colors?|storage)\b",
    re.IGNORECASE,
)
PRODUCT_FLOW_MARKERS = re.compile(
    r"\b(here are all the available products|let me know if you.d like full details|"
    r"results for|available products in iStore)\b",
    re.IGNORECASE,
)
ORDER_FLOW_MARKERS = re.compile(
    r"\b(available colors?|available storage|how many|quantity|shall I place|"
    r"please confirm|confirm to proceed|order summary|preferred color)\b",
    re.IGNORECASE,
)


def _is_ongoing_order_flow(chat_history: List[Any]) -> bool:
    """Keep multi-turn purchase conversations on the order agent."""
    if not chat_history:
        return False

    recent = chat_history[-8:]

    for msg in reversed(recent):
        if isinstance(msg, AIMessage) and "Order placed successfully" in (msg.content or ""):
            return False

    for msg in recent:
        if isinstance(msg, HumanMessage) and ORDER_ROUTE_PATTERN.search(msg.content or ""):
            return True

    for msg in reversed(recent):
        if isinstance(msg, AIMessage) and ORDER_FLOW_MARKERS.search(msg.content or ""):
            return True

    return False


def _is_ongoing_product_flow(chat_history: List[Any], message: str) -> bool:
    """Keep multi-turn product browsing on the product agent."""
    if not chat_history:
        return False

    recent = chat_history[-8:]
    had_product_listing = any(
        isinstance(msg, AIMessage) and PRODUCT_FLOW_MARKERS.search(msg.content or "")
        for msg in recent
    )
    if not had_product_listing:
        return False

    if ORDER_ROUTE_PATTERN.search(message):
        return False

    return bool(
        PRODUCT_ROUTE_PATTERN.search(message)
        or re.search(r"\b(iPhone|iPad|MacBook|Mac|AirPods|Watch)\b", message, re.IGNORECASE)
        or re.search(r"product_\d+", message, re.IGNORECASE)
    )


def detect_specialist_route(message: str, chat_history: List[Any] | None = None) -> Optional[str]:
    """Route clear intents directly to specialist agents."""
    if WISHLIST_ROUTE_PATTERN.search(message):
        return "wishlist"
    if ORDER_ROUTE_PATTERN.search(message):
        return "order"
    if chat_history and _is_ongoing_order_flow(chat_history):
        return "order"
    if PRODUCT_ROUTE_PATTERN.search(message):
        return "product"
    if chat_history and _is_ongoing_product_flow(chat_history, message):
        return "product"
    return None


async def _run_specialist(route: str, input_text: str, chat_history: List[Any]) -> str:
    if route == "wishlist":
        executor = get_wishlist_agent_executor()
    elif route == "order":
        executor = get_order_agent_executor()
    elif route == "product":
        executor = get_product_agent_executor()
    else:
        raise ValueError(f"Unknown route: {route}")

    result = await executor.ainvoke({
        "input": input_text,
        "chat_history": chat_history,
    })
    return result["output"]


# return_direct=True skips a final LLM synthesis call after the specialist responds,
# cutting Groq API usage roughly in half per routed request.
@tool(return_direct=True)
async def talk_to_product_agent(query: str) -> str:
    """Use this tool when the query is about browsing, searching, looking up product details,
    viewing specifications, colors, or getting recommendations/trending items.
    """
    executor = get_product_agent_executor()
    history = chat_history_var.get()
    res = await executor.ainvoke({"input": query, "chat_history": history})
    return res["output"]


@tool(return_direct=True)
async def talk_to_order_agent(query: str) -> str:
    """Use this tool when the user wants to buy, order, purchase, or checkout a product,
    place an order, view order history, or cancel a pending order.
    Handles the full purchase flow including finding products and placing orders.
    """
    executor = get_order_agent_executor()
    history = chat_history_var.get()
    res = await executor.ainvoke({"input": query, "chat_history": history})
    return res["output"]


@tool(return_direct=True)
async def talk_to_wishlist_agent(query: str) -> str:
    """Use this tool when the query is about viewing, adding, removing, or clearing the wishlist.
    """
    executor = get_wishlist_agent_executor()
    history = chat_history_var.get()
    res = await executor.ainvoke({"input": query, "chat_history": history})
    return res["output"]


ROUTER_TOOLS = [
    talk_to_product_agent,
    talk_to_order_agent,
    talk_to_wishlist_agent,
]

MAIN_ROUTER_SYSTEM_PROMPT = """You are the Main Router Agent for the iStore customer assistant. Your job is to orchestrate conversation and route requests to the correct specialist agents (Product Agent, Order Agent, or Wishlist Agent).

Rules:
1. Always route user queries to the appropriate specialist agent using the available tools.
2. Route to the **Order Agent** when the user wants to buy, order, purchase, or checkout — even if they name a specific product (e.g. "I want to order the iPhone 16"). The Order Agent handles the full purchase flow.
3. Route to the **Product Agent** for browsing, searching, or product info when the user is NOT trying to buy.
4. If the user query is generic (e.g. "Hi", "Who are you?", "Help me"), reply directly to the user in a friendly way, explaining that you can help them browse products, manage their wishlist, checkout products, and track orders.
5. Maintain a premium, polite, and helpful tone fitting for a premium Apple reseller (iStore).
6. IMPORTANT: DO NOT include any images, image URLs, or markdown image tags in your response. The chat bot must only display text.
7. When using tools, ensure you only pass the exact required parameters.
8. CRITICAL: Once a specialist agent tool returns a result, relay that result to the user as your final response immediately. Do NOT call the tool again in a loop.
9. NEVER tell the user to visit the website or click buttons manually — the agents handle actions via tools.
"""

_main_executor: AgentExecutor | None = None


def get_main_agent_executor() -> AgentExecutor:
    global _main_executor
    if _main_executor is not None:
        return _main_executor

    llm = get_llm(temperature=0.0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", MAIN_ROUTER_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, ROUTER_TOOLS, prompt)
    _main_executor = AgentExecutor(
        agent=agent,
        tools=ROUTER_TOOLS,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=2,
        early_stopping_method="force",
    )
    return _main_executor


async def run_agent(input_text: str, chat_history: List[Any] = None) -> str:
    """Main entrypoint to run the router agent."""
    if chat_history is None:
        chat_history = []

    route = detect_specialist_route(input_text, chat_history)
    if route:
        return await _run_specialist(route, input_text, chat_history)

    executor = get_main_agent_executor()
    try:
        result = await executor.ainvoke({
            "input": input_text,
            "chat_history": chat_history,
        })
        return result["output"]
    except Exception as error:
        error_text = str(error)
        if "talk_to_order_agent" in error_text or "tool_use_failed" in error_text:
            return await _run_specialist("order", input_text, chat_history)
        if "talk_to_wishlist_agent" in error_text:
            return await _run_specialist("wishlist", input_text, chat_history)
        if "talk_to_product_agent" in error_text:
            return await _run_specialist("product", input_text, chat_history)
        raise
