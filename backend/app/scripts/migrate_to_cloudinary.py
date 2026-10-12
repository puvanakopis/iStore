import asyncio
import os
import sys

# Ensure backend root is on sys.path
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
APP_DIR = os.path.dirname(SCRIPT_DIR)
BACKEND_DIR = os.path.dirname(APP_DIR)
for p in [BACKEND_DIR, APP_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from app.core.config import settings
from app.services import cloudinary_service, product_service


async def main():
    print("=" * 60)
    print("iStore: Migrate Product Images to Cloudinary")
    print("=" * 60)

    if not cloudinary_service.is_cloudinary_configured():
        print("\n[ERROR] Cloudinary is not configured!")
        print("Please set the following environment variables in backend/.env:")
        print("  CLOUDINARY_CLOUD_NAME=your_cloud_name")
        print("  CLOUDINARY_API_KEY=your_api_key")
        print("  CLOUDINARY_API_SECRET=your_api_secret")
        print("or")
        print("  CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>\n")
        return

    print("[1/2] Connecting to MongoDB...")
    client = AsyncIOMotorClient(
        settings.MONGODB_URL,
        tlsCAFile=certifi.where()
    )
    db = client[settings.DATABASE_NAME]

    print("[2/2] Scanning products and migrating local images to Cloudinary...")
    try:
        result = await product_service.migrate_all_product_images_to_cloudinary(db)
        print("\n" + "=" * 60)
        print("Migration Summary:")
        print(f"  Products updated: {result.get('migrated_products')}")
        print(f"  Images uploaded to Cloudinary: {result.get('migrated_images')}")
        if result.get('failed_images', 0) > 0:
            print(f"  Images failed: {result.get('failed_images')}")
        print("=" * 60)
        print("Done! All updated image URLs in MongoDB are now permanent Cloudinary URLs.")
    except Exception as e:
        print(f"\n[ERROR] Migration failed: {e}")
    finally:
        client.close()


if __name__ == "__main__":
    asyncio.run(main())
