//----------------------------------------------------------------------
//  mode
//----------------------------------------------------------------------
'use strict';

//----------------------------------------------------------------------
//  変数宣言
//----------------------------------------------------------------------
const gulp = require('gulp');
const { series ,parallel } = require('gulp');
const del = require('del');
const browserSync = require('browser-sync');
const autoprefixer = require("autoprefixer");
const loadPlugins = require('gulp-load-plugins');
const $ = loadPlugins();                            //  postcss,purgecss,imagemin,plumber,sass,sass-glob,connect-php,notify,rename,clean-css,uglify

//  clean
const clean = {
  src:['./dist/**','!./dist'],
};

//  copy
const copy = {
  src:'./src/**',
  dest:'./dist',
};

//  dest
const dest = {
  html:{
    src:'./src/*.html',
    dest:'./dist',
  },

  scss:{
    src:'./src/scss/**',
    dest:'./dist/scss',
  },
};

//  minify
const minify = {
  css:{
    src:'./src/css/styles.css',
    content:['./src/*.html','./src/js/**/*.js'],
    dest:'./dist/css',
  },

  fontawesome:{
    src:'./src/vender/fontawesome/css/all.min.css',
    content:['./src/*.html','./src/js/**/*.js'],
    dest:'./dist/vender/fontawesome/css',
  },

  swiper:{
    src:'./src/vender/swiper/css/swiper-bundle.min.css',
    content:['./src/*.html','./src/js/**/*.js'],
    dest:'./dist/vender/swiper/css',
  },

  tailwind:{
    src:'./src/vender/tailwind/css/tailwind.css',
    content:['./src/*.html','./src/js/**/*.js'],
    dest:'./dist/vender/tailwind/css',
  },

  js:{
    src:'./src/js/**',
    dest:'./dist/js',
  },
};

//  imagemin
const imagemin = {
  src:'./src/image/**/*.{png,jpg,JPG,gif,svg}',
  dest:'./dist/image',
};

//  watch
const watchSrc = ['./src/**','!./src/css/**'];

//  sass
const sass = {
  src:'./src/scss/**/*.scss',
  dest:'./src/css/',
};

//  browser-sync
const bs = {
  port:5500,
  base:'./src/',
};

//----------------------------------------------------------------------
//  task処理
//----------------------------------------------------------------------
//  clean
gulp.task('clean', function (done) {
  del(clean.src);
  done();
});

//  copy
gulp.task('copy', function (done) {
  gulp.src(copy.src)
      .pipe(gulp.dest(copy.dest));
  done();
});

//  dest
gulp.task('dest', function (done) {
  gulp.src(dest.html.src)
      .pipe(gulp.dest(dest.html.dest));

  gulp.src(dest.scss.src)
      .pipe(gulp.dest(dest.scss.dest));
  done();
});

//  minify
gulp.task('minify', function (done) {
	gulp.src(minify.css.src)
      .pipe($.plumber())
      .pipe($.purgecss({content:minify.css.content}))
      .pipe($.cleanCss())
      .pipe(gulp.dest(minify.css.dest));

  gulp.src(minify.fontawesome.src)
      .pipe($.plumber())
      .pipe($.purgecss({content: minify.fontawesome.content}))
      .pipe($.cleanCss())
      .pipe(gulp.dest(minify.fontawesome.dest));

  gulp.src(minify.swiper.src)
      .pipe($.plumber())
      .pipe($.purgecss({content: minify.swiper.content}))
      .pipe($.cleanCss())
      .pipe(gulp.dest(minify.swiper.dest));

  gulp.src(minify.tailwind.src)
      .pipe($.plumber())
      .pipe($.purgecss({
        content: minify.tailwind.content,
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
      }))
      .pipe($.cleanCss())
      .pipe(gulp.dest(minify.tailwind.dest));

  gulp.src(minify.js.src)
      .pipe($.plumber())
      .pipe($.uglify())
      .pipe(gulp.dest(minify.js.dest));
	done();
});

//  imagemin
gulp.task('imagemin', function (done) {
  gulp.src(imagemin.src)
      .pipe($.imagemin())
      .pipe(gulp.dest(imagemin.dest));
	done();
});

//  sass
gulp.task('sass', function (done) {
  gulp.src(sass.src)
      .pipe($.plumber({errorHandler: $.notify.onError("Error: <%= error.message %>")}))
      .pipe($.sassGlob())
      .pipe($.sass())
      .pipe($.postcss([
        autoprefixer({
          cascade: false
        })
      ]))
      .pipe(gulp.dest(sass.dest));
	done();
});

//  browser-sync
gulp.task('browser-sync', function(done){
  $.connectPhp.server({
    port: bs.port,
    base: bs.base,
  },
  function(done){
    browserSync({
      notify:false,
      proxy: `localhost:${bs.port}`,
      open: 'external',
    });
  });
  done();
});

gulp.task('bs-reload',function(done){
  browserSync.reload();
  done();
})

//----------------------------------------------------------------------
//  watch task
//----------------------------------------------------------------------
//  watch
gulp.task('dev:watch', function (done) {
	gulp.watch(watchSrc, gulp.series(parallel('sass'),'bs-reload'));
});

gulp.task('pro:watch', function (done) {
	gulp.watch(watchSrc, gulp.series(parallel('dest','sass'),'minify','bs-reload'));
});

//----------------------------------------------------------------------
//  multi task
//----------------------------------------------------------------------
gulp.task('start', gulp.series('clean','copy'));

gulp.task('dev:default', gulp.series(parallel('browser-sync','sass'),'bs-reload','dev:watch'));

gulp.task('pro:default', gulp.series(parallel('imagemin','browser-sync','dest','sass'),'minify','bs-reload','pro:watch'));

/************************************************************************/
/*  END OF FILE                                       									*/
/************************************************************************/
