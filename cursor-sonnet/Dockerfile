# syntax=docker/dockerfile:1

FROM node:20-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY server/server.js ./dist/server.js

ENV PORT=8080

CMD ["dist/server.js"]
