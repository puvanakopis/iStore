from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth
from app.core.config import settings
from app.core.database import connect_to_mongo, close_mongo_connection
import logging

app = FastAPI(title=settings.PROJECT_NAME)


@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])


@app.get("/")
def read_root():
    return {"message": "Welcome to iStore Backend API"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
