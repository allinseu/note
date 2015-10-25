(function (window, document) {
    // learn cloud初始化
    AV.initialize("x4wg7adtwqe58wyp20wfkiwflctzbgypi75kxwa14t7ivn7h", "b4t6fm6ej6zjwq1iemw7z3zypd2slava19va3xdxvci9wt21");


    //notebookObj.save({title: "设计",numberOfNote:"10"}, {
    //	success: function(object) {
    //		console.log(object);
    //	}
    //});


    /* for convient ,uses gloabl variable here */
    var global = {};
    global.notebooks = [];
    global.essays = [];
    global.selectedNotebook = null;
    global.selectedEssay = null;
    global.state = "read";   // state can be read or write or pending

    var MODALCODE = {
        duplicateNoteName: 1,
        removeNotebook: 2,
        removeNote: 3
    };

    var modalCode = null;

    /* Handles all the logic here */
    $(document).ready(function () {
        // NotebookModel.loadAll(callback)
        NotebookModel.loadAll(getNotebooks);

        var waitNotebook = util.setTimer(waitToRenderCatalogue, 300);

        var waitCatalogue = util.setTimer(waitToRenderEssay, 400);

        function waitToRenderCatalogue() {
            // console.log('运行中.....');
            var time = time || 4;
            if (time < 0 || global.notebooks.length > 0) {
                if ($('.notebook')[0]) {
                    $($('.notebook')[0]).find('a').trigger("click");
                }
                util.clearTimer(waitNotebook);
            } else {
                time--;
            }
        }

        function waitToRenderEssay() {
            var time = time || 5;
            if (time < 0 || global.essays.length > 0) {
                clickCatalogueAnalog();
                util.clearTimer(waitCatalogue);
            } else {
                time--;
            }
        }


        // 添加笔记本的input失去焦点，如果里面没有内容则隐藏输入框，如果有内容，则保存
        $('.inputAddNotebook').blur(inputAddNotebookBlur);

        // 输入框改变事件
        $('.inputAddNotebook').keyup(function (event) {
            if (event.keyCode == 13) {
                inputAddNotebookBlur(event);
            }
        });


        // 点击删除笔记本按钮
        $('.deleteNotebook').click(clickRemoveNotebook);

        // 点击删除笔记按钮, 因为deleteEssay按钮可能没有生成，所以事件绑定在document上
        $(document).on('click', '.deleteEssay', clickRemoveEssay);

        $('.create-essay').click(clickCreateEssay);

        $(document).on('keyup', '.essay-title', function () {
            var title = $(this).val() || '标题';
            $('.catalogue.selected').find('h5').html(title);
            checkState();
        });

        $(document).on('keyup', '.editor-area', function () {
            var content = $(this).text() || '令人虎躯一震的内容';
            if (content.length > 80) {
                content = content.slice(0, 80) + '...';
            }
            $('.catalogue.selected').find('p').html(content);
            checkState();
        });

        function checkState() {
            if ($('.essay-title').val() && $('.editor-area').html()) {
                global.state = "write";
            }
        }

        $('.add-essay').click(clickAddEssay);

        function clickCreateEssay() {
            //console.log($('.catalogue'));
            if (global.state === "read") {
                $('.catalogue').removeClass('selected');
                CreatingCatalogue.render($('#catalogues'));
            }
            showEditor();

        }

        // 得到所有的notebook 通过view.js渲染
        function getNotebooks(error, notebooks) {
            $notebooks = $('#notebooks');
            if (error) {
                console.log('error');

            } else {
                if (notebooks === undefined || notebooks.length === 0) {
                    notebooks = [];
                }
                NotebookView.render($('#notebooks'), notebooks);
            }

            util.checkNotebook(clickNotebook);
        }

        // 增加笔记本回调事件，渲染新节点
        function addNotebook(error, notebook) {
            if (error) {
                console.debug(error);
            } else {
                console.log('add回调:', notebook);
                if (notebook.id) {
                    global.notebooks.push(notebook);
                    NotebookView.render($('#notebooks'), notebook);
                    util.checkNotebook(clickNotebook);
                }
            }
        }

        // 单击notebook,选中当前notebook  该事件在util.checkNotebook中绑定
        function clickNotebook(event) {
            event.preventDefault();
            $target = $(this);
            if (!$target.hasClass('selected')) {

                $('.notebook').removeClass('selected');
                $target.addClass('selected');
                $('.deleteNotebook').addClass('g_pointer');
                var stringArray = $target.text().split('(');
                var title = stringArray.slice(0, stringArray.length - 1).join('');
                //console.log(global.notebooks);

                global.selectedNotebook = util.findSelectOne(title, global.notebooks);
                //console.log('Select notebook: ' +global.selectedNotebook);
                //console.log(global.selectedNotebook);
                global.state = 'read';
                if (stringArray[stringArray.length - 1] === "0)") {
                    CatalogueView.render($('#catalogues'), []);
                    showEditor();
                    return 'no essay';
                }
                EssayModel.loadAll(title, loadEssays);
            }
            function loadEssays(error) {
                if (error) return console.log(error);

                if (global.selectedNotebook.numberOfNote !== global.essays.length) {
                    //console.log('update catalogue');

                    global.selectedNotebook.numberOfNote = global.essays.length;
                    NotebookModel.update(global.selectedNotebook,
                        function () {
                            CatalogueView.render($('#catalogues'), global.essays);
                            NotebookView.update($('#notebooks').find('.selected'), global.selectedNotebook);
                            util.checkNotebook(clickNotebook);
                            selectCatalogue();
                        });

                } else {
                    CatalogueView.render($('#catalogues'), global.essays);
                    selectCatalogue();
                }

                function selectCatalogue() {
                    util.checkCatalogue(clickCatalogue);
                    clickCatalogueAnalog();
                }
            }
        }


        // 单击catalogue,选中当前的目录   该事件在util.checkCatalogue中绑定
        function clickCatalogue(event) {
            //console.log('click catalogue');


            var $target = $(event.target);
            if (!$(this).hasClass('selected')) {

                $('#catalogues').find('.catalogue').removeClass('selected');
                $(this).addClass('selected');


                if (global.state === "write") {
                    //console.log('i save.....');
                    clickAddEssay();
                } else if (global.state === "pending") {
                    $('.catalogue').first().remove();
                }

                global.selectedEssay = util.findById($(this)[0].dataset.id, global.essays);
                EssayView.render($('.content'), global.selectedEssay);
                global.state = 'read';
            }



        }

        // 点击删除笔记本
        function clickRemoveNotebook() {
            var message = {
                title: "确定删除笔记本？",
                content: "点击确定删除笔记本, 点击右上角的X取消删除"
            };
            modalCode = MODALCODE.removeNotebook;
            openModal(message);

        }

        // 点击删除文章按钮
        function clickRemoveEssay(event) {
            // TODO: 弹出提示框，询问是否确定删除
            event.preventDefault();
            var message = {
                title: "确定删除笔记？",
                content: "点击确定删除笔记, 点击右上角的X取消删除"
            };
            modalCode = MODALCODE.removeNote;
            openModal(message);
            // var $target = $(event.target);

            //console.log("delete essay");


        }

        // 添加目录对话框失去焦点事件；如果没有输入则隐藏输入框，有输入则保存
        function inputAddNotebookBlur(event) {
            var $target = $(event.target);
            if (!$target.val()) {
                $target.hide();
            } else {
                // TODO
                //console.log($target.val())
                if (global.notebooks.some(function (item) {
                        return item.title === $target.val();
                    })) {
                    var message = {
                        title: "笔记本需要不一样的名字",
                        content: "请重新输入一个笔记本的名字!"
                    };
                    modalCode = MODALCODE.duplicateNoteName;
                    openModal(message);
                    return false;
                }
                var newNotebook = {
                    title: $target.val(),
                    numberOfNote: 0,
                    alive: true
                };
                // console.log(newNotebook);
                NotebookModel.add(newNotebook, addNotebook);
                $target.val('');
                $target.hide();
            }
        }

        // 删除目录
        function deleteNotebook() {
            //console.log('deletenotebook click');
            $notebooksDeleted = $('#notebooks').find('.selected');
            //console.log($notebooksDeleted);
            if ($notebooksDeleted.length > 0) {
                $notebooksDeleted.each(function (index, item) {
                    NotebookModel.remove($(item).data('id'), finishDeleteNotebook);
                })
            }
            function finishDeleteNotebook(error, notebook) {
                if (error) return console.log(error);
                //console.log('remove notebook');
                $('.notebook.selected').remove();
                $('.notebook').first().click();
            }

        }

        // 显示编辑文章界面
        function showEditor() {
            if (global.state === "read") {
                $('.essay-title').val('');
                $('.editor-area').html('');
                CreatingEssayView.render();
            }
            global.state = 'pending';

        }

        // 点击保存笔记
        function clickAddEssay() {
            //console.log('Add Essay...');
            var newEssay = {};
            newEssay.title = $('input.essay-title').val();
            newEssay.content = util.htmlFilter($('.editor-area').html());
            newEssay.alive = true;
            if ( newEssay.title && newEssay.content) {
                EssayModel.add(global.selectedNotebook, newEssay, addEssay);
                function addEssay(error,essay) {
                    if (error) return console.log('some error occurred');

                    updateNotebook('add');
                    util.checkCatalogue(clickCatalogue);
                    global.selectedEssay = essay;
                    $('.catalogue.selected')[0].dataset.id = global.selectedEssay.id;
                    EssayView.render($('.content'), global.selectedEssay);

                    global.state = 'read';
                }
            }


        }


        function updateNotebook(op) {
            switch (op) {
                case 'add':
                    //console.log('update notebook');
                    if (notebookPlus(1)) {
                        // TODO 更新view
                        NotebookView.update($('#notebooks').find('.selected'), global.selectedNotebook);
                        //console.log('Notebook update!');
                    }
                    break;
                case 'remove':
                    if (notebookPlus(-1)) {
                        NotebookView.update($('#notebooks').find('.selected'), global.selectedNotebook);
                    }
                    break;
            }

            // 所有更新操作只会对选中的notebook进行
            function notebookPlus(number) {

                if (number === 1 || number === -1) {
                    var notebook = global.selectedNotebook;
                    //console.log(notebook);
                    if (notebook && notebook.id) {
                        notebook.numberOfNote = notebook.numberOfNote + number;
                        NotebookModel.update(notebook, function (error) {
                            if (error) console.log(error);

                            //  这个API返回的结果是error
                            global.selectedNotebook = notebook;
                        });
                        return true;
                    } else {
                        //console.log("can't find seleted notebook!");
                        return false;
                    }
                }

            }
        }

        function clickCatalogueAnalog() {
            if ($('.catalogue').length > 0) {
                $('.catalogue').first().trigger('click');
            }
        }

        function afterRemoveEssay() {

            updateView();


            function updateView() {
                var nextCatalogue = $('.catalogue.selected').next();
                var prevCatalogue = $('.catalogue.selected').prev();
                $('.catalogue.selected').remove();

                if (nextCatalogue.length === 0) {

                    if (prevCatalogue.length === 0) {
                        // 没有文章了,重新渲染
                        CatalogueView.render($('#catalogues'), []);
                        showEditor();
                    } else {
                        prevCatalogue.trigger('click');
                    }
                } else {
                    nextCatalogue.trigger('click');
                }

                updateNotebook('remove');
            }

        }


        function removeEssay() {

            // console.log(global.selectedEssay);
            var notebook = global.selectedNotebook.title;
            var noteId = global.selectedEssay.id;

            EssayModel.remove(notebook, noteId, function (status, error) {
                if (status === "success") {
                    // TODO update view
                    afterRemoveEssay();
                    // $('.catalogue.selected').remove();

                } else if (status === "error") {
                    // report error
                    console.log(error);
                }
            })
        }

        window.Global = global;


        var $modal = $('.modal-frame');
        var $overlay = $('.modal-overlay');

        /* Need this to clear out the keyframe classes so they dont clash with each other between ener/leave. Cheers. */
        $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function (e) {
            if ($modal.hasClass('state-leave')) {
                $modal.removeClass('state-leave');
            }
        });

        function openModal(message) {
            $('.modal-btn').unbind();
            switch (modalCode) {
                case MODALCODE.duplicateNoteName:
                    break;
                case MODALCODE.removeNotebook:
                    $('.modal-btn').click(deleteNotebook);
                    break;
                case MODALCODE.removeNote:
                    $('.modal-btn').click(removeEssay);
                    break;
            }
            $('.modal-title').html(message.title);
            $('.modal-content').html(message.content);
            $overlay.addClass('state-show');
            $modal.removeClass('state-leave').addClass('state-appear');
        }

        $(document).on('click', '.modal-close-action', function () {
            switch (modalCode) {
                case MODALCODE.duplicateNoteName:
                    $('.inputAddNotebook').focus();
            }
            $overlay.removeClass('state-show');
            $modal.removeClass('state-appear').addClass('state-leave');
        });


    });

    $('.editor-area').on('paste', function () {
        var $this = $(this);
        setTimeout(function () {
            $this.html($this.text());
        }, 3);
    });
    $('.addNotebook').click(function (event) {
        $('.inputAddNotebook').show().focus();
    });
    $('a').click(function (event) {
        event.preventDefault();
    });

    // content滚动，删除button一直在右上角显示效果
    $('.content').scroll(function () {
        if ($('.content').scrollTop() > 139) {
            $('.content_close').addClass('content_close-out');
        } else {
            $('.content_close').removeClass('content_close-out');
        }

    })

})(this, this.document);
