from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_route
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
import time


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
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_route.router, prefix="/auth", tags=["auth"])

@app.get("/")
def read_root():
    return {"message": "Welcome to iStore Backend API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
