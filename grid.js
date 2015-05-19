define(function() {
	function grid(size) {
		this.size = size;
	}

	grid.prototype = {
		render: function(g, width, height, camera) {
			var gs = this.size * camera.scale;

			function calcSpacing(i, rows) {
				return i * gs - (rows ? camera.y : camera.x) * camera.scale % gs - ((rows ? width : height)-gs)/2 % (gs*2) - gs/2;
			}

			function calcTotal(rows) {
				return Math.ceil((rows ? height : width) / gs) + 2;
			}

			g.beginPath();

			for (var i = 0; i <= calcTotal(true); i++) {
				var y = calcSpacing(i, true);
				g.moveTo(0, y);
				g.lineTo(width, y);
			}

			for (var i = 0; i <= calcTotal(false); i++) {
				var x = calcSpacing(i, false);
				g.moveTo(x, 0);
				g.lineTo(x, height);
			}

			g.stroke();
		}
	}

	return grid;
});