FROM python:3.8.1-slim-buster

ARG PIPENV_INSTALL_COMMAND="pipenv install --system --dev"

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on

WORKDIR /app

RUN apt-get update && apt-get install -y postgresql-client npm \
  && pip install --no-cache pipenv==2018.11.26 awscli \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY Pipfile .
COPY Pipfile.lock .

RUN $PIPENV_INSTALL_COMMAND

COPY . .

EXPOSE 8000

CMD ./manage.py migrate && \
    ./manage.py initialuser && \
    ./manage.py create_dynamo_tables && \
    ./manage.py loadscripts && \
    gunicorn --bind 0.0.0.0:8000 --access-logfile - schemacms.wsgi:application
