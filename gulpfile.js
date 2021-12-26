/*
 * @Author: い 狂奔的蜗牛
 * @Date: 2021-12-22 12:25:04
 * @Description: 压缩混淆js
 */
const gulp = require('gulp');
const del = require('del');
// JS 压缩混淆
const uglify = require('gulp-uglify');
gulp.task('uglify', function () {
  return gulp.src('miniprogram_dist/**/*.js').pipe(uglify()).pipe(gulp.dest('miniprogram_dist'));
});
// 清除目录
gulp.task('clean', function () {
  return del(['miniprogram_dist']);
});
