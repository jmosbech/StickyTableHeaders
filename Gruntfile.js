/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    meta: {
      version: '0.1.19',
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
  grunt.registerTask('default', ['jshint','uglify']);
};
