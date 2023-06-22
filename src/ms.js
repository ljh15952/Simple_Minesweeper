let canvas = document.getElementById('canvas');
let cfx = canvas.getContext('2d')

const getMousep = e => {
	const canv = e.target.getBoundingClientRect();
	return {};
}

canvas.addEventListener('mousemove', e => {
	const canv = canvas.getBoundingClientRect();
	pos = {x: Math.floor(e.clientX - canv.left), y: Math.floor(e.clientY - canv.top) };
	console.log(pos);
})