time = 0;
count = 0;
function menuMore(){
	time = time + 1;
	
	if($("div#menu > ul").children().eq(0).length != 0 && $("div#menu > ul").children().eq(1).length != 0)
	{
		if($("div#menu > ul").children().eq(0).position().top == $("div#menu > ul").children().eq(1).position().top)
		{
			$("div#menu > ul > li").each(function(index)
			{
				if(index == 0)
				{
					goodPosition = $(this).position().top;
				}
				//alert($(this).position().top);
				if($(this).position().top == goodPosition)
				{
					return; /* nothing wrong, same height as first menu element */
				}
				 
				$(this).hide();
				count = count + 1;
			});
		}
	}
	
	if(count > 0)
	{
		$("div#menu > ul > li:visible:last").hide();
		
		html = "<li><a href='#' class='more-menu'>Meer</a><ul class='submenuNext'>";
		
		$("div#menu > ul > li:hidden").each(function()
		{	
			/*html = html + "<li><a href='" + $(this).find("a").attr("href") + "'>" +  $(this).text() + "</a></li>"; ORIGINAL */
			html = html + '<li>' + $(this).html() + '</li>';	
		});
		
		html = html + "</ul>";
		
		$("div#menu > ul").append(html);
		
		if(time == 1)
		{
			$("div#menu > ul > li:visible").each(function(index)
			{
				if(index == 0)
				{
					goodPosition = $(this).position().top;
				}

				if($(this).position().top != goodPosition)
				{
					$('div#menu > ul > li > a.more-menu').parent().remove();
					menuMore();
					return false; /* nothing wrong, same height as first menu element */
				}
			});
		}
	}
}

function hoverMenu()
{
	$('div#menu ul > li li:has(ul) > a').append('<span class="moreUlSign">&raquo;</span>');
	
	$('div#menu li').hover(
	function()
	{
		var elm = $(this);
		var toOpen = $(this).find('ul').first();
		var hoverLi = toOpen.parent().parent();
		
		// || toOpen.length < 1
		if(toOpen.is(':hidden')) //only action if not opend or not exists (hover is called the amount of levels when leaving and entering again)
		{
			$(this).parent().find('ul').not(toOpen).hide();
		}

		clearTimeout($(this).data('timeInOut'));
		
		if(toOpen.hasClass('submenuNext') && hoverLi.hasClass('submenuNext')) //make sure this not the first menu
		{		
			var width = hoverLi.outerWidth();
			var offset = hoverLi.offset();
			var hoverOffset = toOpen.parent().offset();
			
			if(($(window).width() - (offset.left + width)) > 222){
				var left = 220;
			}
			else
			{
				var left = -220;
			}

			toOpen.css({
				top: 3,
				marginLeft:  left + "px"
			});
		}
		else
		{
			var width = elm.outerWidth();
			var offset = elm.offset();
			var hoverOffset = toOpen.parent().offset();

			if(($(window).width() - (offset.left + width)) > 222){
				var left = elm.css('margin-left');
			}
			else
			{
				var left = -220 + elm.width();
			}

			toOpen.css({
				marginLeft:  left + "px"
			});				
		}

		toOpen.fadeIn(200);
		
	},
	function()
	{
		var elm = this;
		
		$(this).data('timeInOut', setTimeout(function()
		{
			$(elm).find('ul').first().hide();
		}, 450))
		
	});
}