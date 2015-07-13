// include gulp
var gulp = require('gulp');

// include plugins
var jshint    = require('gulp-jshint');
var less      = require('gulp-less');
var concat    = require('gulp-concat');
var uglify    = require('gulp-uglify');
var rename    = require('gulp-rename');
var minifyCSS = require('gulp-minify-css');
var jade      = require('gulp-jade-php');
var del       = require('del');
var changed   = require('gulp-changed');
var ftpjson   = require('./ftp.json');

var path = require('path'),
    exec = require('child_process').exec,
    fs = require('fs'),
    tar = require('tar-fs'),
    async = require('async'),
    Client = require('ssh2').Client,
    zlib = require('zlib');

var lsData;

var dist = {
  all: './lifespan/**/*',
  templates: {
    views: './lifespan/',
    partials: './lifespan/partials/'
  },
  js: {
    all: './lifespan/js',
    lib: './lifespan/js/lib',
    vendor: './lifespan/js/vendor'
  },
  styles: {
    all: './lifespan/css',
    site: './lifespan/css/site',
    vendor: './lifespan/css/vendor'
  },
  fonts: './lifespan/fonts/',
  wp: {
    theme: {
      all: './lifespan'
    }
  }
};

var source = {
  templates: {
    all: './_assets/templates/**/*.jade',
    views: './_assets/templates/views/**/*.jade',
    partials: './_assets/templates/partials/**/*.jade'
  },
  styles: {
    site: './_assets/less/*.less',
    siteWatch: './_assets/less/**/*.less',
    vendor: './_assets/css/vendor/**/*.css'
  },
  js: {
    lib: './_assets/js/lib/**/*.js',
    vendor: './_assets/js/vendor/**/*.js'
  },
  fonts: './_assets/fonts/*.*',
  wp: {
    theme: {
      all: './_assets/wordpress/**/*.*',
      index: './_assets/wordpress/index.php',
      stylecss: './_assets/wordpress/style.css',
      functions: './_assets/wordpress/functions.php'
    }
  }
};


// Clean directories before compile.
gulp.task('clean', function(cb) {
  del([
    dist.all,
    './tmp/*'
  ], cb);
});


