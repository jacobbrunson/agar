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
				speed = 375 / blob.radius;
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
							if (dist >= 0) {
								//var dist = Math.sqrt(distSquared);
								//console.log(dist);
								var l1 = Math.sqrt(Math.pow(blob1.vx, 2) + Math.pow(blob1.vy, 2)); //TODO: account for mass
								var l2 = Math.sqrt(Math.pow(blob2.vx, 2) + Math.pow(blob2.vy, 2));

								var d1 = dist * l1 / (l1 + l2);
								var d2 = dist * l2 / (l1 + l2);

								console.log(l1, l2, "|", d1, d2);
	
								blob1.x -= blob1.vx / l1 * d1;
								blob1.y -= blob1.vy / l1 * d1;
								blob2.x -= blob2.vx / l2 * d2;
								blob2.y -= blob2.vy / l2 * d2;
							}
						}
					}
				});
			});
		});

$.each(players, function(i, player) {
			$.each(player.blobs, function(i, blob) {
				//tree.insert(blob);
				blob.render(g);
			});
		});

		g.restore();

		setTimeout(function() {
			window.requestAnimationFrame(render);
		}, 0);
	}
});


