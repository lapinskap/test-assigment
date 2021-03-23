#!/usr/bin/env bash

SYSTEM=$(uname -s);

if [ "$SYSTEM" = "Linux" ]
then
  echo "Woohoo! I'm running on Linux!"
  docker-compose -f docker-compose-dev.yml up -d
  docker-compose -f docker-compose-dev.yml exec -u node feniks-omb npm start
elif [ "$SYSTEM" = "Darwin" ]
then
  echo "Woohoo! I'm running on macOS!"
  docker-compose -f docker-compose-dev.yml up -d
  docker-compose -f docker-compose-dev.yml exec -u node feniks-omb npm start
fi
