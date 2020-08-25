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
3. Install [python8](https://www.python.org/downloads/)
4. Install [pipenv](https://github.com/pypa/pipenv#installation)
5. Install [npm](https://www.npmjs.com/)
6. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable)

## Installation

### Easy way
`make setup` & ☕

You will find a more detailed documentation in `./frontend/schemaCMS`, `./frontend/schemaUI`, `./backend/app`, and `./docs`

## Running
Run backend - `Before you run app make sure that you have the latest local.env file`

```shell script
make up
```
Run frontend
```shell script
make fe-up
```

## Development
Backend in running on `localhost:8000`

MailCatcher in running on `localhost:1080`

Documentations in running on `localhost:8001`

Frontend in running on `localhost:3000`

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

