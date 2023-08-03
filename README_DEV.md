# web-interface

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.1.3.

## Requirement

This projects needs the following tools installed.

- Node.js
- npm
- Docker

Please perform a `npm install` on the project in order to download the project dependencies of the project.

## Development server

Run `npm run start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `npm run ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

### Build - local

Run `npm run ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Build - docker

Run `npm run docker:build` to make a production build and package this app into a docker image, this will also run all tests and will only suceed if the tests are ok.

Run `npm run docker:run` to start this app as a docker container after building it. Navigate to `http://localhost:4201/`.

## Tests

### Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `npm run e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

### Running CI tests

Use `npm run test:ci` as also `npm run e2e:ci` to run automateable tests on ci systems. Usage can also be seen in [Dockerfile](Dockerfile).

## Deploy

### Configuration

The app is being configured by filling the template file `assets/config.templ.json` in order to generate the configuration file `assets/config.json`.

During runtime the configuration can be accessed by using the `ConfigService`.

## Further help

To get more help on the Angular CLI use `npm run ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
