/*global module:false*/

module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-bower-version');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      source: 'jquery.stickytableheaders.js',
      sourceMin: 'jquery.stickytableheaders.min.js'
    },

    bower_version: {
      update: []
    },

    uglify: {
      options: {
        banner:
          '/*!\n' +
          ' * StickyTableHeaders <%= pkg.version %> (<%= grunt.template.today("yyyy-mm-dd HH:MM") %>)\n' +
          ' * MIT licensed\n' +
          ' * Copyright (C) Jonas Mosbech - https://github.com/jmosbech/StickyTableHeaders\n' +
          ' */'
      },
      standard: {
        files: {
          'js/<%= meta.sourceMin %>': ['js/<%= meta.source %>']
        }
      }
    },

    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: false,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      js: ['js/<%= meta.source %>']
    }
  });

  // Loaded tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jshint','uglify', 'bower_version']);
};
