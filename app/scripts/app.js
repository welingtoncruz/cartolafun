var materialAdmin = angular.module('materialAdmin', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'ngStorage',
]);

materialAdmin.constant('API_URL', 'http://ec2-52-90-92-206.compute-1.amazonaws.com');

materialAdmin.run(function ($rootScope, $state, $localStorage) { 
  if (typeof $localStorage.version == 'undefined') {
    $localStorage.version = '1.0';    
  }
});