angular.module('starter')

.controller('LoginCtrl', [ '$scope', 'AuthService', '$ionicPopup', '$state', 'socket', function($scope, AuthService, $ionicPopup, $state, socket) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(data) {
      socket.emit('loggedin', {data});
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

app.controller('InsideCtrl', ["$scope", "AuthService", "API_ENDPOINT", "$http", "$state", "socket", "UserFactory", function($scope, AuthService, API_ENDPOINT, $http, $state, socket, UserFactory) {
  $scope.house = {
    name: '',
    country: '',
    location: '',
  };
  house = $scope.house;

  $scope.houseit = {
    house: ' ',
    name: ' ',
    id: ' '
  };



  $scope.$watch(function(){
    return UserFactory;
  }, function(NewValue, OldValue){
    console.log("New:", NewValue, "Old:", OldValue);
    $scope.user = UserFactory;
  });

  $scope.destroySession = function() {
    AuthService.logout();
  };

  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      $scope.memberinfo = result.data.msg;
    });
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };

  $scope.gohousedetails = function() {
    console.log("what");
    $state.go('inside.details');
  };

  $scope.gohouseedit = function() {
    console.log("who");
    $state.go('inside.editHouse');
  };

  $scope.gohousehome = function(data) {
    $scope.houseit = data;
    console.log(data);
    $state.go('inside.userhome');

  };

  $scope.goedithome = function() {
    console.log("when");
    $state.go('inside.editProfile');
  };

  $scope.gochat = function() {
    console.log("gonetochat");
    $state.go('inside.chat');
  };

  //saving a new house
  $scope.savehouse = function (data) {
    $state.go('inside.userhome');
    console.log(UserFactory);
    socket.emit('addedHouse', {
                                house,
                                user: UserFactory
                              }
    )};

    $scope.housereturn = function (data) {
      user = data;
      console.log();
    }


    socket.on('houseAdded', function (data) {
      console.log(data);
    });

    socket.on('loadhouses', function (data) {
      $scope.gohousehome(data);
      console.log(data);
      $scope.housereturn(data);
    });



  }])



// app.controller('socketCtrl', function($scope, socket) {

// }])

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



