FROM node:10-alpine

RUN mkdir /webapp/ && \
    apk add --update --no-cache zlib-dev libpng-dev

RUN mkdir -p /webapp/schemaCMS
RUN mkdir -p /webapp/schemaUI

WORKDIR /webapp/schemaUI
COPY package.json .eslintrc .eslintignore yarn.lock .prettierrc .stylelintrc /webapp/schemaUI/
RUN yarn
RUN CI=true yarn test
RUN yarn build
RUN yarn link

WORKDIR /webapp/schemaCMS
COPY package.json .eslintrc .eslintignore yarn.lock .prettierrc .stylelintrc /webapp/schemaCMS/
RUN yarn link schemaUI
RUN yarn
RUN CI=true yarn test
RUN yarn build
