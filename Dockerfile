# ---- Development Stage ----
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 8080
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]

# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Build args for Vite (baked into static build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:alpine AS production

# Nginx SPA konfiqurasiyası
COPY --from=builder /app/dist /usr/share/nginx/html

# React Router üçün nginx konfiqurasiyası
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;

    # Service worker & workbox cleanup — heç vaxt cache edilməməlidir
    location ~* (sw\.js|workbox-.*\.js|registerSW\.js)$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        try_files $uri =204;
    }

    # CSS assets - missing chunks fallback to empty CSS (prevents Workbox 404 bad-precaching)
    location ~* \.css$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri /assets/fallback-style.css;
    }

    # JS assets - missing chunks fallback to reload handler (prevents Workbox 404 & white screen)
    location ~* \.js$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
        try_files $uri /assets/fallback-chunk.js;
    }

    # Static media assets - uzun müddətli cache
    location ~* \.(png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # HTML - heç vaxt cache etmə (SPA routing üçün)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
EOF

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
