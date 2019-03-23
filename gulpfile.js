var lr = require('tiny-lr'), // Мінівебсервер для livereload
    gulp = require('gulp'), // Gulp JS
    run = require('gulp-run-command').default,
    jade = require('gulp-jade'), // Плагін для Jade
    stylus = require('gulp-stylus'), // Плагін для Stylus
    livereload = require('gulp-livereload'), // Livereload для Gulp
    myth = require('gulp-myth'), // Плагін для Myth - http://www.myth.io/
    csso = require('gulp-csso'), // Мініфікація CSS
    imagemin = require('gulp-imagemin'), // Мініфікація зображень
    uglify = require('gulp-uglify'), // Мініфікація JS
    concat = require('gulp-concat'), // Склейка файлів
    connect = require('connect'), // Webserver
    server = lr();

gulp.task('stylus', function() {
    gulp.src('./assets/stylus/screen.styl')
    .pipe(stylus({use: ['nib']})) // збираємо stylus
    .on('error', console.log) // Повідомлення в разі помилки
    .pipe(myth()) // додаємо префіксы - http://www.myth.io/
    .pipe(gulp.dest('./public/css/')) // записуємо css
    .pipe(livereload(server)); // даемо команду на перезавантаження css
});

gulp.task('http-server', function() {
    connect()
    .use(require('connect-livereload')())
    .use(connect.static('./public'))
    .listen('9000');
    console.log('Server listening on http://localhost:9000');
});
gulp.task('watch', function() {
    run('stylus');
    run('jade');
    run('images');
    run('js');
    server.listen(35729, function(err) {
        if (err) return console.log(err);
        gulp.watch('assets/stylus/**/*.styl', function() { gulp.run('stylus'); });
        gulp.watch('assets/template/**/*.jade', function() { gulp.run('jade'); });
        gulp.watch('assets/img/**/*', function() { gulp.run('images'); });
        gulp.watch('assets/js/**/*', function() { gulp.run('js'); });
    });
    run('http-server');
});
