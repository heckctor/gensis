const gulp = require('gulp'),
      //plugins servidor local y sinconización automatica
      browserSync = require('browser-sync')
 
      //Plugins para FTP
      ftp = require('vinyl-ftp'),
      gutil = require('gulp-util'),
 
      //PLugins para compilar sass
      plumber = require('gulp-plumber'),
      sass = require('gulp-sass'),
 
      //Plugins para optimizar imágenes
      imagemin = require('gulp-imagemin'),
      cache = require('gulp-cache'),
 
      //PLugins Post CSS
      postcss = require('gulp-postcss'),
      cssnano = require('cssnano');//autoprefixer
 
 
//---> Sincronizar Navegador
      gulp.task('browser-sync',() =>
        browserSync({
          server: {
              baseDir: "./"
          }
        })
      );
 
      gulp.task('bs-reload',() =>
        browserSync.reload()
      );
//---> Fin Sincronizar Navegador
 
 
//---> Sass
gulp.task('compilarsass',() =>
  gulp.src('./src/sass/**/*.scss')
      .pipe(plumber({
        errorHandler: function(error) {
            console.log(error.message);
            this.emit('end');
        }
      }))
      .pipe(sass())
      .pipe(gulp.dest('./src/css/'))
);
//---> Fin Sass
 
 
//---> PostCss
plugPostcss = [
  cssnano({
    autoprefixer: {
      add: true,
      browsers: 'last 2 versions'
    },
    core: true,
  })
];
 
gulp.task('tareasPostcss',() =>
  gulp.src('./src/css/**/*.css')
      .pipe(postcss(plugPostcss))
      .pipe(gulp.dest('assets/css/'))
);
//---> Fin PostCss
 
 
//optimizar Imagenes
gulp.task('optimizar-img', function() {
    gulp.src('src/img/**/*')
        .pipe(cache(imagemin({
          optimizationLevel: 3,
          progressive: true,
          interlaced: true })))
        .pipe(gulp.dest('assets/img/'));
});
//Fin optimizar Imagenes
 
 
//---> FTP
//Configuración de conexion
var user = process.env.FTP_USER='';
var password = process.env.FTP_PWD='';
var host = '';
var port = 21;
var dirLocales = [
  './assets/*/**' ,
  './assets/*/*/**' ,
  './assets/*/**/*' ,
  './*',
  //omitir carpetas y archivos (anteponer simbolo !)
  '!./src' ,
  '!./node_modules' ,
  '!./gulpfile.js' ,
  '!./package.json' ,
  '!./yarn.lock'
  ];
var dirRemoto = '/public_html/'
 
//función auxiliar para construir una conexión FTP
//basada en nuestra configuración
function getFtpConnection() {
    return ftp.create({
        host: host,
        port: port,
        user: user,
        password: password,
        parallel: 5,
        log: gutil.log
    });
}
 
/**
 * Implementando la tarea
 * Copia los archivos al servidor
 *
 */
 gulp.task('ftp-subir', function() {
     var conn = getFtpConnection();
     return gulp.src(dirLocales, { base: '.', buffer: false })
         .pipe(conn.newer(dirRemoto)) // Sube todo
         .pipe(conn.dest(dirRemoto));
 });
 /**
   * Observa la copia local para los cambios y
   copia los nuevos archivos al servidor cada vez
   que se detecta un cambio
 **/
 gulp.task('ftp-observar-cambios', function() {
     var conn = getFtpConnection();
     gulp.watch(dirLocales)
         .on('change', function(event) {
             console.log('Cambios detectados! Subiendo Archivo "' + event.path + '", ' + event.type);
             return gulp.src([event.path], { base: '.', buffer: false })
                 .pipe(conn.newer(dirRemoto)) // Solo sube archivos más recientes
                 .pipe(conn.dest(dirRemoto));
         });
 });
//---> Fin FTP
 
//Levanta un servidor local para supervisar archivos html/css
gulp.task('servidor', ['browser-sync'] , function() {
  gulp.watch('./src/sass/**/*.scss', ['compilarsass']);
  gulp.watch('./src/css/**/*.css', ['tareasPostcss']);
  gulp.watch("./assets/css/**/*.css", ['bs-reload']);
  gulp.watch("./assets/css/**/*.scss", ['bs-reload']);
  gulp.watch("./*.html", ['bs-reload']);
});
 
//Tarea por defecto que "observa" los directorios locales, compila sass, 
//minifica el css y sube a un servidor los cambios de cualquier archivo
gulp.task('default', ['ftp-observar-cambios'] , function() {
  gulp.watch('./src/sass/**/*.scss', ['compilarsass']);
  gulp.watch('./src/css/**/*.css', ['tareasPostcss']);
  gulp.watch(dirLocales, ['ftp-observar-cambios']);
});
