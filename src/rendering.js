var Class = require('class-wrapper').Class;
var d3 = require('d3-selection');

/**
 * Rendering engine
 *
 * It renders the positioned nodes and bind them with arrows.
 *
 * @param {Object} [nodeProperties] - see [setNodeProperties]{@link Rendering#setProperties}
 */
var Rendering = Class(function(nodeProperties) {
	if (nodeProperties) {
		this.setNodeProperties(nodeProperties);
	}
}, /** @lends Rendering.prototype */ {
	nodeProperties: {
		dimensions: {
			width: 80,
			height: 30
		},
		spacing: {
			horizontal: 10,
			vertical: 10
		},
		text: {
			dx: 10,
			dy: 20
		}
	},

	/**
	 * Scaling factors of X and Y coordiantes
	 *
	 * @type {Object}
	 * @property {Number} x - Scale factor for X coordinates
	 * @property {Number} y - Scale factor for Y coordinates
	 */
	_scale: {
		x: 100,
		y: 50
	},

	/**
	 * Reset the node properies
	 *
	 * @param {Object} [properties] - Properties. Any of already defined properties can be redefined and new one can be added. Only property names which value is undefined will be skipped and warnong message will be displayed in the console.
	 */
	setNodeProprties: function(properties) {
		for (var property in properties) {
			let value = properties[property];
			if (typeof value === 'undefined') {
				console.warn(`Rendering.setProperties(): property ${property} is skipped because it's value is undefined`);
				continue;
			}

			this.nodeProperties[property] = properties[property];
		}

		// Calculate the scaling factors for the real (rendered) coordinate system
		// --------------------------------------------------
		const {dimensions, spacing} = this.nodeProperties;
		this._scale.x = dimensions.width + 2 * spacing.horizontal;
		this._scale.y = dimensions.height + 2 * spacing.vertical;
		// --------------------------------------------------
	},

	/**
	 * Set nodes, which will be rendered
	 *
	 * @param {GraphNode[]} nodes - Set of nodes
	 */
	render: function(nodes) {
		var minX = Infinity;
		var maxX = -Infinity;
		var minY = Infinity;
		var maxY = -Infinity;

		// Create the base contained elements for the diagram
		// --------------------------------------------------
		var domContainer = d3.select('body');
		var domSvg = domContainer.append('svg');
		var domDiagram = domSvg.append('g')
		// --------------------------------------------------

		// Render the nodes and find the real diagram boundaries
		// --------------------------------------------------
		nodes.forEach(node => {
			var domNode = this.renderNode(node, domDiagram);

			//node's X and Y coordinates are rescaled in the method renderNode
			if (minX > node.x) {
				minX = node.x;
			}
			if (maxX < node.x) {
				maxX = node.x;
			}
			if (minY > node.y) {
				minY = node.y;
			}
			if (maxY < node.y) {
				maxY = node.y;
			}
		});
		// --------------------------------------------------

		// TODO Render connection lines
		// --------------------------------------------------
		// --------------------------------------------------

		// Setup the properties for the diagram containers
		// --------------------------------------------------
		domSvg
			.attr('width', (maxX - minX) + this._scale.x)
			.attr('height', (maxY - minY) + this._scale.y)
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
			.attr('version', '1.1');

		if (minX < 0 || minY < 0) {
			domDiagram.attr('transform', `translate(${-minX}, ${-minY})`);
		}
		// --------------------------------------------------

		return domContainer;
	},

	/**
	 * Render a node
	 *
	 * @param {GraphNode} node - Node which will be rendered
	 * @param {D3Selection} domContainer - DOM comntainer where the rendered node will be placed.
	 */
	renderNode: function(node, domContainer) {
		var props = this.nodeProperties;
		var domNode;

		// Reposition node by taking into the account the real element dimensaions
		// --------------------------------------------------
		node.x = node.x * this._scale.x + props.spacing.horizontal;
		node.y = node.y * this._scale.y + props.spacing.vertical;
		// --------------------------------------------------

		// Create a group for the all elements related to the node: rectangle, link, text
		// --------------------------------------------------
		domNode = domContainer.append('g')
			.attr('class', node.type)
			.attr('transform', `translate(${node.x}, ${node.y})`);
		// --------------------------------------------------

		// App link element if possible and make that element as the main container of rectangle and text
		// --------------------------------------------------
		if (node.data.link) {
			domNode = domNode.append('a')
				.attr('xlink:href', node.data.link);
		}
		// --------------------------------------------------

		// Create rectangle element in the main container
		// --------------------------------------------------
		var domBorder = domNode.append('rect')
			.attr('width', props.dimensions.width)
			.attr('height', props.dimensions.height);
		// --------------------------------------------------

		// Add text (node name) into the main container
		// --------------------------------------------------
		var domText = domNode.append('text');
		for (var attr in props.text) {
			domText.attr(attr, props.text[attr]);
		}
		domText.text(node.name);
		// --------------------------------------------------

		return domNode;
	},

	renderConnectionLine: function(nodeA, nodeB) {
	}
});

module.exports = Rendering;
