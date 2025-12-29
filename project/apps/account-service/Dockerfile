FROM node:18.16-alpine
WORKDIR /opt/readme/account-service
COPY ./dist/apps/account-service/package.json .
RUN npm install --omit=dev 
COPY ./dist/apps/account-service .
CMD ["node", "./main.js"]
