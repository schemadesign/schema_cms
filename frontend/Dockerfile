FROM node:12-alpine

RUN mkdir /webapp/ && \
    apk add --update --no-cache zlib-dev libpng-dev

RUN mkdir -p /webapp/schemaCMS
RUN mkdir -p /webapp/schemaUI

WORKDIR /webapp/schemaUI
COPY schemaUI/package.json schemaUI/.eslintrc schemaUI/.eslintignore schemaUI/yarn.lock schemaUI/.prettierrc /webapp/schemaUI/
RUN yarn
COPY . /webapp/
RUN CI=true yarn test
RUN yarn build
RUN yarn link

WORKDIR /webapp/schemaCMS
COPY schemaCMS/package.json schemaCMS/.eslintrc schemaCMS/.eslintignore schemaCMS/yarn.lock schemaCMS/.prettierrc /webapp/schemaCMS/
RUN yarn link schemaUI
RUN yarn
RUN CI=true yarn test
RUN yarn build
