from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import certifi


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_config = Database()


async def connect_to_mongo():
    try:
        db_config.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tlsCAFile=certifi.where()
        )

        db_config.db = db_config.client[settings.DATABASE_NAME]

        # Verify the connection
        await db_config.client.admin.command("ping")

        print("Successfully connected to MongoDB!")
        print(f"Database: {settings.DATABASE_NAME}")

    except Exception as e:
        print("Failed to connect to MongoDB!")
        print(f"Error: {e}")


async def close_mongo_connection():
    if db_config.client:
        db_config.client.close()
        print("MongoDB connection closed.")


def get_db():
    return db_config.db