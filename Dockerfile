FROM node:20-alpine

WORKDIR /app

RUN corepack enable pnpm

COPY ./nest-cli.json ./nest-cli.json

COPY ./tsconfig.json ./tsconfig.json

COPY ./package*.json ./

COPY ./pnpm-lock.yaml ./

COPY ./.env.sample ./.env

COPY ./src ./src

COPY ./templates ./templates

RUN pnpm install && pnpm run build

CMD pnpm run start:prod