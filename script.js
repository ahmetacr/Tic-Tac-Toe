// TIC TAC TOE
// If you need ONE of something (gameBoard, displayController), use a module
// If you need multiple things (players!), create them with factories!

// Back to Factory Functions:
/*
  Now that we've got the theory out of the way, let's return to
  factory functions. Factories are simply plain old JS functions
  that return objects for us to use in our code. Using factories
  is a powerful way to organize and containe the code you're writing
  For example, if we're writing any sort of game, we're probably 
  going to want objects to describe our players and encapsulate 
  all of the things our players can do (functions!).
*/

// Create the Player factory function
const Player = (name,sign,playTurn) => {
  const playerName = name;
  const playerSign = sign;
  
  const addMark = (index) => {
    // Gotta find the index that we are going to add the sign
    // the index going to be the data-index attribute of the signBox clicked!
    Gameboard.gameBoard.splice(index,1,playerSign);
  }

  return {
    playerName,
    playerSign,
    playTurn,
    addMark
  }
}

// GAMEBOARD MODULE
const Gameboard = (function() {
  'use strict'
  const gameBoard = [null,null,null,null,null,null,null,null,null];
  const signBox   = document.querySelectorAll('.signBox');
  
  const _render    = () => {
    let i = 0
    signBox.forEach(box => {
      box.textContent = gameBoard[i]
      i++
    })
  }

  // Will work on that:
  const _getPlayer = () => {

    let name1 = 'ahmed'
    let sign1 = 'X';
    let name2 = 'mehmed';
    let sign2 = 'O'

    const player1  = Player(name1,sign1,true);
    const player2  = Player(name2,sign2,false);

    return {
      player1,
      player2
    }
  }

  const _currentPlayer = (player1,player2) => {
    let currentPlayer;
    if (player1.playTurn && !player2.playTurn) {
      currentPlayer = player1;
      player1.playTurn = false;
      player2.playTurn = true; 
    } else if (player2.playTurn && !player1.playTurn) {
      currentPlayer = player2;
      player2.playTurn = false;
      player1.playTurn = true; 
    }
    return currentPlayer;
  }
  
  // Magic Happens Below!
  
  const _updateGameBoard = (event,player1,player2) => {
    // We set data-index attribute to find the clicked box and add it to gameBoard
    console.log('event: ',event)
    const myIndex = event.target.getAttribute("data-index");
    let currentPlayer = _currentPlayer(player1,player2);
    currentPlayer.addMark(myIndex)    
    console.log(currentPlayer);
    _render();

    // This will disable the box from being clicked again
    event.target.removeEventListener('click', _updateGameBoard)

    // Change the Current Player's color 
    displayController.changePlayerColor(currentPlayer);

    // GAMEOVER 
    let isGameOver = displayController.gameOver();
    if (isGameOver.gameOver && !isGameOver.isTie) {
      signBox.forEach(box => box.removeEventListener('click',_updateGameBoard))
      announceWinner(currentPlayer.playerName); 
    } else if (isGameOver.gameOver && isGameOver.isTie) {
      signBox.forEach(box => box.removeEventListener('click',_updateGameBoard))
      announceWinner('THERE IS NO WINNER AT THIS TIME!'); 
    }
    console.log(isGameOver); 
  };

  const announceWinner = (currentPlayer) => {
    const winnerPara = document.querySelector('.replay .winner');
    winnerPara.textContent = `WINNER: ${currentPlayer}`
  }

  const gameController = (name1,name2) => {
    const {player1,player2} = _getPlayer()
    player1.playerName = name1;
    player2.playerName = name2;
    signBox.forEach(box => box.addEventListener('click', (event) => _updateGameBoard(event,player1,player2)))
  }

  // gameController();

  return {
    gameBoard: gameBoard,
    gameController: gameController
  }
})();

