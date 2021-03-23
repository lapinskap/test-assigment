#!/usr/bin/env bash

SYSTEM=$(uname -s);
CURRENTDIR=$(pwd);

cp -n "$CURRENTDIR/.env.dist" "$CURRENTDIR/.env"
rm -rf "$CURRENTDIR/../node_modules"

if [ "$SYSTEM" = "Linux" ]
then
  echo "Woohoo! I'm running on Linux!"
  docker-compose -f docker-compose-dev.yml stop
  docker-compose -f docker-compose-dev.yml build --no-cache
  docker-compose -f docker-compose-dev.yml up -d --remove-orphans
  docker-compose -f docker-compose-dev.yml exec -u node test-assigment npm install
elif [ "$SYSTEM" = "Darwin" ]
then
  echo "Woohoo! I'm running on macOS!"
  docker-compose -f docker-compose-dev.yml stop
  docker-compose -f docker-compose-dev.yml build --no-cache
  docker-compose -f docker-compose-dev.yml up -d --remove-orphans
  docker-compose -f docker-compose-dev.yml exec -u node test-assigment npm install
fi
