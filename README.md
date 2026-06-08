# iStore – AI-Powered E‑commerce Platform

iStore is a full‑stack e‑commerce platform for a premium Apple reseller. It combines a modern Next.js frontend with a FastAPI backend that leverages LangChain agents to provide a conversational shopping assistant. Customers can browse products, manage wishlists, place orders, and track their order history – all through natural language.

---

## ✨ Key Features

### 🤖 Conversational AI Assistant – Three specialized LangChain agents:
- **Product Agent** – Browse, search, view details, get recommendations & trending items.
- **Order Agent** – Guided multi‑step order placement, order history, and cancellation.
- **Wishlist Agent** – Add/remove items, view and clear wishlist.

- **Authentication & Security** – JWT‑based auth, OTP email verification, password reset.
- **Complete E‑commerce Backend** – Product, order, user & wishlist management (MongoDB).
- **Modern Frontend** – Next.js 14 (App Router), Tailwind CSS, fully responsive.
- **Admin Dashboard** – Role‑based access for managing products, users & orders.
- **RESTful APIs** – Clear separation of routes for auth, products, orders, users, wishlist.

---

## 🧱 Tech Stack

### Frontend
- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- React Context for state & auth

### Backend
- FastAPI (Python 3.10+)
- MongoDB + Motor (async driver)
- LangChain (classic agents, tool calling)
- Groq (LLM inference – fast Mixtral/LLaMA3)
- JWT for authentication
- Pydantic v2 + email‑validator

### AI Agent Tools
- Custom tools for product search, order placement, wishlist operations.
- ContextVars to pass user identity & chat history to tools.
- Smart routing between specialist agents (detects intent via regex + conversation flow).

---

## 📂 Project Structure

```
istore/
├── frontend/                # Next.js application
│   ├── app/                 # App router pages & layouts
│   ├── components/          # Reusable UI components
│   ├── contexts/            # Auth & cart contexts
│   ├── interfaces/          # TypeScript types
│   ├── services/            # API service layer
│   └── public/              # Static assets
│
├── backend/
│   ├── app/
│   │   ├── agent/           # LangChain agents & tools
│   │   │   ├── agents/      # Product, Order, Wishlist, Main Router
│   │   │   ├── tools/       # Order, product, wishlist tools
│   │   │   └── utils.py
│   │   ├── core/            # Config, DB, security, LLM factory
│   │   ├── middleware/      # Auth middleware
│   │   ├── models/          # MongoDB models (ODM)
│   │   ├── routes/          # FastAPI route modules
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── services/        # Business logic
│   │   └── utils/           # OTP helpers, sanitization
│   ├── uploads/             # Product images (admin uploads)
│   ├── .env                 # Environment variables
│   └── main.py              # FastAPI entrypoint
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/pnpm
- Python 3.10+
- MongoDB instance (local or Atlas)
- Groq API key (for LLM)

### Backend Setup

1. **Clone & navigate**
```bash
git clone https://github.com/puvanakopis/istore.git
cd istore/backend
```

2. **Create virtual environment**
```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
.venv\Scripts\activate      # Windows
```

3. **Install dependencies**
```bash
uv sync
```
> If `requirements.txt` is missing, install manually:
> `uv add fastapi uvicorn motor python-dotenv langchain langchain-classic langchain-core groq pydantic python-jose passlib bcrypt email-validator pillow`

4. **Environment variables** – create `.env` in `backend/`:
```ini
MONGO_URI=mongodb://localhost:27017
DB_NAME=istore
SECRET_KEY=your_jwt_secret_key_change_me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
GROQ_API_KEY=your_groq_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FRONTEND_URL=http://localhost:3000
```

5. **Run MongoDB** (local or start Atlas cluster)

6. **Start the backend server**
```bash
uvicorn main:app --reload --port 8000
```
> API docs available at http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend folder**
```bash
cd ../frontend
```

2. **Install dependencies**
```bash
npm install
# or
pnpm install
```

3. **Environment variables** – create `.env.local` in `frontend/`:
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Run development server**
```bash
npm run dev
```
Open http://localhost:3000

---

## 🤖 AI Agent Architecture

The assistant uses a hierarchical agent design to reduce latency and cost:

- **Main Router Agent** – Decides which specialist to call (or replies directly). Uses regex + conversation history to detect ongoing flows.
- **Product Agent** – Handles `list_products`, `search_products`, `get_product_details`, `get_trending_products`, `get_recommendations`.
- **Order Agent** – Guides the user through a 4‑step purchase flow:
  1. Call `get_product_order_options` → show colors/storage.
  2. Ask for quantity.
  3. Confirm order summary.
  4. Call `order_product_by_name` or `place_product_order`.
- **Wishlist Agent** – Manages wishlist via `get_my_wishlist`, `add_item_to_wishlist`, `remove_item_from_wishlist`, `clear_my_wishlist`.

> All tools are asynchronous and receive the logged‑in user via `ContextVar`. The agents never ask users to visit the website or fill forms manually – everything happens via tool calls.

---

## 📡 API Endpoints (Backend)

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register + send OTP |
| POST | `/auth/verify-otp` | Verify email OTP |
| POST | `/auth/login` | Login → JWT + user object |
| POST | `/auth/forgot-password` | Request password reset OTP |
| POST | `/auth/reset-password` | Reset password with OTP |
| GET | `/auth/me` | Get current user profile |
| PUT | `/auth/me` | Update profile |
| PUT | `/auth/change-password` | Change password |
| DELETE | `/auth/me` | Delete account |

### Products

| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/products/` | all |
| GET | `/products/search?q=` | all |
| GET | `/products/trending` | all |
| GET | `/products/recommendations/{id}` | all |
| GET | `/products/{id}` | all |
| POST | `/products/upload` | admin |
| POST | `/products/` | admin |
| PUT | `/products/{id}` | admin |
| DELETE | `/products/{id}` | admin |

