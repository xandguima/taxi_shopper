# Etapa 1: Construir a aplicação TypeScript
FROM node:20 AS builder

WORKDIR /app

# Copia os arquivos necessários para instalar as dependências
COPY backend/package*.json ./ 
RUN npm install

# Copia o código fonte para o container
COPY ./backend /app/backend

# Compila os arquivos TypeScript para JavaScript
WORKDIR /app/backend
RUN npm run build

# Etapa 2: Criar a imagem final com apenas os arquivos necessários
FROM node:20 AS runner

WORKDIR /app

# Copia apenas o package.json para instalar as dependências de produção
COPY backend/package*.json ./ 
RUN npm install --only=production

# Copia os arquivos de build (dist) do estágio anterior
COPY --from=builder /app/backend/dist /app/backend/dist

# Cria a pasta db, caso ela não exista, com permissões adequadas
RUN mkdir -p /app/backend/db && chmod 777 /app/backend/db

# Porta em que o serviço será exposto
EXPOSE 8080

# Comando para iniciar o servidor e rodar as migrações/seed
CMD ["sh", "-c", "npm run migrate-prod && npm run seed-prod && npm run start"]
