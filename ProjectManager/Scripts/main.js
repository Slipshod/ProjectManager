if(!root) {
    var root = { };
}

(function(root, $) {
    root.util = {
        makeAjaxRequest : function makeAjaxRequest (url, data) {
            if (!data.redirect) {
                data.redirect = "/Project";
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
    });

    var controller = {
        create : function create (e) {
            var data = {
                Title: $('#Title').val(),
                Detail: $('#Detail').val(),
                Completed: $('#Completed').val()
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
                Completed: $('#Completed').val(),
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