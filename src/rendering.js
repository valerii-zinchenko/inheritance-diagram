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
	render: function(noi) {
		var minX = Infinity;
		var maxX = -Infinity;
		var minY = Infinity;
		var maxY = -Infinity;

		// Create the base contained elements for the diagram
		// --------------------------------------------------
		var domContainer = d3.select('body');
		var domSvg = domContainer.append('svg');
		var domDiagram = domSvg.append('g');
		// --------------------------------------------------

		// Render the nodes and find the real diagram boundaries
		// --------------------------------------------------
		[noi].concat(noi.parentStack, noi.children, noi.mixins)
			.forEach(node => {
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

		// TODO: Build end marker for connecting line
		// Render connection lines
		// --------------------------------------------------
		this.renderConnections(noi, domSvg);
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

	/**
	 * Render all connections between nodes
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} noi - node of interest
	 * @param {D3Selection} domContainer - DOM comntainer where the rendered connection will be placed
	 */
	renderConnections: function(noi, domContainer) {
		var connections = [];

		// Connect parents
		const parentStack = noi.parentStack;
		if (parentStack.length > 0) {
			this._renderVerticalConnection(noi, parentStack[0], 'parent');

			for (var n = 0, N = parentStack.length - 1; n < N; n++) {
				this._renderConnection(parentStack[n], parentStack[n+1], 'parent');
			}
		}

		//Connect children
		noi.children.forEach(child => {
			this._renderVerticalConnection(child, noi, 'child');
		});

		// Connect mixins
		noi.mixins.forEach(mixin => {
			this._renderHorizontalConnection(mixin, noi, 'mixin');
		});
	},

	/**
	 * Render a connection line from the right edge of node A to the left edge of a node B
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @param {D3Selection} domContainer - DOM container where the connection line will be inserted
	 * @param {String} [type=''] - Type of a connection line. This will be directly added to the class attribute
	 */
	_renderHorizontalConnection: function(nodeA, nodeB, domContainer, type) {
		domContainer.append('path')
			.attr('transform', this._buildOffsetForHorizontalPath(nodeA, nodeB))
			.attr('d', this._buildHorizontalPath(nodeA, nodeB))
			.attr('class', type || '');
	},

	/**
	 * Render a connection line from the top edge of node A to the bottom edge of a node B
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @param {D3Selection} domContainer - DOM container where the connection line will be inserted
	 * @param {String} [type=''] - Type of a connection line. This will be directly added to the class attribute
	 */
	_renderVerticalConnection: function(nodeA, nodeB, domContainer, type) {
		domContainer.append('path')
			.attr('transform', this._buildOffsetForVerticalPath(nodeA, nodeB))
			.attr('d', this._buildVerticalPath(nodeA, nodeB))
			.attr('class', type || '');
	},

	/**
	 * Build path for horizontal connection line
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @return {String} - The value for `path` attribute
	 */
	_buildHorizontalPath: function(nodeA, nodeB) {
		const distance = nodeB.x - nodeA.x - this.nodeProperties.dimension.width;

		return (nodeA.x === nodeB.x)
			? `M 0 0 h ${distance}`
			: `M 0 0 h ${distance / 2} v ${nodeB.x - nodeA.x} h ${distance}`;
	},

	/**
	 * Build path for vertical connection line
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @return {String} - The value for `path` attribute
	 */
	_buildVerticalPath: function(nodeA, nodeB) {
		const distance = nodeB.y - nodeA.y - this.nodeProperties.dimension.height;

		return (nodeA.x === nodeB.x)
			? `M 0 0 h ${distance}`
			: `M 0 0 v ${distance / 2} h ${nodeB.x - nodeA.x} v ${distance}`;
	},

	/**
	 * Calculate value for `transform` attridute of a horizontal path to position it near the start node
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @return {String} - The value for `transform` attribute
	 */
	_buildOffsetForHorizontalPath: function(nodeA, nodeB) {
		const {dimensions, spacing} = this.nodeProperties;

		return `translate(${nodeA.x + dimensions.width + spacing.vertical}, ${nodeA.y - dimension.height / 2 - spacing.vertical})`;
	},

	/**
	 * Calculate value for `transform` attridute of a vertical path to position it near the start node
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @return {String} - The value for `transform` attribute
	 */
	_buildOffsetForVerticalPath: function(nodeA, nodeB) {
		const {dimensions, spacing} = this.nodeProperties;

		return `translate(${nodeA.x + dimensions.width / 2 + spacing.horizontal}, ${nodeA.y - spacing.vertical})`;
	}
});

module.exports = Rendering;
