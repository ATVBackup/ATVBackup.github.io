/**
 * @author: Benjamin Sterling
 * @version: 1.0
 * @copyright (c) 2007 Benjamin Sterling, KenzoMedia
*/
(function($){
	$.fn.jqGalViewII = function(options){
		return this.each(function(i){
			var el = this;
			el.jqthis = $(this);
			el.jqchildren = el.jqthis.find('img');
			el.opts = $.extend({}, jqGalViewII.defaults, options);
			el.index = i;
			el.totalChildren = el.jqchildren.size();
			el.jqjqviewii = jqGalViewII.swapOut(el);
			
			el.container = $('<div class="gvIIContainer">').appendTo(el.jqjqviewii);

			el.mainImgContainer = $('<div class="gvIIImgContainer">').appendTo(el.container);
			el.image = $('<img style="display:none;"/>').appendTo(el.mainImgContainer);
			el.loader = $('<div class="gvIILoader"/>').appendTo(el.mainImgContainer);
			el.altTextBox = $('<div class="gvIIAltText"/>').appendTo(el.mainImgContainer);
			el.holder = $('<div class="gvIIHolder"/>').appendTo(el.container);
			
			
			el.jqthis.after(el.jqjqviewii).remove();
			

			el.imgCw = el.mainImgContainer.width();
			el.imgCh = el.mainImgContainer.height();

			el.jqchildren.each(function(j){
				var jqimage = $(this);
				var tmpimage = this;
				
				tmpimage.index = j;

				var jqdiv = $('<div id="gvIIID'+j+'" class="gvIIItem">')
				.appendTo(el.holder)
				.append('<div class="gvIILoaderMini">');// end : $div
				
				if(el.opts.getUrlBy == 0){
					tmpimage.altImg = jqimage.parent().attr('href');
				}
				else if(el.opts.getUrlBy == 1){
					tmpimage.altImg = el.opts.fullSizePath + tmpimage.src.split('/').pop();
				}
				else if(el.opts.getUrlBy == 2){
					tmpimage.altImg = tmpimage.src.replace(el.opts.prefix,'');
				};
				
				
				this.altTxt = jqimage.attr('alt');                
				
				var image = new Image();
				image.onload = function(){
					image.onload = null;
					jqdiv.empty().append(jqimage);
					
					//dem = jqGalViewII.resize({"w":55,"h":55},{"w":image.width,"h":image.height});
					var margins = jqGalViewII.center({"w":55,"h":55},{"w":jqdiv.find('img').width(),"h":jqdiv.find('img').height()});

					jqimage.css({marginLeft:margins.l,marginTop:margins.t});
					var largeImage = new Image();
					largeImage.onload = function(){
						largeImage.onload = null;

						$('<div class="gvIIFlash">').appendTo(jqdiv).css({opacity:".01"})
						.mouseover(
							function(){
								var $f = $(this);
								$f.css({opacity:".75"}).stop().animate({opacity:".01"},500);
							}
						)
						.click(function(){
								jqimage.trigger('click');
						});//.trigger('mouseover');

						jqimage.click(function(){							
							jqGalViewII.view(this,el);								   
						})
						.css({marginLeft:margins.l,marginTop:margins.t}); //width:dem.w,height:dem.h,
						
						jqimage.attr('data-width', image.width).attr('data-height', image.height);
						
						if( tmpimage.index  == 0 ){
							img2 = el.container.find('.gvIIHolder div:first-child img');
							jqGalViewII.view(img2,el);
						};
						
						//$('.block, #photolibraryalbum').mouseout();
					};  // end : largeImage.onload 
					largeImage.src = tmpimage.altImg;
				};// end : image.onload 
				image.src = tmpimage.src;
			});
		});
	};

	jqGalViewII = {
		//pDem parent deminsions
		//iDem img deminsions
		resize : function(pDem,iDem){
			if (iDem.w > pDem.w) {
				iDem.h = iDem.h * (pDem.w / iDem.w); 
				iDem.w = pDem.w; 
				if (iDem.h > pDem.w) { 
					iDem.w = iDem.w * (pDem.h / iDem.h); 
					iDem.h = pDem.h; 
				};
			} else if (iDem.h > pDem.h) { 
				iDem.w = iDem.w * (pDem.h / iDem.h); 
				iDem.h = pDem.h; 
				if (iDem.w > pDem.w) { 
					iDem.h = iDem.h * (pDem.w /iDem.w); 
					iDem.w = pDem.w;
				};
			};
			
			return iDem;
		},
		center : function(pDem,iDem){
			return { "l":(pDem.w-iDem.w)*.5, "t": (pDem.h-iDem.h)*.5 };
		},
		swapOut : function(el){
			return $('<div id="jqgvii'+el.index+'">');
		},
		view : function(img, el, first)
		{
			//if(!jqGalViewII.defaults.loading){
			
			//jqGalViewII.defaults.loading = true;
			if(typeof img.altImg == 'undefined')
			{
				var url = $(img).attr('src');
				
				if(url == '' || url == 'undefined') return false;
			}
			else
			{
				var url = img.altImg;
			}
			//var url = img.altImg;
			if(/picasa/.test(url)){
				url = /\?/.test(img.altImg) ? '&imgmax=800' : '?imgmax=800';
			};
			
			el.loader.show();		
			
			//image = new Image();
			//image.onload = function(){
			//	image.onload = null;

			//$(img).load($(img).attr( "src"), function(data) {
				//$(img).css('max-height', 'initial');
				//$(img).css('min-width', 'initial');
				//$(img).css('min-height', 'initial');
				
				//alert($(img).css('width'));
				dem = {};
				dem.w = $wOrg = $(img).attr('data-width').replace('px', '');
				dem.h = $hOrg = $(img).attr('data-height').replace('px', '');
				//$(img).css('max-height', '55px');
				//$(img).css('min-width', '55px');
				//$(img).css('min-height', '55px');
				dem = jqGalViewII.resize({"w":el.imgCw,"h":el.imgCh},{"w":dem.w,"h":dem.h});
				var margins = jqGalViewII.center({"w":el.imgCw,"h":el.imgCh},{"w":dem.w,"h":dem.h});
	
				
				el.loader.fadeOut('fast');
				el.altTextBox.fadeTo('fast', 0.1);
				//console.log($(img));
				el.image.fadeOut('fast',function(){
				    el.image.css({width:dem.w,height:dem.h, marginLeft:margins.l,marginTop:margins.t});
					el.image.attr('src',url).fadeIn();
					if(typeof $(img).attr('alt') != 'undefined'){
						el.altTextBox.fadeTo("fast",el.opts.titleOpacity).text($(img).attr('alt'));
					};
                    if($(img).attr('alt') == ""){
                    $(".gvIIAltText").hide();
                }
				});
			//});
			//	jqGalViewII.defaults.loading = false;
				/*
				el.image.click(function(){
					var src = img.altImg;

					// thickbox execution code
					
				});
				*/
			//};
			//image.src = url;
			//}
			//else
			//{
			//	setTimeout(function(){
			//		jqGalViewII.view(img, el, first);
			//	}, 1000)
			//}
		},
		defaults : {
			getUrlBy : 0, // 0 == from parent A tag | 1 == the full size resides in another folder
			fullSizePath : null,
			prefix: 'thumbnail.',
			titleOpacity : .60
		}
	};
})(jQuery);
