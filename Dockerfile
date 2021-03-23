FROM node:12.18.2-alpine

# Setup document root
RUN mkdir -p /var/www/html

# Make sure files/folders needed by the processes are accessable when they run under the node user
RUN chown -R node:node /var/www/html && \
  chown -R node:node /home/node

ADD --chown=node:node . /var/www/html/

RUN npm install -g pm2

USER node
WORKDIR /var/www/html

COPY aws/config/.env.dist /var/www/html/.env
COPY .devProxyConfig.json.dist /var/www/html/.devProxyConfig.json
COPY src/.appConfig.json.dist /var/www/html/src/.appConfig.json

RUN sh aws/injectVersion.sh

RUN npm install

RUN npm run build
#RUN pm2 start server.js --name test-assigment
CMD ["pm2-runtime", "start", "server.js", "--name", "test-assigment"]
