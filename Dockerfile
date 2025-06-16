FROM caddy:2-alpine

WORKDIR /usr/share/caddy

COPY html .

COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 80
EXPOSE 443
