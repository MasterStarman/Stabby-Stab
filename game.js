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
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//canvas fill color
c.fillStyle = "black";
c.fillRect(0, 0, canvas.width, canvas.height);

// Listen for window resize events
window.addEventListener("resize", function () {
	// Update canvas dimensions when the window is resized
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
});

//Player sprites
class Sprite {
	constructor({ position, velocity, color = "red", offset }) {
		this.position = position;
		this.velocity = velocity;
		this.width = 50;
		this.height = 150;
		this.lastKey;
		this.attackBox = {
			position: { x: this.position.x, y: this.position.y },
			width: 100,
			height: 50,
			offset,
		};
		this.color = color;
		this.isAttacking = false;
		this.health = 100;
	}

	//Sprite Draw
	draw() {
		c.fillStyle = this.color;
		c.fillRect(this.position.x, this.position.y, this.width, this.height);

		//Attack box draw
		if (this.isAttacking) {
			c.fillStyle = "green";
			c.fillRect(
				this.attackBox.position.x,
				this.attackBox.position.y,
				this.attackBox.width,
				this.attackBox.height
			);
		}
	}

	update() {
		this.draw();
		this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
		this.attackBox.position.y = this.position.y;

		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;

		//this causes the players to always move down until they hit the ground then stop
		if (this.position.y + this.height + this.velocity.y >= canvas.height) {
			this.velocity.y = 0;
		} else this.velocity.y += gravity;
	}

	attack() {
		this.isAttacking = true;
		setTimeout(() => {
			this.isAttacking = false;
		}, 100);
	}
}

//player1
const player1 = new Sprite({
	position: {
		//starting position
		x: 15,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	offset: {
		x: 0,
		y: 0,
	},
});

//Player2
const player2 = new Sprite({
	position: {
		//starting position
		x: 500,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	color: "blue",
	offset: {
		x: -50,
		y: 0,
	},
});

function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
			rectangle2.position.x &&
		rectangle1.attackBox.position.x <=
			rectangle2.position.x + rectangle2.width &&
		rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
			rectangle2.position.y &&
		rectangle1.attackBox.position.y <=
			rectangle2.position.y + rectangle2.height
	);
}

//function for determining the winner based off of health
function matchResult({ player1, player2, timerId }) {
	clearTimeout(timerId);
	document.querySelector("#matchResult").style.display = "flex";
	if (player1.health === player2.health) {
		document.querySelector("#matchResult").innerHTML = "Tie";
	}
	if (player1.health > player2.health) {
		document.querySelector("#matchResult").innerHTML = "Player 1 Wins";
	}
	if (player1.health < player2.health) {
		document.querySelector("#matchResult").innerHTML = "Player 2 Wins";
	}
}

//Timer
let timer = 10;
let timerId;
function decreaseTimer() {
	if (timer > 0) {
		timerId = setTimeout(decreaseTimer, 1000);
		timer--;
		document.querySelector("#timer").innerHTML = timer;
	}

	//Match Results after the timer has elapsed
	if (timer === 0) {
		matchResult({ player1, player2, timerId });
	}
}

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

	//detect for collision of hit box with player1
	if (
		rectangularCollision({
			rectangle1: player1,
			rectangle2: player2,
		}) &&
		player1.isAttacking
	) {
		player1.isAttacking = false;
		player2.health -= 20;
		document.querySelector("#player2Health").style.width =
			player2.health + "%";
		console.log("player1 attack");
	}

	//detect for collision of hit box with player2
	if (
		rectangularCollision({
			rectangle1: player2,
			rectangle2: player1,
		}) &&
		player2.isAttacking
	) {
		player2.isAttacking = false;
		player1.health -= 20;
		document.querySelector("#player1Health").style.width =
			player1.health + "%";
		console.log("player2 attack");
	}

	//Match result based on player's health
	if (player1.health <= 0 || player2.health <= 0) {
		matchResult({ player1, player2, timerId });
	}

	//console.log("animation running");
}

//Execute functions list
animate();
decreaseTimer();

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
		case " ": //attack
			player1.attack();
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

		case "0": //attack
			player2.attack();
			break;
	}

	//key determination
	//console.log(event.key);
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
		/*Not needed for jumping action
		case "w":
			keys.w.pressed = false;
			break;*/

		//Player 2 keys
		case "ArrowRight":
			keys.ArrowRight.pressed = false;
			break;
		case "ArrowLeft":
			keys.ArrowLeft.pressed = false;
			break;
		/*Not needed for jumping action
		case "ArrowUp":
			keys.ArrowUp.pressed = false;
			break;*/
	}

	//key determination
	//console.log(event.key);
});

//Console.log tests
//console.log("player1: ");
