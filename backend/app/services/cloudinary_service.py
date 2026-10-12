import os
import uuid
import shutil
import re
import cloudinary
import cloudinary.uploader
from typing import Optional, Tuple, List, Dict, Any
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


def extract_public_id(url_or_id: str) -> Optional[str]:
    """
    Extracts the Cloudinary public_id from a Cloudinary URL or returns the id as-is.
    Example:
    https://res.cloudinary.com/demo/image/upload/v1570979139/istore/products/sample.jpg
    -> istore/products/sample
    """
    if not url_or_id or not isinstance(url_or_id, str):
        return None
    if "cloudinary.com" not in url_or_id:
        return url_or_id if not url_or_id.startswith("http") and not url_or_id.startswith("/") else None

    # Matches /upload/(?:v\d+/)?(.*?)(?:\.[a-zA-Z0-9]+)?$
    match = re.search(r"/upload/(?:v\d+/)?(.*?)(?:\.[a-zA-Z0-9]+)?$", url_or_id)
    if match:
        return match.group(1)
    return None


def upload_image(file_obj, folder: str = "istore/products", filename: Optional[str] = None) -> Tuple[str, Optional[str]]:
    """
    Upload an image file object (UploadFile, bytes, or file-like buffer) to Cloudinary.
    Falls back gracefully to local storage if Cloudinary is not configured.
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

    # Local / serverless disk fallback
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


def upload_local_file(filepath: str, folder: str = "istore/products") -> Tuple[Optional[str], Optional[str]]:
    """Uploads a file from local disk to Cloudinary."""
    if not os.path.exists(filepath):
        return None, None
    if not is_cloudinary_configured():
        return None, None

    configure_cloudinary()
    try:
        result = cloudinary.uploader.upload(
            filepath,
            folder=folder,
            resource_type="image",
            overwrite=True,
        )
        return result.get("secure_url") or result.get("url"), result.get("public_id")
    except Exception as e:
        print(f"Failed to upload local file {filepath} to Cloudinary: {e}")
        return None, None


def upload_from_url(image_url: str, folder: str = "istore/products") -> Tuple[Optional[str], Optional[str]]:
    """Uploads an image directly from an external URL to Cloudinary."""
    if not is_cloudinary_configured() or not image_url:
        return None, None
    if "cloudinary.com" in image_url:
        return image_url, extract_public_id(image_url)

    configure_cloudinary()
    try:
        result = cloudinary.uploader.upload(
            image_url,
            folder=folder,
            resource_type="image",
            overwrite=True,
        )
        return result.get("secure_url") or result.get("url"), result.get("public_id")
    except Exception as e:
        print(f"Failed to upload from URL {image_url} to Cloudinary: {e}")
        return None, None


def delete_image(public_id: str) -> bool:
    """Delete an image from Cloudinary by its public_id."""
    if not is_cloudinary_configured() or not public_id:
        return False
    try:
        configure_cloudinary()
        res = cloudinary.uploader.destroy(public_id)
        return res.get("result") in ["ok", "not found"]
    except Exception as e:
        print(f"Cloudinary deletion error for {public_id}: {e}")
        return False


def delete_image_by_url(url: str) -> bool:
    """Extract public_id from Cloudinary URL and delete it."""
    public_id = extract_public_id(url)
    if public_id:
        return delete_image(public_id)
    return False
