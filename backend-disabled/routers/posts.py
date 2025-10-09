from fastapi import APIRouter, HTTPException, Body, Depends, Query
from typing import List, Dict, Any
from firebase_admin import firestore
import datetime

db = firestore.client()
router = APIRouter()

@router.post("/posts", summary="Cria um novo post")
async def create_post(post: Dict[str, Any] = Body(...)):
    """
    Cria um novo post no Firestore.
    - **autorId**: ID do autor do post.
    - **texto**: Conteúdo do post.
    - **imagemURL**: URL da imagem (opcional).
    """
    try:
        post["curtidas"] = []
        post["data"] = datetime.datetime.now(datetime.timezone.utc)
        db.collection('posts').add(post)
        return {"status": "sucesso", "message": "Post criado com sucesso!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/posts", summary="Lista todos os posts")
async def get_posts():
    """
    Retorna todos os posts do feed.
    """
    try:
        posts = []
        posts_query = db.collection('posts').order_by('data', direction=firestore.Query.DESCENDING).stream()
        for doc in posts_query:
            posts.append({**doc.to_dict(), 'id': doc.id})
        return {"status": "sucesso", "posts": posts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
