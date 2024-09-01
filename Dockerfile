# Step 1: Build the Next.js frontend
FROM node:18-alpine AS frontend

WORKDIR /app

# Copy only the frontend files
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code without the backend directory
COPY ./ ./
RUN rm -rf ./splitwise_backend  # Remove the backend directory from the frontend build context

# Disable ESLint during the build process
ENV NEXT_DISABLE_ESLINT=1

# Build the Next.js application
RUN npm run build

# Step 2: Build the FastAPI backend
FROM python:3.10-slim AS backend

WORKDIR /app

# Install necessary packages for the virtual environment
RUN apt-get update && apt-get install -y python3-venv

# Create and activate a virtual environment
RUN python3 -m venv /app/splitwise_env

# Activate the virtual environment and install dependencies
ENV PATH="/app/splitwise_env/bin:$PATH"
COPY splitwise_backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Copy the backend code into the working directory
COPY splitwise_backend /app/backend

# Step 3: Combine both frontend and backend into a single image
FROM python:3.10-slim

WORKDIR /app

# Install Node.js to ensure npm is available
RUN apt-get update && apt-get install -y nodejs npm

# Copy the backend from the backend build stage
COPY --from=backend /app /app/backend

# Copy the frontend build files
COPY --from=frontend /app/.next /app/frontend/.next
COPY --from=frontend /app/public /app/frontend/public

# Recreate and activate the virtual environment for the final image
RUN python3 -m venv /app/splitwise_env
ENV PATH="/app/splitwise_env/bin:$PATH"

# Install backend dependencies again (if necessary)
COPY splitwise_backend/requirements.txt /app/backend/
RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Set environment variables for the application
ENV NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
ENV MONGO_URL=mongodb+srv://nj17official:<password>@njofficial-prod-cluster.q0dlp.mongodb.net/?retryWrites=true&w=majority&appName=njofficial-prod-cluster
ENV ALLOWED_ORIGINS=http://localhost:3000
ENV FIAT_EXCHANGE_RATE_API_URL=https://v6.exchangerate-api.com/v6/7917b245e5e774f2e8d211e6/latest/USD
ENV FIAT_EXCHANGE_RATE_API_KEY=7917b245e5e774f2e8d211e6
ENV CRYPTO_EXCHANGE_RATE_API_URL=http://api.coinlayer.com/live?access_key=b645631b1583e9f5caaec5124ee3b6c1
ENV CRYPTO_EXCHANGE_RATE_API_KEY=b645631b1583e9f5caaec5124ee3b6c1

# Expose ports for frontend and backend
EXPOSE 3000 8000

# Copy the start script
COPY start.sh /app/start.sh

# Make the start script executable
RUN chmod +x /app/start.sh

# Start both frontend and backend using the start script
CMD ["/app/start.sh"]
