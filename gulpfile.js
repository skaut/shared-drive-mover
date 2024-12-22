import gulp from "gulp";
import webpack from "webpack-stream";

import backendWebpackConfig from "./backend.webpack.config.js";
import frontendWebpackConfig from "./frontend.webpack.config.js";

gulp.task("build:appsscript", () =>
  gulp.src("src/appsscript.json").pipe(gulp.dest("dist/")),
);

gulp.task("build:frontend", () =>
  gulp
    .src("src/frontend/index.ts")
    .pipe(webpack(frontendWebpackConfig(undefined, {})))
    .pipe(gulp.dest("dist/")),
);

gulp.task("build:backend", () =>
  gulp
    .src("src/backend/index.ts")
    .pipe(webpack(backendWebpackConfig))
    .pipe(gulp.dest("dist/")),
);

gulp.task(
  "build",
  gulp.parallel("build:appsscript", "build:frontend", "build:backend"),
);
