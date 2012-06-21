/// <reference path="base.js"/>
/// <reference path="/Scripts/Libraries/mustache.js" />
/// <reference path="Libraries/jquery-1.7.2.js" />
/// <reference path="Libraries/jquery.unobtrusive-ajax.js" />
/// <reference path="Libraries/underscore.js" />

if(!root) {
    var root = { };
}
if (!fbi) { var fbi = {}; }

(function(root, fbi, $) {
    "use strict";
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
                    fbi.bus.emit('dialog.isFinished');
                }
            });
        }
    };
    
    root.project = {
        create: function create (){
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                //Created: new Date(),
                Completed: $('#Completed').is(':checked')                
            };
            if (data.Title) {
                fbi.bus.emit("project.action", {
                    url: "/Project/Create",
                    data: data,
                    verb: "POST",
                    success: function() {
                        fbi.bus.emit("dialog.isFinished");
                    }
                });

            } else {
                console.log('Title was empty');
            }
     },
        remove: function remove () {
            var data = {
                ProjectID: $('#ProjectID').val()
            };
            fbi.bus.emit('project.action', {
                url: "/Project/Delete",
                data: data,
                verb: "POST",
                success: function() {
                    fbi.bus.emit("dialog.isFinished");
                }
            });
        },
        edit: function edit () {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked'),
                ProjectID: $('#ProjectID').val()
            };

            if (data.Title) {
                fbi.bus.emit('project.action', {
                    url: "/Project/Edit",
                    data: data,
                    verb: "POST"
                });
            } else {
                console.log('Title was empty');
            }
            fbi.bus.emit("dialog.finish");
        }
    };

    root.subtask = {
        create: function create (){
            //TODO Add logic
        },
        remove: function remove () {
            //TODO Add logic
        },
        edit: function edit () {
            //TODO: Add logic
        }
    };
    
}(root, fbi, jQuery));

(function (root, fbi, Mustache, $) {
    "use strict";
    //var document;
    var controller = {
        init: function init(){
            console.log('controller.init was called');
        //Click Event Listeners
        $("#butDelete").live("click", controller.remove);
        $("#butCreate").live("click", controller.create);
        $("#butEdit").live("click", controller.edit);
        $("#linkNewProject").live("click", function() {
            var template = $('#createProject').html();
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                //Created: new Date(),
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
                success: function(response) {
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
                success: function(response) {
                    var template = $('#deleteProject').html();
                    var outputHtml = Mustache.to_html(template, response);
                    controller.showDialog(outputHtml);
                }               
            });

        });
        $('.butCloseDialog').live("click", function(event) {
            controller.hideDialog(event);
        });
            
        },
        create: function create(e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                //Created: new Date(),
                Completed: $('#Completed').is(':checked')                
            };
            if (data.Title) {
                fbi.bus.emit("project.action", {
                    url: "/Project/Create",
                    data: data,
                    verb: "POST",
                    success: function() {
                        fbi.bus.emit("dialog.isFinished");
                    }
                });

            } else {
                console.log('Title was empty');
            }

        },
        remove: function remove(e) {
            var data = {
                ProjectID: $('#ProjectID').val()
            };
            fbi.bus.emit('project.action', {
                url: "/Project/Delete",
                data: data,
                verb: "POST",
                success: function() {
                    fbi.bus.emit("dialog.isFinished");
                }
            });


        },
        edit: function edit(e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked'),
                ProjectID: $('#ProjectID').val()
            };

            if (data.Title) {
                fbi.bus.emit('project.action', {
                    url: "/Project/Edit",
                    data: data,
                    verb: "POST"
                });
            } else {
                console.log('Title was empty');
            }
            fbi.bus.emit("dialog.finish");

        },
        refreshProjectList: function refreshProjectList(e) {
            $.getJSON('/Project/GetProjectsJson', null, function(data) {
                var listTemplate = $('#projectListTemplate').html();
                var outputHtml = Mustache.to_html(listTemplate, data);
                $('#tablerow').html(outputHtml);
            });
        },
        showDialog: function dialogManager(outputHtml) {
            $('.dialog').html(outputHtml);
            $('.dialogOverlay').fadeIn(250, function() {
                $('.dialog').fadeIn(150);
            });
        },
        hideDialog: function hideDialog(event) {

            //BUG: Does not always get rid of the overlay correctly.  Doesn't select the overlay 
            //NOTE: Currently this is only used when clicking the Close button on the dialog window.    
            var element = $(event.currentTarget);
            var dialog = element.parents('.dialog');
            var overlay = $(".dialogOverlay");

            dialog.fadeOut(250, function() {
                overlay.fadeOut(250, function() {
//                              dialog.delete();
//                              overlay.delete();            
                });
            });

        },
        hideDialogAndRefresh: function hideDialogAndRefresh() {
            $('.dialog').hide();
            $('.dialogOverlay').hide();
            controller.refreshProjectList();
        },
        loadInitialProjectData: function loadInitialProjectData() {
            controller.refreshProjectList();
        }
    }; // END var controller
    var dialogHandler = {
        show: function showDialog(outputHtml) {
            $('.dialog').html(outputHtml);
            $('.dialogOverlay').fadeIn(250, function() {
                $('.dialog').fadeIn(150);
            });
        },
        hide: function hide(event) {

            //BUG: Does not always get rid of the overlay correctly.  Doesn't select the overlay 
            //NOTE: Currently this is only used when clicking the Close button on the dialog window.    
            var element = $(event.currentTarget);
            var dialog = element.parents('.dialog');
            var overlay = $(".dialogOverlay");

            dialog.fadeOut(250, function() {
                overlay.fadeOut(250, function() {
//                              dialog.delete();
//                              overlay.delete();            
                });
            });

        },
        hideDialogAndRefresh: function hideDialogAndRefresh() {
            $('.dialog').hide();
            $('.dialogOverlay').hide();
            controller.refreshProjectList();
        }        
    };
    $(document).ready(function docReady() {
        // Bus Responders
        // Handle internal events that are not UI events        
        fbi.bus.once("project.initialize", controller.init());        
        fbi.bus.once("project.getAllProjectsOnInitialPageLoad", controller.loadInitialProjectData);
        fbi.bus.on("project.action", function(options) {
            root.util.makeAjaxRequest(options.url || "", options.data || { }, options.verb || "POST");
        });
        fbi.bus.on("dialog.isFinished", dialogHandler.hideDialogAndRefresh);
        // END Bus Responders

        fbi.bus.emit("project.getAllProjectsOnInitialPageLoad");
    }); // END $(document).ready      


    if (!root.controllers) {
        root.controllers = { };
    }
    root.controllers.main = controller;
}(root, fbi, Mustache, jQuery));