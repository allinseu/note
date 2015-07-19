$(function () {
	$('.content').scroll(function(event) {
		/* Act on the event */
		var target = $(event.target);
		console.log(target.scrollTop());
		if(target.scrollTop() >= 136){
			console.log('ok')
			$('.content_close').addClass('content_close-out');
		}else{
			$('.content_close').removeClass('content_close-out');
		}
	});
})