/* eslint-env node */

const gulp = require("gulp");

const filter = require("gulp-filter");
const replace = require("gulp-replace");
const webpack = require("webpack-stream");

gulp.task("build:appsscript", () =>
  gulp.src("src/appsscript.json").pipe(gulp.dest("dist/"))
);

gulp.task("build:frontend", () =>
  gulp
    .src("src/frontend/index.ts")
    .pipe(webpack(require("./frontend.webpack.config.js")))
    .pipe(filter(["index.html"]))
    .pipe(replace("\u0085", "\\u0085"))
    .pipe(gulp.dest("dist/"))
);

gulp.task("build:backend", () =>
  gulp
    .src("src/backend/index.ts")
    .pipe(webpack(require("./backend.webpack.config.js")))
    .pipe(gulp.dest("dist/"))
);

gulp.task(
  "build",
  gulp.parallel("build:appsscript", "build:frontend", "build:backend")
);
