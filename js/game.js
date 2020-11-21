var game = new Phaser.Game(1200, 600, Phaser.CANVAS, '', { preload: preload, create: create, update: update });

var OBJbutton = [], objPortas = [], objPerguntas = [], kill = [], Mensagem = [];
var cena, pranchetas, panfletos, barreiras, objetosInterativos, contatoAtual, Fase = 0, andar = true, spriteFase = Fase - 1, FasePerdeu = 7, acao, posicao = "R", operacao = 'Load';
var text;
var button;



function preload() {

}

function start() {
    game.load.audio('audio', ['audio/clipe_a_bela_e_a_fera.mp3']);

    $.getJSON("json/fase.json", function (data) {
        $.each(data, function (key, val) {
            objPortas.push(val);
        })
    });

    $.getJSON("json/perguntas.json", function (data) {
        $.each(data, function (key, val) {
            objPerguntas.push(val);
        })
    });

    cena = game.load.spritesheet('Cena1', 'img/Cenas1-2-3-4-5.png', 2401, 600);
    cena2 = game.load.spritesheet('Cena2', 'img/Cenas6-7-8-9-10.png', 2400, 600);
    game.load.image('MenuPrincipal', 'img/MenuPrincipal.png');
    game.load.image('BalãoFalaR', 'img/BalãoFalaR.png');
    game.load.image('BalãoFalaL', 'img/BalãoFalaL.png');
    game.load.image('MenuSobre', 'img/MenuSobre.png');
    game.load.image('MenuComoJogar', 'img/MenuComoJogar.png');
    game.load.image('cadeirante', 'img/cadeirante.png');
    game.load.image('Enfermeiro', 'img/Enfermeiro.png');
    game.load.image('Atendimento01', 'img/Atendimento01.png');
    game.load.image('Atendimento02', 'img/Atendimento02.png');
    game.load.image('Recepicionista01', 'img/Recepicionista01.png');
    game.load.image('Recepicionista02', 'img/Recepicionista02.png');
    game.load.image('btnComoJogar', 'img/BotãoComoJogar.png');
    game.load.image('btnJogar', 'img/btnJogar.png');
    game.load.image('Panfleto1', 'img/Panfleto1.png');
    game.load.image('PanfletoIco1', 'img/PanfletoIco1.png');
    game.load.image('Panfleto2', 'img/Panfleto2.png');
    game.load.image('PanfletoIco2', 'img/PanfletoIco2.png');
    game.load.image('btnSobre', 'img/btnSobre.png');
    game.load.image('BtnVoltarMenu', 'img/BtnVoltarMenu.png');
    game.load.image('Barreira', 'img/Barreira.png');
    game.load.image('porta', 'img/porta.png');
    game.load.image('prancheta', 'img/Prancheta.png');
    game.load.image('pranchetaView', 'img/PranchetaView.png');
    game.load.image('BotaoSair', 'img/BotaoSair.png');
    game.load.image('BotãoConfirmar', 'img/BotãoConfirmar.png');
    game.load.image('resposta', 'img/resposta.png');
    player = game.load.spritesheet('jogador', 'img/sprints.png', 155.8, 170);
    game.load.start();
}

function loadStart() {
    text.setText("Carregando ....");
}

function fileComplete(progress, cacheKey, success, totalLoaded, totalFiles) {
    text.setText("Arquivos Completos: " + progress + "% - " + totalLoaded + " de " + totalFiles);
}

function loadComplete() {
    text.setText("Carreamento Completo");
    game.stage.disableVisibilityChange = true;
    music = game.add.audio('audio', 0.2, true);
    music.play();
    operacao = "MenuPrincipal";
    create();
}


function isMobile()
{
	var userAgent = navigator.userAgent.toLowerCase();
	if( userAgent.search(/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i)!= -1 )
		return true;
}

