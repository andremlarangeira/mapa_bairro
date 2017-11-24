/* seleciona os elementos da tela*/
var menu = $(".menu");
var icon = $(".menu-icon");
var divMap = $("#map");

/*aciona ou fecha o menu lateral*/
icon.on('click', function() {
   var icon = $(this);
   menu.toggleClass("open");
   trocaIcone();
});

/* se o menu esta aberto carrega o icone de fechar senão carrega o icone da lupa*/
var trocaIcone = function() {
   if (menu.hasClass("open")) {
      $(".path").attr("d", "M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z");
   } else {
      $(".path").attr("d", "M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z");
   }
}

trocaIcone();

var map;
var markers = [];
var infowindow = {};
var gMaps = {};
var locations = [{
      title: 'Casa',
      location: {
         lat: -22.738729,
         lng: -47.616529
      }
   },
   {
      title: 'Coop',
      location: {
         lat: -22.738893,
         lng: -47.628706
      }
   },
   {
      title: 'Lobato',
      location: {
         lat: -22.746132,
         lng: -47.635882
      }
   },
   {
      title: 'Padaria',
      location: {
         lat: -22.7389413,
         lng: -47.6252318
      }
   },
   {
      title: 'Terminal',
      location: {
         lat: -22.7358604,
         lng: -47.6292229
      }
   },
   {
      title: 'Condominio',
      location: {
         lat: -22.7369278,
         lng: -47.6299448
      }
   },
   {
      title: 'Banco',
      location: {
         lat: -22.7380874,
         lng: -47.6292498
      }
   }
];

/*inicia o mapa e adiciona os marcadores*/
function initMap() {
   gMaps = google.maps;
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: -22.738382,
         lng: -47.630451
      },
      zoom: 15
   });

   infowindow = new google.maps.InfoWindow();

   loadMarkers(locations);
   initKnokout();
}

function removeMarkers() {
   for (i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
   }
}

function loadMarkers(arrayLocations) {
   removeMarkers();
   markers = [];
   for (var i = 0; i < arrayLocations.length; i++) {
      var title = arrayLocations[i].title;
      var position = arrayLocations[i].location;
      // console.log(title);

      var marker = new google.maps.Marker({
         map: map,
         position: position,
         title: title,
         animation: google.maps.Animation.DROP,
         id: i
      });
      markers.push(marker);

      // marker.addListener('click', function() {
      //    populateInfoWindow(this, infowindow);
      // });
      google.maps.event.addListener(marker, 'click', function() {
         animaMarker(this);
         populateInfoWindow(this, infowindow);
      });

      function populateInfoWindow(marker, infowindow) {
         if (infowindow.marker != marker) {
            infowindow.marker = marker;
         };
         infowindow.setContent('<div>' + marker.title + '</div>');
         infowindow.open(map, marker);

         infowindow.addListener('closeclick', function() {
            infowindow.close();
         });
      };

      function animaMarker(marker) {
         console.log(marker.title);
         if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
         } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
         }
      }
   }
}


/*viewmodel do knockoutjs*/
function ViewModel() {
   var self = this;
   self.locationList = ko.observableArray(locations);
   self.busca = ko.observable();
   self.filtraBusca = function(location) {
      var title = location.title.toUpperCase();
      var busca = self.busca() ? self.busca().toUpperCase() : "";
      // console.log(busca);
      return title.includes(busca);
   };
   self.filtro = ko.computed(function() {
      var arrayFiltro = self.locationList().filter(self.filtraBusca);
      loadMarkers(arrayFiltro);
      return arrayFiltro;
   });

   self.clickItem = function(item) {
      var i = self.filtro().indexOf(item);
      google.maps.event.trigger(markers[i], 'click');
   }
}

/*inicializacao knockoutjs*/
function initKnokout() {
   ko.applyBindings(ViewModel());
};

// for (var i = 0; i < ko.ViewModel.filtro.length; i++) {
//    console.log(ko.ViewModel.filtro[i]);
// }
