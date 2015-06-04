/*
 * e-Detailing template
 * https://github.com/4-life/e-Detailing
 *
 * Copyright (c) 2015 
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
     
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    autoshot: {
      default_options: {
        options: {
          path: './test/src',
		  zoomFactor: .2,
          viewport: [
            '200x150'
          ],
		  delay: false,
          remote: {
            files: [
			
            ]
          }
        },
      },
    },
	
    ctl: {
      default_options: {
        options: {
		  user: " ",
		  password: " ", 
		  local: {
            pathFrom : './test/src/',
			pathTo   : "./test/#result/ctlfile/"
          }
        },
      },
    },
	
    ftp: {
      default_options: {
        options: {	  
			host : " ",
			port : 21, 
			user : " ", 
			pass : " ",
			dir  : "./test/#result/"
        },
      },
    },
	
	zip: {
      default_options: {
        files: [{
          filter: 'isDirectory',
          expand: true,
          cwd: './test/src',
          src: ['*'],
          dest: './test/#result'
        }]
      }
    },

    copy: {
	  main: {
        expand: true,
        cwd: 'test/src/common/',
        src: ['**'],
		dest: './test/src/',
	  },
    },
	
    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });
  
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'autoshot', 'zip', 'ftp', 'copy', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
