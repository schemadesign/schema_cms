FROM nginx:1.14-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY files/ /etc/nginx/
COPY dist/ /app/webapp
