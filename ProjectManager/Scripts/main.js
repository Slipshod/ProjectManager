if(!root) {
    var root = { };
}

(function(root, $) {
    root.util = {
        makeAjaxRequest : function makeAjaxRequest (url, data, requestType) {
            if (!requestType) {
                requestType = "POST";
            }
            $.ajax({
                type: requestType,
                url: url,
                data: data,
                success: function () {
                    //TODO: Should closing the dialog and updating the project list be done here?
                }
            });
        }
    };
    
    root.project = {};
    
})(root, jQuery);

(function(root, $) {
    $(document).ready(function docReady() {
        $("#butDelete").live("click", controller.remove);
        $("#butCreate").live("click", controller.create);
        $("#butEdit").live("click", controller.edit);
        $("#linkNewProject").live("click", function() {
            var template = $('#createProject').html();
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked')
            };
            var outputHtml = Mustache.to_html(template, data);

            controller.showDialog(outputHtml);
        });

        $(".editLink").live("click", function() {
            var projectId = $(this).attr("data-id");
            var data = {
                ProjectID: projectId
            };
            $.ajax({
               type: "GET",
               url: "/Project/Edit",
               data: data,
               success: function (response) {
                   var template = $('#editProject').html();
                   var outputHtml = Mustache.to_html(template, response);
                   controller.showDialog(outputHtml);                   
               }
               
            });

        });
        
        $(".deleteLink").live("click", function() {
             var projectId = $(this).attr("data-id");
             
            //Currently the Delete action is returning the correct item to delete as Json
            var data = {
                ProjectID: projectId
            };
            $.ajax({
               type: "GET",
               url: "/Project/Delete",
               data: data,
               success: function (response) {
                   var template = $('#deleteProject').html();
                   var outputHtml = Mustache.to_html(template, response);
                   controller.showDialog(outputHtml);                   
               }
               
            });

        });
    
        $('.butCloseDialog').live("click", function(event) {
            controller.hideDialog(event);
        });
    });        
    

    


    var controller = {
        create: function create(e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked'), 
                redirect: "/"
            };
            if (data.Title) {
                root.util.makeAjaxRequest("/Project/Create", data);

            } else {
                console.log('Title was empty');
            }
            $('.dialog').hide();
            $('.dialogOverlay').hide();
            controller.refreshProjectList();
            
        },

        remove: function remove(e) {
            var data = {
                ProjectID: $('#ProjectID').val()
                };
            root.util.makeAjaxRequest("/Project/Delete", data, "POST");
            $('.dialog').hide();
            $('.dialogOverlay').hide();
            controller.refreshProjectList();
            
        },
        edit: function edit(e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked'),
                ProjectID: $('#ProjectID').val(),
                redirect: "/"
            };

            if (data.Title) {
                root.util.makeAjaxRequest("/Project/Edit", data);
            } else {
                console.log('Title was empty');
            }

            $('.dialog').hide();
            $('.dialogOverlay').hide();
            controller.refreshProjectList();
            
        },
        refreshProjectList: function refreshProjectList(e) {
            //TODO: Make this work
            
            $.getJSON('/Project/GetProjectsJson', null, function (data) {
            var listTemplate = $('#projectListTemplate').html();
            var outputHtml = Mustache.to_html(listTemplate, data);
            $('#tablerow').html(outputHtml);
        });
        },
        showDialog: function dialogManager(outputHtml) {
            if ($('.dialog')){
                console.log('.dialog window FOUND!');
            } else {
                console.log('.dialog window not found');
            }
            $('.dialog').html(outputHtml);
            $('.dialogOverlay').fadeIn(250, function() {
                $('.dialog').fadeIn(150);
                });
        },
        hideDialog: function hideDialog(event) {
            
        //BUG: Does not get rid of the overlay correctly.  Doesn't select the overlay    
        var element = $(event.currentTarget);
        var dialog = element.parents('.dialog');
        var overlay = $(".dialogOverlay");

        dialog.fadeOut(250, function() {
            overlay.fadeOut(250, function() {
//                              dialog.delete();
//                              overlay.delete();            
            });
        });    
            
        }
    };

    if (!root.controllers) {
        root.controllers = { };
    }
    root.controllers.main = controller;
})(root, jQuery);