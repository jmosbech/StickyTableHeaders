/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.0',
      source: 'jquery.stickytableheaders.js',
      sourceMin: 'jquery.stickytableheaders.min.js'
    },

    uglify: {
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
          jQuery: true,
          Backbone: true,
          _: true,
          Marionette: true,
          $: true,
          slice: true
        }
      },
      js: ['js/<%= meta.source %>']
    }
  });

  // Laoded tasks
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task.
  grunt.registerTask('default', ['jshint','uglify']);
};
