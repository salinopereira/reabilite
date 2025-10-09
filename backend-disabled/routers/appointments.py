from fastapi import APIRouter, HTTPException, Body, Depends, Query
from typing import List, Dict, Any
from firebase_admin import firestore
import datetime

db = firestore.client()
router = APIRouter()

@router.post("/marcar_consulta", summary="Marca uma nova consulta")
async def marcar_consulta(consulta: Dict[str, Any] = Body(...)):
    """
    Registra uma nova consulta no Firestore.
    - **pacienteId**: ID do paciente.
    - **profissionalId**: ID do profissional.
    - **data**: Data da consulta (YYYY-MM-DD).
    - **hora**: Hora da consulta (HH:MM).
    """
    try:
        consulta["status"] = "pendente" # Status inicial
        consulta["criado_em"] = datetime.datetime.now(datetime.timezone.utc)
        db.collection('consultas').add(consulta)
        return {"status": "sucesso", "message": "Consulta marcada com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/consultas_usuario", summary="Busca as consultas de um usuário")
async def get_consultas_usuario(id: str = Query(..., description="ID do usuário (paciente ou profissional)")):
    """
    Retorna todas as consultas associadas a um ID de usuário.
    """
    try:
        consultas = []
        # Query for both paciente and profissional fields
        paciente_query = db.collection('consultas').where('pacienteId', '==', id).stream()
        for doc in paciente_query:
            consultas.append({**doc.to_dict(), 'id': doc.id})
        
        profissional_query = db.collection('consultas').where('profissionalId', '==', id).stream()
        for doc in profissional_query:
             if doc.id not in [c['id'] for c in consultas]: # Avoid duplicates
                consultas.append({**doc.to_dict(), 'id': doc.id})

        return {"status": "sucesso", "consultas": consultas}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
