angular.module('starter')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {
  url: 'http://localhost:8100/api',
  //  For a simulator use:
  // url: 'http://localhost:8080/api'
});