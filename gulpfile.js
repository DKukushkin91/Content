'use-strict'

const {src, dest, watch, series, parallel}= require('gulp');
const	browserSync = require('browser-sync').create();
const	pug = require('gulp-pug');
const	plumber = require('gulp-plumber');
const	cleanCSS = require('gulp-clean-css');
const	babel = require('gulp-babel');
const stylus = require('gulp-stylus')
const autoprefixer = require('gulp-autoprefixer');
const rollup = require('rollup-stream');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const terser = require('gulp-terser');
const concat = require('gulp-concat');
const del = require('del');
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');
const sourcemaps = require('gulp-sourcemaps');
const svgStore = require('gulp-svgstore');
const rename = require('gulp-rename');

/* Paths variables */
let basepath = {
	src: 'src/',
	dest: 'build/'
};

let path = {
	build: {
		js: 'build/scripts/',
		css: 'build/css/',
	},
	src: {
		js: `${basepath.src}scripts/`,
		pug: `${basepath.src}layouts/**/*.pug`,
		styl: `${basepath.src}/styles/*.styl`,
	},
	watch: {
		js: `${basepath.src}scripts/**/*.js`,
		pug: `${basepath.src}**/*.pug`,
		stylus: `${basepath.src}**/*.styl`,
	}
};

/* Overwrite */
const clean = () => del([`${basepath.dest}/*`, `${basepath.dest}/html/*`, `!${basepath.dest}/img`]);

/* Pug templates */
const pug2html = () => {
	return src(path.src.pug)
		.pipe(plumber())
		.pipe(pug({
			pretty: true
		}))
		.pipe(dest(`${basepath.dest}html`))
}

/* styles */
const styles = () => {
  return src(path.src.styl)
    .pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(stylus({
			compress: true
		}))
		.pipe(concat('main.css'))
    .pipe(autoprefixer({ overrideBrowserslist: ['last 5 versions'], grid: true }))
    .pipe(cleanCSS({compatibility: 'ie11'}))
		.pipe(sourcemaps.write('.'))
    .pipe(dest(path.build.css))
		.pipe(browserSync.stream())
}

const vendorCss = () => {
	return src(`${basepath.src}/styles/vendor/*.css`)
		.pipe(sourcemaps.init())
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(concat('vendor.css'))
		.pipe(sourcemaps.write('.'))
    .pipe(dest(path.build.css))
}

/* JS */
const vendorJs = () => {
	return src(`${path.src.js}vendor/*.js`)
		.pipe(sourcemaps.init())
		.pipe(concat('vendor.js'))
		.pipe(terser())
		.pipe(sourcemaps.write('.'))
		.pipe(dest(`${path.build.js}`))
};

const userJs = () => {
	return rollup({
		input: `${path.src.js}main.js`,
		format: 'es',
	})
	.pipe(source('main.js'))
	.pipe(buffer())
	.pipe(src(`${path.src.js}jquery/*.js`))
	.pipe(sourcemaps.init())
	.pipe(babel({
			presets: ['@babel/preset-env']
	}))
	.pipe(terser())
	.pipe(concat('main.js'))
	.pipe(sourcemaps.write('.'))
	.pipe(dest(`${path.build.js}`))
	.pipe(browserSync.stream())
};

/* server */
const serv = (cb) => {
	browserSync.init({
		startPath: '/html',
		server: {
			baseDir: basepath.dest,
		},
		notify: false,
	});

	watch(path.watch.pug, series('pug2html'));
	watch(path.watch.stylus, series('styles'));
	watch(path.watch.js, series('userJs'));
	watch("build/*.html").on('change', browserSync.reload);

	cb();
};

/* optimization images */
const imgOptimization = () => {
	return src(`${basepath.src}img/*.*`)
		.pipe(newer(`${basepath.dest}img`))
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.mozjpeg({quality: 80, progressive: true}),
			imagemin.optipng({optimizationLevel: 5, interlaced: true}),
			imagemin.svgo({
				plugins: [
					{removeViewBox: false },
					{cleanupIDs: false},
				],
			}),
		]))
		.pipe(dest(`${basepath.dest}img`))
}

/* convert svg to sprite */
const svg2sprite = () => {
	return src(`${basepath.src}img/sprite/icon-*.svg`)
		.pipe(imagemin([
			imagemin.svgo({
				plugins: [
					{removeViewBox: false },
					{cleanupIDs: false},
					{removeAttrs: {attrs: '(fill|stroke|style)'}}
				],
			}),
		]))
		.pipe(svgStore())
		.pipe(rename('sprite.svg'))
		.pipe(dest(`${basepath.dest}img`))
}

/* video */
const video = () => src(`${basepath.src}video/**/*.*`).pipe(dest(`${basepath.dest}video`));

/* fonts */
const fonts = () => src(`${basepath.src}fonts/**/*.*`).pipe(dest(`${basepath.dest}fonts`));

/* exports */
exports.pug2html = pug2html;
exports.styles = styles;
exports.vendorJs = vendorJs;
exports.userJs = userJs;
exports.serv = serv;
exports.clean = clean;
exports.fonts = fonts;
exports.video = video;
exports.vendorCss = vendorCss;
exports.imgOptimization = imgOptimization;
exports.svg2sprite = svg2sprite;

/* default actions */
const img = series(imgOptimization, svg2sprite);
const vendor = series(vendorCss, vendorJs);

const build = series(clean, parallel(img, video, fonts, pug2html, styles, vendor, userJs));

exports.build = build;
exports.default = series(serv);
