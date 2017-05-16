'use strict';

/**
 * @ngdoc function
 * @name CityAnalysis.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the CityAnalysis
 */
myApp.controller('AboutCtrl', ['$scope', 'userSettings',
  function($scope, userSettings) {

    $scope.city = userSettings.city;

    this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}]);
