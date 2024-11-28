# Taxi Shopper

Este projeto oferece uma experiência simples e eficaz para o usuário escolher a melhor opção para as suas viagens. O processo começa com o usuário inserindo um endereço de origem e destino em uma interface inicial. Com esses dados é realizado uma chamada à API do Google Maps para obter a geocodificação dos endereços. Após isso são oferecidas opções de motoristas e valores diferentes para aquela rota, o usuário escolhe o que mais se encaixa com sua necessidade e por fim faz a confirmação.

##🎢 Ponto de partida

Iniciaremos com o docker!
Gostaria de visualizar o projeto? 
Basta baixar o repositório e criar um .env na raiz do projeto de acordo com a variável do .env.example:
```
docker compose up
```
As aplicações estão disponiveis na portas 80 e 8080<br>
Api - localhost:8080<br>
front- localhost:80

Caso queira analisar o front ou back leia as instruções a seguir:

### 📄 Pré-requisitos 
Necessidades para instalação:
Node.js e npm (ou gerenciador de pacotes da sua preferência)


## ⚒️ Backend

### 🖥️ Instalação
Comando necessários para instalação dos pacotes de dependencia e inialização do projeto a nivel de desenvolvimento.

Comandos:
```
npm install 
npm run migrate-dev
npm run seed-dev
npm run dev
```

### 🧪 Testes

Comandos: 

```
npm run test
```
### 🔨 Build
Necessário para transcrição typescript para javascript
```
npm run build
```


## 🖌️ Frontend


### 🖥️ Instalação 
Comando necessários para instalação dos pacotes de dependencia e inialização do projeto a nivel de desenvolvimento.
Comandos:
```
npm install 
npm run dev
```

### 🔨 Build
Necessário para transcrição typescript para javascript
```
npm run build
```
