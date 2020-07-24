import setuptools


with open("../README.md") as fp:
    long_description = fp.read()


AWS_CDK_VERSION = "1.45.0"


setuptools.setup(
    name="schema-cms-infra",
    version="0.0.1",
    description="Schema CMS",
    long_description=long_description,
    long_description_content_type="text/markdown",
    author="author",
    package_dir={"": "."},
    packages=setuptools.find_packages(where="."),
    install_requires=[
        "aws-cdk.cx-api=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.core=={version}".format(version=AWS_CDK_VERSION),
        "aws_cdk.assets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.region-info=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-iam=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-kinesis=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-cloudwatch=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-events=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-logs=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.assets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-kms=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-s3=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-s3-assets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-s3-notifications=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-sqs=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-ssm=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-ec2=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-lambda=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-lambda-event-sources=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-route53=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-sns=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-cloudformation=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-certificatemanager=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-elasticloadbalancingv2=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-apigateway=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-ecr=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-autoscaling-common=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-applicationautoscaling=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-elasticloadbalancing=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-ecr-assets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-secretsmanager=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-cloudfront=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-route53-targets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-autoscaling=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-sns-subscriptions=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-autoscaling-hooktargets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-servicediscovery=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-ecs=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-codepipeline=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-codecommit=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-codebuild=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-stepfunctions=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-events-targets=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-ecs-patterns=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-sam=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-rds=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk-aws-codepipeline=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-codedeploy=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk-aws-codepipeline-actions=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-dynamodb=={version}".format(version=AWS_CDK_VERSION),
        "aws-cdk.aws-stepfunctions-tasks=={version}".format(version=AWS_CDK_VERSION),
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