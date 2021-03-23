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

COPY docker/prodConfig/.env /var/www/html/.env
COPY docker/prodConfig/.devProxyConfig.json /var/www/html/.devProxyConfig.json
COPY docker/prodConfig/.appConfig.json /var/www/html/src/.appConfig.json

RUN npm install

RUN npm run build
#RUN pm2 start server.js --name test-assigment-ui
CMD ["pm2-runtime", "start", "server.js", "--name", "test-assigment-ui"]
