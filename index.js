const playerCanvas = document.getElementById('snake_board1');
const enemyCanvas = document.getElementById('snake_board2');
const foodCanvas = document.getElementById('food_board')
playerCanvas.style.position = 'absolute';
enemyCanvas.style.position = 'absolute';
foodCanvas.style.position = 'absolute';

foodCanvas.width = window.innerWidth;
foodCanvas.height = window.innerHeight;

const commands = {
	ArrowLeft: false,
	ArrowRight: false,
}

const dimensions = { width: window.innerWidth, height: window.innerHeight }

const playerSnake = Snake({ length: 50, canvas: playerCanvas, dimensions, player: true, controls: { left: 65, right: 68 } });

const enemySnake = Snake({ length: 50, canvas: enemyCanvas, dimensions, color: 'gray', initCoord: [500, 500], direction: 135, player: true });


setInterval(snakeLogic.bind(null, playerSnake), 40)
setInterval(snakeLogic.bind(null, enemySnake), 40)
setInterval(Snake.detectCollision.bind(null, { length: 1, velocity: 3, minLength: 25 }, playerSnake, enemySnake))

function snakeLogic(snake) {
	snake.calc();
	snake.render();
}