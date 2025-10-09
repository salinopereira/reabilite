
import firebase_admin
from firebase_admin import credentials, firestore, messaging

try:
    # Tenta inicializar o app a partir do arquivo de chave de serviço
    # O caminho é relativo ao WORKDIR no Dockerfile, que é /app
    cred = credentials.Certificate("serviceAccountKey.json") 
    firebase_admin.initialize_app(cred)
    print("Firebase Admin SDK inicializado com sucesso.")
except Exception as e:
    print(f"Erro ao inicializar Firebase Admin SDK: {e}")
    print("Certifique-se de que o arquivo 'serviceAccountKey.json' existe na raiz do diretório 'backend' e é válido.")

db = firestore.client()
