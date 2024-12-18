# Use the official Node.js image as the base
FROM node:18 as build

# Set working directory
WORKDIR /frontend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc g++ \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the frontend directory
COPY . .

# Build the React app for production
RUN npm run build

# Use a lightweight Nginx image to serve the React app
FROM nginx:alpine

# Copy the build output to Nginx's default HTML directory
COPY --from=build /frontend/build /usr/share/nginx/html

# Expose port 80 to make the app accessible
EXPOSE 80

# Run Nginx in the foregroundd
CMD ["nginx", "-g", "daemon off;"]