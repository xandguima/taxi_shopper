
#MultStageBuild
# Etapa 1
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./ 
RUN npm install

COPY ./ /app


WORKDIR /app
RUN npm run build

# Stage 2
FROM node:20-alpine3.19 AS runner

WORKDIR /app

COPY package*.json ./ 
RUN npm install --only=production


COPY --from=builder /app/dist /app/dist


RUN mkdir -p /app/db && chmod 777 /app/db

EXPOSE 8080

CMD ["sh", "-c", "npm run migrate-prod && npm run seed-prod && npm run start"]

