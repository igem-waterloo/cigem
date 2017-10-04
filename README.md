# CiGEM

CiGEM is a collaborative effort between the University of Toronto and University of Waterloo iGEM teams to create a CI server for iGEM wikis.

* [Setup](#setup)
* [Running locally](#running-locally)
* [Deploying to App Engine](#deploying-to-app-engine)
* [Running the tests](#running-the-tests)

## Setup

Before you can run or deploy the sample, you need to do the following:

1.  Refer to the [appengine/README.md][readme] file for instructions on
    running and deploying.
1.  Install dependencies:

    With `npm`:

        npm install

    or with `yarn`:

        yarn install

## Running locally

With `npm`:

    npm start

or with `yarn`:

    yarn start

## Deploying to App Engine

With `npm`:

    npm run deploy

or with `yarn`:

    yarn run deploy

## Running the tests

[appengine]: https://cloud.google.com/appengine/docs/flexible/nodejs
[tutorial]: https://cloud.google.com/appengine/docs/flexible/nodejs/quickstart
[readme]: ../README.md
[contributing]: https://github.com/GoogleCloudPlatform/nodejs-docs-samples/blob/master/CONTRIBUTING.md
