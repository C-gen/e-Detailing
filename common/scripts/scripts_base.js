/*! 
	SCRIPTS_BASE v0.9
	nestline digital (c) 2015
*/

"use strict";

var main_obj = {
		opt: {
			// КАРТА ПРЕЗЕНТАЦИИ
			map : {
				"Presentation01_Brand_RU":{
					"p_pres":"",
					"p_slide":"",
					"slides":["Title_Brand_RU","Popup_Brand_RU","Video_Brand_RU"] 
				},
				"Presentation02_Brand_RU":{
					"p_pres":"Presentation01_Brand_RU",
					"p_slide":"Popup_Brand_RU",
					"slides":["ExampleAnim_Brand_RU"] 
				}
			}, 		
			// СОЗДАНИЕ ПУНКТОВ ОСНОВНОГО МЕНЮ
			create_menu : true, // создавать или нет
			nav_buttons : [
				{el_class : 'btn_home', show : true, except : [] },
				{el_class : 'btn_complianse', show : false, except : [] },
				{el_class : 'btn_psp', show : false, except : [] },
				{el_class : 'btn_research', show : false, except : [] },
				{el_class : 'btn_library', show : true, except : [] },
				{el_class : 'btn_media', show : true, except : [] },
				{el_class : 'btn_answers', show : false, except : [] },
				{el_class : 'btn_internal', show : true, except : [] }
			],	
			// ПРИВЯЗКА ССЫЛОК К КЛАССАМ. obj - классы, к которым цепляются переходы ////////////////////////	
			links : [
				{obj : 'btn_home', slide : 'Title_Brand_RU', present : 'Presentation01_Brand_RU'},
				{obj : 'btn_library', slide : 'Popup_Brand_RU', present : 'Presentation01_Brand_RU'},
				{obj : 'btn_media', slide : 'Video_Brand_RU', present : 'Presentation01_Brand_RU'},
				{obj : 'btn_internal', slide : 'ExampleAnim_Brand_RU', present : 'Presentation02_Brand_RU'}
			],		
			show_bc : true, // показывать крошки или нет	
			goto_back_btn : ".goto_back", // элемент на котором срабатывает функция возврата на предыдущую страницу
			single_link : ".single_link", // элемент к которому привязываются переходы по презентации. Необходим для ссылки, которая находится только на одном слайде. Ссылка должна выглядеть так: <a href="#ссылочка" class="single_link" data-slide="slide1:presentation1">ссылка</a>  ЭТУ ВОЗМОЖНОСТЬ ИСПОЛЬЗОВАТЬ НЕЖЕЛАТЕЛЬНО!!!!!!!!!!!!!!
						
			//далее идут служебные переменные
			current_presentation : false, 
			current_slide : false,
			isSlideDataReady : function(){return main_obj.opt.current_presentation != '' && main_obj.opt.current_slide != '';},
			slidePresentationH : "", 
			slidePresentationV : "", 
			slidePresentationV2 : "", 
			slideLeft : "", 
			slideRight : "", 
			slideUp : "", 
			slideDown : "", 
			bc : "", 
			prev_s : "", 
			prev_p : "",
			pres : "",
			slide : "",
			is_app : false
		},
		set_events: function(){
			var self = this;
			
			// ПИШЕМ ВСЕ ЕВЕНТЫ ТУТ /////////////////		
			
			
			
			// swipe  
			var gestures = ['swipeLeft', 'swipeRight', 'swipeUp','swipeDown'];
			gestures.forEach(function (type) {
				$$('body').on(type, function (e) {
					switch (type) {
						case 'swipeLeft':
							if(!self.opt.isSlideDataReady())return;
							if(self.opt.slideRight!=''){					
								self.func_goto_slide(false,self.opt.slideRight,self.opt.slidePresentationH);
							}break;
						case 'swipeRight':
							if(!self.opt.isSlideDataReady())return;
							if(self.opt.slideLeft!=''){
								self.func_goto_slide(false,self.opt.slideLeft,self.opt.slidePresentationH);
							}break;
						case 'swipeUp':
							if(!self.opt.isSlideDataReady())return;
							if(self.opt.slideDown!=''){	
								self.func_goto_slide(false,self.opt.slideDown,self.opt.slidePresentationV);
							}break;
						case 'swipeDown':
							if(!self.opt.isSlideDataReady())return;
							if(self.opt.slideUp!=''){
								self.func_goto_slide(false,self.opt.slideUp,self.opt.slidePresentationV2);
							}break;
					}
				});
            });
			
				
			// POPUP ///////////////////////////////////////		
			$$(".popup_btn").on("touch",function( e ) {
				e.stopPropagation();
				$$(this).parent().find(".popup").addClass("active");
			}); 
			
			$$(".popup_close").on("touch",function( e ) {
				$$(this).parent().parent().removeClass("active");
			}); 
	
			// VIDEO ///////////////////////////////////////	
			$$('.play').on("touch",function( e ) {
				e.stopPropagation();
				$$(".video").fadeIn(300);
				$$("video").load();
				$$("video")[0].play();
				$$("video").show();
			});
			
			$$('.video_close').on("touch",function( e ) {
				e.stopPropagation();	
				$$(".video").fadeOut(300);
				$$("video").hide();
				$$("video")[0].pause();
			});	
			
			$$("video").on("touch",function( e ) {
				e.stopPropagation();
			});	
			
			// события для кастомного меню //////
			
			$$(".open_menu").on("touch",function( e ) {
				e.stopPropagation();
				$$("section").addClass("nav_open");
			});				
			$$(".open_menu_overlay").on("touch",function( e ) {
				e.stopPropagation();
				$$("section").removeClass("nav_open");
			});
								
			for(var a in self.opt.links){
				self.func_goto_slide('.' + self.opt.links[a]['obj'], self.opt.links[a]['slide'], self.opt.links[a]['present']);
			}					
			
			$$(self.opt.single_link).each(function(a) {
				var slide_present = $$(this).attr("data-slide").split(':');
				self.func_goto_slide($$(this)[0], slide_present[0], slide_present[1]);
			});
			
			// OTHER ///////////////////////
			$$(document).on('touchmove', function(e){
				e.preventDefault();
			});		
			
			$$(self.opt.goto_back_btn).on("touch",function( e ) {
				self.go_back();
			});	
		},
		start: function() {		
			// определение приложение это или веб-страница /////////////////			
			var self = this, address = document.location.href;	
			
			if(address.indexOf('/mobile/') == -1){						
				self.opt.current_presentation = address.split("?")[1];
				
				if(!self.opt.current_presentation || self.opt.current_presentation == "undefined"){
					self.opt.current_presentation = $$("title").text();
				}	
				self.opt.current_slide = address.slice(address.lastIndexOf("/") + 1, address.lastIndexOf(".html"));
				
				$$("section").attr("id",self.opt.current_slide);
				
				self.setSwipesData();
				self.opt.show_bc ? self.generate_bc() : true;
				self.opt.create_menu ? self.set_main_menu() : true;
				self.set_events();
			}else{				
				self.opt.is_app = true;
				
				com.veeva.clm.getDataForCurrentObject('Presentation', 'Presentation_Id_vod__c', function(result){
					self.opt.current_presentation = result.Presentation.Presentation_Id_vod__c;
					com.veeva.clm.getDataForCurrentObject('KeyMessage', 'Media_File_Name_vod__c', function(result){
						self.opt.current_slide = result.KeyMessage.Media_File_Name_vod__c.split(".")[0];
					
						self.setSwipesData();
						self.opt.show_bc ? self.generate_bc() : true;
						self.opt.create_menu ? self.set_main_menu() : true;
						self.set_events();
					});
				});			
			}
			
			
		},
		generate_bc: function(){
			// генерация bredcrumbs /////////////////
			var self = this;	
			self.opt.pres = localStorage.getItem("pres");
			self.opt.slide = localStorage.getItem("slide");
		
			if(self.opt.pres){		
				self.opt.pres = self.opt.pres.split(',');
				self.opt.slide = self.opt.slide.split(',');
				self.opt.prev_p = self.opt.pres[self.opt.pres.length-1];
				self.opt.prev_s = self.opt.slide[self.opt.slide.length-1];
				self.opt.pres.push(self.opt.current_presentation);
				self.opt.slide.push(self.opt.current_slide);	
			}else{
				self.opt.pres = new Array(self.opt.current_presentation);
				self.opt.slide = new Array(self.opt.current_slide);
			}
	
			self.opt.pres = self.opt.pres.join();
			self.opt.slide = self.opt.slide.join();
		
			localStorage.setItem("pres", self.opt.pres);
			localStorage.setItem("slide", self.opt.slide);
			
			if(!self.opt.isSlideDataReady())return;
		
			var presentation, columns = [], rows = [], s = '', s2 = '', flag = false;
	
			if(self.opt.map[self.opt.current_presentation].p_pres != ''){
				presentation = self.opt.map[self.opt.current_presentation].p_pres;
			}else{
				presentation = self.opt.current_presentation;
			}
			for(var k in self.opt.map[presentation].slides){
				if(self.opt.map[presentation].slides[k] == self.opt.current_slide){
					rows.push(1);
					flag = true;
				}else{
					rows.push(0);
				}
				for(var l in self.opt.map){
					if(self.opt.map[l].p_slide == self.opt.map[presentation].slides[k] && self.opt.map[l].p_pres == presentation){
						for(var i in self.opt.map[l].slides){
							if(self.opt.map[l].slides[i] == self.opt.current_slide && l == self.opt.current_presentation && !flag){
								rows.push(1);
								flag = true;
							}else{
								rows.push(0);
							}
						}
					}
				}
		
				columns.push(rows);
				rows = [];
			}		
			for(var i in columns){
				for(var j in columns[i]){
					s += '<div class="bc-item'+(columns[i][j]==1 ? ' active' : '')+'"></div>';
				}
				s2 += '<div class="bc-column">'+s+'</div>';
				s = '';
			}		
			self.opt.bc = '<div class="bc">'+s2+'</div>';
			$$('section').append(self.opt.bc);
		},
		setSwipesData: function(){
			var self = this;	
			
			if(!self.opt.isSlideDataReady())return;
	
			var k, flag = false, slides, slide;
			
			try{
				if(self.opt.map[self.opt.current_presentation].p_pres == ''){
					slides = self.opt.map[self.opt.current_presentation].slides;
					self.opt.slidePresentationH = self.opt.current_presentation;
					slide = self.opt.current_slide;
				}else{
					slides = self.opt.map[self.opt.map[self.opt.current_presentation].p_pres].slides;
					self.opt.slidePresentationH = self.opt.map[self.opt.current_presentation].p_pres;
					slide = self.opt.map[self.opt.current_presentation].p_slide;
				}
			}catch(e){
				alert("Ошибка! Не верное указание презентации для этого слайда в <title>");
				console.log(e);
				return false;
			}
	
			for(var k in slides){
				if(slides[k] == slide){
					self.opt.slideLeft = (parseInt(k) == 0) ? '' : slides[parseInt(k)-1];
					self.opt.slideRight = (parseInt(k) == (slides.length-1)) ? '' : slides[parseInt(k)+1];
					flag = true;
				}
				if(flag){
					flag = false;
					break;
				}
			}
	
			if(self.opt.map[self.opt.current_presentation].p_pres == ''){
				for(var k in self.opt.map){
					if(self.opt.map[k].p_slide == self.opt.current_slide){
						self.opt.slidePresentationV = k;
						self.opt.slideUp = '';
						self.opt.slideDown = self.opt.map[k].slides[0];
						flag = true;
					}
					if(flag){
						flag = false;
						break;
					}
				}
			}else{
				self.opt.slidePresentationV = self.opt.current_presentation;
				self.opt.slidePresentationV2 = self.opt.current_presentation;
				slides = self.opt.map[self.opt.current_presentation].slides;
				slide = self.opt.current_slide;
		
				for(var k in slides){
					if(slides[k] == slide){
						if(parseInt(k) == 0){
							self.opt.slidePresentationV2 = self.opt.map[self.opt.current_presentation].p_pres;
							self.opt.slideUp = self.opt.map[self.opt.current_presentation].p_slide;
						}else{
							self.opt.slideUp = slides[parseInt(k)-1];
						}
						self.opt.slideDown = (parseInt(k) == (slides.length-1)) ? '' : slides[parseInt(k)+1];
						flag = true;
					}
					if(flag){
						flag = false;
						break;
					}
				}
			}
		},
		set_main_menu: function(){ 
			var self = this, main_menu = "", except = false;
			for(var a in self.opt.nav_buttons){
				if(self.opt.nav_buttons[a]['show']){
					except = false;
					for(var k in self.opt.nav_buttons[a]['except']){
						self.opt.nav_buttons[a]['except'][k] == self.opt.current_slide ? except = true : true;
					}
					except ? main_menu += "<button class='"+self.opt.nav_buttons[a]['el_class']+" btn_disable'></button>" : main_menu += "<button class='"+self.opt.nav_buttons[a]['el_class']+"'></button>";
				}else{
					except = true;
					for(var k in self.opt.nav_buttons[a]['except']){
						self.opt.nav_buttons[a]['except'][k] == self.opt.current_slide ? except = false : true;
					}
					except ? main_menu += "<button class='"+self.opt.nav_buttons[a]['el_class']+" btn_disable'></button>" : main_menu += "<button class='"+self.opt.nav_buttons[a]['el_class']+"'></button>";					
				}
			}
			$$("nav").append(main_menu);
		},
		func_goto_slide: function(obj,slide,present){
			var self = this;
			if(obj){
				$$(obj).on("touch",function( e ) {
					self.opt.is_app ? com.veeva.clm.gotoSlide(slide+'.zip', present) : document.location.href = "../"+slide+"/"+slide+".html?"+present;						
				});	
			}else{
				self.opt.is_app ? com.veeva.clm.gotoSlide(slide+'.zip', present) : document.location.href = "../"+slide+"/"+slide+".html?"+present;
			}
		},
		go_back: function(){
			var self = this;	
			com.veeva.clm.gotoSlide(self.opt.prev_s, self.opt.prev_p);
		}
	};

	

(function() {
	main_obj.start();	
})();
	
		
	
	
	
	
	