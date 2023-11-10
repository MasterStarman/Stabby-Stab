const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const gravity = 0.75;
const keys = {
	a: {
		pressed: false,
	},
	d: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowRight: { pressed: false },
};
//let lastKey;

//canvas defaults

//canvas size
canvas.width = 1024;
canvas.height = 576;

//canvas fill color
c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

//Player sprites
class Sprite {
	constructor({ position, velocity }) {
		this.position = position;
		this.velocity = velocity;
		this.height = 150;
		this.lastKey;
	}

	draw() {
		c.fillStyle = "red";
		c.fillRect(this.position.x, this.position.y, 50, this.height);
	}

	update() {
		this.draw();

		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		//this causes the players to always move done until they hit the ground then stop
		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		} else this.velocity.y += gravity;
	}
}

//player1
const player1 = new Sprite({
	position: {
		//starting position
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
});

//Player2
const player2 = new Sprite({
	position: {
		//starting position
		x: 400,
		y: 100,
	},
	velocity: {
		x: 0,
		y: 0,
	},
});

//Infinite animate loop
function animate() {
	requestAnimationFrame(animate);
	//keeps screen black for the canvas
	c.fillStyle = "black";
	//makes the canvas reset to clear to give the look of movement
	c.fillRect(0, 0, canvas.width, canvas.height);
	//runs player animation
	player1.update();
	player2.update();

	//player 1 movement
	player1.velocity.x = 0;
	if (keys.a.pressed && player1.lastKey === "a") {
		player1.velocity.x = -10;
	} else if (keys.d.pressed && player1.lastKey === "d") {
		player1.velocity.x = 10;
	}

	//player 2 movement
	player2.velocity.x = 0;
	if (keys.ArrowLeft.pressed && player2.lastKey === "ArrowLeft") {
		player2.velocity.x = -10;
	} else if (keys.ArrowRight.pressed && player2.lastKey === "ArrowRight") {
		player2.velocity.x = 10;
	}

	console.log("animation running");
}

//Execute functions list
animate();

//Event listeners
window.addEventListener("keydown", (event) => {
	switch (event.key) {
		//Player 1 keys
		case "d": //right
			keys.d.pressed = true;
			player1.lastKey = "d";
			break;
		case "a": //left
			keys.a.pressed = true;
			player1.lastKey = "a";
			break;
		case "w": //jump
			player1.velocity.y = -20;
			break;

		//Player 2 keys
		case "ArrowRight": //right
			keys.ArrowRight.pressed = true;
			player2.lastKey = "ArrowRight";

			break;
		case "ArrowLeft": //left
			keys.ArrowLeft.pressed = true;
			player2.lastKey = "ArrowLeft";

			break;
		case "ArrowUp": //jump
			player2.velocity.y = -20;
			break;
	}

	console.log(event.key);
});

window.addEventListener("keyup", (event) => {
	switch (event.key) {
		//Player 1 keys
		case "d":
			keys.d.pressed = false;
			break;
		case "a":
			keys.a.pressed = false;
			break;
		/*case "w":
			keys.w.pressed = false;
			break;*/

		//Player 2 keys
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
		/*case "ArrowUp":
			keys.ArrowUp.pressed = false;
			break;*/
	}
	console.log(event.key);
});

//Console.log tests
console.log("player1: ");
