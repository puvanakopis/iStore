# iStore – AI-Powered E‑commerce Platform

iStore is a full‑stack e‑commerce platform for a premium Apple reseller. It combines a modern **Next.js** frontend with a **FastAPI** backend that leverages **LangChain agents** to provide a conversational shopping assistant. Customers can browse products, manage wishlists, place orders, and track their order history — all through natural language.

The entire stack is **Dockerized** and ready to run with a single `docker compose up` command.

---

## ✨ Key Features

### 🤖 Conversational AI Assistant – Three specialized LangChain agents:
- **Product Agent** – Browse, search, view details, get recommendations & trending items.
- **Order Agent** – Guided multi‑step order placement, order history, and cancellation.
- **Wishlist Agent** – Add/remove items, view and clear wishlist.

- **Authentication & Security** – JWT‑based auth, OTP email verification, password reset.
- **Complete E‑commerce Backend** – Product, order, user & wishlist management (MongoDB Atlas).
- **Modern Frontend** – Next.js 14 (App Router), Tailwind CSS, fully responsive.
- **Admin Dashboard** – Role‑based access for managing products, users & orders.
- **RESTful APIs** – Clear separation of routes for auth, products, orders, users, wishlist.
- **Docker Ready** – Multi‑stage Dockerfiles + Docker Compose for one-command deployment.

---

## 🧱 Tech Stack

### Frontend
- **Next.js 14** (App Router, standalone output)
- **Tailwind CSS**
- **TypeScript**
- **React Context** for state & auth
- **Node.js 20** (Alpine) runtime image

### Backend
- **FastAPI** (Python 3.13+)
- **MongoDB Atlas** + Motor (async driver)
- **LangChain** (agents, tool calling) + **LangGraph**
- **Groq** (LLM inference – LLaMA 3.1)
- **JWT** for authentication (python-jose)
- **Pydantic v2** + email‑validator
- **uv** for fast dependency management
- **Python 3.13‑slim** runtime image

### AI Agent Tools
- Custom tools for product search, order placement, wishlist operations.
- ContextVars to pass user identity & chat history to tools.
- Smart routing between specialist agents (detects intent via regex + conversation flow).

### Infrastructure
- **Docker** (multi-stage builds)
- **Docker Compose** (orchestration with health checks)
- **MongoDB Atlas** (cloud database)

---

## 📂 Project Structure

```
iStore/
├── docker-compose.yml       # Orchestrates backend + frontend containers
├── .dockerignore            # Root-level Docker ignore rules
├── README.md
│
├── frontend/                # Next.js application
│   ├── Dockerfile           # 3-stage: deps → builder → runtime
│   ├── .dockerignore
│   ├── app/                 # App router pages & layouts
│   ├── components/          # Reusable UI components
│   ├── contexts/            # Auth & cart contexts
│   ├── interfaces/          # TypeScript types
│   ├── services/            # API service layer
│   ├── utils/               # Utility helpers
│   └── public/              # Static assets
│
└── backend/
    ├── Dockerfile           # 2-stage: builder → runtime
    ├── .dockerignore
    ├── pyproject.toml       # uv dependencies
    ├── uv.lock              # Locked dependency tree
    ├── uploads/             # Product images (mounted as volume)
    └── app/
        ├── main.py          # FastAPI entrypoint
        ├── agent/           # LangChain agents & tools
        │   ├── agents/      # Product, Order, Wishlist, Main Router
        │   ├── tools/       # Order, product, wishlist tools
        │   └── utils.py
        ├── core/            # Config, DB, security, LLM factory
        ├── middleware/      # Auth middleware
        ├── models/          # MongoDB models
        ├── routes/          # FastAPI route modules
        ├── schemas/         # Pydantic schemas
        ├── services/        # Business logic
        └── utils/           # OTP helpers, sanitization
```

---

## 🐳 Docker Deployment (Recommended)

This is the fastest way to get the full stack running locally.

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- A MongoDB Atlas connection string
- A Groq API key

