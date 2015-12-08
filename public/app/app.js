angular.module('MyApp', ['mainCtrl', 'appRoutes', 'authService', 'userCtrl', 'userService', 'storyService', 'storyCtrl'])

.config(function($httpProvider) {
	$httpProvider.interceptors.push("AuthInterceptor");
})