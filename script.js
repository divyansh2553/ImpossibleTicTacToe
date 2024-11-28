/* script.js */
const board = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset');
const vsComputerBtn = document.getElementById('vsComputer');
const vsPlayerBtn = document.getElementById('vsPlayer');

let currentPlayer = 'X';
let boardState = Array(9).fill('');
let isGameActive = true;
let isVsComputer = false;

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function initializeGame() {
  board.innerHTML = '';
  boardState.fill('');
  currentPlayer = 'X';
  isGameActive = true;
  statusText.textContent = isVsComputer ? "You're X. Good luck!" : "Player X's turn";

  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i;
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

function handleCellClick(e) {
  const index = e.target.dataset.index;

  if (!isGameActive || boardState[index] !== '') return;

  boardState[index] = currentPlayer;
  e.target.textContent = currentPlayer;
  e.target.classList.add('taken');

  if (checkWin(currentPlayer)) {
    statusText.textContent = `${currentPlayer} wins!`;
    isGameActive = false;
    return;
  }

  if (!boardState.includes('')) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusText.textContent = isVsComputer
    ? currentPlayer === 'X'
      ? "Your turn!"
      : "Computer's turn..."
    : `Player ${currentPlayer}'s turn`;

  if (isVsComputer && currentPlayer === 'O') {
    setTimeout(computerMove, 500);
  }
}

function computerMove() {
  const bestMove = getBestMove();
  boardState[bestMove] = 'O';

  const cell = document.querySelector(`.cell[data-index='${bestMove}']`);
  cell.textContent = 'O';
  cell.classList.add('taken');

  if (checkWin('O')) {
    statusText.textContent = "Computer wins!";
    isGameActive = false;
    return;
  }

  if (!boardState.includes('')) {
    statusText.textContent = "It's a draw!";
    isGameActive = false;
    return;
  }

  currentPlayer = 'X';
  statusText.textContent = "Your turn!";
}

function getBestMove() {
  return minimax(boardState, 'O').index;
}

function minimax(newBoard, player) {
  const emptySpots = newBoard.map((val, idx) => (val === '' ? idx : null)).filter(val => val !== null);

  if (checkWin('X')) return { score: -10 };
  if (checkWin('O')) return { score: 10 };
  if (emptySpots.length === 0) return { score: 0 };

  const moves = [];

  for (const spot of emptySpots) {
    const move = { index: spot };
    newBoard[spot] = player;

    if (player === 'O') {
      move.score = minimax(newBoard, 'X').score;
    } else {
      move.score = minimax(newBoard, 'O').score;
    }

    newBoard[spot] = '';
    moves.push(move);
  }

  return player === 'O'
    ? moves.reduce((best, move) => (move.score > best.score ? move : best))
    : moves.reduce((best, move) => (move.score < best.score ? move : best));
}

function checkWin(player) {
  return WINNING_COMBINATIONS.some(combination =>
    combination.every(index => boardState[index] === player)
  );
}

vsComputerBtn.addEventListener('click', () => {
  isVsComputer = true;
  initializeGame();
});

vsPlayerBtn.addEventListener('click', () => {
  isVsComputer = false;
  initializeGame();
});

resetBtn.addEventListener('click', initializeGame);

initializeGame();
