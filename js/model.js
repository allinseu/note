(function(window,document){

    /* Learn cloud Models
     *  从learncloud加载内容，并且支持对learn cloud上的内容进行编辑
     *  Notebook: 是笔记本对象，有两个属性 title和numberOfNote
     *
     */
    var Notebook = AV.Object.extend("Notebook");
    window.Notebook = Notebook;
    //var notebookObj = new Notebook();

    var leanNotebooks = [];
    var leanEssays     = [];
	var NotebookModel = {};


	/* Loads all noteboolks from the localstorage.
     *
     *  Calls: callback(error, entries)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebooks -- an array of entries
     */
	NotebookModel.loadAll = function(callback){
		// TODO
        console.log("load all");
        var NotebookCollection = AV.Collection.extend({
            model: Notebook
        });
        var query = new AV.Query(Notebook);
        query.equalTo("alive", true);
        var notebookCollection = query.collection();

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
                    leanNotebooks.push(item);
                    //console.log(item.createdAt);
                    //console.log(notebook);
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
                    leanNotebooks.push(notebook);
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
        var query = new AV.Query(Notebook);
        console.log(id);
        query.get(id,{
            success: function(notebook){
                console.log("查询返回的:");
                console.log(notebook);
                callback(null,notebook);
            },
            error: function(notebook,error){
                console.log(error);
                callback(error, notebook);
            }
        });
    }

    /* Deletes the entry with the given id.
     *
     * Calls: callback(error)
     *  error -- the error that occurred or NULL if no error occurred
     */
    NotebookModel.remove = function(id, callback){
    	// TODO
        console.log('remove called');
        var objs = leanNotebooks.filter(function(item){
            return item.id === id;
        });
        var deleteNotebook = objs[0];

        deleteNotebook.set('alive',false);
        deleteNotebook.save().then(successFunc,errorFunc);
        function successFunc(obj){
            console.log('success');
            callback(null,obj);
        }
        function errorFunc(obj,error){
            console.log('failed');
            callback(error,obj);
        }

    }

    


    var EssayModel = {};

    /* Loads all catalogues of the notebook from the server.
     *
     *  Calls: callback(error, entries)
     *  error -- the error that occurred or NULL if no error occurred
     *  notebooks -- an array of entries
     */
    EssayModel.loadAll = function(title, callback){
    	// TODO

        var Notes = AV.Object.extend(title);
        var NoteCollection = AV.Collection.extend({
            model: Notes,
            query: (new AV.Query(Notes)).equalTo("alive",true)
        });
        var noteCollection = new NoteCollection();

        noteCollection.fetch().then(success,failed);
        function success(collection){
            var essays = [];
            collection.models.forEach(function(item){
                var essay = {}
                util.cloneEssay(item,essay);
                essays.push(essay);
            })
            callback(null,essays);
            // console.log(collection);
            console.log('success load');s
        }
        function failed(collection,error){
            if(error) console.log('failed');
        }

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