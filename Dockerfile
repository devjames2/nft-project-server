FROM node:12.18.4 AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

###
FROM node:12.18.4-alpine3.9
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm", "run", "start:debug"]