var app = angular.module('starter', [
  'ionic',
  'btford.socket-io',
    ])

app.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })
  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })
  .state('inside', {
    url: '/inside',
    abstract: true,
    templateUrl: 'templates/inside.html',
    controller: 'InsideCtrl'
  })
  .state('inside.userhome', {
    url: '/inside',
    templateUrl: 'templates/userhome.html'
  })
  .state('inside.details', {
    url: '/inside/housedetails',
    templateUrl: 'templates/housedetails.html'
  })
  .state('inside.editHouse', {
    url: '/inside/edit',
    templateUrl: 'templates/edithouse.html'
  })
  .state('inside.editProfile', {
    url: '/inside/editProfile',
    templateUrl: 'templates/editprofile.html'
  })
  .state('inside.chat', {
    url: '/inside/chat',
    templateUrl: 'templates/chat.html'
  })

  ;

  $urlRouterProvider.otherwise('/outside/login');
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      console.log(next.name);
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {
        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
});