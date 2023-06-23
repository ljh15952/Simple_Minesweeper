const canvas = document.getElementById('canvas'); 
const ctx = canvas.getContext('2d')

// 설정 상수들
const tileSize = 18;
const numRows = 16;
const numCols = 30;
const numMines = 99;

let board = {
	// 셀 관리 배열 지뢰인지 아닌지 지뢰가 아니라면 근처 지뢰 수 가 몇개인지 관리하는 배열
	cells: Array(16).fill(null).map(()=>Array(30).fill(null)),
	// 클릭한 셀 관리 배열 클릭 = true 안클릭(기본상태) = false
	revealed: Array(16).fill(null).map(()=>Array(30).fill(null)),
	// 깃발로 넣었는지 관리 배열 깃발 = true 안클릭(기본상태) = false
	flagged: Array(16).fill(null).map(()=>Array(30).fill(null)),
};

// 변수들 게임이 끝났는가 아닌가, 남은 지뢰의 수
let gameOver = false;
let minesLeft = numMines;

// 클릭 이벤트 리스너 선언
canvas.addEventListener('click', handleCellClick);
canvas.addEventListener('contextmenu', handleCellRightClick);

initializeBoard();
drawBoard();

function initializeBoard(){
	// Create cells
	for(let row = 0; row < numRows; row++){
		for(let col = 0; col < numCols; col++){
			board.cells[row][col] = {
				mine: false,
				count: 0
			}
		}
	}
	
	// Place mines randomly
	let minesToPlace = numMines;
	while(minesToPlace > 0){
		const row = Math.floor(Math.random() * numRows);
		const col = Math.floor(Math.random() * numCols);
		if(!board.cells[row][col].mine){
			board.cells[row][col].mine = true;
			minestoPlace--;
		}
	}
	
	// 근처 지뢰 개수 카운팅
	for(let row = 0; row < numRows; row++){
		for(let col = 0; col < numCols; col++){
			if(!board.cells[row][col].mine){
				const count = countNeighboringMines(row, col);
				board.cells[row][col].count = count;
			}
		}
	}
}

function countNeighboringMines(row, col){
	let count = 0;
	for(let i = -1; i <= 1; i++){
		for(let j = -1; j <= 1; j++){
			const newRow = row + i;
			const newCol = col + j;
			if(isValidCell(newRow, newCol) && board.cells[newRow][newColl].mine)
				count++;
		}
	}
	return count;
}

function handleCellClick(event){
	if(gameOver){
		return;
	}
	
	
	
	
}

ctx.font = "15px Arial";

canvas.addEventListener('mousemove', e => {
	const canv = canvas.getBoundingClientRect();
	pos = {x: Math.floor((e.clientX - canv.left) / 18), y: Math.floor((e.clientY - canv.top) / 18) };
})

canvas.addEventListener('click', () => {
	if(board.info[pos.y][pos.x] !== 2){
		dfs(pos.y, pos.x);
		drawBoard();
	}
})

canvas.addEventListener('contextmenu', e => {
	e.preventDefault();
	board.info[pos.y][pos.x] = 2 - board.info[pos.y][pos.x];
	drawBoard();
});

const drawBoard = () => {
	ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
	board.info.map((a, i)=>{
		a.map((b, j)=>{
			ctx.fillStyle = 'black';
			if(b === 1){
				ctx.strokeRect(j * 18, i * 18, 17, 17);
				ctx.fillText(board.num[i][j],j * 18 + 4, i * 18 + 14);	
			}else if(b === 2){
				ctx.fillStyle = 'red';
				ctx.fillRect(j * 18, i * 18, 17, 17);
			}else{
				ctx.fillRect(j * 18, i * 18, 17, 17);
			}
		})
	})
}

const dfs = (y,x) => {
	
	board.info[y][x] = 1;
	
	if(board.num[y][x] > 0 || board.num[y][x] === '*')
		return;
	
	for(let i = 0; i < 8; ++i){
		if(y + my[i] < 0 || y + my[i] >= 16 
		|| x + mx[i] < 0 || x + mx[i] >= 30) 
			continue;
		if(board.info[y+my[i]][x+mx[i]] === 1)
			continue;
		if(board.num[y+my[i]][x+mx[i]] !== '*')
			dfs(y+my[i], x+mx[i]);
	}
	
}

const setBoard = (y,x) => {
	for(let k = 0; k < 8; ++k){
		if(y + my[k] < 0 || y + my[k] >= 16 
		|| x + mx[k] < 0 || x + mx[k] >= 30) 
			continue;
		if(board.num[y + my[k]][x + mx[k]] === '*')
			continue;
		board.num[y + my[k]][x + mx[k]]++;
	}
}

const setMine = () => {
	rp = {x: Math.floor(Math.random() * 30), y: Math.floor(Math.random() * 16)};
	if(board.num[rp.y][rp.x] === '*') setMine();
	else {
		board.num[rp.y][rp.x] = '*';
		setBoard(rp.y, rp.x);
	}
}

for(let i = 0; i < 99; ++i) setMine();
drawBoard();