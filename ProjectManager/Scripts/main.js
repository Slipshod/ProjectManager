if(!root) {
    var root = { };
}

(function(root, $) {
    root.util = {
        makeAjaxRequest : function makeAjaxRequest (url, data) {
            if (!data.redirect) {
                data.redirect = "/";
            }
            $.ajax({
                type: "POST",
                url: url,
                data: data,
                success: function (response) {
                     window.location.href = data.redirect;
                }
            });
        }
    };
    
    root.project = {};
    
})(root, jQuery);

(function(root, $) {
    $(document).ready(function docReady () {
        $("#butDelete").click(controller.remove);
        $("#butCreate").click(controller.create);
        $("#butEdit").click(controller.edit);
        
    $("#linkNewProject").click(function() {
        $('.dialogOverlay').fadeIn(250, function() {
            $('.dialog').fadeIn(150);
        });
    });

    $('.butCloseDialog').live("click", function(event) {
        var element = $(event.currentTarget);
        var dialog = element.parents('.dialog');
        var overlay = dialog.next();

        dialog.fadeOut(250, function() {
            overlay.fadeOut(250, function() {
                //              dialog.delete();
                //              overlay.delete();            
            });
        });
    });
});

    var controller = {
        create : function create (e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked')
            };

            if (data.Title) {
                root.util.makeAjaxRequest("/Project/Create", data);
            } else {
                console.log('Title was empty');  
                }            
            },
        remove : function remove (e) {
                var data = {
                    ProjectID: $('#ProjectID').val()
                    };
            root.util.makeAjaxRequest("/Project/Delete", data);
        },
        edit: function edit (e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').is(':checked'),
                ProjectID: $('#ProjectID').val()
            };
            
            

            if (data.Title) {
                root.util.makeAjaxRequest("/Project/Edit", data);
            } else {
                console.log('Title was empty');
            }
        }
    };

    if (!root.controllers) {
        root.controllers = { };
    }
    root.controllers.main = controller;
})(root, jQuery);