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
  });
  
  grunt.loadTasks('tasks');

  grunt.registerTask('send', ['zip', 'ctl', 'ftp']);
  //grunt.registerTask('default', ['']);
};
