from langchain_classic.agents import AgentExecutor
from langchain_classic.agents import create_tool_calling_agent
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from app.core.config import get_llm
from app.agent.tools.wishlist_tools import (
    get_my_wishlist,
    add_item_to_wishlist,
    remove_item_from_wishlist,
    clear_my_wishlist
)

WISHLIST_TOOLS = [
    get_my_wishlist,
    add_item_to_wishlist,
    remove_item_from_wishlist,
    clear_my_wishlist
]

WISHLIST_AGENT_SYSTEM_PROMPT = """You are the specialized Wishlist Agent for iStore. Your job is to help customers manage their wishlist (add items to wishlist, view wishlist, search wishlist items, remove items from wishlist, clear wishlist).

Key Guidelines:
1. Only use the provided wishlist tools. Never invent tools such as log_in or login.
2. If a tool returns an authentication error, politely ask the user to sign in on the website and do not call any other tools.
3. Use `get_my_wishlist` to view items. If the user searches or asks about a specific product in their wishlist (e.g. "is iPhone in my wishlist?", "show wishlist items matching Mac"), pass `search_query` (e.g. `search_query="iPhone"`).
4. Provide friendly confirmations when adding or removing items.
5. Do NOT include any emojis or icons in your responses. Keep responses clean plain text.
"""

_wishlist_executor: AgentExecutor | None = None


def get_wishlist_agent_executor() -> AgentExecutor:
    global _wishlist_executor
    if _wishlist_executor is not None:
        return _wishlist_executor

    llm = get_llm(temperature=0.0)
    prompt = ChatPromptTemplate.from_messages([
        ("system", WISHLIST_AGENT_SYSTEM_PROMPT),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])

    agent = create_tool_calling_agent(llm, WISHLIST_TOOLS, prompt)
    _wishlist_executor = AgentExecutor(
        agent=agent,
        tools=WISHLIST_TOOLS,
        verbose=True,
        handle_parsing_errors=True,
        max_iterations=3,
        early_stopping_method="force",
    )
    return _wishlist_executor
