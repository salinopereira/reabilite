from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import professionals, appointments, ratings, posts

# Initialize Firebase Admin SDK
from . import firebase_config

app = FastAPI(
    title="Reabilite Pro API",
    description="API para gerenciar dados de pacientes e profissionais da plataforma Reabilite Pro.",
    version="1.0.0",
)

# CORS Configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"], summary="Verifica a saúde da API")
async def read_root():
    return {"status": "ok", "message": "Bem-vindo à API Reabilite Pro!"}

# Include your routers
app.include_router(professionals.router, prefix="/api", tags=["Professionals"])
app.include_router(appointments.router, prefix="/api", tags=["Appointments"])
app.include_router(ratings.router, prefix="/api", tags=["Ratings"])
app.include_router(posts.router, prefix="/api", tags=["Posts"])
