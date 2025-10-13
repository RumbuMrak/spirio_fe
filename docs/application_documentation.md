# Application documentation

## Tech stack

- NodeJS 20
- NextJS 14
- NPM 10

## Software requirements

- Supervisor

## Packages

- via `package.json`

## Locales

- via `i18n.json`

## Env

- via `.env.example`

## HTTP handling

Direct all HTTP requests to `/public/` folder first and fallback to NextJS HTTP Server.

### NextJS HTTP Server

`bash /provision/supervisor/server.sh $LOCAL_HTTP_SERVER_PORT`
