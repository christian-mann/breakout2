function between(a,b,c) {
	return a <= b && b < c;
}

var W_GAME = 500;
var H_GAME = 500;
var W_PADDLE = 100;
var H_PADDLE = 10;
var W_BALL = 10;
var H_BALL = 10;
var W_BRICK = 20;
var H_BRICK = 10;

function main() {
	var playing = true;
	var paddle = document.getElementById("paddle");
	var game = document.getElementById("game");
	var lifes = document.getElementsByClassName("life");
	var message = document.getElementById("message");

	var leftpressed = false;
	var rightpressed = false;

	var ppaddlex = 0;
	var vballx;
	var vbally;
	var pballx;
	var pbally;

	function resetball() {
		vballx = 2;
		vbally = -2;
		pballx = 225;
		pbally = 400;
	}
	resetball();

	// add bricks
	for (var row = 0; row < 3; row++) {
		for (var col = 0; col < W_GAME/W_BRICK; col++) {
			var brick = document.createElement("div");
			brick.classList.add("brick");
			brick.style.left = col * (W_BRICK);
			brick.style.top = 40 + row * H_BRICK;
			game.appendChild(brick);
		}
	}

	// initial positions of paddle and ball
	ppaddlex = 200;


	// some events
	function loselife() {
		if (lifes.length > 0) {
			lifes[0].parentElement.removeChild(lifes[0]);
		} else {
			message.innerHTML = "Game over :(";
			vballx = vbally = 0;
			ball.classList.add('invisible');
			playing = false;
		}
	}

	// key listener
	window.onkeydown = (e) => {
		if (e.key == "ArrowRight") {
			rightpressed = true;
		} else if (e.key == "ArrowLeft") {
			leftpressed = true;
		}
	};

	window.onkeyup = (e) => {
		if (e.key == "ArrowRight") {
			rightpressed = false;
		} else if (e.key == "ArrowLeft") {
			leftpressed = false;
		}
	}
	
	// event loop
	window.setInterval(() => {
		// ball collision
		if (pballx <= 0) {
			// left wall
			vballx = Math.abs(vballx);
		}

		if (pballx >= W_GAME - W_BALL) {
			// right wall
			vballx = -Math.abs(vballx);
		}

		if (pbally <= 0) {
			// ceiling
			vbally = Math.abs(vbally);
		}

		if (pbally >= H_GAME - H_BALL) {
			// floor
			loselife();
			resetball();
		}

		if (470 <= pbally && pbally < 490 &&
			ppaddlex <= pballx && pballx < ppaddlex + W_PADDLE) {
			// collision with paddle
			vbally = -Math.abs(vbally);
			// which quintet?
			var quintet = (pballx - (ppaddlex + W_PADDLE/2)) / W_PADDLE * 5;
			console.log('quintet', quintet);
			vballx += quintet;
			console.log('vballx', vballx);
		}

		// brick collisions
		for (var brick of document.querySelectorAll(".brick")) {
			pbrickx = Number(brick.style.left.slice(0,-2));
			pbricky = Number(brick.style.top.slice(0,-2));
			// top wall
			if (Math.abs(pbally + 10 - pbricky) <= 2 &&
				between(pbrickx, pballx, pbrickx + W_BRICK)) {
				//debugger;
				brick.parentElement.removeChild(brick);
				vbally = -Math.abs(vbally);
			}
			// bottom wall
			if (Math.abs(pbally - (pbricky + 10)) <= 2 &&
				between(pbrickx, pballx, pbrickx + W_BRICK)
			) {
				//debugger;
				brick.parentElement.removeChild(brick);
				vbally = Math.abs(vbally);
			}
			// left wall
			if (
				Math.abs(pballx - (pbrickx + W_BRICK)) <= 2 &&
				between(pbricky, pbally, pbricky+10)
			) {
				brick.parentElement.removeChild(brick);
				vballx *= -1;
			}
			if (
				Math.abs(pballx + 10 - pbrickx) <= 2 &&
				between(pbricky, pbally, pbricky+10)
			) {
				brick.parentElement.removeChild(brick);
				vballx *= -1;
			}
		}

		// ball movement
		if (playing) {
			pballx += vballx;
			pbally += vbally;
			ball.style.left = pballx + "px";
			ball.style.top = pbally + "px";
		}


		// paddle
		if (leftpressed) {
			ppaddlex -= 3;
			if (ppaddlex < 0) ppaddlex = 0;
		} else if (rightpressed) {
			ppaddlex += 3;
			if (ppaddlex > 400) ppaddlex = 400;
		}
		paddle.style.left = ppaddlex + "px";
	}, 10);
};

main();
