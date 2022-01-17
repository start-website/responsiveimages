"use strict";

const path = require('path'),
    gulp = require('gulp'),
    webpack = require('webpack-stream'),
    clean = require('gulp-clean'),
    browserSync             = require('browser-sync'),
    cache = require('gulp-cache');

const babel = require("gulp-babel");

const isDev = process.env.NODE_ENV === 'development';

// gulp.task('move-dist', function (done) {
//     return gulp.src([
//         './public/**',
//         'src/*.html'
//     ])
//         .pipe(gulp.dest('./dist'));
// })


gulp.task('move-dist', function (done) {
    return gulp.src([
      'src/*.html'
    ])
    .pipe(gulp.dest('./dist'));
})

gulp.task('move-dist-img', function (done) {
    return gulp.src([
      'src/img/**'
    ])
    .pipe(gulp.dest('./dist/img'));
})

// Настройка Webpack
const webpackConfig = {
    mode: isDev ? 'development' : 'production',
    entry: {
        'backend-webasyst': './src/js/_backend.js',
    },
    output: {
        filename: '[name].js',
    },
    optimization: {
        // We no not want to minimize our code.
        minimize: false
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                      presets: [['@babel/preset-env', {
                        corejs: 3,
                        useBuiltIns: 'usage'
                      }]]
                    }
                }
            }

        ]
    }
};

// Webpack - сборщик js модулей
gulp.task('webpack', function () {
    return gulp.src([
        './src/js/_backend.js',
    ])
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(isDev ? './src/js' : './dist/js'));
});



gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('browser-sync' , function() { 
    browserSync({
        server: {
            baseDir: 'src'
        },
        //browser: 'Firefox',
        notify: false
    });
  });

gulp.task('cache', function () {
    return cache.clearAll();
});

gulp.task('watch', function() {
    // Наблюдение
    //gulp.watch('src/scss/style.scss', gulp.parallel('sass'));  
    gulp.watch('src/js/_scripts.js', gulp.parallel('webpack'));
    // Обновление страницы
   // gulp.watch('src/css/style.css').on('change', browserSync.reload);
    gulp.watch('src/*.html').on('change', browserSync.reload); 
    gulp.watch('src/js/scripts.js').on('change', browserSync.reload);
  });

gulp.task('default', gulp.parallel('watch', 'webpack', 'browser-sync'));

gulp.task('build', gulp.series('webpack', 'move-dist', 'move-dist-img'));


