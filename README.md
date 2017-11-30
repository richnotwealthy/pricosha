# PriCoSha

Intro to DB Final Project

## Project Part 3

Login is implemented at `app/components/LoginPage.js`. Content viewing is implemented at `app/components/ContentViewer.js`. Content adding is implemented at `app/components/ContentAdder.js`. The database interaction is all handled at `src/db/db.js`.

## Setup for Development

You're going to need Node.js (and npm, it's package manager) setup on your machine in order to run the development environment locally. I don't care how you install Node, but I do recommend you use a package manager like homebrew or apt and pull the latest LTS version.

After cloning this package (and installing Node!), run the following:

```
# install dependencies
> npm install
# start the dev server
> npm start
```

The app will automatically open a new tab in Google Chrome at [http://localhost:3083/](http://localhost:3083/) where the app is running.

## Production build

To build this app into a static, minified package, running `npm run build` will create such a package under the `/build/` directory and run the production server at [http://localhost:9000/](http://localhost:9000/).

---

Made with the help of ejecting a [create-react-app](https://github.com/facebookincubator/create-react-app).