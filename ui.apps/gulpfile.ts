"use strict";

const gulp = require("gulp");
const del = require("del");
const tsc = require("gulp-typescript");
const sourcemaps = require('gulp-sourcemaps');
const tsProject = tsc.createProject("tsconfig.json");
const tslint = require('gulp-tslint');

var clean = require('gulp-clean');
var replace = require('gulp-replace');

const appConfig = {
    tsSources: '/src/main/content/jcr_root/apps/ngaem',
    tsBuildTarget: 'build',
    resourcesBuildTarget: "build",
    systemConfigTargetAem: 'src/main/content/jcr_root/apps/ngaem/components/structure/page/clientlib'
}

var compileTs = function(source, destination) {
    let tsResult = gulp.src(source)
        .pipe(sourcemaps.init())
        .pipe(tsProject());
    return tsResult.js
        .pipe(sourcemaps.write(".", {sourceRoot: appConfig.tsSources}))
        .pipe(gulp.dest(destination));        
}

var buildLibs = function(destination) {
return gulp.src([
        'core-js/client/shim.min.js',
        'systemjs/dist/system-polyfills.js',
        'systemjs/dist/system.src.js',
        'reflect-metadata/Reflect.js',
        'rxjs/**/*.js',
        'zone.js/dist/**',
        '@angular/**/bundles/**',
        'ng2-completer/ng2-completer.umd.js'
    ], {cwd: "node_modules/**"}) /* Glob required here. */
    .pipe(gulp.dest(destination));    
}

/**
 * Remove build directory.
 */
gulp.task('clean', gulp.series((cb) => {
    return del(["build"], cb);
}));


/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', gulp.series(() => {
    return gulp.src("src/**/*.ts")
        .pipe(tslint({
            formatter: 'prose'
        }))
        .pipe(tslint.report());
}));

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task("compile", gulp.series("tslint", () => {
    return compileTs("src/main/content/jcr_root/apps/ngaem/components/**/*.ts", 'build/app');
}));

/**
 * Copy all resources that are not TypeScript files into build directory.
 */
gulp.task("resources:static", gulp.series(() => {
    return gulp.src(["src/template/index.html"])
        .pipe(gulp.dest('build'));
}));

gulp.task("resources", gulp.series("resources:static", (done) => {
    gulp.src(["src/main/content/jcr_root/apps/ngaem/components/**/*", "!**/*.ts"])
        .pipe(gulp.dest('build/app')).on('end', function () { done(); });;
}));


/**
 * Copy all required libraries into build directory.
 */

gulp.task("libs", gulp.series(() => {
    return buildLibs("build/lib");
}));

gulp.task('system-config', gulp.series(() => {
  return gulp.src(['src/template/systemjs.config.js'])
    .pipe(replace('${DESIGN_PATH}', 'lib/'))
    .pipe(replace('${APP_PATH}', 'app/content'))
    .pipe(gulp.dest('build'));
}));

gulp.task('update-template-path', gulp.series('compile', 'resources', () => {
  return gulp.src(['build/app/content/**/*.component.js'])
    .pipe(replace('/apps/ngaem/components', '/app'))
    .pipe(gulp.dest('build/app/content'));
}));

gulp.task('clean-generated-files', gulp.series(function () {
    return gulp.src([
     'src/main/content/jcr_root/apps/ngaem/components/**/*.component.js', 
     'src/main/content/jcr_root/apps/ngaem/components/**/*.component.js.map',
     'src/main/content/jcr_root/apps/ngaem/components/**/app.module.js',
     'src/main/content/jcr_root/apps/ngaem/components/**/app.module.js.map',
     'src/main/content/jcr_root/apps/ngaem/components/**/app.routing.js', 
     'src/main/content/jcr_root/apps/ngaem/components/**/app.routing.js.map',
     'src/main/content/jcr_root/apps/ngaem/components/content/main.js', 
     'src/main/content/jcr_root/apps/ngaem/components/content/main.js.map',
     'src/main/content/jcr_root/apps/ngaem/components/ui.tests/**/*.spec.js', 
    ], 
    {read: false, allowEmpty: true}).pipe(clean({force: true}));
}));

/**
 * Build the project.
 */
gulp.task("build", gulp.series('clean-generated-files', 'update-template-path', 'libs', 'system-config', (done) => {
    console.log(" ****************** UI BUILD (ANGULAR) COMPETED ****************** ");
    done();
}));

/**
 * AEM Build specific tasks (executed from maven)
 */
gulp.task("libs:aem", gulp.series(() => {
    return buildLibs("src/main/content/jcr_root/etc/designs/ngaem/lib/");
})); 

gulp.task("resources:aem", gulp.series(() => {
    return gulp.src(["src/app/**/*", "!**/*.ts"])
        .pipe(gulp.dest('src/main/content/jcr_root/etc/designs/ngaem/app'));
}));

gulp.task("compile:aem", gulp.series("tslint", () => {
    return compileTs("src/main/content/jcr_root/apps/ngaem/components/**/*.ts",'src/main/content/jcr_root/apps/ngaem/components');
}));

gulp.task('update-template-path:aem', gulp.series('compile:aem', 'resources:aem', () => {
  return gulp.src(['src/main/content/jcr_root/apps/ngaem/components/**/*.component.js'])
    .pipe(replace('/apps/ngaem/components/content', '/bin/ngtemplate?path=/apps/ngaem/components/content'))
    .pipe(gulp.dest('src/main/content/jcr_root/apps/ngaem/components'));
}));

gulp.task('system-config:aem', gulp.series(() => {
  return gulp.src(['src/template/systemjs.config.js'])
    .pipe(replace('${DESIGN_PATH}', '/etc/designs/ngaem/lib/'))
    .pipe(replace('${APP_PATH}', '/apps/ngaem/components/content'))
    .pipe(gulp.dest(appConfig.systemConfigTargetAem));
}));

gulp.task("build:aem", gulp.series('clean-generated-files', 'update-template-path:aem', 'libs:aem', 'system-config:aem', (done) => {
    console.log(" ****************** UI BUILD (AEM) COMPETED ****************** ");
    done();
}));


/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', gulp.series(function () {
    gulp.watch(["src/**/*.ts"], ['compile']).on('change', function (e) {
        console.log('TypeScript file ' + e.path + ' has been changed. Compiling.');
    });
        
    gulp.watch(["src/**/*.html", "src/**/*.css"], ['resources']).on('change', function (e) {
        console.log('Resource file ' + e.path + ' has been changed. Updating.');
    });
}));