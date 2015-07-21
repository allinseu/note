<<<<<<< HEAD
(function(window,document){

	/* for convient ,uses gloabl variable here */
	var notebooks = [];
	var catalogue = [];
	var notebook  = {}
	var essay     = {};
	var selectedNotebook = null,
		selectedEssay = null;

	/* Handles all the logic here */
	$(document).ready(function(){
		// NotebookModel.loadAll(callback)


	})

})(this,this.document);
=======
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
>>>>>>> 3fa98e49615cd5e3e7bee0091338bd63d1e1d3b6
