angular.module('starter')

.service('AuthService', function($q, $http, API_ENDPOINT, UserFactory, $rootScope) {
  var LOCAL_TOKEN_KEY = 'yourTokenKey';
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common.Authorization = authToken;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common.Authorization = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var validateToken = function() {
    return $q(function(resolve, reject){
      $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
        if (result.data.success) {
          console.log(result.data)
          UserFactory.user = result.data.user;
          $rootScope.$emit("validated");
          resolve(result.data.msg)
        } else {
          reject(result.data.msg);
        }
      });
    })
  }

  var register = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/signup', user).then(function(result) {
        if (result.data.success) {
          resolve(result.data.msg);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var login = function(user) {
    return $q(function(resolve, reject) {
      $http.post(API_ENDPOINT.url + '/authenticate', user).then(function(result) {
        if (result.data.success) {
          storeUserCredentials(result.data.token);
          UserFactory.user = result.data.user;
          $rootScope.$emit("validated");
          resolve(result.data);
        } else {
          reject(result.data.msg);
        }
      });
    });
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    register: register,
    logout: logout,
    validateToken: validateToken,
    isAuthenticated: function() {return isAuthenticated;},
  };
})

.factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated,
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

app.factory('UserFactory', function($rootScope){
  var x = {
    user: '',
    houses: [],
    password: ' ',
    id: ' '
  };

  return x;
})


.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});