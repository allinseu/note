(function(){
	var NotebookView = {};

	/* Rends the notebook area, show the notebooks , requires the $notebook node
	 * and  notebookData object
	 */
	NotebookView.render = function($notebook, notebookData){
		// TODO

		if($.isArray(notebookData)){
			// 如果是数组，则渲染所有元素
			console.log('rend Notebook: ', notebookData)
			var content = {
				notebooks: notebookData
			};
			var notebookTemplate = Handlebars.compile($notebook.html());
			if(notebookData){
				$notebook.html(notebookTemplate(content));
			}else{
				$notebook.html(notebookTemplate([]));
			}
		}else{
			// 不是数组，则在结尾添加一个节点
			var newLi = '<li class="notebook"><a href="/notebook/#{{id}}">{{title}}({{numberOfNote}})</a></li>';
			notebookTemplate = Handlebars.compile(newLi);
			if(notebookData.id){
				newLi = notebookTemplate(notebookData);
				$notebook.append(newLi);
			}

		}
	};


	/* Rends the sidebar area, show the catalogue of one notebook. Requires the 
	 * object representing the catalogue of selected notebook. If this object is 
	 * null, suggets to create essay
	 */
	var CatalogueView = {};
	CatalogueView.render = function($catalogue, catalogueData){
	  // TODO
	};


	/* Renders an essay into the given $eessay element. Requires the object
	 * representing the active essay (activeEssayData). If this object is null,
	 * picks the first existing essay. If no entry exists, this view will display
	 * the CreatingEssayView. */
	var EssayView ={};
	EssayView.render = function($essay, activeEssayData){
		// TODO
	}

	/* Renders a view to allow the user to create an essay. Requires the $essay
   * element. */
	var CreatingEssayView ={};
	CreatingEssayView.render = function($essay){
		// TODO
	}

	/* Renders a view to allow the user to edit an entry. Requires the $entry
     * element and an object representing the active entry. */
    var EditingEssayView ={};
    EditingEssayView.render = function($entry, activeEssayData) {
      // TODO
    };

	window.NotebookView  = NotebookView;
	window.CatalogueView = CatalogueView;
	window.EssayView     = EssayView;
	window.CreatingEssayView = CreatingEssayView;


})(this, this.document);