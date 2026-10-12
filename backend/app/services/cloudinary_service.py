import os
import uuid
import shutil
import cloudinary
import cloudinary.uploader
from typing import Optional, Tuple
from app.core.config import settings

_configured = False


def is_cloudinary_configured() -> bool:
    if settings.CLOUDINARY_URL:
        return True
    if (
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_API_KEY
        and settings.CLOUDINARY_API_SECRET
    ):
        return True
    return False


def configure_cloudinary():
    global _configured
    if _configured:
        return

    if settings.CLOUDINARY_URL:
        cloudinary.config(cloudinary_url=settings.CLOUDINARY_URL)
        _configured = True
    elif (
        settings.CLOUDINARY_CLOUD_NAME
        and settings.CLOUDINARY_API_KEY
        and settings.CLOUDINARY_API_SECRET
    ):
        cloudinary.config(
            cloud_name=settings.CLOUDINARY_CLOUD_NAME,
            api_key=settings.CLOUDINARY_API_KEY,
            api_secret=settings.CLOUDINARY_API_SECRET,
            secure=True,
        )
        _configured = True


def upload_image(file_obj, folder: str = "istore/products", filename: Optional[str] = None) -> Tuple[str, Optional[str]]:
    """
    Upload an image file to Cloudinary.
    Falls back gracefully to local storage if Cloudinary credentials are not configured.
    Returns: (image_url, public_id)
    """
    if is_cloudinary_configured():
        configure_cloudinary()
        if hasattr(file_obj, "seek"):
            file_obj.seek(0)
        result = cloudinary.uploader.upload(
            file_obj,
            folder=folder,
            resource_type="image",
            overwrite=True,
        )
        secure_url = result.get("secure_url") or result.get("url")
        return secure_url, result.get("public_id")

    # Fallback to local / tmp storage if Cloudinary is not configured
    upload_dir = os.environ.get(
        "UPLOAD_DIR",
        "uploads" if os.access(".", os.W_OK) else "/tmp/uploads"
    )
    os.makedirs(upload_dir, exist_ok=True)
    ext = os.path.splitext(filename or "image.png")[1]
    unique_name = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(upload_dir, unique_name)

    if hasattr(file_obj, "seek"):
        file_obj.seek(0)

    with open(filepath, "wb") as buffer:
        if hasattr(file_obj, "read"):
            shutil.copyfileobj(file_obj, buffer)
        else:
            buffer.write(file_obj)

    return f"/uploads/{unique_name}", None


def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary by its public_id."""
    if not is_cloudinary_configured() or not public_id:
        return False
    try:
        configure_cloudinary()
        res = cloudinary.uploader.destroy(public_id)
        return res.get("result") == "ok"
    except Exception as e:
        print(f"Cloudinary deletion error: {e}")
        return False
