var menu = $(".menu");
var icon = $(".menu-icon");

icon.on('click', function(){
   console.log("teste");
   menu.toggleClass("open");
});
