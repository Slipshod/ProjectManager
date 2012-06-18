$("#linkNewProject").click(function (){
    $('.dialogOverlay').fadeIn(250,function(){
        $('.dialog').fadeIn(150);
    });

    console.log('new project link was clicked');
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