FROM node:20-alpine

WORKDIR /app

COPY userservice/package*.json ./

RUN npm ci

COPY userservice/ .
COPY src/ ./src/

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3005/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "index.js"]