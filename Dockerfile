# Use a Node.js 18 base image for the build stage
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight Node.js 18 image for the production stage
FROM node:18-alpine AS production

# Set the working directory
WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/public ./public

# Expose the port the application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]