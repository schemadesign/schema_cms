```
               ________  ________  ___  ___  _______   _____ ______   ________     
              |\   ____\|\   ____\|\  \|\  \|\  ___ \ |\   _ \  _   \|\   __  \    
              \ \  \___|\ \  \___|\ \  \\\  \ \   __/|\ \  \\\__\ \  \ \  \|\  \   
               \ \_____  \ \  \    \ \   __  \ \  \_|/_\ \  \\|__| \  \ \   __  \  
                \|____|\  \ \  \____\ \  \ \  \ \  \_|\ \ \  \    \ \  \ \  \ \  \ 
                  ____\_\  \ \_______\ \__\ \__\ \_______\ \__\    \ \__\ \__\ \__\
                 |\_________\|_______|\|__|\|__|\|_______|\|__|     \|__|\|__|\|__|
                 \|_________|

                                 ________  _____ ______   ________      
                                |\   ____\|\   _ \  _   \|\   ____\     
                                \ \  \___|\ \  \\\__\ \  \ \  \___|_    
                                 \ \  \    \ \  \\|__| \  \ \_____  \   
                                  \ \  \____\ \  \    \ \  \|____|\  \  
                                   \ \_______\ \__\    \ \__\____\_\  \ 
                                    \|_______|\|__|     \|__|\_________\
                                                            \|_________|
```

# Prerequisites
Docker is used to develop, test, and improve an environment.

1. Install [docker](https://docs.docker.com/install/)
2. Install [docker-compose](https://docs.docker.com/compose/install/) if you are using Linux
3. Install [python 3.8](https://www.python.org/downloads/)
4. Install [pipenv](https://github.com/pypa/pipenv#installation)
5. Install [npm](https://www.npmjs.com/)
6. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

## Installation

### Easy way
`make setup` & ☕

You will find a more detailed documentation in `./frontend/schemaCMS`, `./frontend/schemaUI`, `./backend/app` and `./docs`

## Running locally

1. Create Auth0 tenant for local use. You can find instructions [here](./docs/auth0.md).
2. Create and fill `local.env` file:

    ```bash
    cp local.env.example local.env
    ```
2. Run backend services:

    ```bash
    make up
    ```
3. Run frontend:

    ```bash
    make fe-up
    ```

## Development
Backend is running on `localhost:8000`

MailCatcher is running on `localhost:1080`

Documentations is running on `localhost:8001`

Frontend is running on `localhost:3000`

# Local set-up and usage notes

## Important notes

*Before you run the app locally:*
 1. make sure that you have the `local.env` file updated
 2. check if you have any running containers using the same ports as Schema CMS components, if yes please stop/kill those;
you can check running containers using a `docker ps` command and stop/kill selected container using `docker stop/kill CONTAINER ID`
 3. if you want to keep uploaded datasource files and use them after restarting a computer or killing the docker container,
before you use `docker-compose up`, you have to uncomment the line `- "localstack_data:/tmp/localstack/data"` (line 30) in the` docker-compose.yml` file.
Now all data source files, block images etc. will be saved to disk.  
> Note that in this case starting backend may take a little more time because all files must be indexed again.



## Inviting user to Schema CMS localy

1. In a new browser tab go to `http://localhost:1080/`
2. In a second tab open `http://localhost:8000/admin/` and login as a root user, you can set a root password in the `local.env`, changing value of `DJANGO_ROOT_PASSWORD` but the default password is set to `root12345` 
3. Now go to a `Users` tab and click the `INVITE USER` button, fill all required fields and `SAVE`  
> NOTE: you can use dummy email if you want because locally we don't send any emails
4. Go to a tab from step 1. You should see an invitation email with a password change link. Click it and set the password.
5. After the password is set you can go to the `http://localhost:3000` and login using invited user credentials  
> NOTE: you won't be able to login to app if you don't set password

## Changing user role

1. Go to the `http://localhost:8000/admin/` -> `Users`
2. click on the user whose role you want to change
3. in a `Permissions` section you will find a dropdown with available roles, choose one and `SAVE`
4. after the role was changed you need to login again


# Deployment 

## Intro

This project uses [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) for easy deployment application
on any AWS account.

To easy manage multiple AWS accounts project uses [aws-vault](https://github.com/99designs/aws-vault).

Application requires Auth0 and domain with verified certificate in AWS.

## Configuration
### Prerequisites

1. Make sure you run `make setup` and you have all packages installed.
2. [aws-vault](https://github.com/99designs/aws-vault) installed.
3. [Auth0](https://auth0.com/) tenant and required applications created. You can find instructions [here](./docs/auth0.md)

### aws-vault configuration
1. Log In to [AWS Console](https://aws.amazon.com/console/), go to `My security credentials` and create access key.
2. Use created access key to add new profile in [aws-vault](https://github.com/99designs/aws-vault#quick-start).
3. Edit file `~/aws/config` by adding line `region=<selected-deployment-region>` under profile you added.
4. Update profile and region in `.project_config.json`.
    
## Steps
### Deploy base resources and components

From project root directory:

1. `make deploy-infra`
2. `make deploy-components`

### Deploy certificates

1. Go to [AWS Certificate Manager](https://console.aws.amazon.com/acm) on selected region.
2. Request `Request a public certificate`.
3. Add your domain names: 
    - `example.com`
    - `*.example.com`
4. Choose `DNS validation`.
5. Add DNS records from generated csv to your DNS and wait till `status` is `Issued`.

### Create SSN parameters

1. Copy file `infra/ssm_parameters.example.json` as `infra/ssm_parameters.json`.
2. Fill parameters values.

### Verify Domain in Amazon Simple Email Service

1. Go to [AWS SES](https://console.aws.amazon.com/ses/home) on selected region.
2. Verify your domain or email used as `DJANGO_DEFAULT_FROM_EMAIL`

### Deploy application

From project root directory:

1. Run `make build` to create and push docker images with application to AWS ECR
2. After successful build run `make deploy-app`
3. Set app and public api domains in DNS by creating CNAME records pointing newly created ELB
