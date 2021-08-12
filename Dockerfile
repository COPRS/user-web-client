#############
### build ###
#############

# base image
FROM node:14 as build

# install chrome for tests
RUN apt-get update && apt-get install -yq chromium \
    # Cypress dependencies
    libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --audit=false

# add app
COPY . /app

# run tests
ENV CHROME_BIN=chromium
RUN npm run test:ci
RUN npm run e2e:ci
USER root

# generate build
RUN npm run ng build -- --output-path=dist

############
### prod ###
############

# base image
FROM nginx:1.21.0-alpine

# copy artifact build from the 'build environment'
COPY --from=build /app/dist /usr/share/nginx/html

# expose port 80
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]