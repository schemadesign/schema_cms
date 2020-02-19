FROM python:3.8.1-slim-buster

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

ARG STAGE=prod

WORKDIR /app

COPY scripts/install_serverless.sh .

RUN apt-get update \
  && apt-get install -y build-essential \
  && apt-get install -y libpq-dev \
  && apt-get install -y gettext \
  && apt-get purge -y --auto-remove -o APT::AutoRemove::RecommendsImportant=false \
  && rm -rf /var/lib/apt/lists/*


RUN if [ "$STAGE" = "dev" ] ; then sh install_serverless.sh ; else pip install awscli; fi

COPY ./requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

COPY . /app

EXPOSE 8000

CMD ./manage.py migrate && \
    ./manage.py initialuser && \
    ./manage.py create_dynamo_tables && \
    ./manage.py loadscripts && \
    gunicorn --bind 0.0.0.0:8000 --access-logfile - schemacms.wsgi:application
