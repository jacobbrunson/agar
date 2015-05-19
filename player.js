define(["./blob"], function(Blob) {
	function player(name, radius, color, x, y) { //TODO: auto generate radius, color, x, y
		this.id = ("xxxxxxxxxxxx"+name).replace(/[x]/g, function(c) {var r = Math.random()*16|0,v=c=="x"?r:r&0x3|0x8;return v.toString(16);});
		this.name = name;
		this.blobs = [new Blob(this.id, radius, color, x, y)];
	}

	player.prototype = {
		
	}

	return player;
});