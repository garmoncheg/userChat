angular.module('appRoutes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			controller: 'MainController',
			controllerAs: 'main'
		})
		.when('/login', {
			templateUrl: 'app/views/pages/login.html'
		})
		.when('/signup', {
			templateUrl: 'app/views/pages/signup.html'
		})
		.when('/allStorie', {
			templateUrl: 'app/views/pages/allStories.html',
			controller: 'AllStories',
			controllerAs: 'story',
			resolve: {
				storye: function(Story) {
					return Story.allStories(); 
				}
			}
		})


	$locationProvider.html5Mode(true);
})