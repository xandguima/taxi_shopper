#multStageBuild
# Etapa 1: Build da aplicação
FROM node:20 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . . 
RUN npm run build

# Stage 2: Servir a aplicação
FROM node:20 AS serve

WORKDIR /app

RUN npm install -g serve

RUN apt-get update && apt-get install -y wait-for-it

COPY --from=build /app/dist .

EXPOSE 80

CMD ["sh", "-c", "wait-for-it api:8080 -- serve"]
