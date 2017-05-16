'use strict';

/**
 * @ngdoc function
 * @name CityAnalysis.controller:MoreCtrl
 * @description
 * # MoreCtrl
 * Controller of the CityAnalysis
 */
myApp.controller('MoreCtrl', ['$scope', 'userSettings',
  function($scope, userSettings) {

    $scope.city = userSettings.city;

    this.awesomeThings = [
    'HTML5 Boilerplate',
    'AngularJS',
    'Karma'
  ];
}]);
