/*
 * grunt-contrib-copy
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Chris Talkington, contributors
 * Licensed under the MIT license.
 * https://github.com/gruntjs/grunt-contrib-copy/blob/master/LICENSE-MIT
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');
  var async = require('async');
  var fs = require('fs');
  var chalk = require('chalk');
  var crypto = require('crypto');

  grunt.registerMultiTask('copy', 'Copy files.', function() {
	
	var done = this.async();
	var self = this;
	
    var options = this.options({
	
    });

		
    // Listen event to decide when can stop the task 
    grunt.event.on('finish', function(eventType) {
        done();
    });
	
	var dir = options.dir, i = 0, files;
	
    var isExpandedPair;
    var dirs = {};
    var tally = {
      dirs: 0,
      files: 0,
    };
	
	
	function readDir(dir, callback){
		fs.readdir(dir, function(err, files) {
			files.splice(files.indexOf("common"), 1);
			
			
			callback(files);
		});		
	}
		
	function start(){
		readDir(self.files[0].dest, startCopy);
	}
	
	function startCopy(files){	
			
		async.eachSeries(files, function(file, outerCb) {
		   
			var dest = self.files[0].dest+file;
				
		   deleteFolderRecursive(dest + "/common/");
			
		   self.files.forEach(function(filePair) {
				isExpandedPair = filePair.orig.expand || false;
				filePair.src.forEach(function(src) {
					src = unixifyPath(src);
					dest = unixifyPath(dest);
			
					if (detectDestType(dest) === 'directory') {
						dest = (isExpandedPair) ? dest : path.join(dest, src);
					}
				
					if (grunt.file.isDir(src)) {
						grunt.verbose.writeln('Creating ' + chalk.cyan(dest));
						grunt.file.mkdir(dest);
						options.mode = false;
						if (options.mode !== false) {
							fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
						}

						if (options.timestamp) {
							dirs[dest] = src;
						}

						tally.dirs++;
					} else {
						grunt.verbose.writeln('Copying ' + chalk.cyan(src) + ' -> ' + chalk.cyan(dest));
						
						console.log(src);
						console.log(dest);
						
						var path = src.replace("test/src/", "");
						
						grunt.file.copy(src, dest+"/"+path);
						syncTimestamp(src, dest);
						if (options.mode !== false) {
							fs.chmodSync(dest, (options.mode === true) ? fs.lstatSync(src).mode : options.mode);
						}
						tally.files++;
					}
				});
			});
			
			outerCb();
		}, function() {
			grunt.event.emit('finish');
			console.log(chalk.yellow("all done"));
		});
		
	}
	
	
	start();
	
 });
 
   var detectDestType = function(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  };

  var unixifyPath = function(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  };

  var syncTimestamp = function (src, dest) {
    var stat = fs.lstatSync(src);
    if (path.basename(src) !== path.basename(dest)) {
      return;
    }

    fs.utimesSync(dest, stat.atime, stat.mtime);
  };
 
  var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { 
                deleteFolderRecursive(curPath);
            } else { 
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};
 
 
};
