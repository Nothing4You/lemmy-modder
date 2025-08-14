FROM node:22.17.1-alpine@sha256:5539840ce9d013fa13e3b9814c9353024be7ac75aca5db6d039504a56c04ea59 AS build

WORKDIR /app

# install npm deps
COPY package*.json ./
RUN \
  --mount=type=cache,target=/root/.npm \
  npm ci

# build frontend
COPY ./ .
RUN \
  --mount=type=cache,target=/root/.npm \
  npm run build

# copy files to run container
FROM nginx:stable-alpine@sha256:8757e9607e9d2c294bd64d242b4702bffe19f488c82b57de4650db493d19b639

# copy distribution from build step
COPY --from=build /app/dist /usr/share/nginx/html

# install entrypoint script to /usr/local/bin/
RUN mkdir -p /usr/local/bin/
COPY ./scripts/docker-startup.sh /usr/local/bin/docker-startup.sh
RUN chmod 700 /usr/local/bin/docker-startup.sh

# expose and set entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/usr/local/bin/docker-startup.sh"]
