// import gulp from 'gulp'
const gulp = require('gulp');
const { src, dest } = gulp

function copyIcons() {
    return src(['nodes/**/*.{jpg,png,svg}']).pipe(dest('dist/nodes'))
}

exports.default = copyIcons
