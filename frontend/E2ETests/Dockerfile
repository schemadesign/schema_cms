FROM node:12


COPY ./scripts/wait-for-it.sh ./
RUN chmod 755 wait-for-it.sh
COPY ./scripts/run.sh ./
RUN chmod 755 run.sh

COPY ./package.json package.json
COPY ./package-lock.json package-lock.json
COPY babel.config.json babel.config.json

RUN npm ci

COPY ./.env ./
COPY ./config config
COPY ./test test

CMD [ "./run.sh"]

