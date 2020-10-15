var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);


app.use('/js',express.static(__dirname + '/js'));
app.use('/assets',express.static(__dirname + '/assets'));
app.use('/json',express.static(__dirname + '/json'));

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});



server.listen(process.env.PORT || 5050,function(){
    console.log('Listening on '+server.address().port);
});

server.lastPlayderID = 0; // Acompanhe o último id atribuído a um novo jogador

io.on('connection',function(socket){

console.log('Socket conectado ID:'+ socket.id);

//chamado pelo Client
    socket.on('newplayer',function(){
        //criando o jogador
        socket.player = {
            id: server.lastPlayderID++,
            x: randomInt(5150,5200),
            y: randomInt(2084,2085),
            socketID: socket.id//randomInt(100,400)
        };

        function getAllPlayers(){
            var players = [];
            Object.keys(io.sockets.connected).forEach(function(socketID){
                console.log("Pegando todos user: "+socketID);
                var player = io.sockets.connected[socketID].player;
                if(player) 
                players.push(player);
            });
            return players;
        }
        
        
        socket.emit('allplayers',getAllPlayers());//enviar para o novo jogador a lista de jogadores já conectados
        socket.broadcast.emit('lastplayer',socket.player);
        
        socket.on('Move',function(data){
           // console.log("Movendo: X="+data.x+" e Y="+data.y)
            socket.player.x += data.x;
            socket.player.y += data.y;
            io.emit('move',socket.player,data.x,data.y);
        });

        socket.on('disconnect',function(){
            io.emit('remove',socket.player.id);
        });
    });


});



function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
