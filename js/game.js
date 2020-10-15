
var Game = {};

Game.init = function () {
    game.stage.disableVisibilityChange = true;
};

var OBJbutton = [], OBJsalas = [], lastMovement = [];
var chaoMapa,corredorMapa;
var id = 0;
Game.playerMap = {};
var IdPlayer;
var sala = 0;
var chao,corredor;

Game.preload = function () {

    function json() {

        $.getJSON("json/buttons.json", function (data) {
            $.each(data, function (key, val) {
                OBJbutton.push(val);
            })
        });


        $.getJSON("json/sala.json", function (data) {
            $.each(data, function (key, val) {
                OBJsalas.push(val);
            })
        });


    }


    console.log(game.world)

    game.load.image('sala1', 'assets/salas/sala1.png');
    game.load.image('sala2_3_7_8_9_10_11_12', 'assets/salas/sala2_3_7_8_9_10_11_12.png');
    game.load.image('sala5', 'assets/salas/sala5.png');
    game.load.image('sala6', 'assets/salas/sala6.png');
    game.load.image('chao', 'assets/chao.jpg');
    game.load.image('chao2', 'assets/chao2.jpg');
    game.load.image('ground', 'assets/parede.png');
    game.load.image('prancheta', 'assets/prancheta.png');
    game.load.image('mesa', 'assets/mesa.jpg');
    game.load.spritesheet('jogador', 'assets/sprints.png', 80, 84);
    game.load.image('pranchetaGrande', 'assets/prancheta_grande.png');
    game.load.spritesheet('button', 'assets/button.png');
    game.load.image('espaco', 'assets/espaco.png');
    game.load.image('CV', 'assets/salas/corredorV.jpg');
    game.load.image('CH', 'assets/salas/corredorH.jpg');
    json();

}



Game.create = function () {
    //  DrawSalas(sala);

    //criando mapa
    game.world.setBounds(0, 0, 6000, 6000);

    //criando sistema de fisica
    game.physics.startSystem(Phaser.Physics.arcade);

game.add.sprite(0, 0, 'espaco');

    //criando jogador
    Client.askNewPlayer()

    cursors = game.input.keyboard.createCursorKeys();

    for(var sala=0;sala<12;sala++)
    DrawSalas(sala);
}

Game.addNewPlayer = function (id, x, y) {
    console.log("ID:" + id);
    Game.playerMap[id] = game.add.sprite(x, y, 'jogador');
    game.physics.arcade.enable(Game.playerMap[id]);
    Game.playerMap[id].animations.add('left', [4, 5], 8, true);
    Game.playerMap[id].animations.add('right', [2, 3], 8, true);
    Game.playerMap[id].animations.add('up', [0, 1], 8, true);
    Game.playerMap[id].animations.add('down', [6, 7], 8, true);
    console.log("Desenhando: "+id);
    //Aqui está atribuindo a camera para o ultimo player, não quero isso
    game.camera.follow(Game.playerMap[id]);
    console.log("New : " + Game.playerMap[id]);
    IdPlayer = { id: id, jogador: (Game.playerMap[id]) };
   
};


Game.addLastPlayer = function (id, x, y) {
    console.log("ID:" + id);
    Game.playerMap[id] = game.add.sprite(x, y, 'jogador');
    game.physics.arcade.enable(Game.playerMap[id]);
    Game.playerMap[id].animations.add('left', [4, 5], 8, true);
    Game.playerMap[id].animations.add('right', [2, 3], 8, true);
    Game.playerMap[id].animations.add('up', [0, 1], 8, true);
    Game.playerMap[id].animations.add('down', [6, 7], 8, true);
    console.log("Desenhando: "+id);
    //Aqui está atribuindo a camera para o ultimo player, não quero isso
    //game.camera.follow(Game.playerMap[id]);
    console.log("New : " + Game.playerMap[id]);
    IdPlayer = { id: id, jogador: (Game.playerMap[id]) };
   
};


Game.movePlayer = function (id, x, y) {
    if(Game.playerMap[id]){
    if (x < 0) {
        Game.playerMap[id].x += x;
        Game.playerMap[id].animations.play('left');
        lastMovement[id] = "left";
    }
    else if (x > 0) {
        Game.playerMap[id].x += x;
        Game.playerMap[id].animations.play('right');
        lastMovement[id] = "right";
    }
    else if (y < 0) {
        Game.playerMap[id].y += y;
        Game.playerMap[id].animations.play('up');
        lastMovement[id] = "stop-up";
    } else if (y > 0) {
        Game.playerMap[id].y += y;
        lastMovement[id] = "stop-down";
        Game.playerMap[id].animations.play('down');
    }
    else {
        Game.playerMap[id].animations.stop();
     // console.log(id);
        if (lastMovement[id] == "stop-up")
            Game.playerMap[id].frame = 8;
        else if (lastMovement[id] == "stop-down")
            Game.playerMap[id].frame = 9;

    }
    }
};





Game.removePlayer = function (id) {
    if(Game.playerMap[id]){
    Game.playerMap[id].destroy();
    delete Game.playerMap[id];
    }
};

function DrawCorredores(salaAtual) {
    try {
        console.log("Corredor:"+salaAtual)
        corredor = game.add.group();
        corredor.enableBody = true;
        corredorMapa = corredor.create(salaAtual.x, salaAtual.y,salaAtual.type);
        corredorMapa.body.immovable = true;
        
    } catch (e) {
        console.log("Erro Corredor " + e.message);
    }
}

function DrawSalas(sala) {
    try {
        console.log(OBJsalas[sala])
        chao = game.add.group();
        chao.enableBody = true;
        chaoMapa = chao.create(OBJsalas[sala].x, OBJsalas[sala].y, OBJsalas[sala].img);
        chaoMapa.body.immovable = true;
        for(var cor in OBJsalas[sala].corredor) 
        DrawCorredores(OBJsalas[sala].corredor[cor])
    } catch (e) {
        console.log("Acabou as Salas " + e.message);
    }
}

function liberaProximaSala(a, b) {
    //  if(b.local==sala+1){
    DrawSalas(++sala);
    if (sala == 5 || sala == 9)
        DrawSalas(++sala);
    // }

    //  
}



Game.update = function () {
    //deixando sempre jogador no top
    let velocidade=10
    if (IdPlayer) {
        game.world.bringToTop(IdPlayer.jogador);
        //fisica em contato com a sala
       // game.physics.arcade.overlap(IdPlayer.jogador, chao, liberaProximaSala, null, this);
        //

        if (cursors.left.isDown) {

            //console.log("PLayer: "+IdPlayer.game.id);
            //  Move to the left
            // console.log("Antes: \n X:"+   Game.playerMap[IdPlayer].x + " e Y:" +Game.playerMap[IdPlayer].y)
            Client.sendMove(-velocidade, 0);

        }
        else if (cursors.right.isDown) {
            //  console.log("Tentando andar R");
            //  Move to the left
            Client.sendMove(velocidade, 0);
        }
        else if (cursors.up.isDown) {
            //    console.log("Tentando andar UP");
            //  Move to the right
            Client.sendMove(0, -velocidade);


        } else if (cursors.down.isDown) {
            //   console.log("Tentando andar D");
            //  Move to the right
            Client.sendMove(0, velocidade);
        }
        else {
            Client.sendMove(0, 0);
        }
    }

}

function render() {
    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}