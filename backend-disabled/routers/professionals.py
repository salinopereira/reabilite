from fastapi import APIRouter, HTTPException
from ..firebase_config import db

router = APIRouter()

@router.get("/professionals")
def get_professionals():
    if db is None:
        raise HTTPException(
            status_code=503, 
            detail="Firebase is not configured. Please set the FIREBASE_CREDENTIALS_B64 environment variable."
        )
    try:
        professionals_ref = db.collection('professionals')
        professionals = [doc.to_dict() for doc in professionals_ref.stream()]
        return professionals
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while fetching professionals: {e}")
