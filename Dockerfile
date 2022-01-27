FROM node:12 as base

WORKDIR /src
COPY package*.json ./

FROM base as dev
EXPOSE 3000
ENV NODE_ENV=development
RUN npm install
COPY . /
CMD ["npm", "run", "serve"]

FROM base as test
ENV NODE_ENV=test
RUN npm install
COPY . /
CMD ["npm", "run", "test"]
