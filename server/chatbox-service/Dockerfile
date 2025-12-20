FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies quickly
RUN npm install --omit=dev --legacy-peer-deps --no-audit --prefer-offline

# Copy source code
COPY . .

EXPOSE 5008

CMD ["node", "src/index.js"]