function create() {

    switch (operacao) {

        case "jogo":
            game.physics.startSystem(Phaser.Physics.ARCADE);

            DesenharSala(Fase)

            game.world.setBounds(0, 0, 2403, 600);

            player = game.add.sprite(10, 340, 'jogador');

            game.physics.arcade.enable(player);
            player.animations.add('left', [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37, 38, 39], 20, true);
            player.animations.add('right', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 20, true);
            player.animations.add('up', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 20, true);
            player.animations.add('down', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19], 20, true);

            player.body.collideWorldBounds = true;

            player.body.bounce.y = 0.1;

            cursors = game.input.keyboard.createCursorKeys();
            game.camera.follow(player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);


            if (isMobile()){
                 game.add.button(20, 20, "btnComoJogar", function(){
                    player.body.velocity.x += 150;
                    player.animations.play('right');} 
                    , this);
                //game.add.button(1200, 20, "btnComoJogar", ClickBtnComoJoga, this);
            }

            break;

        case "MenuComoJogar":
            CenaMenu = game.add.sprite(0, 0, 'MenuComoJogar');
            btnVoltar = game.add.button(25, 35, "BtnVoltarMenu", ClickBtnVoltarMenu, this);
            kill.push(btnVoltar);
            break;

        case "MenuSobre":
            CenaMenu = game.add.sprite(0, 0, 'MenuSobre');
            btnVoltar = game.add.button(25, 35, "BtnVoltarMenu", ClickBtnVoltarMenu, this);
            kill.push(btnVoltar);
            break;

        case "Load":
            game.stage.backgroundColor = 'rgb(30, 30, 32)';

  
            game.load.onLoadStart.add(loadStart, this);
            game.load.onFileComplete.add(fileComplete, this);
            game.load.onLoadComplete.add(loadComplete, this);

            text = game.add.text(350, 300, 'Prestes a carregar o jogo', { fill: '#ffffff' });

            start();
            break;

        case "MenuPrincipal":
            CenaMenu = game.add.sprite(0, 0, 'MenuPrincipal');
            btnJogar = game.add.button(455.5, 210, "btnJogar", ClickBtnJogo, this);
            btnComoJogar = game.add.button(455.5, 330, "btnComoJogar", ClickBtnComoJoga, this);
            btnSobre = game.add.button(455.5, 450, "btnSobre", ClickBtnSobre, this);
            kill.push(btnComoJogar);
            kill.push(btnJogar);
            kill.push(btnSobre);
            break;

    }

}

function DesenharSala(faseAtual) {

    if (faseAtual <= 4) {
        spriteFase++;
        cena = game.add.sprite(0, 0, 'Cena1');
        cena.frame = spriteFase;
    } else if (faseAtual == 5) {
        spriteFase = 0;
        cena = game.add.sprite(0, 0, 'Cena2');
        cena.frame = faseAtual;
    } else if (faseAtual == 6) {
        spriteFase = 0;
        cena = game.add.sprite(0, 0, 'Cena2');
        cena.frame = 1;
    }
    else if (faseAtual == FasePerdeu) {
        spriteFase++;
        cena = game.add.sprite(0, 0, 'Cena2');
        cena.frame = 2;
    } else {
        alert("Fim de Jogo!")
    }

    if (faseAtual != 6 && faseAtual != FasePerdeu) {
        pranchetas = game.add.group();
        pranchetas.enableBody = true;
        var prancheta = pranchetas.create(objPortas[faseAtual].prancheta.x, objPortas[faseAtual].prancheta.y, 'prancheta');
        prancheta.body.immovable = true;
    }

    for (let position in objPortas[faseAtual].panfletos) {
        panfletos = game.add.group();
        panfletos.enableBody = true;
        var panfleto = panfletos.create(objPortas[faseAtual].panfletos[position].x, 340, objPortas[faseAtual].panfletos[position].id);
        panfleto.body.immovable = true;
        panfleto.panfleto = objPortas[faseAtual].panfletos[position].grande;
    }

    portas = game.add.group();
    portas.enableBody = true;

    for (let position in objPortas[faseAtual].portas) {
        var porta = portas.create(objPortas[faseAtual].portas[position].x, objPortas[faseAtual].portas[position].y, 'porta');
        porta.body.immovable = true;
        porta.resposta = objPortas[faseAtual].portas[position].resposta
        if (faseAtual == 6)
            porta.scale.setTo(1, 0.8);

    }

    for (let position in objPortas[faseAtual].barreira) {
        barreiras = game.add.group();
        barreiras.enableBody = true;
        var barreira = barreiras.create(objPortas[faseAtual].barreira[position].x, 340, "Barreira");
        barreira.body.immovable = true;

    }

    for (let position in objPortas[faseAtual].objetosInterativos) {

        objetosInterativos = game.add.group();
        objetosInterativos.enableBody = true;
        var objetosInterativo = objetosInterativos.create(objPortas[faseAtual].objetosInterativos[position].x, objPortas[faseAtual].objetosInterativos[position].y, objPortas[faseAtual].objetosInterativos[position].imagem);
        objetosInterativo.body.immovable = true;
        objetosInterativo.mensagem = objPortas[faseAtual].objetosInterativos[position].mensagem;
        objetosInterativo.balaoX = objPortas[faseAtual].objetosInterativos[position].balaoX;
        objetosInterativo.balaoY = objPortas[faseAtual].objetosInterativos[position].balaoY;
        objetosInterativo.mensagemVisivel = objPortas[faseAtual].objetosInterativos[position].mensagemVisivel;
        objetosInterativo.balao = objPortas[faseAtual].objetosInterativos[position].balao;
        objetosInterativo.id = position;

    }

    player.x = objPortas[faseAtual].spawn.x;
}


