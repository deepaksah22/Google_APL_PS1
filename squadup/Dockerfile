FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port Cloud Run uses
EXPOSE 8080

# Cloud Run injects the PORT environment variable.
# We are running the Vite dev server because the custom /api/live endpoint 
# is implemented inside vite.config.js as a configureServer middleware.
CMD ["sh", "-c", "npm run dev -- --host 0.0.0.0 --port ${PORT:-8080}"]
