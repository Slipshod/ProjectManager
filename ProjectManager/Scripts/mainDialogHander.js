$("#linkNewProject").click(function (){
    var formOutputHtml = Mustache.to_html($('#formData').html(), worker);
    //... populate data
    
    $('#myForm').html(formOutputHtml);
    $('.dialogOverlay').fadeIn(250,function(){
        $('.dialog').fadeIn(150);
    });
});

$('.butCloseDialog').live("click", function(event){
    var element = $(event.currentTarget);
    var dialog = element.parents('.dialog');
    var overlay = dialog.next();

    dialog.fadeOut(250, function (){
        overlay.fadeOut(250, function(){
              dialog.delete();
              overlay.delete();            
        });
    });    
       
});