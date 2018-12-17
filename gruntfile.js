var serveStatic = require('serve-static');
module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: '\n'
      },
      js: {
        src: ['app/**/*.js'],
        dest: 'tmp/bundle.js'
      },
      css: {
        src: ['app/**/*.css'],
        dest: 'tmp/bundle.css'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      js: {
        src: 'tmp/bundle.js',
        dest: 'build/bundle.min.js'
      },
      css: {
        src: 'tmp/bundle.css',
        dest: 'build/bundle.min.css'
      }
    },
    watch: {
      options: { livereload: 35729 },
      htmls: {
        files: ['app/index.html'],
        tasks: ['copy']
      },
      styles: {
        files: ['app/**/*.css'],
        tasks: ['clean:css','concat:css','uglify:css']
      },
      javascripts: {
        files: ['app/**/*.js'],
        tasks: ['clean:js', 'concat:js', 'uglify:js']
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= connect.options.port %>/'
      }
    },
    connect: {
      options: {
        port: 9002,
        hostname: 'localhost',
      },
      livereload: {
        options: {
          middleware: function (connect, options) {
            return [require('connect-livereload')(), serveStatic('build')]
          }
        }
      },
      'server-real': {
        proxies: [
          {
            context: '/rest',
            host: 'localhost',
            port: 8080,
            https: false,
            changeOrigin: false,
            xforward: false
          }
        ]
      },
    },
    copy: {
      main: {
        expand: true,
        flatten: true,
        src: 'app/index.html',
        dest: 'build/'
      }
    },
    clean: {
      build: ['build/'],
      tmp: ['tmp'],
      css: ['build/*.css'],
      js: ['build/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-connect-proxy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', ['clean', 'copy', 'concat', 'uglify', 'clean:tmp', 'connect:livereload', 'open', 'watch']);
};