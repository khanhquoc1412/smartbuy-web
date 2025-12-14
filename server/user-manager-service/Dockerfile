FROM node:18-alpine

WORKDIR /app

# Install build dependencies for native modules (bcrypt)
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json* ./

# Install all dependencies for build and rebuild bcrypt
RUN npm install --legacy-peer-deps --no-audit && \
    npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Build if needed (check if build script exists)
RUN npm run build || true

# Remove devDependencies
RUN npm prune --production

EXPOSE 3006

CMD ["node", "index.js"]
