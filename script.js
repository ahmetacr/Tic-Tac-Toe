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
  // Create the gameboard array:
  let gameBoard = [null,null,null,null,null,null,null,null,null];
  const signBox   = document.querySelectorAll('.signBox');
  
  // Push the array into the window
  const _render    = (gameBoard) => {
    let i = 0
    signBox.forEach(box => {
      box.textContent = gameBoard[i]
      i++
    })
  }

  // Get the information and create the Player element
  const _getPlayer = (name1,name2) => {
    let sign1 = 'X';
    let sign2 = 'O';

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

  const _gameOverRepeat = (currentPlayer,gameBoard,isGameOver,replay) => {
    currentPlayer = '';
    gameBoard = [null,null,null,null,null,null,null,null,null];
    isGameOver.gameOver = false;
    isGameOver.isTie    = false;
    replay;
  }
  
  // Magic Happens Below!
  const _updateGameBoard = (event,player1,player2) => {
    if (event.target.textContent == '') {
      // We set data-index attribute to find the clicked box and add it to gameBoard
      const myIndex = event.target.getAttribute("data-index");
  
      // Get the current player and render()
      let currentPlayer = _currentPlayer(player1,player2);
      currentPlayer.addMark(myIndex)    
      _render(Gameboard.gameBoard);
  
      // Change the Current Player's color 
      displayController.changePlayerColor(currentPlayer);
    
      // Decide if the game is over 
      let isGameOver = displayController.gameOver();
      if (isGameOver.gameOver && !isGameOver.isTie) {
        _announceWinner(currentPlayer.playerName); 
        _gameOverRepeat(currentPlayer,gameBoard,isGameOver,displayController.Replay());
      } else if (isGameOver.gameOver && isGameOver.isTie) {
        _announceWinner('THERE IS NO WINNER AT THIS TIME!'); 
        _gameOverRepeat(currentPlayer,gameBoard,isGameOver,displayController.Replay());
      }
      return {
        isGameOver
      } 
    }
  };

  const _announceWinner = (currentPlayer) => {
    const winnerPara = document.querySelector('.replay .winner');
    winnerPara.textContent = `WINNER: ${currentPlayer.toUpperCase()}`
  }

  // Get the player objects and names and give it in
  const gameController = (name1,name2) => {
    const {player1,player2} = _getPlayer(name1,name2)
    function _start(event) {
      _updateGameBoard(event,player1,player2)
      if (displayController.gameOver().gameOver) {
        signBox.forEach(box => box.removeEventListener('click', _start))
      }
    }
    signBox.forEach(box => box.addEventListener('click', _start),{once:true}); // This will disable each box after one click
  }

  // Return the gameboard so that it's display can be updated
  // Return the gameController so that it starts as long as the start button is pressed
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

  // Set how to decide on whether the game is over
  const gameOver = () => {
    const gameBoard = Gameboard.gameBoard;
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
    if (!gameBoard.includes(null) && !gameOver) {
      console.log("It's a TIE!");
      isTie    = true;
      gameOver = true;
    }
    return {
      gameOver,
      isTie
    }
  }

  // Take the Player type from UI
  const _playerType = (event) => {
    let playerType;
    if (event.target.id == 'singlePlayer') {
      playerType = 'single';
    } else {
      playerType = 'multi';
    }
    return playerType;
  }
  
  // Pass the intro sections, create the start button and open the game!
  const _passIntro = () => {
    // Get the option buttons which initially pop up!
    const options = document.querySelectorAll('.options div button');

    // Create the Start Button variable and define it later based on the event
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

  // Get the input and set it to the display
  const _displayPlayerName = (input1,input2='computer') => {
    if (input2 !== 'computer') {
      input2.addEventListener('change', (event) => {
        player2Name = event.target.value;
        player2P.textContent = player2Name;
      })
    }

    input1.addEventListener('change', (event) => {
      player1Name = event.target.value;
      player2Name = 'Computer'
      // set player name on display
      player1P.textContent = player1Name;
      player2P.textContent = player2Name;
    })    
    return {
      player1Name: player1Name,
      player2Name: player2Name
    }
  }
  
  // If single player
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
    openingPage.appendChild(singleDiv);

    _displayPlayerName(singleInput);

    return {
      startBTN: startBTN,
    }
  }
  // If multi-player
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

    _displayPlayerName(player1Input,player2Input)
    return {
      startBTN: startBTN
    }
  }

  // Set the display if the start button is clicked!
  const _startGame   = startBtn => {
    startBtn.addEventListener('click', () => {
      openingPage.style.display = 'none';
      gameDiv.style.display = 'flex';      
      Gameboard.gameController(player1Name,player2Name);
    })

  }

  // Display the current player's color as green
  const changePlayerColor = (player) => {
    if (player.playerSign == 'X') {
      player2P.style.color = 'green';
      player1P.style.color = '#d1c4e9'
    } else if (player.playerSign == 'O') {
      player1P.style.color = 'green';
      player2P.style.color = '#d1c4e9'
    }
  }

  // Get and set the Replay button
  const Replay = () => {
    const replayBtn = document.getElementById('replayBtn');
    replayBtn.style.display = 'block';
    console.log(replayBtn.style.display);
    console.log('AAAAAAAAAAAA');
    replayBtn.addEventListener('click', function replay(){
      document.querySelector('.winner').textContent =  '';
      document.querySelectorAll('.signBox').forEach(box => box.textContent = '');

      Gameboard.gameBoard = [null,null,null,null,null,null,null,null,null]
      replayBtn.style.display = 'none';
      Gameboard.gameController(player1Name,player2Name);  
    },{capture:true})
  }

  _passIntro();
  
  return {
    gameOver,
    changePlayerColor,
    Replay
  }

})()


