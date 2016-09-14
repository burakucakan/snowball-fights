/// <reference path="angular/angular.min.js" />
var icerinkApp = angular.module('icerinkApp', ['ngRoute', 'firebase', 'autocomplete']);

// Route Provider
icerinkApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/Welcome', {
        templateUrl: 'views/welcome.html',
        controller: 'WelcomeController'
    }).when('/Game', {
        templateUrl: 'views/game.html',
        controller: 'IcerinkController'
    }).when('/Editor', {
        templateUrl: 'views/pathEditor.html',
        controller: 'pathEditorController'
    }).otherwise({
        redirectTo: '/Welcome'
    });


    // //check browser support
    // if(window.history && window.history.pushState){
    //  $locationProvider.html5Mode({
    //          enabled: true,
    //          requireBase: false
    //   });
    // }
}]);

// Authentication Control
icerinkApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    if ($location.$$path == '/Game') {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            if ($rootScope.fireUser === null || $rootScope.fireUser === undefined) {
                $location.path("/Welcome");
            }
        });
    }
}]);
