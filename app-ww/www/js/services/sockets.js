app.factory('socket', ['socketFactory', function(socketFactory){
    var myIoSocket = io.connect('http://localhost:8080/#/inside/inside/chat');

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });

  return mySocket;
}]);