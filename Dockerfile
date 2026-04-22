FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate
COPY . .
RUN npm run build

FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app

# 1. Copy package files
COPY package*.json ./

# 2. Install production deps + EXPLICITLY ensure the adapter is there
# Sometimes peer dependencies are missed in --omit=dev
RUN npm ci --omit=dev && npm install @prisma/adapter-pg pg

# 3. Copy the generated Prisma engine files from build stage
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client ./node_modules/@prisma/client

# 4. Copy the rest of the application
COPY prisma ./prisma/
COPY --from=build /app/dist ./dist

# 5. Security and User setup
EXPOSE 4000
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["node", "dist/src/main"]