## Using Docker to build and deploy Magrit

### 3 containers, Magritapp, Redis, NGINX

This version can be used to deploy on a (dedicated) server with only HTTP support.
It doesn't require any particular attention, just clone Magrit repository, go in the `misc/Docker` folder and run `docker-compose -f docker-compose.yml up -d`.

### 4 containers, Magritapp, Redis, NGINX and certbot

This version can be used to deploy on a (dedicated) server with support for HTTPS, based on certificates provided by Let's Encrypt.

Note that you need to have the certificates available on the host on `/etc/letsencrypt` folder (see these tutorials for example if needed https://www.grottedubarbu.fr/docker-nginx-reverse-proxy/ / https://www.nginx.com/blog/using-free-ssltls-certificates-from-lets-encrypt-with-nginx/ - see https://letsencrypt.org/docs/certificates-for-localhost/ if you need certificates for testing locally).

Once you're done with having the certificates in the appropriate folder of the host, clone Magrit repository, replace `magrit.cnrs.fr` by the URL of your server in `misc/Docker/nginx/conf/https/nginx.conf` (lines 12 to 14) then go in the `misc/Docker` folder and run `docker-compose -f docker-compose.https.yml up -d`

### 1 container, Magritapp and Redis

This is the version that we publish on DockerHub. It doesn't use docker-compose and is only made of a single Dockerfile.

We recommend this version for users who want to have Magrit on their computer for personal use.

You don't need to build manually this container, as you can use the version that we publish on DockerHub by doing `docker run magrit/magrit`.


### Other configurations

If you need to deploy Magrit alongside other applications on your server, you probably don't need to bring in the NGINX and certbot containers.
You can take inspiration from our "Magritapp, Redis, NGINX" configuration to create your configuration with 2 containers, Magritapp and Redis and then manage on your side (with Apache Server or NGINX for example) to expose Magrit publicly.