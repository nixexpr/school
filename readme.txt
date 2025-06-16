Simple web server with files baked into the image.

Caddyfile:
----------
:80 {  
  root * /usr/share/caddy
  file_server
}

start: (docker compose is used, build option to retake the site)
------
docker compose up -d --build


access:
-------
via browser
curl http://localhost/
