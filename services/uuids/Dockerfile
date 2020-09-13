#---- Base Node -----
FROM node:lts-alpine AS base

ENV HOME /home/node

WORKDIR $HOME

COPY package.json app/

#----Install Production Packages----
FROM base AS dependencies

WORKDIR $HOME/app

# install node packages
RUN npm install --production \
    && mv node_modules prod_node_modules \
    && npm install \
    && mv node_modules dev_node_modules

#----Test & Build----
FROM base AS build

WORKDIR $HOME/app

COPY --from=dependencies $HOME/app/dev_node_modules ./node_modules

COPY tsconfig.json ./
COPY .babelrc ./
COPY .eslintrc ./
COPY .eslintignore ./
COPY copyStaticAssets.js ./
COPY src ./src
COPY ./bluebird-global.d.ts src/

# install node packages and run linting tests
RUN mkdir -p ./build \
    && npm test \
    && npm run build

#----Release----
FROM base AS release

ARG APP_PORT
ARG DEBUG_PORT=9229

WORKDIR $HOME/app
# copy production node_nodules
COPY --from=dependencies $HOME/app/prod_node_modules ./node_modules
COPY --from=build $HOME/app/build ./

EXPOSE ${APP_PORT}

ENTRYPOINT ["node", "index.js"]
