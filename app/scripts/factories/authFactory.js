'use strict';

angular.module('roseStClient').factory('AuthFactory', ['$http', '$window', function ($http, $window) {
	
	var userId = {};

	var login = function (credentials) {
		return $http.post('http://localhost:3000/users/login', credentials).success(function (response) {
			var userId = response.id;
			_storeSession(response);
			console.log("logged in")
		});
	};

	var logout = function () {
		return $http.post('http://localhost:3000/users/logout').success(function (response) {
			$window.localStorage.removeItem('rs-user');
			var userId = {};
			console.log("logged out")
		});
	};

	var register = function (credentials) {
		return $http.post('http://localhost:3000/posts/users/', 
								{ user: { 
									email: credentials.email,
									password: credentials.password
								} }).success(function (response) {
			_storeSession(response);
		}).error(function (response) {
			console.log(response)
		});
	};

	var isAuthenticated = function () {
		var data = JSON.parse($window.localStorage.getItem('rs-user'));
		if (data) {
			return true;
		} else {
			return false;
		}
	};

	var clearStorage = function () {};

	var _storeSession = function (data) {
		$window.localStorage.setItem('rs-user', JSON.stringify(data));
		// best practice is to give unique prefixes to your variables
		$http.defaults.headers.common.Authorization = 'Token token=' + data.token;
	};
	
	if (isAuthenticated() === true) {
		var userId = JSON.parse($window.localStorage.getItem('rs-user')).id;
	} else {
		var userId = null;
	};

	return {
		login: login,
		logout: logout,
		register: register,
		isAuthenticated: isAuthenticated,
		clearStorage: clearStorage,
		userId: userId
	};
}]);