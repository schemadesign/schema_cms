
# Deployment instructions

## Intro

This project uses [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) for easy deployment application
on any AWS account.

To easy manage multiple AWS accounts project uses [aws-vault](https://github.com/99designs/aws-vault).

Application requires Auth0 and domain with verified certificate in AWS.

## Configuration
### Prerequisites

1. Make sure you run `make setup` and you have all packages installed.
2. Install [aws-vault](https://github.com/99designs/aws-vault).
3. Create [Auth0](https://auth0.com/) tenant with applications.

### aws-vault configuration
1. Log In to [AWS Console](https://aws.amazon.com/console/), go to `My security credentials` and create access key
2. Use created access key to add new profile in [aws-vault](https://github.com/99designs/aws-vault#quick-start)
3. Edit file `~/aws/config` by adding line `region=<selected-deployment-region>` under profile you added
4. Update profile and region in `.project_config.json`

### Auth0 configuration

1. Log In and create a new Auth0 tenant
2. Go to `Applications` and create `SINGLE PAGE APPLICATION`
3. Fill:
    - `Allowed Callback URLs`:
        -   `https://<[your-domain]>/api/v1/auth/complete/auth0`
    - `Allowed Logout URLs`:
        - `https://<[your-domain]>/api/v1/auth/login/auth0,`
        - `https://<[your-domain]>/auth/not-registered,`
        - `https://<[your-domain]>/auth/revoked-access`
    - `Allowed Web Origins`:
        - `https://<[your-domain]>`
4. Again go to `Applications` and create `MACHINE TO MACHINE`
5. Choose `Auth0 Management Api` and `Select all` scopes.
6. Fill:
    - `Allowed Callback URLs`: `https://<[your-domain]>`
    
## Deployment
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

1. Run `make build` to create and push docker images with app to AWS ECR
2. After successful build run `deploy-app`
3. Set app and public api domains in DNS by creating CNAME records pointing newly created ELB

*Note: Those steps may take 15-40 min
