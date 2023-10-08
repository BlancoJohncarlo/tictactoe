var board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

var currentPlayer = 'X';
var gameOver = false;
var vsAI = false; 
var vsPlayer = false; 

var vsAIButton = document.getElementById('vs-ai-button');
var vsPlayerButton = document.getElementById('vs-player-button');
var startButton = document.getElementById('start-button');
var gameContainer = document.getElementById('game-container');
var boardContainer = document.getElementById('board-container');
var optionMessage = document.getElementById('option-message');

vsAIButton.addEventListener('click', function() {
    vsAI = true;
    vsPlayer = false;
    vsAIButton.classList.add('clicked');
    vsPlayerButton.classList.remove('clicked');
    optionMessage.classList.add('hidden');
});

vsPlayerButton.addEventListener('click', function() {
    vsAI = false;
    vsPlayer = true;
    vsPlayerButton.classList.add('clicked');
    vsAIButton.classList.remove('clicked');
    optionMessage.classList.add('hidden');
});

function startGame() {
    if (!vsAI && !vsPlayer) {
        optionMessage.classList.remove('hidden');
    } else {
        optionMessage.classList.add('hidden');
        gameContainer.style.display = 'none';
        boardContainer.style.display = 'block';
        resetBoard();
    }
}


function resetBoard() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;

    var cells = document.getElementsByClassName('cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
    }

    document.getElementById('result').innerText = '';

    if (currentPlayer === 'O' && vsAI && !gameOver) {
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(row, col) {
    if (gameOver || board[row][col] !== '') return;

    board[row][col] = currentPlayer;
    document.getElementById('board').children[row * 3 + col].innerText = currentPlayer;

    if (checkWinner(currentPlayer)) {
        gameOver = true;
        document.getElementById('result').innerText = currentPlayer + " wins!";
    } else if (isBoardFull()) {
        gameOver = true;
        document.getElementById('result').innerText = "It's a draw!";
    } else {
        currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
        if (currentPlayer === 'O' && vsAI && !gameOver) {
            setTimeout(makeAIMove, 500);
        }
    }
}

function checkWinner(player) {
    // Check rows, columns, and diagonals for winning positions
    for (var i = 0; i < 3; i++) {
        if (board[i][0] === player && board[i][1] === player && board[i][2] === player) {
            return true;
        }
        if (board[0][i] === player && board[1][i] === player && board[2][i] === player) {
            return true;
        }
    }
    if (board[0][0] === player && board[1][1] === player && board[2][2] === player) {
        return true;
    }
    if (board[0][2] === player && board[1][1] === player && board[2][0] === player) {
        return true;
    }
    return false;
}

function isBoardFull() {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return false;
            }
        }
    }
    return true;
}

function makeAIMove() {
    if (gameOver) return;

    // Simple AI: Find the best move (win, block, or random)
    var bestMove = findBestMove();
    if (bestMove) {
        makeMove(bestMove.row, bestMove.col);
    } else {
        // If no optimal move, make a random move
        var availableCells = [];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    availableCells.push({ row: i, col: j });
                }
            }
        }
        if (availableCells.length > 0) {
            var randomIndex = Math.floor(Math.random() * availableCells.length);
            var aiMove = availableCells[randomIndex];
            makeMove(aiMove.row, aiMove.col);
        }
    }
}

function evaluate(board) {
    // Check rows, columns, and diagonals for winning positions
    for (var i = 0; i < 3; i++) {
        if (board[i][0] === board[i][1] && board[i][1] === board[i][2]) {
            if (board[i][0] === 'O') return 10;
            if (board[i][0] === 'X') return -10;
        }
        if (board[0][i] === board[1][i] && board[1][i] === board[2][i]) {
            if (board[0][i] === 'O') return 10;
            if (board[0][i] === 'X') return -10;
        }
    }
    if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
        if (board[0][0] === 'O') return 10;
        if (board[0][0] === 'X') return -10;
    }
    if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
        if (board[0][2] === 'O') return 10;
        if (board[0][2] === 'X') return -10;
    }
    return 0; // No winner
}