function respondendo(player, porta) {

    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (this.spaceKey.isDown) {
        if (objPerguntas[Fase].respostaCorreta === porta.resposta) {
            lendoResposta(player, porta, true);
        }
        else {
            lendoResposta(player, porta, false);
        }

    }
}

function spawnPlayer(player, porta) {
    player.position.x = porta.x;
}

function lendoPrancheta(player, prancheta) {
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    if (this.spaceKey.isDown) {
        var posicaoX;
        andar = false;
        let texto;
        if (player.x > 500)
            posicaoX = player.x;
        else
            posicaoX = 500;
        var pranchetaGrande = game.add.sprite(posicaoX - 500, 0, 'pranchetaView');
        var style = { font: "20px ", fill: "black" };
        texto = objPerguntas[Fase].enunciado;
        texto = game.add.text(posicaoX - 430, 190, texto, style);
        button = game.add.button(posicaoX - 410, 500, "BotaoSair", ClickSair, this);
        kill.push(texto);
        kill.push(pranchetaGrande);
        kill.push(button);
    }
}


function lendoPanfletos(player, panfleto) {
    this.spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    if (this.spaceKey.isDown) {
        let posicaoX;
        andar = false;
        if (player.x > 500)
            posicaoX = player.x;
        else
            posicaoX = 500;

        var panfletoGrande = game.add.sprite(posicaoX - 500, 0, panfleto.panfleto);
        //  Add and update the scor
        button = game.add.button(posicaoX - (panfletoGrande.width / 2), panfletoGrande.height, "BotaoSair", ClickSair, this);

        kill.push(panfletoGrande);
        kill.push(button);

    }
}

function ClickSair() {
    andar = true;
    kill.forEach(function (item) { item.kill(); });
}
function ClickBtnJogo() {
    operacao = "jogo";
    kill.forEach(function (item) { item.kill(); });
    create();
}
function ClickBtnSobre() {
    operacao = "MenuSobre";
    kill.forEach(function (item) { item.kill(); });
    create();
}

function ClickBtnComoJoga() {
    operacao = "MenuComoJogar";
    kill.forEach(function (item) { item.kill(); });
    create();
}

function ClickBtnVoltarMenu() {
    operacao = "MenuPrincipal";
    kill.forEach(function (item) { item.kill(); });
    create();
}

