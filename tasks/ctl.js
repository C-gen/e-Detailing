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
	   dataList: [
            // ВСТАВЛЯЕМ СЮДА ОБЪЕКТ С DESCRIPTION
       ]
    });
	
	if(options.file && options.file!=''){	
		var file_options = JSON.parse(fs.readFileSync('./'+options.file, 'utf8'));
		for (var property in file_options){
			options[property] = file_options[property];
		}
	}

	fs.readdir(options.local.pathFrom, function(err, list) {
	  err ? console.log(err) : true;
	  for(var l in list){
		obj.push( {src: list[l]+"", dest: list[l]+".ctl"} );
	  }
	  
	  async.eachSeries(obj, function(file, outerCb) {
		var contents = "USER="+options.user+"\r\n";
			contents += "PASSWORD="+options.pass+"\r\n";
			contents += "FILENAME="+file.src+".zip\r\n";
			contents += "Name="+file.src+"\r\n";
			if(typeof(options.dataList[0])=='object' && options.dataList[0][file.src]){
                contents += "Description_vod__c="+options.dataList[0][file.src]+"\r\n";
            }
			contents += "Active_vod__c=true";
			
		grunt.file.write(options.local.pathTo + file.dest, contents, {encoding:"utf8"});
		console.log("done write "+chalk.green(file.src)+" : "+chalk.cyan(file.dest));
		outerCb();
	  }, function() {
		grunt.log.ok('Ctl generate complete!');
		done();
	  });	
	});	
  });
};