// DISPLAY CONTROLLER MODULE!.
const displayController = (function() {
  'use strict'
  const openingPage = document.querySelector('.openingPage');
  const gameDiv     = document.querySelector('.game');
  const player1P = document.querySelector('#player1')
  const player2P = document.querySelector('#player2')
  let player1Name;
  let player2Name;

  player1P.style.color = 'green';

  const gameOver = () => {
    const gameBoard = Gameboard.gameBoard;
    console.log(gameBoard);
    console.log(gameBoard[0])
    let gameOver = false;
    let isTie    = false;
    // Check for the horizontal equation: 
    if (gameBoard[0] == gameBoard[1] && gameBoard[1] == gameBoard[2] && gameBoard[2] !== null) {
      gameOver = true;
    } else if (gameBoard[3] == gameBoard[4] && gameBoard[4] == gameBoard[5] && gameBoard[5] !== null) {
      gameOver = true;
    } else if (gameBoard[6] == gameBoard[7] && gameBoard[7] == gameBoard[8] && gameBoard[8] !== null) {
      gameOver = true;
    }

    // Check for the vertical equation
    if (gameBoard[0] == gameBoard[3] && gameBoard[3] == gameBoard[6] && gameBoard[6] !== null) {
      gameOver = true;
    } else if (gameBoard[1] == gameBoard[4] && gameBoard[4] == gameBoard[7] && gameBoard[7] !== null) {
      gameOver = true;
    } else if (gameBoard[2] == gameBoard[5] && gameBoard[5] == gameBoard[8] && gameBoard[8] !== null) {
      gameOver = true;
    }

    // Check for the cross equation
    if (gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8] && gameBoard[8] !== null) {
      gameOver = true;
    } else if (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6] && gameBoard[6] !== null) {
      gameOver = true;
    }

    // Check for the tie
    if (!gameBoard.includes(null)) {
      console.log("It's a TIE!");
      isTie    = true;
      gameOver = true;
    }

    if (gameOver) {
      console.log('GAME OVER!')
    
    };
    return {
      gameOver,
      isTie
    }
  }

  const _playerType = (event) => {
    // We got 2 options: Single player or Multi-Player
    let playerType;
    if (event.target.id == 'singlePlayer') {
      playerType = 'single';
    } else {
      playerType = 'multi';
    }
    console.log(playerType);
    return playerType;
  }
  
  const _goInputSection = () => {
    const options = document.querySelectorAll('.options div button');
    let startBTN;
    options.forEach(option => option.addEventListener('click', (event) => {
      // Clean the opening page so that the users enter information about 
      const openingItems = openingPage.children;
      openingPage.removeChild(openingItems[1])
      
      // Go to the next section based on type:
      let type = _playerType(event)
      type == 'single' ? startBTN = _singlePlayer().startBTN: startBTN = _multiPlayer().startBTN;

      // start the game:
      console.log(startBTN);
      _startGame(startBTN);
    }))
    return startBTN
  }

  const _getPlayerName = (input1,input2='computer') => {
    if (input2 !== 'computer') {
      input2.addEventListener('change', (event) => {
        player2Name = event.target.value;
        console.log('player2 Name: ',event.target.value); 
        player2P.textContent = player2Name;
      })
    }

    input1.addEventListener('change', (event) => {
      player1Name = event.target.value;
      player2Name = 'Computer'
      console.log('player1 Name: ',event.target.value); 

      // set player name on display
      player1P.textContent = player1Name;
      player2P.textContent = player2Name;
    })    
    return {
      player1Name: player1Name,
      player2Name: player2Name
    }
  }
  
  const _singlePlayer = () => {
    const header = document.querySelector('.openingHeader h1');
    header.textContent = 'You will be playing against AI!'

    const singleDiv = document.createElement('div');
    singleDiv.classList.add('singleDiv');

    const singleLabel = document.createElement('label');
    singleLabel.setAttribute('name','single');
    singleLabel.id = 'single';
    singleLabel.textContent = 'Please Enter Your Name'

    const singleInput = document.createElement('input');
    singleInput.setAttribute('type','text');
    singleInput.setAttribute('name','single');
    singleInput.setAttribute('placeholder','Your Name');
    singleInput.id = 'single';

    const startBTN = document.createElement('button');
    startBTN.classList.add('startBtn');
    startBTN.textContent = 'START'

    singleDiv.appendChild(singleLabel);
    singleDiv.appendChild(singleInput);
    singleDiv.appendChild(startBTN);

    openingPage.style.backgroundColor = 'rgb(53, 1, 53)';
    // openingPage.style.color = '#d1c4e9';
    openingPage.appendChild(singleDiv);

    _getPlayerName(singleInput);
    // player1Name = _getPlayerName(singleInput).player1Name
    // player2Name = _getPlayerName(singleInput).player2Name;

    return {
      startBTN: startBTN,
    }
  }

  const _multiPlayer = () => {
    const header = document.querySelector('.openingHeader h1');
    header.textContent = 'MULTI PLAYER MODE!'

    const multiDiv = document.createElement('div');
    multiDiv.classList.add('multiDiv');

    const player1Div = document.createElement('div');
    player1Div.classList.add('player1Div'); // eklemesem de olur ? 
    
    const player1Label = document.createElement('label');
    player1Label.setAttribute('name','player1Label');
    player1Label.id = 'player1Label';
    player1Label.textContent = 'FIRST PLAYER NAME'

    const player1Input = document.createElement('input');
    player1Input.setAttribute('type','text');
    player1Input.setAttribute('name','player1Input');
    player1Input.setAttribute('placeholder','Player 1');
    player1Input.id = 'player1Input';

    const player2Div = document.createElement('div');
    player2Div.classList.add('player2Div'); // eklemesem de olur ? 

    const player2Label = document.createElement('label');
    player2Label.setAttribute('name','player2Label');
    player2Label.id = 'player2Label';
    player2Label.textContent = 'SECOND PLAYER NAME'

    const player2Input = document.createElement('input');
    player2Input.setAttribute('type','text');
    player2Input.setAttribute('name','player2Input');
    player2Input.setAttribute('placeholder','Player 2');
    player2Input.id = 'player2Input';

    const startBTN = document.createElement('button');
    startBTN.classList.add('startBtn');
    startBTN.textContent = 'START'

    player1Div.appendChild(player1Label);
    player1Div.appendChild(player1Input);

    player2Div.appendChild(player2Label);
    player2Div.appendChild(player2Input);

    multiDiv.appendChild(player1Div);
    multiDiv.appendChild(player2Div);
    multiDiv.appendChild(startBTN);

    openingPage.appendChild(multiDiv);

    openingPage.style.backgroundColor = 'rgb(53, 1, 53)';

    _getPlayerName(player1Input,player2Input)
    return {
      startBTN: startBTN
    }
  }

  const _startGame   = startBtn => {
    startBtn.addEventListener('click', (event) => {
      openingPage.style.display = 'none';
      gameDiv.style.display = 'flex';      
      console.log('player1Name: ',player1Name)
      console.log('player2Name: ',player2Name)
      Gameboard.gameController(player1Name,player2Name);
    })

  }

  const changePlayerColor = (player) => {
    if (player.playerSign == 'X') {
      player2P.style.color = 'green';
      player1P.style.color = '#d1c4e9'
    } else if (player.playerSign == 'O') {
      player1P.style.color = 'green';
      player2P.style.color = '#d1c4e9'
    }
  }

  _goInputSection();
  
  return {
    gameOver,
    changePlayerColor
  }

})()


