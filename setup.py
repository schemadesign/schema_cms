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
        "aws-cdk.core",
        "aws-cdk.aws-apigateway",
        "aws-cdk.aws-ec2",
        "aws-cdk.aws-ecs",
        "aws-cdk.aws-ecs-patterns",
        "aws-cdk.aws-iam",
        "aws-cdk.aws-lambda",
        "aws-cdk.aws-rds",
        "aws-cdk.aws-sqs",
        "aws_cdk.aws-ecr",
        "aws-cdk.aws-codebuild",
        "aws_cdk_aws-codepipeline",
        "aws_cdk_aws-codepipeline-actions",
        "aws_cdk.aws-stepfunctions",
        "aws_cdk.aws-stepfunctions-tasks",
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
