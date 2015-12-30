(function() {

var app = angular.module('app', ['login', 'polls', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		templateUrl: '/modules/index.html'
	});
}]);

})();
