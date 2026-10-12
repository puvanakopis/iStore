import sys
import os

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(CURRENT_DIR)
BACKEND_DIR = os.path.join(ROOT_DIR, "backend")

for p in [BACKEND_DIR, os.path.join(BACKEND_DIR, "app"), ROOT_DIR]:
    if p not in sys.path:
        sys.path.insert(0, p)

from app.main import app
