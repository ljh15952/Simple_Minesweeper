const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const tileSize = 18;
const numRows = 16;
const numCols = 30;
const numMines = 99;

let board = {
  cells: Array(numRows).fill(null).map(() => Array(numCols).fill(null)),
  revealed: Array(numRows).fill(false).map(() => Array(numCols).fill(false)),
  flagged: Array(numRows).fill(false).map(() => Array(numCols).fill(false))
};

let gameOver = false;
let minesLeft = numMines;

canvas.addEventListener('click', handleCellClick);
canvas.addEventListener('contextmenu', handleCellRightClick);

initializeBoard();
drawBoard();

function initializeBoard() {
  // Create cells
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      board.cells[row][col] = {
        mine: false,
        count: 0
      };
    }
  }

  // Place mines randomly
  let minesToPlace = numMines;
  while (minesToPlace > 0) {
    const row = Math.floor(Math.random() * numRows);
    const col = Math.floor(Math.random() * numCols);
    if (!board.cells[row][col].mine) {
      board.cells[row][col].mine = true;
      minesToPlace--;
    }
  }

  // Calculate neighboring mine counts
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!board.cells[row][col].mine) {
        const count = countNeighboringMines(row, col);
        board.cells[row][col].count = count;
      }
    }
  }
}

function countNeighboringMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (isValidCell(newRow, newCol) && board.cells[newRow][newCol].mine) {
        count++;
      }
    }
  }
  return count;
}

function handleCellClick(event) {
  if (gameOver) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const cellRow = Math.floor(mouseY / tileSize);
  const cellCol = Math.floor(mouseX / tileSize);

  if (isValidCell(cellRow, cellCol) && !board.flagged[cellRow][cellCol]) {
    revealCell(cellRow, cellCol);
    if (board.cells[cellRow][cellCol].mine) {
      gameOver = true;
      revealAllCells();
      alert('Game Over');
    } else if (isGameWon()) {
      gameOver = true;
      revealAllCells();
      alert('Congratulations! You won the game!');
    }
  }

  drawBoard();
}

function handleCellRightClick(event) {
  event.preventDefault();

  if (gameOver) {
    return;
  }

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  const cellRow = Math.floor(mouseY / tileSize);
  const cellCol = Math.floor(mouseX / tileSize);

  if (isValidCell(cellRow, cellCol) && !board.revealed[cellRow][cellCol]) {
    board.flagged[cellRow][cellCol] = !board.flagged[cellRow][cellCol];
    if (board.flagged[cellRow][cellCol]) {
      minesLeft--;
    } else {
      minesLeft++;
    }
  }

  drawBoard();
}

function isValidCell(row, col) {
  return row >= 0 && row < numRows && col >= 0 && col < numCols;
}

function revealCell(row, col) {
  if (!isValidCell(row, col) || board.revealed[row][col]) {
    return;
  }

  board.revealed[row][col] = true;

  if (board.cells[row][col].count === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        revealCell(row + i, col + j);
      }
    }
  }
}

function revealAllCells() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      board.revealed[row][col] = true;
    }
  }
}

function isGameWon() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!board.cells[row][col].mine && !board.revealed[row][col]) {
        return false;
      }
    }
  }
  return true;
}

function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const x = col * tileSize;
      const y = row * tileSize;

      if (board.revealed[row][col]) {
        ctx.fillStyle = '#ccc';
        ctx.fillRect(x, y, tileSize, tileSize);

        if (board.cells[row][col].mine) {
          ctx.fillStyle = 'red';
          ctx.beginPath();
          ctx.arc(x + tileSize / 2, y + tileSize / 2, tileSize / 4, 0, 2 * Math.PI);
          ctx.fill();
        } else if (board.cells[row][col].count > 0) {
          ctx.font = '12px Arial';
          ctx.fillStyle = 'black';
          ctx.fillText(board.cells[row][col].count, x + tileSize / 3, y + tileSize / 2);
        }
      } else {
        ctx.fillStyle = '#999';
        ctx.fillRect(x, y, tileSize, tileSize);

        if (board.flagged[row][col]) {
          ctx.font = '12px Arial';
          ctx.fillStyle = 'red';
          ctx.fillText('🚩', x + tileSize / 3, y + tileSize / 2);
        }
      }
    }
  }

  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Mines Left: ' + minesLeft, 10, canvas.height - 10);
}

