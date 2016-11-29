var Class = require('class-wrapper').Class;
var GraphNode = require('./src/GraphNode');
var d3 = require('d3-selection');

/**
 * Rendering engine
 *
 * It renders the positioned nodes and bind them with arrows.
 *
 * @param {Object} [properties] - Properties. Any of already defined properties can be redefined and new one can be added. Only property names which are already defined for methods or if the value is undefined, then such properties will be skipped and warnong message will be displayed in the console.
 */
var Rendering = Class(function(properties) {
	if (properties) {
		this.setProperties(properties);
	}
}, /** @lends Rendering.prototype */ {
	cssFile: '',
	nodeDimensions: {
		width: 80,
		height: 30
	},
	spacing: {
		horizontal: 10,
		vertical: 10
	},
	text: {
		dx: 10,
		dy: 20,
		'text-anchor': 'middle'
	},
	_scale: {
		x: 100,
		y: 50
	},

	/**
	 * Reset the properies
	 *
	 * @param {Object} [properties] - Properties. Any of already defined properties can be redefined and new one can be added. Only property names which are already defined for methods or if the value is undefined, then such properties will be skipped and warnong message will be displayed in the console.
	 */
	setProprties: function(properties) {
		Object.keys(properties).forEarch(property => {
			if (typeof this[property] === 'function') {
				console.warn(`Rendering(): property ${property} is skipped because this name is already reserved for a method`);
				return;
			}

			var value = properties[property];
			if (typeof value === 'undefined') {
				console.warn(`Rendering(): property ${property} is skipped because it's value is undefined`);
				return;
			}

			this[property] = properties[property];
		});

		this._scale.x = this.nodeDimensions.width + 2 * this.spacing.horizontal;
		this._scale.y = this.nodeDimensions.height + 2 * this.spacing.vertical;
	},

	/**
	 * Set nodes, which will be rendered
	 *
	 * @param {GraphNode[]} nodes - Set of nodes
	 */
	render: function(nodes) {
		var maxX = 0;
		var maxY = 0;
		var domContainer = d3.select('body');

		var domSvg = domContainer.append('svg');

		nodes.forEach(node => {
			var domNode = this.renderNode(node, domSvg);

			//node's X and Y coordinates are rescaled in the method renderNode
			if (maxX < node.x) {
				maxX = node.x;
			}
			if (maxY < node.y) {
				maxY = node.y;
			}
		});

		domSvg.attr('width', maxX + this.nodeDimensions.width + this.spacing.horizontal);
		domSvg.attr('height', maxY + this.nodeDimensions.height + this.spacing.vertical);

		return domContainer;
	},

	renderNode: function(node, domContainer) {
		node.x = (node.x + 0.5) * this._scale.x
		node.y = (node.y + 0.5) * this._scale.y

		var domG = domContainer.append('g')
			.attr('class', node.type)
			.attr('transform', `translate(${node.x}, ${node.y})`);

		var domA = domG.append('a')
			.attr('xlink:href', node.link);

		var domBorder = domA.append('rect')
			.attr('width', this.nodeDimensions.width)
			.attr('height', this.nodeDimensions.height);

		var domText = domA.appen('text');
		for (var attr in this.text) {
			domText.attr(attr, this.text[attr]);
		}
		domText.text(node.name);

		return domG;
	},

	renderConnectionLine: function(nodeA, nodeB) {
	}
});
