FROM segment/chamber:2 AS chamber

FROM python:3.8.3-slim-buster

ARG PIPENV_INSTALL_COMMAND="pipenv install --system --dev"

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV PIP_NO_CACHE_DIR off
ENV PIP_DISABLE_PIP_VERSION_CHECK on

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends postgresql-client npm \
  && pip install --no-cache-dir pipenv==2020.6.2 awscli \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*

COPY --from=chamber /chamber /bin/chamber

COPY Pipfile* /app/

RUN $PIPENV_INSTALL_COMMAND

COPY . .
RUN chmod +x scripts/*.sh

EXPOSE 8000

CMD ["./scripts/run.sh"]
