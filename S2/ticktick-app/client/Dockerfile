FROM node:18-slim@sha256:4d8e5346c6b6f8f0a4f1a0f8e6e9e6b5a4d3c2b1a0f8e6d5c4b3a2f1e0d9c8b AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine@sha256:5a0c7e6c6e9e6b5a4d3c2b1a0f8e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]