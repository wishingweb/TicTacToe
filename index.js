'use strict'

let closeBtn, gameOverMenu, winnerTeam, shader;
let currWinner = null, audioTrigger; //audio trigger is used to disabled sound when AI is finding the best
                                            //cell. As the sound is played whenever a cell is added with a symbol
                                            //true means the sound now could be played and mute otherwise.
let gameBoard;
let boardTable = document.getElementsByTagName("table")[0];
let cells = document.querySelectorAll("td");
let restartBtn = document.getElementById("restart");

const PLAYER="O",  AI="X";

let board;
let turn;

const SOLUTIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

window.onload = () => {
  turn = 0;
  gameInit();
}

//note: 
//  turn == 0 means computer's turn
//  turn == 1 means player's turn

//whenever user clicked the cell in the table element, check for cell availablility
//as well as produce the correct sound if audioTrigger is on. 
//If the cell is available, add the current player symbol into the cell and then change turn to 0.
//checkWinner() function would be called so that we can check if the player has won the game
//
let cellsClicked = (event) => {
  let cellAvailable = addArea(board, event.target.id, PLAYER);
  if (cellAvailable) {
    let result = checkWinner(board);
    turn = 0;
    if (result != false) {
      setResult(result);
    }else if (turn == 0) {
      computerTurn(board);
      turn = 1;
    }
  }
}

let gameInit = () => {
  currWinner = null;
  board = new Array(9);
  audioTrigger = true;

  closeBtn = document.getElementById("close");
  gameOverMenu= document.getElementById("gameOver")
  winnerTeam = document.getElementById("winTeam")
  shader = document.getElementById("shader");

  if (turn == 0) {
    setTimeout(()=>{
      randomMove(board);
    }, 500);
    turn = 1;
  }

  closeBtn.addEventListener("click", closeGameOverMenu, false);
  restartBtn.style.display="none";

  for (let cellIndex=0; cellIndex < cells.length; cellIndex++){
    cells[cellIndex].innerHTML = "";
    cells[cellIndex].style.backgroundColor = "transparent"
    board.fill(null);
    cells[cellIndex].addEventListener ("click", cellsClicked, false);
  }
}

let closeGameOverMenu = () => {
  //used opacity to animate the fade in, while display none to prevent user from able to click the
  //game over menu or selecting it (which would cause the app to not so user friend)
  shader.style.opacity = "0";
  gameOverMenu.style.opacity = "0";

  setTimeout(()=> {
    shader.style.display = "none"
    gameOverMenu.style.display = "none";
  }, 300);
}

//playing sound effects
// 0 = win, 1 = button click, 2 = add points
let playSound = (soundIndex) => {
  let musicArr = ["win","click","areaAdded","error"];
  if (Number.isInteger(soundIndex) != true) soundIndex = 2;
  let winSound = new Audio(`music/${musicArr[soundIndex]}.mp3`);
  winSound.volume = (soundIndex == 0) ? 0.3 : 0.7;
  winSound.play();
}

let gameOver = (result) => {
  setTimeout(playSound(0), 900);
  currWinner = result.winner;
  let winner = ( currWinner == 1) ? {team:"Player", scoreId:"playerScore"} : (currWinner == 0)? {team:"Computer", scoreId:"enemyScore"} : {team: "Draw", scoreId: null};
  if (winner.scoreId != null) {
    let scorer = document.getElementById(winner.scoreId);
    scorer.innerHTML = Number(scorer.innerHTML) + 1;
  }
  shader.style.display = "block";
  gameOverMenu.style.display = "block";
  setTimeout(()=> {
    shader.style.opacity = "1.0"
    gameOverMenu.style.opacity = "1.0";
    restartBtn.style.display = "block";
  },300);
  winnerTeam.innerHTML = winner.team;
}
