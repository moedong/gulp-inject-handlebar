var gulp = require('gulp');

//浏览器自动刷新
var browserSync = require('browser-sync');

var inject = require('gulp-inject');
//格式化html,js
var prettify = require('gulp-jsbeautifier');

var postcss = require('gulp-postcss');
//css压缩
var cssnano = require('cssnano');
//js压缩
var uglify = require('gulp-uglify');
//文件合并
var concat = require('gulp-concat');
//文件更名
var rename = require('gulp-rename');

var greplace = require('gulp-replace');

/*-----------------------------------------*/
gulp.task('css-optimize',function(){

    var processors = [
        cssnano
    ];
    return gulp.src('./css/*.css')
        .pipe(postcss(processors))
        .pipe(gulp.dest('./dist/css'));
});

/*合并、压缩js文件*/
gulp.task('js', function() {
  return gulp.src(['./script/handlebars.js','./script/jquery.js','./script/index.js','!gulpfile.js'])
    .pipe(concat('index.js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/script'))
});

gulp.task('index', function () {
  var target = gulp.src('./main.html');
  var jssources = gulp.src(['./script/*.js','!gulpfile.js']).pipe(concat('index.js')).pipe(rename({suffix: '.min' }));
  var csssources = gulp.src(['./css/*.css'], {read: false});
 
  return target.pipe(inject(csssources)).pipe(inject(jssources))
    .pipe(inject(gulp.src(['./body.html']), {
        starttag: '<!-- inject:body:{{ext}} -->',
        transform: function (filePath, file) {
          return file.contents.toString('utf8')
        }
    }))
    .pipe(inject(gulp.src(['./handlebars.html']), {
        starttag: '<!-- inject:handlebars:{{ext}} -->',
        transform: function (filePath, file) {
          return file.contents.toString('utf8')
        }
    }))
    .pipe(rename({
        basename: "index",
        extname: ".html"
      }))
    .pipe(gulp.dest('./dist'));
});

/*格式化html*/
gulp.task('prettify-html', ['index'],function() {
    return gulp.src('./dist/*.html')
    .pipe(greplace('<!-- inject:css -->', ' '))
    .pipe(greplace('<!-- inject:body:html -->', ' '))
    .pipe(greplace('<!-- inject:handlebars:html -->', ' '))
    .pipe(greplace('<!-- inject:js -->', ' '))
    .pipe(greplace('<!-- endinject -->', ' '))
    .pipe(prettify({indentSize:4}))
    .pipe(gulp.dest('./dist'));
});

/*浏览器自动刷新*/
/*gulp.task('browser-sync',['index','prettify-html','css-optimize','js'],function() {
    browserSync({
        files: "./dist/**",
        proxy: "http://192.168.50.75/demo/gulp/gulp-inject-handlebar/dist/"
    });
});*/

/*-----------------------------------------*/
gulp.task('watch', function(){
    gulp.watch('./*.html', ['index','prettify-html']);
});

/*-----------------------------------------*/
gulp.task('default', ['watch','index','prettify-html','css-optimize','js','browser-sync']);