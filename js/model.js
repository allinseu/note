(function(window,document){

    /* Learn cloud Models
     *  从learncloud加载内容，并且支持对learn cloud上的内容进行编辑
     *  Notebook: 是笔记本对象，有两个属性 title和numberOfNote
     *
     */
    var Notebook = AV.Object.extend("Notebook");
    window.Notebook = Notebook;
    //var notebookObj = new Notebook();


	var NotebookModel = {};


	/* Loads all noteboolks from the localstorage.
     *
     *  Calls: callback(error, entries)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebooks -- an array of entries
     */
	NotebookModel.loadAll = function(callback){
		// TODO
        var NotebookCollection = AV.Collection.extend({
            model: Notebook
        });
        var notebookCollection = new NotebookCollection();

        var notebooks = [];
        notebookCollection.comparator = function(object){
            return object.createdAt.getTime();
        }
        notebookCollection.fetch({
            success: function(collection){
                collection.models.forEach(function(item){
                    var notebook  = {};
                    util.cloneNotebook(item, notebook);
                    notebooks.push(notebook);
                    console.log(item.createdAt);
                    console.log(notebook);
                });
                callback(false,notebooks);
            },
            error: function(collection,error){
                console.log(error);
                callback(error,null);
            }
        });


	}

	/* Adds the given notebook to the list of notebooks. The notebook must *not* have
  	 * an id associated with it.
     *
   	 *  Calls: callback(error, notebook)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebook -- the notebook added, with an id attribute
     */
	NotebookModel.add = function(notebook, callback){
		// TODO
        var notebookObj = new Notebook();
        notebookObj.save(notebook,
            {
                success: function(notebook){
                    var retNotebook = {};
                    util.cloneNotebook(notebook,retNotebook);
                    callback(null,retNotebook);
                },
                error: function(notebook,error){
                    var retNotebook = {};
                    console.log(error);
                    callback(error,notebook);
                }
            });

	}

	/* Updates the given entry. The entry must have an id attribute that
     * identifies it.
     *
     * Calls: callback(error)
     *  error -- the error that occurred or NULL if no error occurred
     */

    NotebookModel.update = function(notebook, callback){
    	// TODO
    }

    /* Deletes the entry with the given id.
     *
     * Calls: callback(error)
     *  error -- the error that occurred or NULL if no error occurred
     */
    NotebookModel.remove = function(id, callback){
    	// TODO
    }

    


    var EssayModel = {};

    /* Loads all catalogues of the notebook from the server.
     *
     *  Calls: callback(error, entries)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebooks -- an array of entries
     */
    EssayModel.loadAll = function(notebook, callback){
    	// TODO
    }

    /* Adds the given essay to the specific notebook. The catalogue must *not* have
  	 * an id associated with it.
     *
   	 *  Calls: callback(error, notebook)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebook -- the notebook added, with an id attribute
     */
    EssayModel.add = function(essay, callback){
    	// TODO
    }

    /* Updates the given entry. The entry must have an id attribute that
     * identifies it.
     *
     * Calls: callback(error)
     *  error -- the error that occurred or NULL if no error occurred
     */
    EssayModel.update = function(essay, callback){
    	// TODO
    }

    /* Removes the given essay. The essay must have an id attribute that
     * identifies it.
     *
     * Calls: callback(error)
     *  error -- the error that occurred or NULL if no error occurred
     */
    EssayModel.remove = function(id, callback){
    	// TODO
    }
    window.NotebookModel = NotebookModel;
    window.EssayModel = EssayModel;


})(this,this.document)