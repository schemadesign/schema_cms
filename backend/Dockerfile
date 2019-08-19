FROM python:3.7.0a2-alpine3.6
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
    ./manage.py collectstatic --noinput && \
    gunicorn --bind 0.0.0.0:$PORT --access-logfile - schemacms.wsgi:application
