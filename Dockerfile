# Stage 1: Build static assets
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (if any)
COPY package*.json ./
RUN npm install

# Copy application files and build
COPY . .
RUN npm run build

# Stage 2: Serve static site with Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy dist output from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
