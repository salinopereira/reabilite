# Use uma imagem base oficial do Python.
FROM python:3.9-slim

# Define o diretório de trabalho no contêiner
WORKDIR /app

# Copia o arquivo de dependências para o diretório de trabalho
COPY requirements.txt .

# Instala as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copia o restante do código da aplicação para o diretório de trabalho
COPY . .

# O Cloud Run define a variável de ambiente PORT. Usamos o shell para substituí-la.
# O host 0.0.0.0 é necessário para que seja acessível de fora do contêiner.
# Usamos o exec para que o processo do python substitua o processo do shell.
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}
