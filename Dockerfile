# Copyright 2023 Airbus
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

####################
### test & build ###
####################

# base image
FROM node:16 as build

# install chrome for tests
RUN apt-get update && apt-get install -yq chromium \
    # Cypress dependencies
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb \
    gettext-base

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm install --audit=false

# add app
COPY . /app


# run tests
ENV CHROME_BIN=chromium
RUN npm run test:ci
RUN npm run e2e:ci
USER root

# generate build
RUN npm run build -- --output-path=dist
RUN mv /app/dist/index.html /app/dist/index.templ.html

############
### prod ###
############

# base image
FROM nginx:1.21.6-alpine

RUN apk upgrade --no-cache && apk add --no-cache gettext

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

RUN rm /usr/share/nginx/html/assets/config.json
RUN rm /usr/share/nginx/html/index.html

ADD ./docker/entrypoint.sh /entrypoint.sh

# expose port 80
EXPOSE 80

# run nginx
ENTRYPOINT [ "/entrypoint.sh" ]