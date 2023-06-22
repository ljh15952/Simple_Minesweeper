let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d')

let p = {x: -1, y: -1};

let board = Array(16).fill(-1).map(()=>Array(30).fill(-1))


const getMousep = e => {
	const canv = e.target.getBoundingClientRect();
	return {};
}

canvas.addEventListener('mousemove', e => {
	const canv = canvas.getBoundingClientRect();
	pos = {x: Math.floor((e.clientX - canv.left) / 18), y: Math.floor((e.clientY - canv.top) / 18) };
})

canvas.addEventListener('click', () => {
	console.log(pos);
	board[pos.y][pos.x] = 0;
	drawBoard();
})

// 고급 : 가로 30, 세로 16, 지뢰 99개 (20.6%)
ctx.font = "15px Arial";
const drawBoard = () => {
	ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
	
	board.map((a, i)=>{
		a.map((b, j)=>{
			if(b === -1){
				ctx.fillRect(j * 18, i * 18, 17, 17);
			}else{
				ctx.strokeRect(j * 18, i * 18, 17, 17);
				ctx.fillText(b,j * 18 + 4, i * 18 + 14);	
			}
		})
	})
	
	
}

drawBoard();