### Orders

| Method | Endpoint | Role |
|--------|----------|------|
| POST | `/orders/` | user |
| GET | `/orders/` | user |
| GET | `/orders/all` | admin |
| PUT | `/orders/{id}` | admin |
| DELETE | `/orders/{id}` | admin |

### Wishlist

| Method | Endpoint | Role |
|--------|----------|------|
| GET | `/wishlist/` | user |
| POST | `/wishlist/add` | user |
| POST | `/wishlist/remove` | user |
| DELETE | `/wishlist/clear` | user |

### Chat (AI Agent)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chat/chat` | Send message, get agent response |

**Request body:**
```json
{
  "message": "I want to order iPhone 14",
  "history": [
    { "role": "user", "content": "Hi" },
    { "role": "assistant", "content": "Hello! How can I help?" }
  ]
}
```

**Response:**
```json
{ "response": "Here are the available colors for iPhone 14..." }
```

---

## 🧪 Example Conversation

**User:** I want to buy an iPhone 14 Pro.

**Assistant (Order Agent):**
> Here are the available options for iPhone 14 Pro (ID: prod_123):
> Colors: Space Black, Silver, Gold, Deep Purple
> Storage: 128GB – Rs. 329,900 | 256GB – Rs. 369,900 | 512GB – Rs. 449,900
>
> Please tell me your preferred color and storage.

**User:** Deep Purple, 256GB.

**Assistant:** How many units would you like?

**User:** One.

**Assistant:**
> Order summary:
> - Product: iPhone 14 Pro
> - Color: Deep Purple
> - Storage: 256GB
> - Quantity: 1
> - Unit price: Rs. 369,900
>
> Shall I place this order? Please confirm.

**User:** Yes, place it.

**Assistant:**
> ✅ Order placed successfully!
> - Order ID: ord_abc123
> - Status: Pending
> - Total: Rs. 369,900

---

## 🔧 Development Tips

- **Testing agents locally** – Use `backend/tests/test_agent.py` (if created) or run `curl` against `/chat/chat`.
- **Adding new tools** – Place them in `app/agent/tools/`, register in the corresponding agent's `TOOLS` list.
- **Changing LLM** – Edit `app/core/config.py` → `get_llm()` (supports Groq, OpenAI, or any LangChain LLM).
- **Admin access** – Set a user's `role` to `"admin"` in MongoDB to access admin endpoints.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Name:** Puvanakopis  
**GitHub:** [@puvanakopis](https://github.com/puvanakopis)  
**LinkedIn:** [Puvanakopis](https://www.linkedin.com/in/puvanakopis/)  
**Email:** puvanakopis@gamil.com

---

Happy shopping with iStore! 🍏
