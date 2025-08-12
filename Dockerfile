FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN npm ci --ignore-scripts || npm install --ignore-scripts

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure bin scripts are executable inside container (some hosts lose +x)
RUN chmod +x ./node_modules/.bin/* || true
RUN node ./node_modules/typescript/lib/tsc.js -p .

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev --no-audit --no-fund || npm install --production --no-audit --no-fund
COPY --from=build /app/dist ./dist
RUN npm pkg set type=module >/dev/null 2>&1 || true
EXPOSE 4000
CMD ["node", "--experimental-specifier-resolution=node", "dist/server/index.js"]


