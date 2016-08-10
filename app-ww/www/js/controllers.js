angular.module('starter')

.controller('LoginCtrl', [ '$scope', 'AuthService', '$ionicPopup', '$state', 'socket', '$http', 'API_ENDPOINT', 'UserFactory', function($scope, AuthService, $ionicPopup, $state, socket, $http, API_ENDPOINT, UserFactory) {
  $scope.user = {};

  AuthService.validateToken().then(function(data) {
    $state.go("inside.userhome");
  });

  $scope.login = function() {
    AuthService.login($scope.user).then(function(data) {
      $state.go('inside.userhome');
     }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
}])

.controller('RegisterCtrl', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

app.controller('InsideCtrl', ["$scope", "AuthService", "API_ENDPOINT", "$http", "$state", "socket", "UserFactory", "$rootScope", function($scope, AuthService, API_ENDPOINT, $http, $state, socket, UserFactory, $rootScope) {
  $scope.houses  = [];
  $scope.house   = {};
  $scope.windows = {};

  AuthService.validateToken().then(function(data) {
    $scope.user = UserFactory;
  });

  $scope.$watch(function(){
    return UserFactory;
  }, function(NewValue, OldValue){
    console.log("New:", NewValue, "Old:", OldValue);
    $scope.user = UserFactory;
  });

  $rootScope.$on('validated', function () {
    console.log("user validated!!! please get data")
    $scope.refreshData();
  });

  $scope.refreshData = function () {
    socket.emit('getData', {id: UserFactory.user._id});

    socket.on('arefreshing', function (data) {
      $scope.house = data.houses[0];
    });
  };

}])

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});



