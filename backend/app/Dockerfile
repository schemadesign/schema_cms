FROM python:3.7.4-slim-buster
ENV PYTHONUNBUFFERED 1

ARG STAGE=prod

RUN if [ "$STAGE" = "prod" ] ; then pip install awscli gevent ; else  apt update && \
    apt install -y apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common && \
    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add - && \
    add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian \
    $(lsb_release -cs) \
    stable" && \
    apt update && apt install -y docker-ce docker-ce-cli containerd.io npm && \
    npm install -g serverless && npm install --save-dev serverless-localstack && \
    npm install --save-dev serverless-package-external && \
    pip install awscli gevent ; fi

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
    gunicorn --worker-class=gevent --bind 0.0.0.0:8000 --timeout 180 --graceful-timeout 30  --access-logfile - schemacms.wsgi:application
