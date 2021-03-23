#!/usr/bin/env bash

SYSTEM=$(uname -s);
CURRENTDIR=$(pwd);

cp -n "$CURRENTDIR/.env.dist" "$CURRENTDIR/.env"

git pull

docker-compose -f docker-compose-prod.yml down
docker-compose -f docker-compose-prod.yml up -d --build --remove-orphans --force-recreate
docker-compose -f docker-compose-prod.yml exec -u node test-assigment-panel npm test -- --coverage --watchAll=false
docker-compose -f docker-compose-prod.yml exec -u node test-assigment-panel cp -R /var/www/html/coverage/lcov-report /var/www/html/public/test-report
