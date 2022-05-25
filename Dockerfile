FROM node:14.16.0-alpine

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=7000
CMD npm run dev
EXPOSE 7000