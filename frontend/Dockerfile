# Etapa 1: Build da aplicação
FROM node:20 AS build

WORKDIR /app

# Instalar as dependências do projeto
COPY package.json package-lock.json ./
RUN npm install

# Copiar os arquivos da aplicação e gerar a build de produção
COPY . . 
RUN npm run build

# Etapa 2: Servir a aplicação
FROM node:20 AS serve

WORKDIR /app

# Instalar o servidor HTTP para servir o build
RUN npm install -g serve

# Instalar o wait-for-it para aguardar a API
RUN apt-get update && apt-get install -y wait-for-it

# Copiar o build gerado para o novo container
COPY --from=build /app/dist . 

# Expor a porta 80
EXPOSE 3000

# Rodar o servidor para servir a aplicação
CMD ["sh", "-c", "wait-for-it api:8080 -- serve"]
