#!/usr/bin/env bash

set -e

apt update
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg2 \
    software-properties-common
curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable"
apt update
apt install -y docker-ce docker-ce-cli containerd.io npm
npm install -g serverless
npm install --save-dev serverless-localstack
npm install --save-dev serverless-package-external
pip install awscli gevent