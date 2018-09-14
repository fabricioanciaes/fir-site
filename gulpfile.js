"use strict";

var gulp = require('gulp');
var postcss = require('gulp-postcss');
var sass = require('gulp-sass');
var rename = require('gulp-rename');

var browserSync = require('browser-sync').create();

var maps = require('gulp-sourcemaps');
var concat = require('gulp-concat');
var htmlreplace = require('gulp-html-replace');
var uglify = require('gulp-uglify-es').default;

var imagemin = require('gulp-imagemin');

var autoprefixer = require('autoprefixer');
var cssnano = require('cssnano');
var uncss = require('postcss-uncss');
var pxtorem = require('postcss-pxtorem');
var critical = require('critical').stream;

var log = require('fancy-log');

var srcPath = {
	styles: 'src/assets/css',
	images: 'src/assets/img',
	scripts: 'src/assets/js',
	pages: 'src',
	fonts: 'src/assets/fonts'
}

var distPath = {
	root: 'dist',
	styles: 'dist/assets/css',
	images: 'dist/assets/img',
	scripts: 'dist/assets/js',
	pages: 'dist',
	fonts: 'dist/assets/fonts'
}

//Concatena os scripts globais pra dev (Mantém sourcemap pra desenvolvimento)
gulp.task('devScripts', function() {
	return gulp.src([
		//Os scripts que são concatenados são somente os comuns a todas as páginas
		//Vendors (libraries externas)
		//ex: `${srcPath.scripts}/vendor/jquery-3.2.1.slim.min.js`,
	])
	.pipe(maps.init())
	.pipe(concat('main.js'))
	.pipe(maps.write('./'))
	.pipe(gulp.dest(`${srcPath.scripts}`))
	.on('error', function(err) { log.error(err.message); })
	.pipe(browserSync.stream())
})

//Prepara os scripts globais pra produção
gulp.task('buildGlobalScripts', function() {
	return gulp.src([
		//Os scripts que são concatenados são somente os comuns a todas as páginas
		//Vendors (libraries externas)
		//ex: `${srcPath.scripts}/vendor/jquery-3.2.1.slim.min.js`,
	])
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(rename('main.min.js'))
	.on('error', function(err) { log.error(err.message); })
	.pipe(gulp.dest(`${distPath.scripts}`))
})

//Por Local scripts quero dizer scripts que só são usados em uma página
gulp.task('buildLocalScripts', function() {
	return gulp.src([`${srcPath.scripts}/pages/*.js`])
	.pipe(uglify())
	.on('error', function(err) { log.error(err.message); })
	.pipe(gulp.dest(`${distPath.scripts}/pages`))
})

//Compila o sass e processa com o postcss para o ambiente de dev
gulp.task('devCss', function() {
	var processors = [
		autoprefixer,
		pxtorem,
	];

	return gulp.src(`${srcPath.styles}/main.scss`)
		.pipe(maps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(maps.write(`./`))
		.pipe(gulp.dest(`${srcPath.styles}`))
		.on('error', function(err) { log.error(err.message); })
		.pipe(browserSync.stream())
})

//Prepara o CSS pra produção
//Já tem o padrão pra remover código do Bootstrap
gulp.task('buildCss', ['renameSources', 'buildLocalScripts', 'buildGlobalScripts'], function() {
	var processors = [
		autoprefixer,
		pxtorem,
		cssnano,
		uncss({
			html: `${distPath.pages}/*.html`,
			htmlroot: `./dist`,
			ignore: [
				/\.js-/, '.hide-input-content', /^\.input/, /^\.uncss-/,
				/\.fade/, /\.modal/, '.affix', /\.tooltip/, /\.popover/, /\.collaps/,
			]
		})
	];

	return gulp.src(`${srcPath.styles}/main.scss`)
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(rename('main.css'))
		.on('error', function(err) { log.error(err.message); })
		.pipe(gulp.dest(`${distPath.styles}`))
})

//Task de watch, executa tasks de dev quando scripts e css são alterados
gulp.task('watchFiles', function() {
	gulp.watch(`${srcPath.styles}/**/*.scss`, ['devCss'])
	gulp.watch(`${srcPath.scripts}/**/*.js`, ['devScripts'])
})

//Troca o caminho dos scripts no html para refletir a estrutura da pasta de produção (dist)
gulp.task('renameSources', function(){
	return gulp.src([`${srcPath.pages}/*.html`])
	.pipe(htmlreplace({
		'globaljs': `assets/js/main.min.js`,
		'css': `assets/css/main.css`,
	}))
	.on('error', function(err) { log.error(err.message); })
	.pipe(gulp.dest(`${distPath.pages}`))
})

//Otimiza as imagens (não comprime, apenas reduz o tamanho de outras formas sem perda)
//Só funciona para jpg,gif,png,svg. Quaisquer outros tipos de arquivos não pararão na pasta de prod
gulp.task('buildImages', function(){
	return gulp.src(`${srcPath.images}/**/*.*`)
		.pipe(imagemin())
		.on('error', function(err) { log.error(err.message); })
		.pipe(gulp.dest(`${distPath.images}`))
})

//Copia as fontes
gulp.task('copyFonts', function() {
	gulp.src(`${srcPath.fonts}/*.{woff,woff2}`)
		.pipe(gulp.dest(`${distPath.fonts}`))
})

//Pega CSS crítico (acima do fold) e o deixa inline nos HTMLs
gulp.task('criticalCss', ['renameSources', 'buildCss'], function() {
	return gulp.src(`${distPath.pages}/*.html`)
		.pipe(critical({
			base: `${distPath.root}`,
			inline: true,
			css: [`${distPath.styles}/main.css`],
			dimensions: [
			{
				with:320,
				height:480
			}
			],
			ignore: ['@font-face',/url\(/]
		}))
		.on('error', function(err) { log.error(err.message); })
		.pipe(gulp.dest(`${distPath.root}`))
})

//Task de deploy. Prepara tudo para a produção, rode essa aqui
gulp.task('deploy', ['renameSources', 'buildImages', 'buildCss', 'buildGlobalScripts', 'buildLocalScripts', 'copyFonts', 'criticalCss'], function(){
})

//Prepara o browsersync (server de desenvolvimento com live reload)
gulp.task('dev', ['watchFiles'], function() {
	browserSync.init({
		server: `${srcPath.pages}`
	})
})