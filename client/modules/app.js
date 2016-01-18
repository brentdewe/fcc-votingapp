(function() {

var app = angular.module('app', ['auth', 'user', 'polls', 'ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
	$routeProvider
	.when('/', {
		redirectTo: '/polls'
	});
}]);

app.controller('AppCtrl', ['$scope', 'auth', '$location',
function($scope, auth, $location) {
	auth.checkAuthentication();
	$scope.currentUser = auth.currentUser;
	$scope.isAuthenticated = auth.isAuthenticated;
	$scope.location = $location;
}]);

app.directive('twitter', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attr) {
			twttr.widgets.createShareButton(attr.url, element[0],
				function(e) {}, { count: 'none', text: attr.text });
		}
	}
});

})();
