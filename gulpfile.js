/* eslint-env node */

const gulp = require( 'gulp' );

const concat = require( 'gulp-concat' );
const ts = require( 'gulp-typescript' );
const webpack = require( 'webpack-stream' );

gulp.task( 'build:appsscript', function() {
	return gulp.src( 'src/appsscript.json' )
		.pipe(gulp.dest('dist/'));
} );

gulp.task( 'build:frontend', function() {
	return gulp.src( 'src/frontend/index.ts' )
		.pipe(webpack( require( './frontend.webpack.config.js' ) ))
		.pipe(gulp.dest('dist/'));
} );

gulp.task( 'build:backend', function() {
	const tsProject = ts.createProject( 'tsconfig.json', { lib: [ 'es5' ], types: [ 'google-apps-script' ] } );
	return gulp.src( ['src/backend/*.ts', 'src/backend/d.ts/*.d.ts', 'src/interfaces/*.ts' ] )
		.pipe(tsProject())
		.js.pipe( concat( 'backend.gs' ) )
		.pipe(gulp.dest('dist/'));
} );

gulp.task( 'build', gulp.series( 'build:appsscript', 'build:frontend', 'build:backend' ) );
