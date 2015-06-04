/*
 * grunt-autoshot
 * https://github.com//grunt-autoshot
 *
 * Copyright (c) 2013 Ferrari Lee
 * Licensed under the MIT license.
 */

'use strict';

  
module.exports = function(grunt) {
  var async = require('async');
  var chalk = require('chalk');
  var fs = require('fs');
  var obj = [];
  
  process.setMaxListeners(0);
  grunt.registerMultiTask('ctl', 'Create a ctl file.', function() {
    var done = this.async();
	var self = this;
	
    var options = self.options({
      user: "user",
	  password: "password", 
      local: {
        pathFrom : './test/src/',
		pathTo   : "./test/#result/ctlfile/"
      }
    });

  fs.readdir(options.local.pathFrom, function(err, list) {
	err ? console.log(err) : true;
	for(var l in list){
		obj.push( {src: list[l]+"", dest: list[l]+".ctl"} );
	}
	  
      async.eachSeries(obj, function(file, outerCb) {
		
		var contents = "USER="+options.user+"\r\n";
			contents += "PASSWORD="+options.password+"\r\n";
			contents += "FILENAME="+file.src+".zip\r\n";
			contents += "Name="+file.src+"\r\n";
			contents += "Active_vod__c=true";
			
		grunt.file.write(options.local.pathTo + file.dest, contents, {encoding:"utf8"});
		console.log("done write "+chalk.green(file.src)+" : "+chalk.cyan(file.dest));
        outerCb();
      }, function() {
        grunt.event.emit('finish');
		console.log(chalk.yellow("all done"));
      });

    // Listen event to decide when can stop the task 
    grunt.event.on('finish', function(eventType) {
        done();
    });
	
	
  });
	
	
  });
};
