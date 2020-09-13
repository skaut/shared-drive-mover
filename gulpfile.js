const gulp = require( 'gulp' );

const webpack = require( 'webpack-stream' );

gulp.task( 'build:appsscript', function() {
	return gulp.src( 'src/appsscript.json' )
		.pipe(webpack( require( './appsscript.webpack.config.js' ) ))
		.pipe(gulp.dest('dist/'));
} );

gulp.task( 'build:frontend', function() {
	return gulp.src( 'src/frontend/index.ts' )
		.pipe(webpack( require( './frontend.webpack.config.js' ) ))
		.pipe(gulp.dest('dist/'));
} );

gulp.task( 'build:backend', function() {
	return gulp.src( 'src/backend/backend.ts' )
		.pipe(webpack( require( './backend.webpack.config.js' ) ))
		.pipe(gulp.dest('dist/'));
} );

gulp.task( 'build', gulp.series( 'build:appsscript', 'build:frontend', 'build:backend' ) );
