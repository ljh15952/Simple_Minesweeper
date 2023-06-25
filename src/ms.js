const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 상수들
const numRows = 16;
const numCols = 30;
const numMines = 99;
const tileSize = 18;

let board = {
	cells: Array(numRows).fill(null).map(()=>Array(numCols).fill(null))
};

let minesLeft = numMines;
let gameOver = false;

canvas.addEventListener('click', handleCellClick);
canvas.addEventListener('contextmenu', handleCellRightClick);

initializeBoard();
drawBoard();

function handleCellClick(event){
	if(gameOver){
		return;
	}
	
	const rect = canvas.getBoundingClientRect();
	const mouseX = event.clientX - rect.left;
	const mouseY = event.clientY - rect.top;
	
	const cellRow = Math.floor(mouseX / tileSize);
	const cellCol = Math.floor(mouseY / tileSize);
	
	console.log(cellRow + ' ' + cellCol);
	
}

function handleCellRightClick(event){
	event.preventDefault();
	console.log('2');
}

function initializeBoard() {
	for(let row = 0; row < numRows; row++){
		for(let col = 0; col < numCols; col++){
			board.cells[row][col] = {
				mine: false,
				revealed: false,
				flag: false,
				count: 0
			}
		}
	}
	
	let minesToPlace = numMines;while (minesToPlace > 0) {
		const row = Math.floor(Math.random() * numRows);
		const col = Math.floor(Math.random() * numCols);
		if (!board.cells[row][col].mine) {
		  board.cells[row][col].mine = true;
		  minesToPlace--;
		}
	}
}


function drawBoard(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for(let row = 0; row < numRows; row++){
		for(let col = 0; col < numCols; col++){
			
			const x = col * tileSize;
			const y = row * tileSize;
			
			if(board.cells[row][col].revealed){
				ctx.fillStyle = '#ccc'
				ctx.fillRect(x, y, tileSize-1, tileSize-1);
				
				if(board.cells[row][col].mine){
					ctx.font = '17px Arial'
					ctx.fillStyle = 'black'
					ctx.fillText('⚙', x + tileSize / 15, y + tileSize / 1.2);
				}else if(board.cells[row][col].count > 0){
					ctx.font = '12px Arial'
					ctx.fillStyle = 'black'
					ctx.fillText(board.cells[row][col].count, x + tileSize / 3.5, y + tileSize / 1.3);
				}
			}else{
				ctx.fillStyle = '#999'
				ctx.fillRect(x, y, tileSize-1, tileSize-1);
				if(board.cells[row][col].flag){
					ctx.font = '13px Arial'
					ctx.fillText('🚩', x + tileSize / 10, y + tileSize / 1.4);
				}
			}
			
		}	
	}
	
	ctx.fillStyle = 'black';
	ctx.font = '16px Arial';
	ctx.fillText('Remain mines : ' + minesLeft, 10, canvas.height - 10);
}