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
let timer = 30;
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
