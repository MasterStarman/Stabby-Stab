const canvas = document.querySelector("canvas");

const c = canvas.getContext("2d");

const gravity = 0.75;

//Load the background image
const backgroundImage = new Image();
backgroundImage.src = "./img/background/resized_background.png";

const background = new Sprite({
	position: {
		x: 0,
		y: 0,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	imageSrc: "./img/background/resized_background.png",
});

const shop = new Sprite({
	position: {
		x: 600,
		y: 258,
	},
	velocity: {
		x: 0,
		y: 0,
	},
	imageSrc: "./img/decorations/shop_anim.png",
	scale: 2,
	framesMax: 6,
	framesHold: 10,
});

const keys = {
	a: {
		pressed: false,
	},
	d: { pressed: false },
	ArrowLeft: { pressed: false },
	ArrowRight: { pressed: false },
};
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

//player1
const player1 = new Fighter({
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
	imageSrc: "./img/character/Hero Knight/Sprites/idle.png",
	framesMax: 11, //This is how many pictures there are in the sprite sheet
	scale: 1.75,
	offset: {
		x: 140,
		y: 52,
	},
	framesHold: 3,
	sprites: {
		idle: {
			imageSrc: "./img/character/Hero Knight/Sprites/idle.png",
			framesMax: 11, //This is how many pictures there are in the sprite sheet
		},
		run: {
			imageSrc: "./img/character/Hero Knight/Sprites/run.png",
			framesMax: 8, //This is how many pictures there are in the sprite sheet
		},
		jump: {
			imageSrc: "./img/character/Hero Knight/Sprites/jump.png",
			framesMax: 3, //This is how many pictures there are in the sprite sheet
		},
		fall: {
			imageSrc: "./img/character/Hero Knight/Sprites/fall.png",
			framesMax: 3, //This is how many pictures there are in the sprite sheet
		},
	},
});

//Player2
const player2 = new Fighter({
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
	imageSrc: "./img/character/Hero Knight/Sprites/idle.png",
	framesMax: 11, //This is how many pictures there are in the sprite sheet
	scale: 1.75,
	offset: {
		x: -140,
		y: 52,
	},
	framesHold: 3,
});

//Function to draw the background image with the updated size
function drawBackground() {
	c.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
}

//Infinite animate loop
function animate() {
	requestAnimationFrame(animate);
	//keeps screen black for the canvas
	c.fillStyle = "black";
	//makes the canvas reset to clear to give the look of movement
	c.fillRect(0, 0, canvas.width, canvas.height);
	drawBackground();
	background.update();
	shop.update();
	//runs player animation
	player1.update();
	player2.update();

	//player 1 movement
	player1.velocity.x = 0;
	//idle animation

	//left and right move animation
	if (keys.a.pressed && player1.lastKey === "a") {
		player1.velocity.x = -10;
		player1.switchSprite("run");
	} else if (keys.d.pressed && player1.lastKey === "d") {
		player1.velocity.x = 10;
		player1.switchSprite("run");
	} else player1.switchSprite("idle");

	//jump animation
	if (player1.velocity.y < 0) {
		player1.switchSprite("jump");
	} else if (player1.velocity.y > 0) {
		player1.switchSprite("fall");
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
