# Docker

**Important notices**

1. All script have to be run from docker directory
2. Make sure you have created .appConfig.json file in src folder
3. Copy docker/.env.dist file to docker/.env and configure variables or use default ones from .env.dist
4. Production mode is not production ready yet, it is only prepared to run project on QA servers

## DEV
**IMPORTANT**

*Currently dev environment on docker do not support running on custom domain, so if you want to work it without any additional changes make sure you have remove `HOST` entry from .env file in project root folder*  

1. Run build-dev.sh in one of this cases:
    * You start project for the first time
    * You are switching from production mode
    * Something has changed in docker files
2. Run run-dev.sh
3. Go to localhost:PORT where PORT is the value you have declared in .env file in docker directory as DOCKER_APP_PORT 
4. If the page do not work make sure you connect with correct protocole (http vs https configured as  `HTTPS` variable in .env file in project root directory
5. Start coding... :)

## PROD
1. Pull the latest changes from Git
2. Provide ssh keys files (id_rsa_feniks, id_rsa_feniks.pub) with access to repo to docker/keys directory
3. Provide config files to docker/prodConfig directory (files: .env, .appConfig.json, .devProxyConfig.json - you can inspire from .dins files)
3. Run deploy-prod.sh
4. App is working on port you have declared in .env file in docker directory as DOCKER_APP_POR
