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
		new Player("fake1", 50, "#00FF00", 50, 200),
		new Player("fake2", 80, "#0000FF", 250, -150),
		new Player("fruitcup", 123, "#FF0000", -300, -50)
	];

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


		var deltaX = (mouse.x - width/2),
			deltaY = (mouse.y - height/2),
			length = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)),
			speed = 5;

		players[2].blobs[0].x += deltaX / length * speed;
		players[2].blobs[0].y += deltaY / length * speed;

		camera.x = players[2].blobs[0].x;
		camera.y = players[2].blobs[0].y;
		//camera.scale = ...

		grid.render(g, width, height, camera);

		g.translate(-camera.x * camera.scale + width / 2, -camera.y * camera.scale + height / 2);
		g.scale(camera.scale, camera.scale);

		tree.clear();
		$.each(players, function(i, player) {
			$.each(player.blobs, function(i, blob) {
				tree.insert(blob);
				g.beginPath();
				g.fillStyle = blob.color;
				g.strokeStyle = "#000";
				g.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2, true);
				g.fill();
			});
		});

		$.each(players, function(_, player1) {
			$.each(player1.blobs, function(_, blob1) {
				$.each(tree.retrieve(blob1), function(i, blob2) {
					if (blob1.player != blob2.player) {
						if (blob1.radius - 20 > blob2.radius) {
							if (Math.pow(blob1.x - blob2.x, 2) + Math.pow(blob1.y - blob2.y, 2) <= Math.pow(blob1.radius, 2)) {
								blob1.radius += blob2.radius;
								$.each(players, function(_, player2) {
									if (blob2.player == player2.id) {
										player2.blobs.splice(i, 1);
									}
								});
							}
						}
					}
				});
			});
		});

		g.restore();

		window.requestAnimationFrame(render);
	}
});


