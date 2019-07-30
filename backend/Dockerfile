# ==================================== BASE ====================================
ARG INSTALL_PYTHON_VERSION=${INSTALL_PYTHON_VERSION:-3.7}
FROM python:${INSTALL_PYTHON_VERSION}-slim-stretch AS base

RUN apt-get update
RUN apt-get install -y \
    curl

ARG INSTALL_NODE_VERSION=${INSTALL_NODE_VERSION:-12}
RUN curl -sL https://deb.nodesource.com/setup_${INSTALL_NODE_VERSION}.x | bash -
RUN apt-get install -y \
    nodejs \
    && apt-get -y autoclean

WORKDIR /app
COPY ["Pipfile", "shell_scripts", "./"]
RUN pip install pipenv

COPY [ "assets", "package.json", "webpack.config.js", "./" ]
RUN npm install --no-optional --no-shrinkwrap --no-package-lock

# ================================= DEVELOPMENT ================================
FROM base AS development
RUN pipenv install --dev
EXPOSE 2992
EXPOSE 5000
ENTRYPOINT [ "/app/shell_scripts/entrypoint.sh" ]
CMD [ "pipenv", "run", "npm", "start" ]
