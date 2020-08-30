function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}          

$(document).ready(function () 
{
	var mobile = getUrlParameter('mobile');

	if(mobile) {
		$('a').each(function() {
			var href = this.href;
			if (href.indexOf('?') != -1) {
				href = href + '&mobile=true';
			}
			else {
				href = href + '?mobile=true';
			}
			$(this).attr('href', href);
		});
	}
	
	$.post('/save/stats'); 
	
	$('input[class^="submit_reaction"]').click(function()
	{	
		id = $(this).attr('class');
		id = id.replace('submit_reaction_', '');
		reaction_box = $(this).parent().parent().parent().parent().parent().find('.reaction_box');
		name_input = $(this).parent().parent().parent().find('input[name="name"]');
		message_input = $(this).parent().parent().parent().find('textarea[name="message"]');
		name = name_input.val();
		message1 = message_input.val();

		if(name == '' || message1 == '')
		{
			alert('Vul je naam en een bericht in');
		} else 
		{	
			var load_wrap = $(this).parent();
	    	$(this).hide();
	        load_wrap.prepend('<img src="/media/images/editor/ajax-loader.gif" />');
	        
            $.post('/save/guestbook_post', {
                id_block: id,
                name: name,
                message : message1,
                page_name : page_name
            }, function (msg) 
            {	
            	var obj = jQuery.parseJSON(msg);
            	if(obj.type == "success") 
            	{
					reaction_box.prepend('<div class="reaction" id="reaction_post_new"><dt style="line-height:20px"><b>'+obj.name+'</b> ('+obj.time+') </dt><div style="margin:3px 0 10px 40px;">'+obj.message+'</div></div>');
					if($('.nomessages').is(':visible'))
			        {
				        $('.nomessages').hide();
				    }
					$(window).scrollTop($('.reaction_' + id).offset().top);
					name_input.val('');
					message_input.val('');
					load_wrap.find('img').hide();
			 		load_wrap.find('input').show();
				} else if(obj.type == "error")
            	{
            		alert(obj.message);
            		name_input.val('');
					message_input.val('');
					load_wrap.find('img').hide();
			 		load_wrap.find('input').show();
            	}
				else 
				 {
				 	alert('Fout opgetreden, herlaad de pagina');
				 }
            });
		}
		
		return false;
	});
	
	$('input[class="submit_poll"]').click(function()
	{	
		id = $(this).parent().parent().parent().attr('id');
		id = id.replace('poll_', '');
		id_block = $(this).parent().parent().parent().attr('data-id-block');
		id_block = id_block.replace('id_block_', '');

		if($(this).parent().parent().find('input[name="vote"]:checked').val() != undefined)
		{
			var load_wrap = $(this).parent();
	    	$(this).hide();
	        load_wrap.prepend('<img src="/media/images/editor/ajax-loader.gif" />');
	
	        $.ajax({
				type: "POST", 
				url : '/save/poll_vote', 
	            data: $('form#poll_'+id).serialize() + '&id_poll=' + id + '&id_block=' + id_block, 
	            success: function (msg) 
	            {    
	        		var obj = jQuery.parseJSON(msg);
	        		
	            	if(obj.type == "success") 
	            	{
		            	$('form#poll_'+id).replaceWith(obj.message);
	            	} 
	            	else if(obj.type == "error")
	            	{
	            		alert(obj.message);
	            	}
	            	else 
	            	{
	            		alert('Fout opgetreden, herlaad de pagina');
	            	}
	            }
	       });
	    }
	    else
	    {
		    alert('Kies een optie waarop je wilt stemmen');
	    }
       		
		return false;
	});
		
	$('input[class="submit_form"]').click(function()
	{	
		id = $(this).parent().parent().parent().attr('id');
		id = id.replace('form_', '');

		var load_wrap = $(this).parent();
    	$(this).hide();
        load_wrap.prepend('<img src="/media/images/editor/ajax-loader.gif" />');
        
        $.ajax({
			type: "POST", 
			url : '/save/form_post', 
            data: $('form#form_'+id).serialize() + '&id_form='+id + '&pagename='+page_name, 
            success: function (msg) 
            {    	
        		var obj = jQuery.parseJSON(msg);
        		
            	if(obj.type == "success") 
            	{
	            	$('form#form_'+id).find('.form_elements').html(obj.confirm);
	            	$(window).scrollTop($('form#form_'+id).offset().top);
            	} 
            	else if(obj.type == "error")
            	{
            		alert(obj.message);
            		load_wrap.find('img').hide();
			 		load_wrap.find('input').show();
            	}
            	else 
            	{
            		alert('Fout opgetreden, herlaad de pagina');
            	}
            }
       });
       		
		return false;
	});
    
    $('.reaction_load_messages').click(function()
    {
     	var id = $(this).attr('id');
        id = id.replace('reaction_load_messages_', '');
    	var load_wrap = $(this).parent();
    	$(this).hide();
        load_wrap.prepend('<img src="/media/images/editor/ajax-loader.gif" />');
        
        var start = load_wrap.parent().find('.reaction_box div.reaction').length;

        $.post('/save/guestbook_load', {
            reaction_id: id,
            start: start 
        }, function (msg) {
			 var obj = jQuery.parseJSON(msg);

			 if(obj.type == "success") 
			 {
			 	for (var i=0; i<obj.messages.length; i++)
			 	{
			 		$(load_wrap.parent().find('.reaction_box ')).append('<div class="reaction" id="reaction_post_'+obj.messages[i].id+'"><dt style="line-height:20px"><b>'+obj.messages[i].name+'</b> ('+obj.messages[i].time+') </dt><div style="margin:3px 0 10px 40px;">'+obj.messages[i].message+'</div></div>');
			 	}
			 	if(obj.num_rows > obj.messages.length + start)
			 	{
			 		load_wrap.find('img').hide();
			 		load_wrap.find('input').show();
			 	} else
			 	{
			 		load_wrap.hide();
			 	}
			 } else 
			 {
			 	alert('Fout opgetreden, herlaad de pagina');
			 }
        });	            
    });
});