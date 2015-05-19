define(["jquery", "quadtree", "./grid", "./camera", "./blob", "./player"], function($, Quadtree, Grid, Camera, Blob, Player) {

	//Set up game
	var grid = new Grid(50);
	var camera = new Camera(0, 0, 1.0);

	//Set up canvas
	var canvas = $("#canvas").get(0);
	var g = canvas.getContext("2d");

	//Handle window (re)sizing
	var width, height;
	function resize() {
		width = window.innerWidth;
		height = window.innerHeight;
		canvas.width = width;
		canvas.height = height;
	}
	resize();
	$(window).resize(resize);

	//Handle mouse movement
	var mouse = {x: 0, y: 0};
	$(window).mousemove(function(event) {
		mouse.x = event.pageX;
		mouse.y = event.pageY;
	});

	//Set up quadtree
	var players = [
		new Player("fake1", 20, "#00FF00", 50, 200),
		new Player("fake2", 50, "#0000FF", 250, -150),
		new Player("fruitcup", 75, "#FF0000", -300, -50)
	];

	players[2].blobs[1] = new Blob(players[2].id, 75, "#FF0000", -120, -50);
	players[2].blobs[2] = new Blob(players[2].id, 30, "#FF0000", -120, -500);
	players[2].blobs[3] = new Blob(players[2].id, 45, "#FF0000", -500, -500);
	players[2].blobs[4] = new Blob(players[2].id, 60, "#FF0000", 500, -500);

	var tree = new Quadtree({
		x: -2000,
		y: -2000,
		width: 4000,
		height: 4000
	}, 20, 6);

	var tick = 0;

	window.requestAnimationFrame(render);
	function render() {
		g.clearRect(0, 0, width, height);

		g.fillStyle = "#000000";
		g.strokeStyle = "#000000";

		g.save();

		tick++;

		$.each(players[2].blobs, function(_, blob) {
			var deltaX = (mouse.x - width/2 + camera.x - blob.x),
				deltaY = (mouse.y - height/2 + camera.y - blob.y),
				length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
				speed = 100 / blob.radius;
			blob.vx = deltaX / length * speed * Math.min(1, Math.pow(deltaX / blob.radius, 2));
			blob.vy = deltaY / length * speed * Math.min(1, Math.pow(deltaY / blob.radius, 2));
			blob.x += blob.vx;
			blob.y += blob.vy;
		});

		//camera.x = players[2].blobs[0].x;
		//camera.y = players[2].blobs[0].y;
		//camera.scale = ...

		grid.render(g, width, height, camera);

		g.translate(-camera.x * camera.scale + width / 2, -camera.y * camera.scale + height / 2);
		g.scale(camera.scale, camera.scale);

		tree.clear();
		$.each(players, function(i, player) {
			$.each(player.blobs, function(i, blob) {
				tree.insert(blob);
				//blob.render(g);
			});
		});

		$.each(players, function(i, player) {
			$.each(player.blobs, function(i, blob) {
				//tree.insert(blob);
				blob.render(g);
			});
		});

		$.each(players, function(_, player1) {
			$.each(player1.blobs, function(_, blob1) {
				$.each(tree.retrieve(blob1), function(i, blob2) {
					if (!blob2.dead) {
						if (blob1.player != blob2.player) {
							if (blob1.radius - 20 > blob2.radius) {
								if (Math.pow(blob1.x - blob2.x, 2) + Math.pow(blob1.y - blob2.y, 2) <= Math.pow(blob1.radius, 2)) {
									blob1.radius += blob2.radius;
									blob2.dead = true;
									$.each(players, function(_, player2) {
										player2.blobs = $.grep(player2.blobs, function(blob3) {
											if (blob2.x == blob3.x && blob2.y == blob3.y) {
												return false;
											}
											return true;
										});
									});
								}
							}
						} else if (blob1.radius != blob2.radius || blob1.x != blob2.x || blob1.y != blob2.y) {
							//IDRK WHAT IM DOING LOL
							var dist = blob1.radius + blob2.radius - Math.sqrt(Math.pow(blob1.x - blob2.x, 2) + Math.pow(blob1.y - blob2.y, 2));
							if (dist >= 1) {
								var px = blob1.x - blob2.x,
									py = blob1.y - blob2.y,
									vx = blob1.vx - blob2.vx,
									vy = blob1.vy - blob2.vy;
								var t = (Math.sqrt(px*px + py*py) - (blob1.radius+blob2.radius)) / Math.sqrt(vx*vx + vy*vy);

								var b1 = blob1.radius / (blob1.radius + blob2.radius),
									b2 = blob2.radius / (blob1.radius + blob2.radius);

								var mx = blob1.vx*b1 + blob2.vx*b2,
									my = blob1.vy*b1 + blob2.vy*b2;

								blob1.x += blob1.vx * t + mx;
								blob1.y += blob1.vy * t + my;
								blob2.x += blob2.vx * t + mx;
								blob2.y += blob2.vy * t + my;

							}
						}
					}
				});
			});
		});



		g.restore();

		setTimeout(function() {
			window.requestAnimationFrame(render);
		}, 0);
	}
});


