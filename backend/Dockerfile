FROM node:20-alpine

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm ci || npm install

# Copy source
COPY src ./src

EXPOSE 4000

CMD ["npm", "start"]
