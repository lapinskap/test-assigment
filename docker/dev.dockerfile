FROM node:12.18.2-alpine

RUN apk add --update git

# Setup document root
RUN mkdir -p /var/www/html

# Make sure files/folders needed by the processes are accessable when they run under the node user
RUN chown -R node:node /var/www/html && \
  chown -R node:node /home/node

WORKDIR /var/www/html
