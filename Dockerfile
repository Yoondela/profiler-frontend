# Stage 1 — Build
FROM node:20-alpine AS build

# Enable Corepack for Yarn 4
RUN corepack enable

WORKDIR /app

# Copy dependency files first
COPY package.json yarn.lock ./

# Ensure Yarn uses node_modules linker
RUN yarn config set nodeLinker node-modules

# Install deps
RUN yarn install --frozen-lockfile

# Copy the rest and build
COPY . .
RUN yarn build

# Stage 2 — Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
