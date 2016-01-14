'use strict';

var JSFtp = require("jsftp");
var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
  
module.exports = function(grunt) {

  grunt.registerMultiTask('ftp', 'Sending ftp file.', function() {
	
	var done = this.async();
	var self = this;
	
    var options = self.options({
		
    });
	
	if(options.file && options.file!=''){	
		var file_options = JSON.parse(fs.readFileSync('./'+options.file, 'utf8'));
		for (var property in file_options){
			options[property] = file_options[property];
		}
	}
	
	var Ftp = new JSFtp({
		host: options.host,
		port: options.port, 
		user: options.user, 
		pass: options.pass
	});	
	
    // Listen event to decide when can stop the task 
    grunt.event.on('finish', function(eventType) {
        done();
    });
	
	var dir = options.dir, i = 0, files;	
	
	function readDir(dir, callback){
		fs.readdir(dir, function(err, allFiles) {
			files = allFiles;
			callback(files);
		});		
	}
	
	function sendFile(src, file, callback){
		
		grunt.log.writeln(file+" sending...");
		
		Ftp.put(src, file, function(hadError) {
			if (!hadError){
				grunt.log.writeln(chalk.bgMagenta(file+" file transferred successfully!"));
				i++;
				callback(files);			
			}else{
				grunt.log.writeln(chalk.red(hadError));
				sendFile(src, file, callback);
				return false;				
			}
		});
	}	
	
	function start(){
		readDir(dir, startSending);
	}
	
	function startSending(files){
		if(files.length == i){
			grunt.log.writeln(chalk.bgGreen("zip files transferred successfully!"));
			grunt.log.writeln(chalk.bgGreen("sending ctl files..."));
			sendCtlFiles();
			return false;
		}
		
		if(path.extname(files[i])==".zip"){
			var src = path.resolve(dir, files[i]);
			sendFile(src, '/'+files[i], startSending);
		}else{
			i++;
			startSending(files);
		}
	}
	
	function sendCtlFiles(){
		dir += "ctlfile/";
		i = 0;
		readDir(dir, startSendingCtl);
	}
	
	function startSendingCtl(files){
					
		if(files.length == i){
			grunt.log.writeln(chalk.bgGreen("ctl transferred successfully!"));
			grunt.event.emit('finish');
			return false;
		}
		
		if(path.extname(files[i])==".ctl"){
			var src = path.resolve(dir, files[i]);
			sendFile(src, '/ctlfile/'+files[i], startSendingCtl);
		}else{
			i++;
			startSendingCtl(files);
		}	
	}
	
	start();
	
 });
};
