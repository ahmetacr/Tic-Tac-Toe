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

// Create the GameBoard Module
const Gameboard = (function() {
  'use strict'
  const gameBoard = [null,null,null,null,null,null,null,null,null];
  const signBox   = document.querySelectorAll('.signBox');
  const winnerPara = document.querySelector('.replay .winner');
  
  const _render    = () => {
    let i = 0
    signBox.forEach(box => {
      box.textContent = gameBoard[i]
      i++
    })
  }

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
  const {player1,player2} = _getPlayer()
  const _updateGameBoard = (event) => {
    // We set data-index attribute to find the clicked box and add it to gameBoard
    const myIndex = event.target.getAttribute("data-index");
    let currentPlayer = _currentPlayer(player1,player2);
    currentPlayer.addMark(myIndex)    
    console.log(currentPlayer);
    _render();

    // This will disable the box from being clicked again
    event.target.removeEventListener('click', _updateGameBoard)

    // Change the Current Player's color 
    displayController.changePlayerColor(currentPlayer);

    // Try gameover // Continue from here
    let isGameOver = displayController.gameOver();
    if (isGameOver.gameOver) {
      signBox.forEach(box => box.removeEventListener('click',_updateGameBoard))
      announceWinner(currentPlayer); // fill it
    }
    console.log(isGameOver); 
  };


  const announceWinner = (currentPlayer) => {
    winnerPara.textContent = `WINNER IS: ${currentPlayer.playerName}`
  }

  signBox.forEach(box => box.addEventListener('click', _updateGameBoard))

  return {
    gameBoard: gameBoard
  }
})();

// This is another Module for deciding a gameover.
const displayController = (function() {
  'use strict'
  const openingPage = document.querySelector('.openingPage');
  const gameDiv     = document.querySelector('.game');
  const player1Name = document.querySelector('#player1')
  const player2Name = document.querySelector('#player2')

  player1Name.style.color = 'green';



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
      _startGame(startBTN);
    }))
    

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

    return {
      startBTN: startBTN
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

    return {
      startBTN: startBTN
    }
  }

  const _startGame   = startBtn => {
    startBtn.addEventListener('click', (event) => {
      openingPage.style.display = 'none';
      gameDiv.style.display = 'flex';      
    })
  }

  const changePlayerColor = (player) => {
    if (player.playerSign == 'X') {
      player2Name.style.color = 'green';
      player1Name.style.color = '#d1c4e9'
    } else if (player.playerSign == 'O') {
      player1Name.style.color = 'green';
      player2Name.style.color = '#d1c4e9'
    }
  }
  _goInputSection();
  return {
    gameOver,
    changePlayerColor
  }

})()


