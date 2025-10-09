from fastapi import APIRouter, HTTPException, Body
from typing import Dict, Any
from firebase_admin import firestore
import datetime

db = firestore.client()
router = APIRouter()

@router.post("/avaliar_profissional", summary="Avalia um profissional")
async def avaliar_profissional(avaliacao: Dict[str, Any] = Body(...)):
    """
    Registra uma nova avaliação para um profissional.
    - **pacienteId**: ID do paciente que está avaliando.
    - **profissionalId**: ID do profissional sendo avaliado.
    - **nota**: Nota da avaliação (1 a 5).
    - **comentario**: Comentário da avaliação.
    """
    try:
        avaliacao["criado_em"] = datetime.datetime.now(datetime.timezone.utc)
        db.collection('avaliacoes').add(avaliacao)
        return {"status": "sucesso", "message": "Avaliação enviada com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
