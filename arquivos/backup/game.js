/*!
* Nome: Game Puzzle
* Autor: Alex Silva
* Versao: 1.0
* Data de Inicio: 28/10/2014
* Data de conclusao: indeterminado
*/
$(document).ready(function(){
    var destaque, pos, tempo, gerador, pecaMov, movtext, movimen, quantLinhas, quantColunas, num = [], contador, alt = [];
    
    function iniciarJogo(){
        var nivel = parseInt($('#dificuldade').val());
        quantLinhas = 3 + nivel; //Quantidade de linhas
        quantColunas = 3 + nivel; //Quantidade de colunas
        movimen = 0;
        
        /********************************************
        * RETORNA VALORES DO BLOCO OPCOES PARA PADRAO
        ********************************************/
        $('#container, #histmovimentos').html('');
        $('#tempo').html('<span id="horas">00:00:00</span><span id="milisegundo">:00</span>');
        $('#movimentos').text(movimen);
        
        /**************************************************
        * CRIA ARRAYS E ENUMERA DE FORMA ORDENADA A POSICAO
        **************************************************/
        contador = 0;
        for(var linha = 0; linha < quantLinhas; linha++){
            $('#container').append('<div id="' + linha + '_linha" class="linha"></div>');
            num[linha] = [];
            for(var coluna = 0; coluna < quantColunas; coluna++){
                num[linha][coluna] = [];
                num[linha][coluna][4] = contador += 1;
                $('#container .linha').eq(linha).append('<div class="' + contador + ' box"><div class="' + coluna + '_linha innerbox">' + contador + '</div></div>');
            }
        }
        
        /***************************************
        * ADICIONA A CLASSE BURACO NO ULTIMO BOX
        ***************************************/
        $('#container .linha').eq(quantLinhas - 1).children().eq(quantColunas - 1).addClass('buraco');
        
        /************************************
        * LOOP NUMERADOR DE POSICOES DE PECAS
        ************************************/
        for(var linha = 0; linha < quantLinhas; linha++){
            for(var coluna = 0; coluna < quantColunas; coluna++){
                for(var i = 0; i <= 3; i++){ //Zerar todas as posicoes
                    num[linha][coluna][i] = 0;
                }
                if(linha != quantLinhas - 1){ //Posicao up
                    num[linha][coluna][0] = num[linha + 1][coluna][4];
                }
                if(coluna != 0){ //Posicao right
                    num[linha][coluna][1] = num[linha][coluna - 1][4];
                }
                if(linha != 0){ //Posicao down
                    num[linha][coluna][2] = num[linha - 1][coluna][4];
                }
                if(coluna != quantColunas - 1){ //Posicao left
                    num[linha][coluna][3] = num[linha][coluna + 1][4];
                }
            }
        }
        
        /*******************************************
        * ARRAY DE ARMAZENAGEM DE POSICOES DOS BOXES
        *******************************************/
        for(var i = 0; i < contador; i++){
            alt[i] = i + 1;
        }
        
        /**********************
        * LOOPS DO EMBARALHADOR
        **********************/
        for (var i = 0; i < (contador * contador); i++){
            geradorAleat();
        }
        while(alt[contador - 1] != contador){
            geradorAleat();
        }
        
        /****************************************
        * MOVIMENTA AS PECAS COM O CLICK DO MOUSE
        ****************************************/
        $('div.box').click(function(){
            destaque = $('div.buraco').attr('class').split(' ')[0];
            var linha = parseInt($('.' + destaque).parent().attr('id').split('_')[0]);
            var coluna = parseInt($('.' + destaque).children().attr('class').split('_')[0]);
            var clicado = $(this).attr('class').split(' ')[0];
            
            for(var i = 0; i < 4; i++){
                if(num[linha][coluna][i] == clicado){
                    switch (i) {
                        case 0:
                            armazenar(0, false);
                            break;
                        case 1:
                            armazenar(1, false);
                            break;
                        case 2:
                            armazenar(2, false);
                            break;
                        case 3:
                            armazenar(3, false);
                            break;
                    }
                }
            }
        });
        
        /****************************
        * OCULTA JANELA INICIA O JOGO
        ****************************/
        $('#inicio').hide();
        $('#game').show();
        $('#music').get(0).play();
    }
    
    /***************************************************
    * FUNCAO QUE INCLUI ZERO NOS NUMEROS MENORES QUE DEZ
    ***************************************************/
    function checkTime(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    
    /*****************************************
    * FUNCAO DE CRONOMETRAGEM DE TEMPO DO JOGO
    *****************************************/
    function temporizador(){
        var ms = 0, s = 0, m = 0, h = 0;
        tempoSet = setInterval(function(){
            if(ms == 60){ s++; ms = 0; }
            if(s == 60){ m++; s = 0; }
            if(m == 60){ h++; m = 0; }
            $('#horas').text(checkTime(h) + ":" + checkTime(m) + ":" + checkTime(s));
            $('#milisegundo').text(":" + checkTime(ms));
            ms += 1;
        },1000/60);
    }
    
    /**********************
    * VERIFICAR PECA MOVIDA
    **********************/
    function armazenar(valor, ger){
        destaque = $('div.buraco').attr('class').split(' ')[0];
        var linha = parseInt($('.' + destaque).parent().attr('id').split('_')[0]);
        var coluna = parseInt($('.' + destaque).children().attr('class').split('_')[0]);
        pecaMov = num[linha][coluna][valor];
        pos = num[linha][coluna][4];
        
        switch(valor){
            case 0:
                movtext = '- Cima';
                break;
            case 1:
                movtext = '- Direita';
                break;
            case 2:
                movtext = '- Baixo';
                break;
            case 3:
                movtext = '- Esquerda';
                break;
        }
        if(pecaMov != 0){ alterarVal(ger); }
    }
    
    /***************
    * ALTERA VALORES
    ***************/    
    function alterarVal(gerador){
        var textoMov = $('.' + pecaMov).children().text();
        var textoBurac = $('.' + destaque).children().text();
        $('.' + destaque).removeClass('buraco').children().text(textoMov);
        $('.' + pecaMov).addClass('buraco').children().text(textoBurac);
        var altMov = alt[pecaMov - 1];
        var altDest = alt[pos - 1];
        alt[pos - 1] = altMov;
        alt[pecaMov - 1] = altDest;
        
        if(gerador == false){ acaoDoUsuario(); }
    }
    
    /*******************************************
    * FUNCAO EXECULTADA SO COM A ACAO DO USUARIO
    *******************************************/
    function acaoDoUsuario(){
        $('#movimentos').text(movimen += 1);
        $("#histmovimentos").append('<span>' + movtext + '</span><br />').scrollTop($("#histmovimentos")[0].scrollHeight);        
        $('#plim').each(function(){
            this.pause();
            this.currentTime = 0;
            this.play();
        });        
        if(tempo != true){
            tempo = true;
            temporizador();
        }
        if(alt[contador - 1] == contador){
            var cont = 0;
            for(var i = 0; i < contador; i++) {
                if(alt[i] == (i + 1)){
                    cont += 1;
                    if(cont == contador){
                        fimDeJogo();
                    }
                }
            }
        }
    }
    
    /************
    * FIM DO JOGO
    ************/
    function fimDeJogo(){
        $('#music').each(function(){
            this.pause();
            this.currentTime = 0;
        });
        clearInterval(tempoSet);
        tempo = undefined;
        
        $('#fim').get(0).play();
        $('#container div.buraco').removeClass('buraco');
        $('#container, h1').hide(700);
        $('#info1').css('float', 'left').animate({width: '130px'},700);
        $('#info2').css('float', 'right').animate({width: '130px'},700);
        $('#histmovimentos').animate({height: '78px'},700).scrollTop(5);
        $('#opcoes').animate({width: '276px', height: '215px', right: '200px', marginTop: '66px'},700);
        $('#opcoes button, #venceu').show(700);
    }
    
    /*********************************
    * FUNCAO DE EMBARALHAMENTO DE JOGO
    *********************************/
    function geradorAleat(){
        var randomico = Math.floor(Math.random() * 4);
        switch (randomico) {
            case 0:
                armazenar(0, true);
                break;
            case 1:
                armazenar(1, true);
                break;
            case 2:
                armazenar(2, true);
                break;
            case 3:
                armazenar(3, true);
                break;
        }
    }
    
    /********************
    * INICIA UM NOVO JOGO
    ********************/
    $('#play').click(function(){
        iniciarJogo();
    });
    
    /*****************************************************************
    * OCULTA O BOX E ABRE OUTRO PARA SELECAO DE NIVEL E INICIO DE JOGO
    *****************************************************************/
    $('#opcoes button').click(function(){
        $('#info1, #info2, #histmovimentos, #opcoes').attr('style', '');
        $('#venceu, #opcoes button, #game').hide();
        $('#container, h1, #inicio').show();
    });
    
    /****************************************************
    * MOVIMENTA AS PECAS DE ACORDO COM A PECA PRESSIONADA
    ****************************************************/
    $('body').keydown(function(e){
        switch (e.keyCode) {
            case 38:
                armazenar(0, false);
                break;
            case 39:
                armazenar(1, false);
                break;
            case 40:
                armazenar(2, false);
                break;
            case 37:
                armazenar(3, false);
                break;
        }
    });
});