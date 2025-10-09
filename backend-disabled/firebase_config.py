import firebase_admin
from firebase_admin import credentials, firestore
from decouple import config
import base64
import json
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

db = None

try:
    firebase_credentials_b64 = config('FIREBASE_CREDENTIALS_B64')
    if not firebase_credentials_b64 or firebase_credentials_b64.startswith('Cole aqui'):
        raise ValueError("FIREBASE_CREDENTIALS_B64 is not set or is a placeholder.")

    firebase_credentials_bytes = base64.b64decode(firebase_credentials_b64)
    firebase_credentials_json = json.loads(firebase_credentials_bytes)

    cred = credentials.Certificate(firebase_credentials_json)
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    logger.info("Firebase initialized successfully.")

except ValueError as e:
    logger.warning(f"Firebase initialization failed: {e}. The API will run, but Firebase features will be disabled.")
except Exception as e:
    logger.error(f"An unexpected error occurred during Firebase initialization: {e}")

