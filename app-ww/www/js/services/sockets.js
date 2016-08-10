app.factory('socket', ['socketFactory','API_ENDPOINT', 'AuthService', '$state', function(socketFactory, API_ENDPOINT, AuthService, $state){
  var myIoSocket = io.connect('http://localhost:8080/#/inside/inside/chat');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  })

  mySocket.on('connect', function () {
    console.log("connect")
  })

  mySocket.on('reconnect', function () {
    console.log("reconnect");
  })

  mySocket.on('disconnect', function () {
    console.log("disconnect");
  })

  return mySocket;
}]);

