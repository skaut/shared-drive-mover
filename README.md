# Shared drive mover

This app enables G Suite users to easily move files from their personal drives to a Shared Drive (previously known as a Team Drive).

The app is intended to run as a [Google Apps Script Web App](https://developers.google.com/apps-script/guides/web).

## How to run

### skaut.cz deployment

The app is currently running for skaut.cz G Suite users [here](https://script.google.com/a/skaut.cz/macros/s/AKfycbyKMLfhOnMl5ckaSUVEzA8b_N_iyMKYJyQ8hZwDizsGiuXlabw/exec).

### Own deployment

To run the app on your own, clone the repo and, install all the dependencies:

```sh
$ git clone https://github.com/skaut/shared-drive-mover.git
$ cd shared-drive-mover 
$ npm install
```

Create a new script project on https://script.google.com under a G Suite account and in the Project properties, copy the Script ID. Put this inside `.clasp.json`. Build the code and push it to the online project by running:

```sh
$ npm run build
$ clasp login
$ clasp push
```

Deploy the online project as a Web App. This should give you an URL to run the project.
