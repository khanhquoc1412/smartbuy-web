FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json* ./

# Install all dependencies for build
RUN npm install --legacy-peer-deps --no-audit --prefer-offline

# Copy source code
COPY . .

# Build if needed (check if build script exists)
RUN npm run build || true

# Remove devDependencies
RUN npm prune --production

EXPOSE 3006

CMD ["node", "index.js"]
