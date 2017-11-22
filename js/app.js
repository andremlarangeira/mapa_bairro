var menu = $(".menu");
var icon = $(".menu-icon");
var divMap = $("#map");

icon.on('click', function(){
   menu.toggleClass("open");
});

divMap.on('click', function(){
   menu.removeClass("open");
})

var map;
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -22.738729, lng:-47.616529},
      zoom: 16
   });

   var lobato = {lat: -22.746132, lng: -47.635882};

   var marker = new google.maps.Marker({
      position: lobato,
      map: map,
      title: 'casa lobato',
      animation: google.maps.Animation.DROP
   });
}
