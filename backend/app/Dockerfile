FROM python:3.7.4-slim-buster
ENV PYTHONUNBUFFERED 1

RUN apt update && apt install -y gcc libev-dev \
    && pip install awscli gevent setuptools bjoern

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
    python -m schemacms.bjoern
    # gunicorn --worker-class=gevent --log-level=DEBUG --bind 0.0.0.0:8000 --timeout 60 --graceful-timeout 30  --access-logfile - schemacms.wsgi:application
