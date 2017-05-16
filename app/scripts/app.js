'use strict';

/**
 * @ngdoc overview
 * @name CityAnalysis
 * @description
 * # CityAnalysis
 *
 * Main module of the application.
 */

/*=============================
  Modules
=============================*/
var myApp = angular.module('CityAnalysis', [
  'ui.select',
  'ngAnimate',
  'ngAria',
  'ngCookies',
  'ngMessages',
  'ngResource',
  'ngRoute',
  'ngSanitize',
  'ngTouch',
  'nemLogging',
  'ui-leaflet'
]);

/*=============================
 Router
 =============================*/
myApp.config(function ($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'main.html',
      controller: 'MainCtrl',
      controllerAs: 'main'
    })
    .when('/more', {
      templateUrl: 'more.html',
      controller: 'MoreCtrl',
      controllerAs: 'more'
    })
    .when('/about', {
      templateUrl: 'about.html',
      controller: 'AboutCtrl',
      controllerAs: 'about'
    })
    .when('/donate', {
      templateUrl: 'donate.html',
      controller: 'DonateCtrl',
      controllerAs: 'donate'
    })
    .otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true);
});

/*=============================
 Whitelist all URLS
 =============================*/
myApp.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
});

/*=============================
 Services
 =============================*/
myApp.service('userSettings', function() {
  var self = this;
  this.clusterModel = 'Neighbourhoods';
  this.showVenues = true;
  this.city = "newyork";
});

myApp.factory('datagrabber', ['$resource', function($resource) {
  var datagrabber = {
    venues: {
      getvenues: function() {
        return $resource('https://s3.amazonaws.com/cityanalysis/venueFeatureCollection.geoJson',
          { callback: "JSON_CALLBACK", format:'jsonp' });
      }
    },
    newyork: {
      neighbourhood: {
        getpolygons: function() {
          return $resource('https://s3.amazonaws.com/cityanalysis/featureCollection/newyork-neighbourhoodmodel-data.geojson',
            { callback: "JSON_CALLBACK", format:'jsonp' });
        }
      },
      venue: {
        getpolygons: function() {
          return $resource('https://s3.amazonaws.com/cityanalysis/featureCollection/newyork-venuemodel-data.geojson',
            { callback: "JSON_CALLBACK", format:'jsonp' });
        }
      },
      user: {
        getpolygons: function() {
          return $resource('https://s3.amazonaws.com/cityanalysis/featureCollection/newyork-usermodel-data.geojson',
            { callback: "JSON_CALLBACK", format:'jsonp' });
        }
      }
    },
    london: {
      neighbourhood: {
        getpolygons: function() {
          return $resource('https://s3.amazonaws.com/cityanalysis/featureCollection/london-neighbourhoodmodel-data.geojson',
            { callback: "JSON_CALLBACK", format:'jsonp' });
        }
      },
      venue: {
        getpolygons: function() {
          return $resource('https://s3.amazonaws.com/cityanalysis/featureCollection/london-venuemodel-data.geojson',
            { callback: "JSON_CALLBACK", format:'jsonp' });
        }
      },
      user: {
        getpolygons: function() {
          return $resource('https://s3.amazonaws.com/cityanalysis/featureCollection/london-usermodel-data.geojson',
            { callback: "JSON_CALLBACK", format:'jsonp' });
        }
      }
    }
  };
  return datagrabber;
}]);

myApp.service('citylist', function() {
  this.startingcity = 'newyork';
  this.cities = {
    newyork: {
      name: "New York",
      lat: 40.730610,
      lng: -73.935242,
      zoom: 10,
      radius: 35000,
      maxbounds: {
        southWest: {
          lat: 40.330610,
          lng: -74.435242
        },
        northEast: {
          lat: 41.130610,
          lng: -73.435242
        }
      }
    },
    london: {
      name: "London",
      lat: 51.509865,
      lng: -0.118092,
      zoom: 10,
      radius: 30000,
      maxbounds: {
        southWest: {
          lat: 51.209865,
          lng: -0.718092
        },
        northEast: {
          lat: 51.809865,
          lng: 0.481908
        }
      }
    }
  };
});

/*=============================
 Directives
 =============================*/
myApp.directive('userSelected', function () {
  return {
    templateUrl: 'directives/userselected.html',
    replace: true/*,
    scope: {
    }*/
  };
});

/*=============================
 Controller
 =============================*/

myApp.controller('indexController', ['$scope', 'citylist', 'userSettings',
  function($scope, citylist, userSettings) {
    $scope.city = {};
    $scope.city.selected = {
      key: citylist.startingcity,
      value: citylist.cities[citylist.startingcity]
    };
    $scope.cityselection = citylist.cities;

    $scope.changeCity = function(newCity) {
      userSettings.city = newCity;
    };
}]);
