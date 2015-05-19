define(function() {
	function blob(player, radius, color, x, y) {
		this.player = player;
		this.radius = radius;
		this.color = color;
		this.x = x;
		this.y = y;
		this.vx = 0;
		this.vy = 0;
	}

	blob.prototype = {
		render: function(g) {
			g.beginPath();
			g.fillStyle = this.color;
			g.strokeStyle = "#000";
			g.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
			g.fill();

			g.font = "48px impact";
			g.fillStyle = "#FFF";
			g.strokeStyle = "#000";
			g.lineWidth = 2;
			g.textAlign = "center";
			//g.fillText(this.player.substring(12), this.x, this.y + 20);
			//g.strokeText(this.player.substring(12), this.x, this.y + 20);
		}
	}

	return blob;
});