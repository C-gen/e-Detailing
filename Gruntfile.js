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
      rename: {
        main: {
            options:{
                path: './src/',                
            },
            files: []
          }
    },
    autoshot: {
      default_options: {
        options: {
          path: './src',
		  string: '',
		  zoomFactor: .2, // .2  1  2
          viewport: [
			'200x150' //  200x150  1024x768  2048x1536
          ],
		  delay: false,
          remote: {
            files: []
          }
        },
      },
    },      
    ctl: {
      default_options: {
        options: {
		  file : ".ftp.json",
		  local: {
            pathFrom : './src/',
			pathTo   : "./src/#result/ctlfile/"
          }
        },
      }
    },	
    ftp: {
      default_options: {
        options: {	  
			file : ".ftp.json",
			dir  : "./src/#result/"
        },
      },
    },	
	zip: {
      default_options: {
        files: [{
          filter: 'isDirectory',
          expand: true,
          cwd: './src',
          src: ['*'],
          dest: './src/#result'
        }]
      }
    },
	clean: {
		build: ["src/#result"],
		release: ["src/**/*"]
	}
  });
  
  grunt.loadTasks('tasks');
  //grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-contrib-clean');
  
  grunt.registerTask('default', ['zip', 'ctl', 'ftp', 'clean:build', 'clean:release']);
};
