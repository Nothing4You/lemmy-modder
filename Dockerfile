FROM node:20.19.0-alpine@sha256:8bda036ddd59ea51a23bc1a1035d3b5c614e72c01366d989f4120e8adca196d4 as build

WORKDIR /app

# install npm deps
COPY package*.json ./
RUN npm ci

# build frontend
COPY ./ .
RUN npm run build

# copy files to run container
FROM nginx:stable-alpine@sha256:d2c11a1e63f200585d8225996fd666436277a54e8c0ba728fa9afff28f075bd7

# copy distribution from build step
COPY --from=build /app/dist /usr/share/nginx/html

# install entrypoint script to /usr/local/bin/
RUN mkdir -p /usr/local/bin/
COPY ./scripts/docker-startup.sh /usr/local/bin/docker-startup.sh
RUN chmod 700 /usr/local/bin/docker-startup.sh

# expose and set entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/usr/local/bin/docker-startup.sh"]
