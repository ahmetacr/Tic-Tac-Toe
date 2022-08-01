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
  
  const {player1,player2} = _getPlayer()
  const _updateGameBoard = (event) => {
    const myIndex = event.target.getAttribute("data-index");
    let currentPlayer = _currentPlayer(player1,player2);
    currentPlayer.addMark(myIndex)    
    console.log(currentPlayer);
    _render();

    // This will disable the box from being clicked again
    event.target.removeEventListener('click', _updateGameBoard)

    // Try gameover // Continue from here
    let isGameOver = displayController.gameOver();
    if (isGameOver) {
      signBox.forEach(box => box.removeEventListener('click',_updateGameBoard))
    }
    console.log(isGameOver); 
  };

  signBox.forEach(box => box.addEventListener('click', _updateGameBoard))

  return {
    gameBoard: gameBoard
  }
})();


const displayController = (function() {
  const gameOver = () => {
    const gameBoard = Gameboard.gameBoard;
    console.log(gameBoard);
    console.log(gameBoard[0])
    let gameOver = false;
    if (gameBoard[0] == gameBoard[1] && gameBoard[1] == gameBoard[2] && gameBoard[2] !== null) {
      gameOver = true;
    } else if (gameBoard[3] == gameBoard[4] && gameBoard[4] == gameBoard[5] && gameBoard[5] !== null) {
      gameOver = true;
    } else if (gameBoard[6] == gameBoard[7] && gameBoard[7] == gameBoard[8] && gameBoard[8] !== null) {
      gameOver = true;
    }

    if (gameBoard[0] == gameBoard[3] && gameBoard[3] == gameBoard[6] && gameBoard[6] !== null) {
      gameOver = true;
    } else if (gameBoard[1] == gameBoard[4] && gameBoard[4] == gameBoard[7] && gameBoard[7] !== null) {
      gameOver = true;
    } else if (gameBoard[2] == gameBoard[5] && gameBoard[5] == gameBoard[8] && gameBoard[8] !== null) {
      gameOver = true;
    }

    if (gameBoard[0] == gameBoard[4] && gameBoard[4] == gameBoard[8] && gameBoard[8] !== null) {
      gameOver = true;
    } else if (gameBoard[2] == gameBoard[4] && gameBoard[4] == gameBoard[6] && gameBoard[6] !== null) {
      gameOver = true;
    }

    if (gameOver) {console.log('GAME OVER!')};
    return gameOver;
  }

  return {
    gameOver
  }
})()



























// const Player1 = (name,level) => {
//   let health = level * 2;
//   const getLevel = () => level;
//   const getName  = () => name;
//   const die      = () => {
//     // uh oh
//   }
//   const damage   = x => {
//     health -= x;
//     if (health <= 0) {
//       die();
//     }
//   }
//   const attack   = enemy => {
//     if (level < enemy.getLevel()) {
//       damage(1);
//       console.log(`${enemy.getName()} has damaged ${name}`);
//     }
//     if (level >= enemy.getLevel()) {
//       enemy.damage(1);
//       console.log(`${name} has damaged ${enemy.getName()}`);
//     }
//   }
//   return {
//     attack,
//     damage,
//     getLevel,
//     getName
//   }
// }

// const jimmie = Player('jim',10);
// const badGuy = Player('jeff',5);

// jimmie.attack(badGuy);
