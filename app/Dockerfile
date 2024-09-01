# Use Node.js 18 as the base image
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json from the root directory (splitwise-app/)
COPY ../package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code from the root directory (splitwise-app/)
COPY ../ ./

# Start the Next.js application
CMD ["npm", "run", "dev"]
