# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app for production
RUN npm run build

# Install a simple web server to serve the static files
RUN npm install -g serve

# Set the command to run the app
CMD ["serve", "-s", "build"]

# Expose the port the app will run on
EXPOSE 3000
