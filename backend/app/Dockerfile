FROM python:3.7.4-slim-buster
ENV PYTHONUNBUFFERED 1

RUN pip install awscli

# Allows docker to cache installed dependencies between builds
COPY ./requirements.txt /app/
WORKDIR /app
RUN pip install -r requirements.txt

# Adds our application code to the image
COPY . /app

EXPOSE 8000

# Migrates the database, uploads staticfiles, and runs the production server
CMD ./manage.py migrate && \
    ./manage.py initialuser && \
    ./manage.py loadscripts && \
    gunicorn --worker-class=tornado --log-level=DEBUG --bind 0.0.0.0:8000 --timeout 60 --graceful-timeout 30  --access-logfile - schemacms.wsgi:application