// lint task
gulp.task('lint', function() {
    return gulp.src(source.js.lib)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('styles', ['less', 'vendor-css']);

// compile less
gulp.task('less', function() {
    return gulp.src(source.styles.site)
        .pipe(less())
        .pipe(gulp.dest(dist.styles.site))
        .pipe(rename(function (path) {
          path.basename += '.min';
        }))
        .pipe(minifyCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest(dist.styles.site));
});

// copy vendor css
gulp.task('vendor-css', function() {
    return gulp.src(source.styles.vendor)
        .pipe(gulp.dest(dist.styles.vendor));
});

// concatenate & minify JS
gulp.task('scripts', ['site-js', 'vendor-js']);

gulp.task('vendor-js', function() {
  return gulp.src(source.js.vendor)
    .pipe(gulp.dest(dist.js.vendor));
});

gulp.task('site-js', function() {
  return gulp.src(source.js.lib)
    .pipe(concat('site.js'))
    .pipe(gulp.dest(dist.js.lib))
    .pipe(rename(function (path) {
        path.basename += '.min'; }))
    .pipe(uglify())
    .pipe(gulp.dest(dist.js.lib));
});

// gulp.task('templates', function() {
//   return gulp.src('./templates/views/*.jade')
//     .pipe(jade({
//       pretty:true
//     }))
//     .pipe(gulp.dest('./sailforjustice/'));
// });

// watch files for changes
gulp.task('watch', function() {
    gulp.watch(source.js.lib, ['lint', 'site-js']);
    gulp.watch(source.js.vendor, ['vendor-js']);
    gulp.watch(source.templates.all, ['templates']);
    gulp.watch(source.styles.siteWatch, ['less']);
    gulp.watch(source.styles.vendor, ['vendor-css']);
    gulp.watch(source.wp.theme.all, ['wordpress']);
});

// PHP Templates
gulp.task('templates', ['partials', 'pages']);

gulp.task('pages', function(event) {

  return gulp.src(source.templates.views)
            .pipe(changed(dist.templates.views))
            .pipe(jade({
                pretty: true,
                locals: {
                  title: 'OMG THIS IS THE TITLE',
                }
             }))
             .pipe(gulp.dest(dist.templates.views));
});

gulp.task('partials', function() {
  return gulp.src(source.templates.partials)
    .pipe(changed(dist.templates.partials))
    .pipe(jade({
        pretty: true,
        locals: {
          title: 'OMG THIS IS THE TITLE',
        }
     }))
     .pipe(gulp.dest(dist.templates.partials));
});

gulp.task('wordpress', function(){
  return gulp.src(source.wp.theme.all)
      .pipe(gulp.dest(dist.wp.theme.all));
});

gulp.task('fonts', function() {
  return gulp.src(source.fonts)
      .pipe(gulp.dest(dist.fonts));
});

// default task
gulp.task('default', ['lint', 'templates', 'styles', 'scripts', 'wordpress', 'fonts', 'watch']);

gulp.task('watch-sync', ['watch'], function() {
  gulp.watch(dist.all, ['sftp']);
});

gulp.task('deploy', ['sftp']);

gulp.task('sftp', function(callback) {
  var conn = new Client(),
      themepath = 'lifespanwptheme/wp-content/themes/';

  function sshExec(cmd, opts, cb) {
    if(typeof(opts) == 'function') {
      cb = opts;
      opts = {};
    }
    conn.exec(cmd, opts, function(err, stream) {
      if (err) return cb(err);

      stream.on('data', function(data) {
        process.stdout.write('STDOUT: ' + data + '\n');
      });

      stream.stderr.on('data', function(data) {
        process.stdout.write('STDERR: ' + data + '\n');
      });

      stream.on('close', function(code, signal) {
        if(code !== 0) {
          return cb(new Error('Exited with code ' + code + (signal ? ' with signal ' + signal : '')));
        }
        cb();
      });

    });
  }

  conn.on('ready', function() {
    console.log('Client :: ready');
    async.series([
      compress,
      function(next) {
        conn.sftp(function(err, sftp) {
          if (err) throw err;
            sftp.fastPut(path.join('.', 'tmp', 'current.tar.gz'), themepath + 'lifespan.tar.gz', function(err) {
              next(err);
            });
        });
      },
      async.apply(sshExec, 'cd ' + themepath + ';rm -rf ./lifespan/*'),
      async.apply(sshExec, 'cd ' + themepath + ';tar -C ./ -xf ./lifespan.tar.gz'),
      async.apply(sshExec, 'cd ' + themepath + ';rm ./lifespan.tar.gz')
    ], function(err) {
      conn.end();
      console.log('Client :: closed');
      callback(err);
    });
  }).connect(ftpjson);
});

function compress(callback) {
  async.series([
    list,
    function(next) {
        console.log('Tar %s files', lsData.length);
        tarball = 'current' + '.tar';
        archive = tarball + '.gz';

        var writer = fs.createWriteStream(path.join('.', 'tmp', tarball));
        tar.pack('./', { entries: lsData }).pipe(writer);

        writer.on('finish', next);
    },
    function(next) {
      var raw = fs.createReadStream(path.join('.', 'tmp', tarball));
      var writer = fs.createWriteStream(path.join('.', 'tmp', archive));

      raw.pipe(zlib.createGzip()).pipe(writer);

      writer.on('finish', function(){
        fs.unlink(path.join('.','tmp', tarball));
        next();
      });
    }
  ], callback);
}

function list(callback) {
  exec('find lifespan/*', function(err, data) {
    if (err) return callback(err);
    lsData = data.split("\n");
    callback();
  });
}
// gulp.task('deploy-dev', ['styles', 'fonts']);
// gulp.task('watch-sync', ['watch'], function() {
//   gulp.watch(dist.all, ['sftp']);
// });
//
// gulp.task('sftp', function() {
//   return gulp.src(dist.all)
//              .pipe(changed(dist.all))
//              .pipe(gulp.dest('./sftp'));
// })
