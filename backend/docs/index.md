# schemacms

Check out the project's [documentation](https://github.com/schemadesign/schema_cms).

# Prerequisites

- [Docker](https://docs.docker.com/docker-for-mac/install/)  

# Initialize the project

Initialize project environment variables using by docker-compose:
```bash
cp local.env.example local.env
```

Start the dev server for local development:

```bash
docker-compose up
```

Create a superuser to login to the admin:

```bash
docker-compose run --rm backend ./manage.py createsuperuser
```


# Continuous Deployment

Work in progress
