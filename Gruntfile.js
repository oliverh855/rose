module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: {
      directories: {
        packages: 'packages',
        stage: 'dist',
        build: 'build',
        kangoscript: 'dist/src/common'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy HH:MM") %> */\n'
      },
      dist: {
        files: {
          'build/<%= pkg.name %>.content.min.js': ['build/<%= pkg.name %>.content.js'],
          'build/<%= pkg.name %>.background.min.js': ['build/<%= pkg.name %>.background.js']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      options: {
        globals: {
          console: true,
          module: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.directories.build %>',
          dest: '<%= config.directories.kangoscript %>/scripts',
          src: [
            'rose.content.min.js',
            'rose.background.min.js'
          ]
        }]
      }
    },
    browserify: {
      dist: {
        options: {
          require: [
            './bower_components/jquery/dist/jquery.min.js',
            './dependencies/jquery.patterns.shim.js',
            './bower_components/underscore/underscore.js',
            './bower_components/jsrsasign/jsrsasign-4.7.0-all-min.js'
          ],
          alias: [
            './bower_components/jquery/dist/jquery.min.js:jquery',
            './dependencies/jquery.patterns.shim.js:jquery-patterns',
            './bower_components/underscore/underscore.js:underscore',
            './bower_components/jsrsasign/jsrsasign-4.7.0-all-min.js:jsrsasign'
          ],
          shit: {}
        },
        files: {
          'build/<%= pkg.name %>.content.js': ['src/components/**/*.js', '!src/components/background/*.js', 'src/app-content.js'],
          'build/<%= pkg.name %>.background.js': ['src/components/**/*.js', '!src/components/content/*.js', 'src/app-background.js']
        }
      }
    },
    shell: {
      kango: {
        command: 'kango.py build --output-directory <%= config.directories.packages %> <%= config.directories.stage %>'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('default', ['jshint', 'browserify', 'uglify', 'copy', 'shell']);
};