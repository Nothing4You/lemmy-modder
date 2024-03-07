FROM node:18.17.0-alpine@sha256:58878e9e1ed3911bdd675d576331ed8838fc851607aed3bb91e25dfaffab3267 as build

WORKDIR /app

# install npm deps
COPY package*.json ./
RUN npm ci

# build frontend
COPY ./ .
RUN npm run build

# copy files to run container
FROM nginx:stable-alpine@sha256:6845649eadc1f0a5dacaf5bb3f01b480ce200ae1249114be11fef9d389196eaf

# copy distribution from build step
COPY --from=build /app/dist /usr/share/nginx/html

# install entrypoint script to /usr/local/bin/
RUN mkdir -p /usr/local/bin/
COPY ./scripts/docker-startup.sh /usr/local/bin/docker-startup.sh
RUN chmod 700 /usr/local/bin/docker-startup.sh

# expose and set entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/usr/local/bin/docker-startup.sh"]
