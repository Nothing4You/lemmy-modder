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
FROM nginx:stable-alpine@sha256:ffa1b2237b1626cc23eb89e35d3944d514d28b2e568a2ce099c9d2e0871560bf

# copy distribution from build step
COPY --from=build /app/dist /usr/share/nginx/html

# install entrypoint script to /usr/local/bin/
RUN mkdir -p /usr/local/bin/
COPY ./scripts/docker-startup.sh /usr/local/bin/docker-startup.sh
RUN chmod 700 /usr/local/bin/docker-startup.sh

# expose and set entrypoint
EXPOSE 80
ENTRYPOINT ["sh", "/usr/local/bin/docker-startup.sh"]