function lendoResposta(player, papel, auth) {
    var posicaoX;
    var respondido = '';

    if (papel.resposta === "A")
        respondido = 0;
    else if (papel.resposta === "B")
        respondido = 1;
    else if (papel.resposta === "C")
        respondido = 2;

    if (player.x > 1900)
        posicaoX = 1900;
    else if (player.x < 500)
        posicaoX = 500;
    else
        posicaoX = player.x;
    andar = false;
    let texto, assunto;
    var pranchetaGrande = game.add.sprite(posicaoX - 300, 100, 'resposta');
    var style = { font: "21px ", fill: "black" };
    if (Fase != FasePerdeu) {
        assunto = game.add.text(posicaoX - 260, 150, "Resposta para este caso:", style);
        kill.push(assunto);
    }
    texto = objPerguntas[Fase].respostas[respondido];
    text = game.add.text(posicaoX - 250, 195, texto, style);
    buttonSair = game.add.button(posicaoX - 200, 400, "BotaoSair", ClickSair, this);

    buttonConfirmar = game.add.button(posicaoX, 400, "BotãoConfirmar", function () {
        if ((Fase == FasePerdeu || Fase == 6) && papel.resposta == objPerguntas[Fase].respostaCorreta) {
            game.world.remove(portas);
            barreiras = [];
            objetosInterativos = [];
            panfletos = [];
            kill = [];
            Mensagem = [];
            player.x = 0;
            player.y = 0;
            Fase = 0;
            spriteFase = Fase - 1;
            andar = true;
            game.world.remove(cena);
            operacao = 'MenuPrincipal';
            create();

        } else if (papel.resposta == objPerguntas[Fase].respostaCorreta) {
            game.world.remove(portas);
            barreiras = [];
            objetosInterativos = [];
            panfletos = [];
            game.world.remove(cena);
            DesenharSala(++Fase);
            andar = true;
            kill.forEach(function (item) { item.kill(); });

        } else {
            Fase = FasePerdeu;
            game.world.remove(portas);
            barreiras = [];
            objetosInterativos = [];
            pranchetas = [];
            panfletos = [];
            game.world.remove(cena);
            DesenharSala(FasePerdeu);
            andar = true;
            kill.forEach(function (item) { item.kill(); });
        }
    }, this);

    kill.push(text);
    kill.push(pranchetaGrande);
    kill.push(buttonSair);
    kill.push(buttonConfirmar);
}

function acaoObjeto(player, objeto) {

    if (objeto.mensagemVisivel) {
        var Balao = game.add.sprite(objeto.balaoX, objeto.balaoY, objeto.balao);
        if (Fase == FasePerdeu)
            Balao.scale.setTo(1.5, 1.5);
        if (Fase == 6)
            Balao.scale.setTo(1.7, 1.5);
        var style = { font: "21px ", fill: "black" };
        text = game.add.text(objeto.balaoX + 25, objeto.balaoY + 30, objeto.mensagem, style);
        Mensagem.push(Balao);
        Mensagem.push(text);
        objeto.mensagemVisivel = false
        contatoAtual = true;
    }

}


function jogo() {
    let velocidade = 250;
    if (andar)
        game.world.bringToTop(player);

    game.physics.arcade.collide(player, barreiras);
    game.physics.arcade.overlap(player, portas, respondendo, null, this);
    game.physics.arcade.overlap(player, pranchetas, lendoPrancheta, null, this);
    game.physics.arcade.overlap(player, panfletos, lendoPanfletos, null, this);
    var Contato = game.physics.arcade.overlap(player, objetosInterativos, acaoObjeto, null, this);

    if (!Contato && contatoAtual) {

        Mensagem.forEach(function (item) { item.kill(); });

    }

    if (cursors.left.isDown && andar) {

        player.body.velocity.x = -velocidade;
        player.animations.play('left');
        posicao = "L"

    }
    else if (cursors.right.isDown && andar) {

        player.body.velocity.x = velocidade;
        player.animations.play('right');
        posicao = "R"
    }
    else if ((cursors.up.isDown) && player.y >= 342.5 && andar) {

        player.body.velocity.y = -velocidade;
        player.animations.play('up');


    } else if (cursors.down.isDown && andar) {

        player.body.velocity.y = +velocidade;
        player.animations.play('down');
    }
    else {
        if (posicao == 'R') {
            player.frame = 10;
        } else if (posicao == 'L') {
            player.frame = 29;
        }
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

    }

    if (player.y < 342)
        player.y = 342

}

function update() {

    switch (operacao) {

        case "jogo":
            jogo();
            break;

        case "MenuPrincipal":

            break;

        case "MenuSobre":

            break;
        case "Load":

            break

    }

}




