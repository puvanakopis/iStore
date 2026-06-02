from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import certifi


class Database:
    client: AsyncIOMotorClient = None
    db = None


db_config = Database()


async def connect_to_mongo():
    db_config.client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tlsCAFile=certifi.where()
    )
    db_config.db = db_config.client[settings.DATABASE_NAME]


async def close_mongo_connection():
    if db_config.client:
        db_config.client.close()


def get_db():
    return db_config.db
