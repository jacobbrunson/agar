define(["jquery", "./grid", "./camera", "./player"], function($, Grid, Camera, Blob) {

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


	var blobs = [
		new Blob(50, "#00FF00", 50, 200),
		new Blob(80, "#0000FF", 250, -150),
		new Blob(123, "#FF0000", -300, -50)
	];

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

		blobs[2].x += deltaX / length * speed;
		blobs[2].y += deltaY / length * speed;

		blobs[0].y += Math.cos(tick / 20) * 1.5;

		blobs[1].x += Math.sin(tick / 10);
		blobs[1].y += Math.cos(tick / 10);

		camera.x = blobs[2].x;
		camera.y = blobs[2].y;
		//camera.scale = ...

		grid.render(g, width, height, camera);

		g.translate(-camera.x * camera.scale + width / 2, -camera.y * camera.scale + height / 2);
		g.scale(camera.scale, camera.scale);

		$.each(blobs, function(i, blob1) {
			g.beginPath();
			g.fillStyle = blob1.color;
			g.strokeStyle = "#000";
			g.arc(blob1.x, blob1.y, blob1.mass, 0, Math.PI * 2, true);
			g.fill();
			$.each(blobs, function(i, blob2) {
				if (blob1.mass - 20 > blob2.mass) {
					if (Math.pow(blob1.x - blob2.x, 2) + Math.pow(blob1.y - blob2.y, 2) <= Math.pow(blob1.mass, 2)) {
						blob2.color = "#000";
					}
				}
			});
		});

		g.restore();

		window.requestAnimationFrame(render);
	}
});


