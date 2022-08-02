FROM ubuntu:22.04
ENV DEBIAN_FRONTEND='noninteractive' TZ='Europe/Paris'
ENV LANG='fr_FR.UTF-8' LANGUAGE='fr_FR' LC_ALL='fr_FR.UTF-8'
RUN apt-get update && apt-get install -y nginx
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
RUN rm -rf /etc/nginx/sites-enabled/default
EXPOSE 80
COPY nginx.conf /etc/nginx/sites-enabled/magritapp
RUN mkdir /var/www/static
COPY static /var/www/static
CMD ["nginx", "-g", "daemon off;"]
