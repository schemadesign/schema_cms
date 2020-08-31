# Schema CMS

Check out the project's [documentation](https://github.com/schemadesign/schema_cms).

# Prerequisites

- [Docker](https://docs.docker.com/docker-for-mac/install/)  

# Managing commands

Install packages:

```bash
make setup
```


Start the dev server for local development:

```bash
make up
```

Make Django migrations:

```bash
make makemigrations
```

Django migrate:

```bash
make migrate
```

Enter backend container:

```bash
make exec
```

Attach backend container:

```bash
make attach
```

Run backend test:

```bash
make pytest
```

Kill containers:

```bash
make down
```