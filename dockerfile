# Stage 1: Build the React app
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* yarn.lock* ./

RUN npm install
# or if you use yarn, replace with: RUN yarn install

# Copy the rest of your app source code
COPY . .

# Build the production version of the app
RUN npm run build
# or with yarn: RUN yarn build

# Stage 2: Serve the built app with a lightweight web server
FROM nginx:alpine

# Copy built files from previous stage to nginx www folder
COPY --from=build /app/build /usr/share/nginx/html

# Remove default nginx config if needed, then add your own (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]