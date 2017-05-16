'use strict';

/**
 * @ngdoc function
 * @name CityAnalysis.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the CityAnalysis
 */
myApp.controller("MainCtrl", ['$scope', '$resource', '$http', '$sce', 'citylist', 'datagrabber', 'leafletData', 'userSettings',
    function($scope, $resource, $http, $sce, citylist, datagrabber, leafletData, userSettings) {

      angular.extend($scope, {
        events: {
          map: {
            enable: ['moveend', 'popupopen'],
            logic: 'emit'
          },
          marker: {
            enable: [],
            logic: 'emit'
          }
        },
        maxbounds: citylist.cities[citylist.startingcity].maxbounds,
        watchOptions: {
          markers: {
            type: null,
            individual: {
              type: null
            }
          }
        },
        defaults: {
          zoomControlPosition: 'bottomright',
          maxZoom: 18,
          minZoom: 9
        },
        center: {
          lat: citylist.cities[citylist.startingcity].lat,
          lng: citylist.cities[citylist.startingcity].lng,
          zoom: citylist.cities[citylist.startingcity].zoom
        },
        /*markers: {
          m1: {
            lat: 52.52,
            lng: 13.40,
            icon: {
              iconUrl: 'images/marker-icon.png',
              shadowUrl: 'images/marker-shadow.png'
            }
          }
        },*/
        path: {
          perimeter: {
            type: "circle",
            radius: citylist.cities[citylist.startingcity].radius,
            latlngs: {
              lat: citylist.cities[citylist.startingcity].lat,
              lng: citylist.cities[citylist.startingcity].lng
            },
            color: '#000000',
            weight: 3,
            opacity: 1,
            clickable: false,
            fill: '#ffffff',
            fillOpacity: 0
          }
        },
        layers: {
          baselayers: {
            googleRoadmap: {
              name: 'Google Streets',
              layerType: 'ROADMAP',
              type: 'google',
              "layerOptions": {
                "showOnSelector": false
              }
            }
          },
          overlays: {}
        }
      });

      $scope.getData = function() {
        console.log("Data switching");

        var overlays = $scope.layers.overlays;
        if (overlays.hasOwnProperty("data")) {
          delete overlays["data"];
          console.log("Deleted");
        }

        function getRandomColor() {
          var letters = '0123456789ABCDEF';
          var color = '#';
          for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
          }
          return color;
        }

        var layers = {};

        function style(feature) {
          var output = {
            color: '#00D',
            fillColor: getRandomColor(),
            weight: 2.0,
            opacity: 0.6,
            fillOpacity: 0.3
          };
          layers[feature.properties.polygonDataUrl] = output;
          return output;
        }


        datagrabber[$scope.service.city][$scope.active].getpolygons().get(function (data) {
          angular.extend($scope.layers.overlays, {
            data: {
              name: 'Polygon',
              type: 'geoJSONShape',
              data: data.toJSON(),
              visible: true,
              layerOptions: {
                style: style,
                resetStyleOnMouseout: true,
                onEachFeature: onEachFeature
              }
            }
          });
          function onEachFeature(feature, layer) {
            layer.on({
              click: function() {
                var url = layer.feature.properties.polygonDataUrl;
                $resource('https://s3.amazonaws.com/cityanalysis/' + url, { callback: "JSON_CALLBACK", format:'jsonp' }).get(function (data) {
                  console.log(data);
                });
              },
              mouseover: function(leafletevent) {
                this.setStyle({
                  weight: 2,
                  color: '#666',
                  fillColor: 'white'
                });
              },
              mouseout: function(leafletevent) {
                this.setStyle(layers[feature.properties.polygonDataUrl]);
              }
            })
          }
          console.log("Data switched");
        });
      };

      $scope.service = userSettings;
      $scope.active = 'neighbourhood';

      $scope.getData(function(){
        console.log("Data switched");
      });


      $scope.$watch('service.city', function(newVal) {
        $scope.cityChanged(newVal);
        $scope.service.city = newVal;
      });

      $scope.cityChanged = function(newCity) {
        //Updatescope for new model
        $scope.center = {
          lat: citylist.cities[newCity].lat,
          lng: citylist.cities[newCity].lng,
          zoom: citylist.cities[newCity].zoom
        };

        $scope.maxbounds = citylist.cities[newCity].maxbounds;

        $scope.path.perimeter = {
          type: "circle",
          radius: citylist.cities[newCity].radius,
          latlngs: {
            lat: citylist.cities[newCity].lat,
            lng: citylist.cities[newCity].lng
          },
          color: '#000000',
          weight: 3,
          opacity: 1,
          clickable: false,
          fill: '#ffffff',
          fillOpacity: 0
        };

        $scope.getData(function(){
          console.log("Data switched");
        });
      };

      $scope.isActive = function(type) {
        return type === $scope.active;
      };

      $scope.changeModel = function(model) {
        $scope.active = model;
        $scope.getData(function(){
          console.log("Data switched");
        });
      };

    }]);
