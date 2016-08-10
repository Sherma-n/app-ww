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

  // backup
  $scope.destroySession = function() {
    AuthService.logout();
  };

    $scope.gohousedetails = function() {
    console.log("what");
    $state.go('inside.details');
  };

  $scope.refreshing = function () {
    console.log('pressed stuffs');
    console.log(UserFactory.user);
    socket.emit('getData', {user: UserFactory.user});

    socket.on('showhouse', function (data) {
      $scope.house = data;
    });
    socket.on('showuser', function (data) {
      console.log('itsthishere');
      UserFactory.user     = data.user;
      UserFactory.houses   = data.houses;
      UserFactory.password = data.password;
      UserFactory.id       = data.id;
    });
  };

    //Fakehardcode
  $scope.fakerefreshing = function (data) {
    console.log('pressed');
    console.log(data);
    console.log(UserFactory.user);
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
      username: UserFactory.user,
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
          houseid: $scope.house.id,
          username: UserFactory.user
      })
    }
  };

  //saving a new house
  $scope.savehouse = function (data) {
    $state.go('inside.userhome');
    socket.emit('addedHouse', {
        house: house.id,
        user: UserFactory
    })
  };

  $scope.housereturn = function (data) {
    user = data;
  };

  // Socket Events
  $scope.updatehouses = function (data) {
    socket.on('gettinghouses', {user: UserFactory});
    $scope.house = data;
    console.log('house updated');
  }

  socket.on('houseAdded', function (data) {
    console.log('houseAdded');
  });

  // //Fakehardcode
  // socket.on('arefreshing', function (data) {
  //   $scope.fakerefreshing(data);
  // });

  socket.on('loadhouses', function (data) {
    $scope.gohousehome(data);

    $scope.housereturn(data);
  });

  socket.on('loggedinuser', function (data) {
    console.log('right before logged in user');
    console.log(data);
      UserFactory.user = data.name;
      UserFactory.houses = data.houses;
      UserFactory.id = data.id;
  });

  socket.on('loggedin', function (data){
    // console.log('on logged in')
    // console.log(data);
    $scope.updatehouses(data);
  });

  socket.on('createdwindow', function(data) {
    $scope.updatehouses(data);
    $scope.fakrefreshing();
  });