function isMovesLeft(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                return true;
            }
        }
    }
    return false;
}

function minimax(board, depth, isMax) {
    var score = evaluate(board);

    if (score === 10 || score === -10) {
        return score;
    }

    if (!isMovesLeft(board)) {
        return 0;
    }

    if (isMax) {
        var best = -Infinity;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'O';
                    best = Math.max(best, minimax(board, depth + 1, !isMax));
                    board[i][j] = '';
                }
            }
        }
        return best;
    } else {
        var best = Infinity;
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = 'X';
                    best = Math.min(best, minimax(board, depth + 1, !isMax));
                    board[i][j] = '';
                }
            }
        }
        return best;
    }
}

function findBestMove() {
    var bestVal = -Infinity;
    var bestMove = { row: -1, col: -1 };

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = 'O';
                var moveVal = minimax(board, 0, false);
                board[i][j] = '';
                if (moveVal > bestVal) {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }

    return bestMove.row === -1 ? null : bestMove;
}

function restartGame() {
    board = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    currentPlayer = 'X';
    gameOver = false;

    var cells = document.getElementsByClassName('cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
    }

    document.getElementById('result').innerText = '';

    if (currentPlayer === 'O' && vsAI && !gameOver) {
        setTimeout(makeAIMove, 500);
    }
}

function backToMainScreen() {
    gameContainer.style.display = 'block';
    boardContainer.style.display = 'none';
    resetBoard();
}

var w = window.innerWidth,
    h = window.innerHeight,
    canvas = document.getElementById('test'),
    ctx = canvas.getContext('2d'),
    rate = 60,
    arc = 100,
    time,
    count,
    size = 7,
    speed = 20,
    parts = new Array,
    colors = ['red','#f57900','yellow','#ce5c00','#5c3566'];
var mouse = { x: 0, y: 0 };

canvas.setAttribute('width',w);
canvas.setAttribute('height',h);

function create() {
  time = 0;
  count = 0;

  for(var i = 0; i < arc; i++) {
    parts[i] = {
      x: Math.ceil(Math.random() * w),
      y: Math.ceil(Math.random() * h),
      toX: Math.random() * 5 - 1,
      toY: Math.random() * 2 - 1,
      c: colors[Math.floor(Math.random()*colors.length)],
      size: Math.random() * size
    }
  }
}

function particles() {
  ctx.clearRect(0,0,w,h);
   canvas.addEventListener('mousemove', MouseMove, false);
  for(var i = 0; i < arc; i++) {
    var li = parts[i];
    var distanceFactor = DistanceBetween( mouse, parts[i] );
    var distanceFactor = Math.max( Math.min( 15 - ( distanceFactor / 10 ), 10 ), 1 );
    ctx.beginPath();
    ctx.arc(li.x,li.y,li.size*distanceFactor,0,Math.PI*2,false);
    ctx.fillStyle = li.c;
    ctx.strokeStyle=li.c;
    if(i%2==0)
      ctx.stroke();
    else
      ctx.fill();
    
    li.x = li.x + li.toX * (time * 0.05);
    li.y = li.y + li.toY * (time * 0.05);
    
    if(li.x > w){
       li.x = 0; 
    }
    if(li.y > h) {
       li.y = 0; 
    }
    if(li.x < 0) {
       li.x = w; 
    }
    if(li.y < 0) {
       li.y = h; 
    }
   
     
  }
  if(time < speed) {
    time++;
  }
  setTimeout(particles,1000/rate);
}
function MouseMove(e) {
   mouse.x = e.layerX;
   mouse.y = e.layerY;

   //context.fillRect(e.layerX, e.layerY, 5, 5);
   //Draw( e.layerX, e.layerY );
}
function DistanceBetween(p1,p2) {
   var dx = p2.x-p1.x;
   var dy = p2.y-p1.y;
   return Math.sqrt(dx*dx + dy*dy);
}
create();
particles();
