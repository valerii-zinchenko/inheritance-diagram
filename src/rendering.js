var Class = require('class-wrapper').Class;
var utils = require('class-wrapper').utils;
var d3 = require('d3-selection');

/**
 * Rendering engine
 *
 * It renders the positioned nodes and bind them with arrows.
 *
 * @class
 *
 * @param {Object} [properties] - see [setNodeProperties]{@link Rendering#setProperties}
 */
var Rendering = Class(function(properties) {
	if (properties) {
		this.setProperties(properties);
	}

	this.rescale();
}, /** @lends Rendering.prototype */ {
	/**
	 * Rendering properties
	 *
	 * @type {Object}
	 */
	properties: {
		node: {
			dimensions: {
				width: 100,
				height: 30
			},
			spacing: {
				horizontal: 10,
				vertical: 20
			},
			text: {
				dx: 10,
				dy: 20
			}
		},
		line: {
			width: 2,
			endMarker: {
				width: 5,
				height: 5
			}
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
		x: 1,
		y: 1
	},

	/**
	 * Reset properies
	 *
	 * @param {Object} [properties] - Properties. Any of already defined properties can be redefined and new one can be added
	 */
	setProprties: function(properties) {
		console.log(this.properties.node.dimensions.width);
		utils.deepCopy(this.properties, properties);
		console.log(this.properties.node.dimensions.width);

		this.rescale();
	},

	/**
	 * Calculate the scaling factors for the real (rendered) coordinate system
	 */
	rescale: function() {
		const {dimensions, spacing} = this.properties.node;

		this._scale.x = dimensions.width + (2 * spacing.horizontal);
		this._scale.y = dimensions.height + (2 * spacing.vertical);
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
		var domDefs = domSvg.append('defs');
		var domDiagram = domSvg.append('g');
		// --------------------------------------------------

		// Render the nodes and find the real diagram boundaries
		// --------------------------------------------------
		[noi].concat(noi.parentStack, noi.children, noi.mixins)
			.forEach(node => {
				this.renderNode(node, domDiagram);

				// node's X and Y coordinates are rescaled in the method renderNode
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

		const endMarker = this.properties.line.endMarker;
		domDefs.append('marker')
			.attr('id', 'Arrow')
			.attr('refY', endMarker.width / 2)
			.attr('orient', 'auto')
			.style('overflow', 'visible')
			.append('path')
			.attr('d', `M 0 0 L ${endMarker.height} ${endMarker.width / 2} L 0 ${endMarker.height} z`);

		// Render connection lines
		// --------------------------------------------------
		this.renderConnections(noi, 'Arrow', domDiagram);
		// --------------------------------------------------

		// Setup the properties for the diagram containers
		// --------------------------------------------------
		domSvg
			.attr('width', (maxX - minX) + this._scale.x)
			.attr('height', (maxY - minY) + this._scale.y)
			.attr('xmlns', 'http://www.w3.org/2000/svg')
			.attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
			.attr('version', '1.1');

		const spacing = this.properties.node.spacing;
		domDiagram.attr('transform', `translate(${-minX + spacing.horizontal}, ${-minY + spacing.vertical})`);
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
		const {dimensions, spacing, text} = this.properties.node;
		var nodeClass = node.type;

		// Reposition node by taking into the account the real element dimensaions
		// --------------------------------------------------
		node.x = (node.x * this._scale.x) + spacing.horizontal;
		node.y = (node.y * this._scale.y) + spacing.vertical;
		// --------------------------------------------------

		// Create a group for the all elements related to the node: rectangle, link, text
		// --------------------------------------------------
		var domGroup = domContainer.append('g');
		var domNode = domGroup;
		// --------------------------------------------------

		// App link element if possible and make that element as the main container of rectangle and text
		// --------------------------------------------------
		if (node.data.link) {
			domNode = domGroup.append('a')
				.attr('xlink:href', node.data.link);
		} else if (node.type !== 'noi') {
			nodeClass += ' no-ref';
		}
		// --------------------------------------------------

		domGroup
			.attr('class', nodeClass)
			.attr('transform', `translate(${node.x}, ${node.y})`);

		// Create rectangle element in the main container
		// --------------------------------------------------
		var domBorder = domNode.append('rect')
			.attr('width', dimensions.width)
			.attr('height', dimensions.height);
		// --------------------------------------------------

		// Add text (node name) into the main container
		// --------------------------------------------------
		var domText = domNode.append('text');
		for (var attr in text) {
			domText.attr(attr, text[attr]);
		}
		domText.text(node.name);
		// --------------------------------------------------

		return domGroup;
	},

	/**
	 * Render all connections between nodes
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} noi - node of interest
	 * @param {String} endMarkerId - ID of an end marker of the connection line
	 * @param {D3Selection} domContainer - DOM comntainer where the rendered connection will be placed
	 */
	renderConnections: function(noi, endMarkerId, domContainer) {
		// Connect parents
		const parentStack = noi.parentStack;
		if (parentStack.length > 0) {
			this._renderVerticalConnection(noi, parentStack[0], endMarkerId, domContainer, 'parent');

			for (var n = 0, N = parentStack.length - 1; n < N; n++) {
				this._renderVerticalConnection(parentStack[n], parentStack[n + 1], endMarkerId, domContainer, 'parent');
			}
		}

		// Connect children
		noi.children.forEach(child => {
			this._renderVerticalConnection(child, noi, endMarkerId, domContainer, 'child');
		});

		// Connect mixins
		noi.mixins.forEach(mixin => {
			this._renderHorizontalConnection(mixin, noi, endMarkerId, domContainer, 'mixin');
		});
	},

	/**
	 * Render a connection line from the right edge of node A to the left edge of a node B
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @param {String} endMarkerId - ID of an end marker for the connection line
	 * @param {D3Selection} domContainer - DOM container where the connection line will be inserted
	 * @param {String} [type=''] - Type of a connection line. This will be directly added to the class attribute
	 */
	_renderHorizontalConnection: function(nodeA, nodeB, endMarkerId, domContainer, type) {
		domContainer.append('path')
			.attr('transform', this._buildOffsetForHorizontalPath(nodeA, nodeB))
			.attr('d', this._buildHorizontalPath(nodeA, nodeB))
			.attr('marker-end', `url(#${endMarkerId})`)
			.attr('stroke-width', this.properties.line.width)
			.attr('stroke', 'black')
			.attr('fill', 'none')
			.attr('class', type || '');
	},

	/**
	 * Render a connection line from the top edge of node A to the bottom edge of a node B
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @param {GraphNode} nodeB - Node where the connection will be ended
	 * @param {String} endMarkerId - ID of an end marker for the connection line
	 * @param {D3Selection} domContainer - DOM container where the connection line will be inserted
	 * @param {String} [type=''] - Type of a connection line. This will be directly added to the class attribute
	 */
	_renderVerticalConnection: function(nodeA, nodeB, endMarkerId, domContainer, type) {
		domContainer.append('path')
			.attr('transform', this._buildOffsetForVerticalPath(nodeA, nodeB))
			.attr('d', this._buildVerticalPath(nodeA, nodeB))
			.attr('marker-end', `url(#${endMarkerId})`)
			.attr('stroke-width', this.properties.line.width)
			.attr('stroke', 'black')
			.attr('fill', 'none')
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
		const {dimensions, spacing} = this.properties.node;
		const distance = nodeB.x - nodeA.x - dimensions.width - (this.properties.line.endMarker.height * this.properties.line.width);

		return (nodeA.y === nodeB.y)
			? `M 0 0 h ${distance}`
			: `M 0 0 h ${spacing.horizontal} v ${nodeB.y - nodeA.y} H ${distance}`;
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
		const {dimensions, spacing} = this.properties.node;
		const distance = nodeB.y - nodeA.y + dimensions.height + (this.properties.line.endMarker.height * this.properties.line.width);

		return (nodeA.x === nodeB.x)
			? `M 0 0 v ${distance}`
			: `M 0 0 v -${spacing.vertical} h ${nodeB.x - nodeA.x} V ${distance}`;
	},

	/**
	 * Calculate value for `transform` attridute of a horizontal path to position it near the start node
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @return {String} - The value for `transform` attribute
	 */
	_buildOffsetForHorizontalPath: function(nodeA) {
		const dimensions = this.properties.node.dimensions;

		return `translate(${nodeA.x + dimensions.width}, ${nodeA.y + (dimensions.height / 2)})`;
	},

	/**
	 * Calculate value for `transform` attridute of a vertical path to position it near the start node
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @return {String} - The value for `transform` attribute
	 */
	_buildOffsetForVerticalPath: function(nodeA) {
		const dimensions = this.properties.node.dimensions;

		return `translate(${nodeA.x + (dimensions.width / 2)}, ${nodeA.y})`;
	}
});

module.exports = Rendering;
