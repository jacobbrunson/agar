requirejs.config({
    baseUrl: "",
    paths: {
        jquery: "jquery"
    },
    shim: {
    	"quadtree": {
    		exports: "Quadtree",
    		init: function() {
    			Quadtree = this.Quadtree
    			Quadtree.prototype.render = function(g) {
    				var drawQuadtree = function(node) {
						var bounds = node.bounds;
						if (node.nodes.length === 0) {
							g.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
						} else {
							for (var i = 0; i < node.nodes.length; i++) {
								drawQuadtree(node.nodes[i]);
							}
						}
					};

    				g.save();
    				g.strokeStyle = "rgba(255, 0, 0, 0.8)";
    				drawQuadtree(this);
    				g.restore();
    			}
    		}
    	}
    }
});

requirejs(["main"]);