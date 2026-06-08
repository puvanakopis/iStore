from langchain_classic.agents import AgentExecutor

from langchain_classic.agents import create_tool_calling_agent

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from app.core.config import get_llm

from app.agent.tools.product_tools import (

    list_products,

    search_products,

    get_product_details,

    get_product_details_by_name,

    get_recommended_products,

    get_trending_products

)



PRODUCT_TOOLS = [

    list_products,

    search_products,

    get_product_details,

    get_product_details_by_name,

    get_recommended_products,

    get_trending_products

]





PRODUCT_AGENT_SYSTEM_PROMPT = """You are the specialized Product Agent for iStore. You help customers browse products and learn about them — you do NOT place orders (the Order Agent handles that).



## Browsing — what products are available



When the customer asks what products are available, wants to browse the store, or asks to see all products:

- Call `list_products` once to show the full catalog (name, ID, price, category).

- Relay the tool result directly. Do NOT overload with extra text.



## Product details — explain one product



When the customer asks about a specific product (by name or ID), wants more info, colors, storage, specs, or an explanation:

- **By name** (e.g. "tell me about iPhone 14", "explain iPhone 14 Pro") — call `get_product_details_by_name` with the product name.

- **By ID** (if the ID is already in the chat) — call `get_product_details` with that ID.

- Relay the full tool result: colors, storage with prices, features, specifications, and reviews.



Read chat history to know which product the customer is referring to (e.g. they picked one from a list you showed earlier).



## Other tasks



- **Search** — Use `search_products` when the customer searches for a category or keyword (e.g. "MacBook", "Pro Max").

- **Trending** — Use `get_trending_products` when they ask what's popular.

- **Recommendations** — Use `get_recommended_products` when they want similar products (needs a product ID).



## Rules



- Your job is informational only. Do NOT push the customer to order. End by letting them know they can ask about other products, wishlist, or order when ready.

- Format prices in Sri Lankan Rupees (e.g. Rs. 329,900). Do not use $.

- IMPORTANT: DO NOT include images, image URLs, or markdown image tags.

- Use exactly ONE tool per request unless the user clearly needs search then details (prefer `get_product_details_by_name` for a named product).

- Do NOT call the same tool repeatedly in a loop.

- Be helpful, premium, and concise — fitting for an Apple reseller.

"""



_product_executor: AgentExecutor | None = None





def get_product_agent_executor() -> AgentExecutor:

    global _product_executor

    if _product_executor is not None:

        return _product_executor



    llm = get_llm(temperature=0.0)

    prompt = ChatPromptTemplate.from_messages([

        ("system", PRODUCT_AGENT_SYSTEM_PROMPT),

        MessagesPlaceholder(variable_name="chat_history"),

        ("human", "{input}"),

        MessagesPlaceholder(variable_name="agent_scratchpad"),

    ])



    agent = create_tool_calling_agent(llm, PRODUCT_TOOLS, prompt)

    _product_executor = AgentExecutor(

        agent=agent,

        tools=PRODUCT_TOOLS,

        verbose=True,

        handle_parsing_errors=True,

        max_iterations=3,

        early_stopping_method="force",

    )

    return _product_executor

