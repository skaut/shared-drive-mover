# Shared drive mover

[![GitHub Release](https://img.shields.io/github/v/release/skaut/shared-drive-mover?logo=github)](https://github.com/skaut/shared-drive-mover/releases)
[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/skaut/shared-drive-mover/CI.yml?branch=master&logo=github)](https://github.com/skaut/shared-drive-mover/actions)
[![Codecov (with branch)](https://img.shields.io/codecov/c/github/skaut/shared-drive-mover/master?logo=codecov)](https://app.codecov.io/gh/skaut/shared-drive-mover)
[![GitHub License](https://img.shields.io/github/license/skaut/shared-drive-mover)](https://github.com/skaut/shared-drive-mover/blob/master/LICENSE)

This app enables Google Workspace users to easily move files from their personal drives to a Shared Drive (previously known as a Team Drive).

The app is intended to run as a [Google Apps Script Web App](https://developers.google.com/apps-script/guides/web).

## How to run

### skaut.cz deployment

The app is currently running for users in the `@skaut.cz` Google Workspace at [presun-disku.skauting.cz](https://presun-disku.skauting.cz).

### Own deployment

To run the app on your own, clone the repo and, install all the dependencies:

```sh
$ git clone https://github.com/skaut/shared-drive-mover.git
$ cd shared-drive-mover 
$ npm install
```

Create a new script project on https://script.google.com under a Google Workspace account and in the Project properties, copy the Script ID. Put this inside `.clasp.json`. Then enable [Google Apps Script API](https://script.google.com/home/usersettings). You should also modify the `webapp.access` value in `appsscript.json` to control who can run the script - see the [docs](https://developers.google.com/apps-script/manifest/web-app-api-executable#webapp) for details.

Finally, build the code and push it to the online project by running:

```sh
$ npm run build
$ clasp login
$ clasp push
```

When asked `Manifest file has been updated. Do you want to push and overwrite?` type `y`.

[Deploy the online project as a Web App](https://developers.google.com/apps-script/guides/web#deploying_a_script_as_a_web_app). This should give you an URL to run the project.
