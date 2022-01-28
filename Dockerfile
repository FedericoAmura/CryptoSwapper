FROM node:12 as base

WORKDIR /src
COPY package*.json ./

FROM base as dev
EXPOSE 3000
ENV NODE_ENV=development
RUN npm install
COPY . .
CMD ["npm", "run", "serve"]

FROM dev as test
ENV NODE_ENV=test
CMD ["npm", "run", "test"]
