/* seleciona os elementos da tela*/
var menu = $(".menu");
var icon = $(".menu-icon");
var divMap = $("#map");

/*aciona ou fecha o menu lateral*/
icon.on('click', function() {
   var icon = $(this);
   menu.toggleClass("open");
   trocaIcone();
   console.log(locations);

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

/*variaveis globais*/
var map;
var markers = [];
var infowindow = {};
var locations = [];
var aIndex = 0;
// var vm = {};
/*inicia o mapa e adiciona os marcadores*/
function initMap() {
   map = new google.maps.Map(document.getElementById('map'), {
      center: {
         lat: -22.7406543,
         lng: -47.6300095
      },
      zoom: 15
   });

   infowindow = new google.maps.InfoWindow();

   /*carrega o arquivo JSON e passa o conteudo de locations para o array locations*/
   $.getJSON("js/locations.json", function(data) {
      locations = data.locations;
      /*inicia o knockoutjs*/
      initKnokout();
      /*chama a funcao loadMarkers que carrega os marcadores com base no array locations*/
      //loadMarkers(locations);
   });
}




/*viewmodel do knockoutjs*/
var ViewModel = function() {
   /*passa o contexto de this que se refere ao viemodel para a variavel self,
      para usarmos nas funcoes e referenciar o viewmodel*/
   var self = this;





   /*****************************************************************************/

   /*remove os marcadores da tela*/
   function removeMarkers() {
      for (i = 0; i < markers.length; i++) {
         markers[i].setMap(null);
      }
   }


   /*funcao que carrega o icone do marcador na cor passada por parametro.
     funcao usada no modulo: começando com APIs*/
   function makeMarkerIcon(markerColor) {
      var markerImage = new google.maps.MarkerImage(
         'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
         '|40|_|%E2%80%A2',
         new google.maps.Size(21, 34),
         new google.maps.Point(0, 0),
         new google.maps.Point(10, 34),
         new google.maps.Size(21, 34));
      return markerImage;
   }

   /*carrega os marcadores com base no array passado por parametro*/
   function loadMarkers(arrayLocations) {
      // define o icone padrao ao carregar o mapa, passando uma cor personalizada
      var defaultIcon = makeMarkerIcon('4db6ac');

      /* icone usado para destacr o marcador quando passar o mouse por cima ou quando
      o marcador estiver selecionado clicado*/
      // var highlightedIcon = makeMarkerIcon('42a5f5');

      /*antes de carregar os marcadores removemos da tela, se tiver algum*/
      removeMarkers();

      /*esvazia o array markers para carregar os novos marcadores*/
      markers = [];

      /*faz um loop no array locations e pegando o titulo e a posicao do marcador
        cria a variavel marker e adiciona ao array markers*/
      for (var i = 0; i < arrayLocations.length; i++) {
         var title = arrayLocations[i].title;
         var position = arrayLocations[i].location;

         var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon,
            id: i
         });
         markers.push(marker);

         /*se clicar no marcador, chama as funcoes de animar o marcadore e de criar
            a infowindow*/
         marker.addListener('click', function() {
            var i = markers.indexOf(this);
            if(vm.filtro()[aIndex].selected()){
              markersStopAnim();
              vm.filtro()[i].selected(!vm.filtro()[i].selected());
            }
            vm.filtro()[i].selected(!vm.filtro()[i].selected());
            aIndex = i;

            if (this.animating == false) {
               populateInfoWindow(this, infowindow);
            } else {
               infowindow.close();
            }
            animaMarker(this);
         });

         /*se passar o mouse por cima do marcador troca o icone do marcador*/
         // marker.addListener('mouseover', function() {
         //    this.setIcon(highlightedIcon);
         // });

         /*ao retirar o mouse de cima do marcador retorna o icone para o padrao*/
         // marker.addListener('mouseout', function() {
         //    this.setIcon(defaultIcon);
         // });

         /*funcao que cria e configura a infowindow*/
         function populateInfoWindow(marker, infowindow) {
            var conteudo = '<div id="content">' +
               '<div id="siteNotice">' +
               '</div>' +
               '<h1 id="firstHeading" class="firstHeading">' + marker.title + '</h1>' +
               '<div id="bodyContent">' +
               '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
               'sandstone rock formation in the southern part of the ' +
               'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
               'south west of the nearest large town, Alice Springs; 450&#160;km ' +
               '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
               'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
               'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
               'Aboriginal people of the area. It has many springs, waterholes, ' +
               'rock caves and ancient paintings. Uluru is listed as a World ' +
               'Heritage Site.</p>' +
               '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
               'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
               '(last visited June 22, 2009).</p>' +
               '</div>' +
               '</div>';
            if (infowindow.marker != marker) {
               infowindow.marker = marker;
            };
            infowindow.setContent(conteudo);
            infowindow.open(map, marker);

            /*se clicar no icone de fechar a infowindow chama a funca que fecha a
               infowindow*/
            infowindow.addListener('closeclick', function() {
               infowindow.close();
            });
         };

         /*funcao que anima o marcador para dar destaque ao marcador selecionado*/
         function animaMarker(marker) {
            marker.setAnimation(google.maps.Animation.BOUNCE);
         };
      }
   }


   function markersStopAnim() {
      for (var i = 0; i < markers.length; i++) {
         markers[i].setAnimation(null);
         self.filtro()[i].selected(false);
      }
   }

   function updateArray(array) {
      for (var i = 0; i < array.length; i++) {
         array[i].selected = ko.observable(false)
      }
      return array;
   };


   /*****************************************************************************/







   /*define os observables que serão usados no html para*/
   self.locationList = ko.observableArray(updateArray(locations));
   self.busca = ko.observable();

   /*funcao que verifica no objeto passado por parametro se a propriedade titulo
    do objeto corresponde a busca digitada pelo usuario*/
   self.filtraBusca = function(location) {
      /*pega o title do obejto e coverte par uppercase para a comparação
        ser mais precisa independente do padrao digitado*/
      var title = location.title.toUpperCase();

      /*verifica se a variavel busca tem conteudo se sim coverte para uppercase
        se não retorna uma string vazia*/
      var busca = self.busca() ? self.busca().toUpperCase() : "";

      /*usa o metodo includes para verificar se a string title contem a string
      busca, se sim retorna true senao retorna false */
      return title.includes(busca);
   };

   self.filtro = ko.computed(function() {
      /*a funcao filter do array faz uma verificacao para cada elemento do array,
        no caso a funcao filtra busca, caso o retorno seja true mantem o elemento,
        caso contrario o elemento é descartado, adicionamos esse novo array criado
        a variavel arrayFiltro e passamos o novo array para a funcao loadMarkers
        para carregar somentes os marcadores filtrados e retonamos o array para
        ser usado no html que carrega a lista no menu lateral utilizando a computed
        observable "filtro"*/
      var arrayFiltro = self.locationList().filter(self.filtraBusca);
      loadMarkers(arrayFiltro);
      return arrayFiltro;
   });


   /*se algum item do menu lateral for clicado pega o indice do elemento clicado
    e aciona o evento click do marcador correspondente*/
   self.clickItem = function(item) {
      var i = self.filtro().indexOf(item);
      google.maps.event.trigger(markers[i], 'click');
   };
}
var vm = {};
/*funcao de inicializacao knockoutjs*/
function initKnokout() {
   vm = new ViewModel();
   ko.applyBindings(ViewModel);
};
