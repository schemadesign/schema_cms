FROM schema_cms_backend as static_collect

ENV DJANGO_SECRET_KEY = 'tmp'
ENV AWS_DEFAULT_REGION = 'us-east-1'
ENV AWS_ACCESS_KEY_ID = 'foo'
ENV AWS_SECRET_ACCESS_KEY = 'bar'
RUN python manage.py collectstatic --no-input


FROM nginx:1.14-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY files/ /etc/nginx/
RUN mkdir -p /app/webapp
RUN mkdir -p /app/webapp/static
COPY --from=static_collect /app/static /tmp/static
COPY --from=schema_cms_frontend /webapp/schemaCMS/build /tmp/dist
RUN cp -R /tmp/static/* /app/webapp/static
RUN cp -R /tmp/dist/* /app/webapp
