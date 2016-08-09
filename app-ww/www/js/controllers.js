angular.module('starter')

.controller('LoginCtrl', [ '$scope', 'AuthService', '$ionicPopup', '$state', 'socket', function($scope, AuthService, $ionicPopup, $state, socket) {
  $scope.user = {
    name: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(data) {
      socket.emit('loggingin', {
                                  username: $scope.user.name,
                              });

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
    pollution: ' ',
    weather: {
            currentweather: ' ',
            temperature: 0,
              },
    windows: [ ]
  };
  house = $scope.house;

  $scope.houseit = {
    house: ' ',
    name: ' ',
    id: ' ',
    users: ' ',
    country: ' ',
    weather: ' '
  };
  houseit = $scope.houseit

  $scope.windows = {
    name: ' ',
    state: true
  }
  windows = $scope.windows


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

    //logging in to a house
  $scope.logginginhouse = function (data) {
    $scope.houseit = {
                      house: data.name,
                      name: data.users,
                      id: data.id,
                      country: data.country,
                      weather: data.weather,
                      }
    console.log($scope.houseit);
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

  //adding a new window
  $scope.createnewwindow = function (data) {
    socket.emit('creatingwindow', {
                                  windowname: windows.name,
                                  houseid: $scope.houseit.id
                                  });
  }

  //saving a new house
  $scope.savehouse = function (data) {
    $state.go('inside.userhome');
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

    // console.log(data);
      $scope.housereturn(data);
    });

    socket.on('loggedin', function (data){
      $scope.logginginhouse(data);
    });

    socket.on('createdwindow', function(data) {
          house = {
            name: data.doc.name,
            country: data.doc.country,
            location: data.doc.location,
            pollution: ' ',
            weather: {
                    currentweather: ' ',
                    temperature: 0,
                      },
            windows: data.doc.windows
          };
      $scope.house = house;
    })



    //onlogging in
































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



