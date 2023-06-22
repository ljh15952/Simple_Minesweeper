let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d')

let pos = {x: -1, y: -1};

let board = {num: Array(16).fill(0).map(()=>Array(30).fill(0)),
			info: Array(16).fill(0).map(()=>Array(30).fill(0))};

let mx = [-1,-1,-1,0,0,1,1,1];
let my = [-1,0,1,-1,1,-1,0,1];

let isclicked = false;

canvas.addEventListener('mousemove', e => {
	const canv = canvas.getBoundingClientRect();
	pos = {x: Math.floor((e.clientX - canv.left) / 18), y: Math.floor((e.clientY - canv.top) / 18) };
})

canvas.addEventListener('click', () => {
	board.info[pos.y][pos.x] = 1;
	drawBoard();
})

ctx.font = "15px Arial";
const drawBoard = () => {
	ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
	
	board.info.map((a, i)=>{
		a.map((b, j)=>{
			if(b === 1){
				ctx.strokeRect(j * 18, i * 18, 17, 17);
				ctx.fillText(board.num[i][j],j * 18 + 4, i * 18 + 14);	
			}else{
				ctx.fillRect(j * 18, i * 18, 17, 17);
			}
		})
	})
	
	
}

const setBoard = (y,x) =>{
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