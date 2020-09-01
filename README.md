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
3. Install [python](https://www.python.org/downloads/) (version 3.8)
4. Install [pipenv](https://github.com/pypa/pipenv#installation) (python package manager)
5. Install [npm](https://nodejs.org/en/) (version 12+)
6. Install [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable) (version 1.22.+)

## Installation

### Easy way
`make setup` & ☕

You will find a more detailed documentation in `./frontend/schemaCMS`, `./frontend/schemaUI`, `./backend/app` and `./docs`

## Running locally

1. Create Auth0 tenant for local use. You can find instructions [here](./docs/auth0.md).
2. Copy `local.env-example` file as `local.env` and fill missing `Auth0` envs using values from your tenant:

    ```bash
    cp local.env-example local.env
    ```
2. Run backend services:

    ```bash
    make up
    ```
   > NOTE: Check if you have any running containers using the same ports as Schema CMS components, if yes please stop/kill those;
you can check running containers using a `docker ps` command and stop/kill selected container using `docker stop/kill CONTAINER ID`
3. Run frontend:

    ```bash
    make fe-up
    ```

## Development
Backend is running on `localhost:8000`

MailCatcher is running on `localhost:1080`

Documentations is running on `localhost:8001`

Frontend is running on `localhost:3000`


## Inviting user to Schema CMS localy

1. In a new browser tab go to `http://localhost:1080/`
2. In a second tab open `http://localhost:8000/admin/` and login as a root user, you can set a root password in the `local.env`, changing value of `DJANGO_ROOT_PASSWORD` but the default password is set to `root12345` 
3. Now go to a `Users` tab and click the `INVITE USER` button, fill all required fields and `SAVE`.

    > NOTE: You can use dummy email if you want because locally we don't send any emails.
4. Go to a tab from step 1. You should see an invitation email with a password change link. Click it and set the password.
5. After the password is set you can go to the `http://localhost:3000` and login using invited user credentials.

    > NOTE: You won't be able to login to app if you don't set password.

    > NOTE: If Gmail email address was used you can log-in to app using `Sign in with Google` option.

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
4. Update `profile` and `region` in `.project_config.json`.
    
## Steps
### Deploy base resources and components

From project root directory:

1. `make deploy-infra`
2. `make deploy-components`

### Validate certificates

1. Go to [AWS Certificate Manager](https://console.aws.amazon.com/acm) on selected region.
2. Validate certificate using DNS. You can follow this [guide](https://aws.amazon.com/blogs/security/easier-certificate-validation-using-dns-with-aws-certificate-manager/).

    > NOTE: As domain names please enter two records. First is just your domain name and second is wild card name with asterisk (*.example.com), this allow protect all subdomains.
3. Wait till `status` is `Issued`.
    
### Verify Domain in Amazon Simple Email Service
[Amazon Simple Email Service](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/Welcome.html) is used by Schema CMS to send emails.
Unfortunately `AWS SES` is in `Sandbox` mode as default and because of that you can only send mail `to` and `from` verified email addresses and domains.
User has to request a change from `Sandbox` to `Production` mode. For more information look [here](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html).
But before that at least one domain has to be verified. To do that follow this steps:

1. Go to [AWS SES](https://console.aws.amazon.com/ses/home) on selected region.
2. Follow this [guide](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domain-procedure.html).
3. When domain `Verification Status` will change to `verified` you have to [request](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/request-production-access.html) moving out from `Sandbox` mode.
> NOTE: Processing this request may take up to 2 days, depending which tier of AWS Support your account is using.

> NOTE: Before AWS SES will be moved to Production mode mails can be send only to verified email addresses. You can verify emails following this [guide](https://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-email-addresses-procedure.html)


### Create SSN parameters

1. Copy file `infra/ssm_parameters.example.json` as `infra/ssm_parameters.json`.
2. Fill parameters values.
    - `/schema-cms-app/CERTIFICATE_ARN` - use `ARN` of certificate validated in previous step. You can find it in `Details` of your this certificate [here]((https://console.aws.amazon.com/acm)).
    - `/schema-cms-app/DJANGO_DEBUG` - `on` if you want to see debug messages when error happens `off` if not.
    - `/schema-cms-app/DJANGO_DEFAULT_FROM_EMAIL` - Verified domain email address that will be used to send emails for example `admin@example.com`.
    - `/schema-cms-app/DOMAIN_NAME` - Domain that will be used to deploy Schema CMS e.g, `example.com`.
    - `/schema-cms-app/DJANGO_HOST` - Domain with `https://` e.g, `https://example.com`.
    - `/schema-cms-app/DJANGO_WEBAPP_HOST` - At this moment same value as `DJANGO_HOST`.
    - `/schema-cms-app/PUBLIC_API_URL` - Subdomain `api` e.g, `https://api.example.com/` with `/` on the end.
    - `/schema-cms-app/DJANGO_ROOT_PASSWORD` - Your password do django admin console.
    - `/schema-cms-app/DJANGO_USER_MGMT_BACKEND` - `schemacms.users.backend_management.auth0.Auth0UserManagement`
    - `/schema-cms-app/DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN` - Domain from created Auth0 `SINGLE PAGE APPLICATION`.
    - `/schema-cms-app/DJANGO_SOCIAL_AUTH_AUTH0_KEY"` - Client ID from created Auth0 `SINGLE PAGE APPLICATION`.
    - `/schema-cms-app/DJANGO_SOCIAL_AUTH_AUTH0_SECRET"` - Client Secret from created Auth0 `SINGLE PAGE APPLICATION`.
    - `/schema-cms-app/DJANGO_USER_MGMT_AUTH0_DOMAIN` - Domain from created Auth0 `MACHINE TO MACHINE`.
    - `/schema-cms-app/DJANGO_USER_MGMT_AUTH0_KEY` - Client ID from created Auth0 `MACHINE TO MACHINE`.
    - `/schema-cms-app/DJANGO_USER_MGMT_AUTH0_SECRET` - Client Secret from created Auth0 `MACHINE TO MACHINE`.
    
### Deploy application

From project root directory:

1. Run `make build` to create and push docker images with application to AWS ECR. This step may take some time.
2. After successful build run `make deploy-app`. This step may take some time.
3. When `deploy-app` step is done, you need find Load Balancer DNS name record in outputs, that looks similar to:
    - `schema-cms-api.ApiServiceLoadBalancerDNSBF9EB7FC = schem-ApiSe-1PMWRS8JQDZ21-901620558.us-west-2.elb.amazonaws.com`
    - or go to list of load balancers on selected region in [AWS Console](https://console.aws.amazon.com/ec2/v2/home?#LoadBalancers:sort=loadBalancerName) and copy `DNS name` from Schema load balancer
3. Add to your DNS `CNAME` records pointing your domain and `api` subdomain to Load Balancer DNS name.
    

### Updating Schema CMS version

During first deployment [AWS CodePipeline](https://console.aws.amazon.com/codesuite/codepipeline/pipelines) and [AWS CodeBuild](https://console.aws.amazon.com/codesuite/codebuild/projects) were deployed.
Those services allow easily deploy selected branch,tag, commit etc. of Schema CMS.
To deploy selected version of Schema CMS:

1. Go to [AWS CodeBuild](https://console.aws.amazon.com/codesuite/codebuild/projects) on region where Schema CMS was deployed.
2. Enter to  `SchemaCMS` build project.
3. Click `Start build`.
4. Put version you want deploy in `Source version - optional` filed.
5. Click `Start build`.

App will start deploying after couple of seconds. To monitor progress of deployment go to [AWS CodePipeline](https://console.aws.amazon.com/codesuite/codepipeline/pipelines)
and enter `schema-cms-pipeline`.

> NOTE: When `Build` stage is done next` Deploy` stage needs `manual approval` to run. `Approve` button will appear on` approve changes` block. Approve to finish deployment.                                                                                .
