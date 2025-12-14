FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json* ./

# Install all dependencies for build
RUN npm install --legacy-peer-deps --no-audit --prefer-offline

# Copy source code
COPY . .

# Build if needed
RUN npm run build || true

# Remove devDependencies
RUN npm prune --production

EXPOSE 5002

CMD ["node", "src/server.js"]
