import setuptools


with open("README.md") as fp:
    long_description = fp.read()


setuptools.setup(
    name="schema_cms_stack",
    version="0.0.1",

    description="Schema CMS",
    long_description=long_description,
    long_description_content_type="text/markdown",

    author="author",

    package_dir={"": "schema_cms_stack"},
    packages=setuptools.find_packages(where="schema_cms_stack"),

    install_requires=[
        "aws-cdk.cx-api==1.9.0",
        "aws-cdk.core==1.9.0",
        "aws-cdk.region-info==1.9.0",
        "aws-cdk.aws-iam==1.9.0",
        "aws-cdk.aws-cloudwatch==1.9.0",
        "aws-cdk.aws-events==1.9.0",
        "aws-cdk.aws-logs==1.9.0",
        "aws-cdk.assets==1.9.0",
        "aws-cdk.aws-kms==1.9.0",
        "aws-cdk.aws-s3==1.9.0",
        "aws-cdk.aws-s3-assets==1.9.0",
        "aws-cdk.aws-sqs==1.9.0",
        "aws-cdk.aws-ssm==1.9.0",
        "aws-cdk.aws-ec2==1.9.0",
        "aws-cdk.aws-lambda==1.9.0",
        "aws-cdk.aws-route53==1.9.0",
        "aws-cdk.aws-sns==1.9.0",
        "aws-cdk.aws-cloudformation==1.9.0",
        "aws-cdk.aws-certificatemanager==1.9.0",
        "aws-cdk.aws-elasticloadbalancingv2==1.9.0",
        "aws-cdk.aws-apigateway==1.9.0",
        "aws-cdk.aws-ecr==1.9.0",
        "aws-cdk.aws-autoscaling-common==1.9.0",
        "aws-cdk.aws-applicationautoscaling==1.9.0",
        "aws-cdk.aws-elasticloadbalancing==1.9.0",
        "aws-cdk.aws-ecr-assets==1.9.0",
        "aws-cdk.aws-secretsmanager==1.9.0",
        "aws-cdk.aws-cloudfront==1.9.0",
        "aws-cdk.aws-route53-targets==1.9.0",
        "aws-cdk.aws-autoscaling==1.9.0",
        "aws-cdk.aws-sns-subscriptions==1.9.0",
        "aws-cdk.aws-autoscaling-hooktargets==1.9.0",
        "aws-cdk.aws-servicediscovery==1.9.0",
        "aws-cdk.aws-ecs==1.9.0",
        "aws-cdk.aws-codepipeline==1.9.0",
        "aws-cdk.aws-codecommit==1.9.0",
        "aws-cdk.aws-codebuild==1.9.0",
        "aws-cdk.aws-stepfunctions==1.9.0",
        "aws-cdk.aws-events-targets==1.9.0",
        "aws-cdk.aws-ecs-patterns==1.9.0",
        "aws-cdk.aws-sam==1.9.0",
        "aws-cdk.aws-rds==1.9.0",
        "aws-cdk-aws-codepipeline==1.9.0",
        "aws-cdk.aws-codedeploy==1.9.0",
        "aws-cdk-aws-codepipeline-actions==1.9.0",
        "aws-cdk.aws-stepfunctions-tasks==1.9.0",
    ],

    python_requires=">=3.6",

    classifiers=[
        "Development Status :: 4 - Beta",

        "Intended Audience :: Developers",

        "License :: OSI Approved :: Apache Software License",

        "Programming Language :: JavaScript",
        "Programming Language :: Python :: 3 :: Only",
        "Programming Language :: Python :: 3.6",
        "Programming Language :: Python :: 3.7",
        "Programming Language :: Python :: 3.8",

        "Topic :: Software Development :: Code Generators",
        "Topic :: Utilities",

        "Typing :: Typed",
    ],
)
