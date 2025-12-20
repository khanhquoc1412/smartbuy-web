FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./

# Install dependencies and rebuild bcrypt
RUN npm install --omit=dev --legacy-peer-deps --no-audit && \
    npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

EXPOSE 3005

CMD ["node", "index.js"]
