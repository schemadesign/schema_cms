
# Deployment instructions

## AWS CDK

This project uses [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/home.html) for easy deployment application
on any AWS account.

The `cdk.json` file tells the CDK Toolkit how to execute app.

This project is set up like a standard Python project.  The initialization
process also creates a virtualenv within this project, stored under the .env
directory.  To create the virtualenv it assumes that there is a `python3`
(or `python` for Windows) executable in your path with access to the `venv`
package. If for any reason the automatic creation of the virtualenv fails,
you can create the virtualenv manually.

To manually create a virtualenv on MacOS and Linux:

```
$ python3 -m venv .env
```

After the init process completes and the virtualenv is created, you can use the following
step to activate your virtualenv.

```
$ source .env/bin/activate
```

If you are a Windows platform, you would activate the virtualenv like this:

```
% .env\Scripts\activate.bat
```

Once the virtualenv is activated, you can install the required dependencies.

```
$ pip install -r requirements.txt
```

At this point you can now synthesize the CloudFormation template for this code.

```
$ cdk synth
```

To add additional dependencies, for example other CDK libraries, just add
them to your `setup.py` file and rerun the `pip install -r requirements.txt`
command.

### Useful commands

 * `cdk ls`          list all stacks in the app
 * `cdk synth`       emits the synthesized CloudFormation template
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk docs`        open CDK documentation


## Deployment options

This CDK stack is prepared to deploy Schema CMS with (first option) or without (second option) CI/CD pipeline.
If you want to install only Schema CMS without additional developer tools choose first option.

### Deploy app only stack

1. Set up you AWS CLI
2. Setup up AWS CDK and create environment described in *AWS CDK* section
3. Setup all environment variables using AWS Secrets Manager and save secrets ARNs to `cdk.json` file in `context`
section:
    ```bash
   $ aws secretsmanager create-secret --name {ENV_NAME} --secret-string {VALUE}
    ```
   Variables you should set:
    `DJANGO_SOCIAL_AUTH_AUTH0_KEY`,
    `DJANGO_SOCIAL_AUTH_AUTH0_SECRET`,
    `DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN`,
    `DJANGO_USER_MGMT_BACKEND`,
    `DJANGO_USER_MGMT_AUTH0_DOMAIN`,
    `DJANGO_USER_MGMT_AUTH0_KEY`,
    `DJANGO_USER_MGMT_AUTH0_SECRET`

4. Build frontend code
    ```bash
    $ cd ./frontend/schemaUI
    $ yarn
    $ yarn build
    $ yarn link
    $ cd ../schemaCMS
    $ yarn link schemaUI
    $ yarn
    $ yarn build
    ```
5. Copy built code to `nginx/dist` directory
    ```bash
   $ cp -R ./frontend/schemaCMS/build/* ./nginx/dist
    ```
4. Deploy `base`, `workers`, `public-api`, `api` stacks using command:
    ```bash
    $ cdk -c installation_mode=app_only deploy base workers public-api api
    ```

### Deploy stack with app and CI/CD pipeline

Below are the steps to deploy entire dev stack

1. Set up you AWS CLI
2. Setup up AWS CDK and create environment described in *AWS CDK* section
3. Setup all environment variables using AWS Secrets Manager and save secrets ARNs to `cdk.json` file in `context`
section:
    ```bash
   $ aws secretsmanager create-secret --name {ENV_NAME} --secret-string {VALUE}
    ```
   Variables you should set:
    `DJANGO_SOCIAL_AUTH_AUTH0_KEY`,
    `DJANGO_SOCIAL_AUTH_AUTH0_SECRET`,
    `DJANGO_SOCIAL_AUTH_AUTH0_DOMAIN`,
    `DJANGO_USER_MGMT_BACKEND`,
    `DJANGO_USER_MGMT_AUTH0_DOMAIN`,
    `DJANGO_USER_MGMT_AUTH0_KEY`,
    `DJANGO_USER_MGMT_AUTH0_SECRET`

    **Commit and push changes in `cdk.json` file**

4. Obtain and save your github token in AWS Secrets Manager. It will be used to create webhook during pipeline
deployment. Save ARN of the secret and pass it to CDK using `-c github_token_arn={TOKEN_ARN}` CLI param or change value in `cdk.json` under
`context > github_token_arn`.
    ```bash
   $ aws secretsmanager create-secret --name github-token --secret-string {TOKEN}
    ```
   Also run
   ```bash
   $ aws codebuild import-source-credentials --server-type GITHUB --auth-type PERSONAL_ACCESS_TOKEN --token {TOKEN}
   ```
   For AWS CodeBuild used for building and testing pull requests
5. Deploy `base` and `ci-pipeline` stacks using commands:
    ```bash
    $ cdk deploy base ci-pipeline
    ```
    This might take some time. It will create base application resources along with CI pipeline using CDK/Cloudformation.
    After successful deployment pipeline will automatically start and build `api`, `public-api` and `workers` stacks.
6. Log into AWS console and approve waiting stacks deployment on `schema-cms-pipeline` in AWS Code Pipeline service 
section.  
