//Interface entre servidor e o jogo

var Client = {};
Client.socket = io.connect();

console.log("Socket: "+ Client.socket)

Client.askNewPlayer = function(){
    //chama o server para criar novo jogador
    Client.socket.emit('newplayer');
   
};


Client.sendMove = function(x,y){
  
    //console.log("Movendo para X:"+x+" e Y:"+y);
    Client.socket.emit('Move',{x:x,y:y});  

};

//recebe do servidor o emit com as informações e joga para o jogo os dados
Client.socket.on('newplayer',function(data){
    Game.addNewPlayer(data.id,data.x,data.y);
});

//recebe do servidor o emit com as informações e joga para o jogo os dados
Client.socket.on('lastplayer',function(data){
    Game.addLastPlayer(data.id,data.x,data.y);
});

Client.socket.on('selfplayer',function(data){
    console.log(data);
    Game.addNewPlayer(data.id,data.x,data.y);
});

Client.socket.on('allplayers',function(data){
   
    //atualiza todas as telas
    for(var i = 0; i < data.length; i++){
       console.log("Player:"+ data[i].id+" X: "+data[i].x+" Y:"+data[i].y)
        Game.addNewPlayer(data[i].id,data[i].x,data[i].y);
    }

    Client.socket.on('move',function(data,x,y){
        Game.movePlayer(data.id,x,y);
    });

    Client.socket.on('remove',function(id){
        console.log('Removendo no SOCKET')
        Game.removePlayer(id);
    });
});




