'use strict';
  
module.exports = function(grunt) {
  var async = require('async');
  var chalk = require('chalk');
  var rename = require('grunt-contrib-rename');
  var fs = require('fs');
  
  process.setMaxListeners(0);
  grunt.registerMultiTask('rename', 'rename', function() {
    var done = this.async();
	var self = this;
	
    var options = self.options({
	
    });
	
    fs.readdir(options.path, function(err, list) {
        if(err) throw err;
        var contents = "";

        for(var l in list){
            self.files.push( {src: [options.path+list[l]+'/'+list[l]+'.html'], dest: options.path+list[l]+'/'+(list[l].replace('old string','new string'))+'.html'} );			
            contents += list[l] + "\r\n";
        }

        grunt.file.write(options.path + 'content.txt', contents, {encoding:"utf8"});

        self.files.forEach(function(filePair) {
            console.log(filePair);
            filePair.src.forEach(function(src) {
                if (!grunt.file.exists(String(filePair.src))) {
                    grunt.log.writeln('Cannot rename non-existent file.');
                } else {
                    if (fs.statSync(String(filePair.src)).isDirectory()) {
                        grunt.log.writeln('Renaming Directory ' + filePair.src + ' -> ' + filePair.dest);
                    } else {
                        grunt.log.writeln('Renaming File ' + filePair.src + ' -> ' + filePair.dest);
                    }

                    fs.renameSync(String(filePair.src), String(filePair.dest), function (err) {
                        if (err) {
                            grunt.log.error();
                            grunt.verbose.error();
                            grunt.fail.warn('Rename operation failed.');
                        }
                    });
                }
            });
        });
    });      
  });
};
