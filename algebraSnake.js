////////////////////////////////////////////////////////////////////////////////////////////////
////  Algebra Snake module
////////////////////////////////////////////////////////////////////////////////////////////////
(function (global) {
	/***
	 * @param {DomNode} [canvas] - The 2d context of the canvas on which the snake will be rendered !NOT OPTIONAL ON CLIENT SIDE!.
	 * @param {Object} [dimensions] - The dimensions of the canvas in which the snake is running.
	 * @param {Number} [dimensions.height = 800] - The height of the canvas.
	 * @param {Number} [dimensions.width = 800] - The width of the canvas.
	 * @param {Number} [velocity = 0] - Initial velocity of the snake.
	 * @param {Number} [direction = 45] - Initial angle of the snake.
	 * @param {Array} [initCoord = [100, 100]] - Initial x, y coordinate of the snake.
	 * @param {Number} [length = 10] - The number of segments in the initial snake.
	 * @param {Array} [coordHistory = [[...initCoord]] - An array of x, y coordinates for each node in the snake.
	 * @param {String} [color = "bada55"] - The color value of the snake.
	 * @param {Boolean} [player] - A booloean identifying if the snake is the current player.
	 * @param {Object} [controls] - A object containing the keycodes that will be used to run the controls.
	 * @param {Number} [controls.left = 37] - The key code of the left command.
	 * @param {Number} [controls.right = 39] - The key code of the right command.
	 */
	// --- returns a new instance of the constructor when called eliminating the need for the new key word --- //
	const Snake = function ({ canvas, dimensions, velocity, direction, initCoord, length, coordHistory, color, player, controls } = {}) {
		return new Snake.init(canvas, dimensions, velocity, direction, initCoord, length, coordHistory, color, player, controls);
	}

	Snake.prototype = {
		/**
		 * @param {Snake [object Object]} snake - An instance of the snake class to be rendered.
		 */
		// --- Does pre-render calculations to move the snake --- //
		calc: function () {
			// Adjusts the direction based on the command inputs
			if (this.commands[this.controls.left]) {
				if (!this.direction) {
					this.direction = 360;
				}
				this.direction -= 15;
				if (!this.direction) {
					this.direction = 360;
				}
			}
			if (this.commands[this.controls.right]) {
				if (this.direction === 360) {
					this.direction = 0
				}
				this.direction += 15;
				if (this.direction === 360) {
					this.direction = 0
				}
			}
			// creates new snake nodes
			let rad = (this.direction * Math.PI) / 180
			for (let i = Math.ceil(this.velocity) / 5; i > 0; i--) {
				let x = 5 * Math.cos(rad) + this.lastCoord[0];
				let y = 5 * Math.sin(rad) + this.lastCoord[1];
				// makes the screen a loop
				if (x < 0) {
					x = this.field.width;
				}
				if (y < 0) {
					y = this.field.height;
				}
				if (x > this.field.width) {
					x = 0;
				}
				if (y > this.field.height) {
					y = 0;
				}
				this.coordHistory.unshift([x, y]);
				this.lastCoord = [x, y];
			};
			// Adjusts the velocity for the next frame
			if ((!this.commands[this.controls.left] && !this.commands[this.controls.right]) && this.velocity < 20) {
				this.velocity += .3
			} else if (this.velocity > 4) {
				this.velocity -= 1
			}
		},
		// --- renders the snake object on the canvas --- //
		render: function () {
			if (global !== window) {
				throw Error('.render is a client side only method');
			}
			// Cleans the previous snake from the board
			this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
			this.coordHistory = this.coordHistory.slice(0, this.length - 1);
			//renders snake
			this.ctx.beginPath();
			this.ctx.moveTo(...this.coordHistory[0]);
			this.coordHistory.forEach((coord, i, arr) => {
				const x1 = coord[0],
					y1 = coord[1],
					x2 = (arr[i - 1] || [0])[0],
					y2 = (arr[i - 1] || [, 0])[1]
				const distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** .5;
				// Fixes issue where the line would extend the whole length of the screen when looping
				if (distance > 20) {
					this.ctx.moveTo(...coord);
				} else {
					this.ctx.lineTo(...coord);
				}
			});
			this.ctx.stroke();
		},
		/**
		 * @param {Rest} snakes - The snakes that are being checked for collisions.
		 * @param {Number} [length = 1] - The penalty for collision with another snake.
		 * @param {Number} [velocity = 1] - The velocity after a collision.
		 * @param {Number} [minLength = 10] - The minimum length for the snake will never dip below that.
		 */
		// --- This method is to detect collisions between snakes --- //
	}

	//////////////////////////////////////////////////////////////////////////////////////////
	//// Defining Global methods for the snake module.
	//////////////////////////////////////////////////////////////////////////////////////////

	/**
	 * @param {Rest} snakes - The snakes that are being checked for collisions.
	 * @param {Number} [length = 2] - The penalty for collision with another snake.
	 * @param {Number} [velocity = 3] - The velocity after a collision.
	 * @param {Number} [minLength = 10] - The minimum length for the snake will never dip below that.
	 */
	// --- This method is to detect collisions between snakes --- //
	Snake.detectCollision = function ({ length, velocity, minLength } = {}, ...snakes) {
		const collisions = [];
		snakes.forEach((snake, i) => {
			let otherSnakes = snakes.slice(0, i).concat(snakes.slice(i + 1));
			otherSnakes.forEach(otherSnakes => {
				otherSnakes.coordHistory.forEach(coord => {
					const x1 = coord[0],
						y1 = coord[1],
						x2 = snake.lastCoord[0];
					y2 = snake.lastCoord[1];
					const distance = ((x2 - x1) ** 2 + (y2 - y1) ** 2) ** .5;
					if (distance <= 10 && !collisions.includes(snake)) {
						collisions.push(snake);
					}
				})
			});
		});
		if (collisions[0]) {
			collisions.forEach(snake => {
				if (snake.length > (minLength || 10)) {
					snake.length -= length || 2;
				}
				snake.velocity = velocity || 3;
			})
		}
	}
	/**
	 * @param {Object} ctx - The context on to which the bacon will be drawn.
	 */
	Snake.placeFood = function (canvas) {
		const ctx = canvas.getContext('2d');
		ctx.font = '14px Font Awesome 5 Free';
		console.log('asdf');
		ctx.fillText('\uf7e5', 150, 150);
	}

	// --- Constructor for the snake --- //
	Snake.init = function (canvas, dimensions, velocity, direction, initCoord, length, coordHistory, color, player, controls) {
		this.velocity = velocity || 0;
		this.direction = direction || 45;
		this.lastCoord = initCoord || [100, 100];
		this.coordHistory = coordHistory || [[...this.lastCoord]];
		this.length = length || 10;
		this.field = dimensions || { height: 800, width: 800 };

		// Setting up the canvas for client side
		if (canvas) {
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			const { ctx } = this;
			canvas.width = dimensions.width;
			canvas.height = dimensions.height;
			ctx.lineJoin = 'round';
			ctx.lineCap = 'round';
			ctx.lineWidth = 15;
			ctx.strokeStyle = color || '#bada55';

		}
		// Initializes the users commands and add event listeners to the window
		this.controls = controls || { left: 37, right: 39 }
		this.commands = {
			[this.controls.left]: false,
			[this.controls.right]: false
		}
		// If we are in the browser and this snake is the player then add eventListeners
		if (global === window && player) {

			document.addEventListener('keydown', e => {
				this.commands[e.keyCode] = true;
			})

			document.addEventListener('keyup', e => {
				this.commands[e.keyCode] = false;
			})
		}
	}


	Snake.init.prototype = Snake.prototype;

	global.Snake = Snake;

})(this);  