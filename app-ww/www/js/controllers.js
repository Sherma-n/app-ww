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
    users: [],
    country: '',
    location: '',
    id: ' ',
    pollution: ' ',
    weather: {
            currentweather: ' ',
            temperature: 28,
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

  // $scope.$watch(function() {
  //   return mySocket;
  // }, function(stuffs) {
  //   console.log('this is the socketFactory');
  //   console.log(stuffs);
  // })


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

  $scope.refreshing = function () {
    console.log('pressed');
    socket.emit('getData', {user: UserFactory.user});

    socket.on('showhouse', function (data) {
      $scope.house = data;
    });
    socket.on('showuser', function (data) {
      console.log('itsthishere');
      UserFactory.user = data.user;
      UserFactory.houses = data.houses;
      UserFactory.password = data.password;
      UserFactory.id = data.id;
    });
  };

    //Fakehardcode
    $scope.fakerefreshing = function (data) {
    console.log('pressed');
    socket.emit('getData', {user: "testing"});

    socket.on('showhouse', function (data) {
      $scope.house = data;
    });
    socket.on('showuser', function (data) {
      console.log('itsthishere');
      UserFactory.user = data.user;
      UserFactory.houses = data.houses;
      UserFactory.password = data.password;
      UserFactory.id = data.id;
    });
  };

  $scope.removeuser = function (user) {
    socket.emit('removinghouseuser', {
                                      remove: user,
                                      housename: $scope.house.name
    });
  }

  $scope.gohouseedit = function() {
    console.log("who");
    $state.go('inside.editHouse');
  };

  $scope.gohousehome = function(data) {
    $scope.houseit = data;
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
    $scope.refreshing();
    console.log('creating a windows');
    socket.emit('creatingwindow', {
                                  windowname: windows.name,
                                  houseid: $scope.house.id
                                  });
    if ($scope.house.user) {
      // user exists
      socket.emit('addingauser', {
          newuser: $scope.house.user,
          houseid: $scope.house.id
      });
    }
    if ($scope.house.name) {
      socket.emit('updatehousename', {
          newname: $scope.house.name,
          houseid: $scope.house.id
      })
    }
  };

  //saving a new house
  $scope.savehouse = function (data) {
    $state.go('inside.userhome');
    socket.emit('addedHouse', {
                                house: house.id,
                                user: UserFactory
                              }
    )};

    $scope.housereturn = function (data) {
      user = data;
    };



    $scope.updatehouses = function (data) {
      socket.on('gettinghouses', {user: UserFactory});
      $scope.house = data;
      console.log('house updated');
    }



    socket.on('houseAdded', function (data) {
      console.log('houseAdded');
    });

    //Fakehardcode
    socket.on('arefreshing', function (data) {
      $scope.fakerefreshing(data);
    });

    socket.on('loadhouses', function (data) {
      $scope.gohousehome(data);

      $scope.housereturn(data);
    });

    socket.on('loggedin', function (data){
      $scope.updatehouses(data);
    });

    socket.on('createdwindow', function(data) {
      $scope.updatehouses(data);
      $scope.refreshing();
    });




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



