import sys
import os
import time

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(CURRENT_DIR)
for path in [CURRENT_DIR, BACKEND_DIR]:
    if path not in sys.path:
        sys.path.insert(0, path)

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routes import auth_route, product_route, order_route, user_route, wishlist_route, agent_route
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection


app = FastAPI(title=settings.PROJECT_NAME)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(
        f"API Call: {request.method} {request.url.path} - Status: {response.status_code} - Time: {process_time:.4f}s")
    return response


@app.on_event("startup")
async def startup_event():
    try:
        await connect_to_mongo()
    except Exception as e:
        print(f"Startup MongoDB connection attempt: {e}")


@app.on_event("shutdown")
async def shutdown_event():
    try:
        await close_mongo_connection()
    except Exception as e:
        print(f"Shutdown MongoDB close attempt: {e}")

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Allow custom production URLs via FRONTEND_URL or CORS_ORIGINS
custom_origin = os.environ.get("FRONTEND_URL")
if custom_origin:
    origins.append(custom_origin.rstrip("/"))

cors_env = os.environ.get("CORS_ORIGINS")
if cors_env:
    for o in cors_env.split(","):
        cleaned = o.strip().rstrip("/")
        if cleaned and cleaned not in origins:
            origins.append(cleaned)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:[0-9]+)?|https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with both direct and /api prefixes for seamless proxying/serverless routing
routers = [
    (auth_route.router, "/auth", ["auth"]),
    (product_route.router, "/products", ["products"]),
    (order_route.router, "/orders", ["orders"]),
    (user_route.router, "/users", ["users"]),
    (wishlist_route.router, "/wishlist", ["wishlist"]),
    (agent_route.router, "/agent", ["agent"]),
]

for r, prefix, tags in routers:
    app.include_router(r, prefix=prefix, tags=tags)
    app.include_router(r, prefix=f"/api{prefix}", tags=tags)

# Serve uploaded static files safely in local and serverless environments
upload_dir = os.environ.get(
    "UPLOAD_DIR",
    "uploads" if os.access(".", os.W_OK) else "/tmp/uploads"
)
try:
    os.makedirs(upload_dir, exist_ok=True)
    app.mount("/uploads", StaticFiles(directory=upload_dir), name="uploads")
    app.mount("/api/uploads", StaticFiles(directory=upload_dir), name="api_uploads")
except Exception as e:
    print(f"Warning: Could not mount uploads directory ({upload_dir}): {e}")


@app.get("/")
@app.get("/api")
@app.get("/api/health")
@app.get("/health")
def read_root():
    return {
        "status": "healthy",
        "message": "Welcome to iStore Backend API",
        "service": "iStore-FastAPI"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

