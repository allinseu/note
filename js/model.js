(function(window,document){
	var NotebookModel = {};

	/* Loads all noteboolks from the server.
     *
     *  Calls: callback(error, entries)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebooks -- an array of entries
     */
	NotebookModel.loadAll = function(callback){
		// TODO
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

    window.NotebookModel = NotebookModel;


    CatalogueModel = {};

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
    window.CatalogueModel = CatalogueModel;
})(this,this.document)