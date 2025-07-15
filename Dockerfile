FROM node:20
WORKDIR /app
ENV NODE_OPTIONS=--openssl-legacy-provider
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm","run","start" ]