var
    gameSettings = {
        maxTime: 5,
        checkInterval: 50,
        triesToWin: 20,
        mode: '' // math or binary
    },
    
    gameState = {
        correctButton: -1,
        timeLeft  : -1,
        triesDone : 0,
        gameTimer : null,
        isRunning : false
    };


var
    binaryOperators = ['and', 'or', /*'not',*/ 'xor'],
    BINARY_MAX      = 256;

var
    mathOperators = ['+', '-', /*'/',*/ '*'],
    MATH_MAX      = 100;


function gaem_init()
{
    $(document).keydown(function(e)
    {       
        switch (e.keyCode)
        {
            
            case 37 : // left
                    e.preventDefault();
                    game_checkTask(1);
                    return false;
                break;

            case 39 : // right
                    e.preventDefault();
                    game_checkTask(2);
                    return false;
                break;
        }
    }); 

    pixi_init();
}

function dec2bin (yaebal)
{
    yaebal = (yaebal > 0) ? yaebal : 0;

    var tx = (yaebal >>> 0).toString(2),
        lendiff = 8 - tx.length;

    if (lendiff > 0)
    {
        for (i = 0; i < lendiff; i++)
            tx = '0' + tx;
    }

    return tx;
}

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function doBinOperation (idx, op1, op2)
{
    var operation = binaryOperators[idx];

    switch (operation)
    {
        case 'and' : return op1 & op2; break;
        case 'or'  : return op1 | op2; break;
        // case 'not' : return ~op1; break; // NOT is unary
        case 'xor' : return op1 ^ op2; break;
        default : alert ('AAWWW SHIT NIGGA, ITS YOUR CHANCE, OH LOL!');
    }
}

function doMathOperation (idx, op1, op2)
{
    var operation = mathOperators[idx];

    switch (operation)
    {
        case '+' : return op1 + op2; break;
        case '-'  : return op1 - op2; break;
        // case 'not' : return ~op1; break; // NOT is unary
        case '*' : return op1 * op2; break;
        default : alert ('AAWWW SHIT NIGGA, ITS YOUR CHANCE, OH LOL!');
    }
}


function game_initTimer()
{
    clearInterval(gameState.gameTimer);

    gameState.timeLeft = gameSettings.maxTime * 1000; // ms
    gameState.gameTimer = setInterval(game_timerTick, gameSettings.checkInterval);
}

function game_timerTick()
{
    gameState.timeLeft -= gameSettings.checkInterval;
    setGauge(gameSettings.maxTime*1000, gameState.timeLeft);
    $('#timer-num').html(gameState.timeLeft);

    if (gameState.timeLeft <= 0)
        game_gameLose();
}

function game_generateTask()
{
    if (gameSettings.mode == 'binary')
    {
        var operand1 = rnd(1, BINARY_MAX),
            operand2 = rnd(1, BINARY_MAX);

        var operationIndex = rnd(0, binaryOperators.length),
            incorrectValue = rnd(1, BINARY_MAX),
            correctValue = doBinOperation(operationIndex, operand1, operand2);

        while (correctValue == incorrectValue) // prevents the same variants
        {
            incorrectValue = rnd(1, BINARY_MAX);
        }

        $('#operand-1').html(dec2bin(operand1));
        $('#operand-2').html(dec2bin(operand2));
        $('#operator').html(binaryOperators[operationIndex]);

        var correctBtn = rnd (1, 3);

        gameState.correctButton = correctBtn;
        if (correctBtn == 1)
        {
            $('#game-variant-2').html(dec2bin(incorrectValue));
            $('#game-variant-1').html(dec2bin(correctValue));
        }
        else
        {
            $('#game-variant-1').html(dec2bin(incorrectValue));
            $('#game-variant-2').html(dec2bin(correctValue));
        }
    }
        else
    if (gameSettings.mode == 'math')
    {
        var operand1 = rnd(1, MATH_MAX),
            operand2 = rnd(1, MATH_MAX);

        var operationIndex = rnd(0, mathOperators.length);

        if (mathOperators[operationIndex] == '-')
        {
            if (operand1 < operand2)
            {
                var tmp = operand2;
                operand2 = operand1;
                operand1 = tmp;
            }
        }

        var correctValue = doMathOperation(operationIndex, operand1, operand2),
            correctValLen = Math.log(correctValue) * Math.LOG10E + 1 | 0,
            incorrectValue = rnd(Math.pow(10, correctValLen-1), Math.pow(10, correctValLen));

        while (correctValue == incorrectValue) // prevents the same variants
        {
            incorrectValue = rnd(Math.pow(10, correctValLen-1), Math.pow(10, correctValLen));
        }

        $('#operand-1').html(operand1);
        $('#operand-2').html(operand2);
        $('#operator').html(mathOperators[operationIndex]);

        var correctBtn = rnd (1, 3);

        gameState.correctButton = correctBtn;
        if (correctBtn == 1)
        {
            $('#game-variant-2').html(incorrectValue);
            $('#game-variant-1').html(correctValue);
        }
        else
        {
            $('#game-variant-1').html(incorrectValue);
            $('#game-variant-2').html(correctValue);
        }
    }

    game_initTimer();
}

function game_checkTask(button)
{
    if (!gameState.isRunning)
        return;

    playSound(SND_PRESS);

    if (button == gameState.correctButton)
    {
        gameState.triesDone++;
        if (gameState.triesDone >= gameSettings.triesToWin)
            game_gameWin();
        else
            game_generateTask();
    }
    else
    {
        game_gameLose();
    }
}

function game_start(mode)
{
    // reset
    gameState = {
        correctButton: -1,
        timeLeft: -1,
        triesDone: 0,
        gameTimer: null,
        isRunning: true
    };

    gameSettings.mode = mode;

    stopSound(SND_WIN);
    stopSound(SND_FAIL);

    playSound(SND_PRESS);

    game_generateTask();
    madness_setState(true)
    switch_mode('game');

    radioPlay();
}

function game_gameWin()
{
    radioStop();

    gameState.isRunning = false;

    playSound(SND_WIN);

    var greeting = '';

    switch (gameSettings.mode)
    {
        case 'math' : greeting = 'OH SHIT, YOU DID IT!'; break;
        case 'binary' : greeting = 'You\'re the BINARY lord!'; break;
        default : greeting = 'How did you do this?';
    }

    $('#start-text').html(greeting);
    $('#startscreen').css({background:'rgba(2, 200, 2, 0.5)'});

    madness_setState(false);
    clearInterval(gameState.gameTimer);

    switch_mode('startscreen');
}

function game_gameLose()
{
    radioStop();

    gameState.isRunning = false;

    playSound(SND_FAIL);

    $('#start-text').html('HAH! GAYYYYY~');
    $('#startscreen').css({background:'rgba(200, 2, 2, 0.5)'});

    madness_setState(false);
    clearInterval(gameState.gameTimer);

    switch_mode('startscreen');
}

function setGauge(max, val, name)
{
    name = name || 'timer';

    var maxw = $('#'+name+'-gauge-handle').width();

    $('#'+name+'-gauge').width(Math.floor((maxw * val) / max));
}

function switch_mode (mode)
{
    switch (mode)
    {
        case 'loading' :
                $('#game').hide();
                $('#startscreen').hide();
                $('#loading').show();
            break;

        case 'startscreen' :
                $('#game').hide();
                $('#loading').hide();
                $('#startscreen').show();
            break;

        case 'game'  : 
                $('#loading').hide();
                $('#startscreen').hide();
                $('#game').show();
            break;
    }
}

$(document).ready(gaem_init);
