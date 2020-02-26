FROM python:3.8.1-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on

RUN apt-get update && apt-get install -y npm \
  && pip install --no-cache pipenv==2018.11.26 awscli \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /functions/public_api

COPY Pipfile .
COPY Pipfile.lock .

RUN pipenv install --system --dev

EXPOSE 8002

CMD node_modules/serverless/bin/serverless wsgi serve -p 8002 --host 0.0.0.0