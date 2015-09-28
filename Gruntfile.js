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
		  string: 'string',
		  zoomFactor: 1, // .2  1  2
          viewport: [
			'1024x768' //  200x150  1024x768  2048x1536
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
		  file : ".ftp.json",
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
			file : ".ftp.json",
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
	clean: {
		build: ["test/#result"],
		release: ["test/src/**/*"]
	}
  });
  
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('default', ['zip', 'ctl', 'ftp', 'clean:build', 'clean:release']);
};
