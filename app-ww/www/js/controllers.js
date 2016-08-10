angular.module('starter')

.controller('LoginCtrl', [ '$scope', 'AuthService', '$ionicPopup', '$state', 'socket', '$http', 'API_ENDPOINT', 'UserFactory', function($scope, AuthService, $ionicPopup, $state, socket, $http, API_ENDPOINT, UserFactory) {
  $scope.user = {};
  $scope.newusers = '';

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
  $scope.userlist  = [];
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
      $scope.house = data.houses;
      console.log('$scope.user');
      console.log($scope.user);
      console.log('$scope.house');
      console.log($scope.house);
      console.log('$scope.windows');
      console.log($scope.windows);
      console.log('value to find');
      console.log($scope.userlist);
      // updateallinfo();
    });
  };

  socket.on('updateuserlist', function (data) {
    console.log('updateuserlist');
    console.log(data)
    $scope.userlist = data.userlist;
  });

  socket.on('newestupdate', function () {
    $scope.refreshData();
  })

  $scope.savehouse = function (data) {
    $state.go('inside.userhome');
    socket.emit('addedHouse', {
        housename: $scope.house.name,
        housecountry: $scope.house.country,
        houselocation: $scope.house.location,
        userid: $scope.user.user.id,
        houseid: $scope.house._id
    });
  };

  $scope.updateallinfo = function () {
    socket.emit('allupdate', {
      currentusername: $scope.user.user.name,
      currenthouseid: $scope.house._id

    });
  };

  $scope.submitform = function (data) {
    if($scope.house.newusers) {
      socket.emit('addingnewuser', {
        newuser: $scope.house.newusers,
        houseid: $scope.house._id
      });
    };
  };



}])// Inside Controller end


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



