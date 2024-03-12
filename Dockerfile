FROM node:18-alpine

COPY public/ /public
COPY src/ /src
COPY package.json /

RUN npm install

CMD ["npm", "build"]

EXPOSE 3000