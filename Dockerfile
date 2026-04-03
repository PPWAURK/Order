FROM node:20-bookworm-slim

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN mkdir -p /app/data
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npm run db:push && npm run start:prod"]
