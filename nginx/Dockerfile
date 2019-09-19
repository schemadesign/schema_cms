FROM backend as static_collect

ENV DJANGO_SECRET_KEY = 'tmp'
RUN python manage.py collectstatic --no-input


FROM nginx:1.14-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY files/ /etc/nginx/
RUN mkdir -p /app/webapp
RUN mkdir -p /app/webapp/static
COPY --from=static_collect /static /tmp/static
COPY --from=frontend /webapp/schemaCMS/build /tmp/dist
RUN cp -R /tmp/static/* /app/webapp/static
RUN cp -R /tmp/dist/* /app/webapp