### 1. Clone the repository
```bash
git clone https://github.com/puvanakopis/istore.git
cd istore
```

### 2. Configure the backend environment
Create the file `backend/.env`:
```ini
# MongoDB Atlas
MONGODB_URL=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0
DATABASE_NAME=istore_db

# JWT
SECRET_KEY=your_jwt_secret_key_change_me
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OTP
OTP_EXPIRE_MINUTES=10

# Email (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
EMAILS_FROM_EMAIL=your_email@gmail.com
EMAILS_FROM_NAME=iStore
USE_MOCK_EMAIL=False

# Groq AI
MODEL_PROVIDER=groq
LLM_MODEL_NAME=llama-3.1-8b-instant
GROQ_API_KEY=your_groq_api_key
```

### 3. Build and start all services
```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend (Next.js) | http://localhost:3000 |
| Backend (FastAPI) | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

### 4. Stop all services
```bash
docker compose down
```

### Useful Docker Commands

```bash
# Run in detached (background) mode
docker compose up --build -d

# View live logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend

# Rebuild only one service
docker compose up --build backend

# Remove containers and volumes
docker compose down -v
```

### Docker Architecture

```
┌─────────────────────────────────────────────────┐
│                  istore_network                  │
│                                                  │
│  ┌──────────────────┐    ┌───────────────────┐  │
│  │  istore_frontend │    │  istore_backend   │  │
│  │  Next.js :3000   │───▶│  FastAPI   :8000  │  │
│  │  (node:20-alpine)│    │  (python3.13-slim)│  │
│  └──────────────────┘    └───────────────────┘  │
│                                  │               │
│                          ┌───────▼───────┐       │
│                          │ ./backend/    │       │
│                          │ uploads/      │       │
│                          │ (bind mount)  │       │
│                          └───────────────┘       │
└─────────────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │ MongoDB     │
                    │ Atlas Cloud │
                    └─────────────┘
```

**Key details:**
- Both services share `istore_network` (bridge driver).
- Frontend waits for the backend to pass its health check before starting (`depends_on: condition: service_healthy`).
- The `backend/uploads/` directory is bind-mounted into the container so uploaded product images persist across restarts.
- The frontend image is built with `NEXT_PUBLIC_API_URL=http://localhost:8000` baked in at build time.

---

## 🚀 Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+ and npm
- Python 3.13+
- MongoDB Atlas account (or local MongoDB)
- Groq API key

### Backend Setup

1. **Clone & navigate**
```bash
git clone https://github.com/puvanakopis/istore.git
cd istore/backend
```

2. **Install uv (fast Python package manager)**
```bash
pip install uv
```

3. **Create virtual environment & install dependencies**
```bash
uv sync
```

4. **Activate virtual environment**
```bash
# Linux/macOS
source .venv/bin/activate

# Windows
.venv\Scripts\activate
```

5. **Create `backend/.env`** – see the [Docker env template](#2-configure-the-backend-environment) above.

6. **Start the backend server**
```bash
uvicorn app.main:app --reload --port 8000
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
```

3. **Create `.env.local` in `frontend/`:**
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

The assistant uses a **hierarchical agent design** to reduce latency and cost:

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

- **Testing agents locally** – Use `curl` against `/chat/chat` or the Swagger UI at http://localhost:8000/docs.
- **Adding new tools** – Place them in `app/agent/tools/`, register in the corresponding agent's `TOOLS` list.
- **Changing LLM** – Edit `app/core/config.py` → `get_llm()` (supports Groq, OpenAI, or any LangChain-compatible LLM).
- **Admin access** – Set a user's `role` to `"admin"` in MongoDB to unlock admin endpoints.
- **Product images** – Uploaded via `/products/upload` and served as static files from `backend/uploads/`. In Docker, this directory is bind-mounted so images persist across container restarts.
- **Mock emails** – Set `USE_MOCK_EMAIL=True` in `.env` to skip actual SMTP during development.

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
**Email:** puvanakopis@gmail.com

---

Happy shopping with iStore! 🍏