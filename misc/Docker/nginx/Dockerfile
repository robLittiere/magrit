FROM ubuntu:22.04
ENV DEBIAN_FRONTEND='noninteractive' TZ='Europe/Paris'
RUN apt-get update && apt-get install --no-install-recommends -y nginx locales && locale-gen fr_FR.UTF-8
ENV LANG='fr_FR.UTF-8' LANGUAGE='fr_FR' LC_ALL='fr_FR.UTF-8'
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
RUN rm -rf /etc/nginx/sites-enabled/default && mkdir /var/www/static
CMD ["nginx", "-g", "daemon off;"]
