FROM node:19-alpine

COPY package.json /app/
COPY src /app/

COPY app.js /app/
COPY prisma /app/

WORKDIR /app/

RUN  npm install

CMD ["node", "app.js"]