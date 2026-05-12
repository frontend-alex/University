FROM node:18-slim@sha256:4d8e5346c6b6f8f0a4f1a0f8e6e9e6b5a4d3c2b1a0f8e6d5c4b3a2f1e0d9c8b
WORKDIR /app
COPY package*.json ./
RUN npm install --production && npm cache clean --force
COPY . .
EXPOSE 3000
CMD ["npm", "start"]