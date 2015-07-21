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

		$('.editor-area').on('paste',function(){    
		    var $this=$(this);
		    setTimeout(function(){
		      $this.html($this.text());
	    	},3);
  		})
	})
})(this,this.document);
