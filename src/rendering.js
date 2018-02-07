/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

const Class = require('class-wrapper').Class;
const Parent = require('./ProcessingNode');
const d3 = require('d3-selection');
const GraphNode = require('../src/GraphNode');

/**
 * Rendering engine
 *
 * It renders the positioned nodes and bind them with arrows.
 *
 * @class
 * @augments ProcessingNode
 *
 * @param {Object} [properties] - Set of [properties]{@link Rendering#properties}
 */
const Rendering = Class(Parent, function() {
	this.rescale();
}, /** @lends Rendering.prototype */ {
	/**
	 * Rendering properties
	 *
	 * All number values are in pixels
	 *
	 * @type {Object}
	 *
	 * @property {Object} node - Properties of a rendered node
	 * @property {Object} node.dimensions - Node dimensions
	 * @property {Number} [node.dimensions.width = 100] - Node width
	 * @property {Number} [node.dimensions.height = 30] - Node height
	 * @property {Object} node.spacing - Spacing between nodes
	 * @property {Number} [node.spacing.horizontal = 10] - Horizontal spacing between nodes
	 * @property {Number} [node.spacing.vertical = 20] - Vertical spacing between nodes
	 * @property {Object} node.text - Properties of a text inside the node
	 * @property {Number} [node.text.dx = 10] - Offset of a text from the left node edge
	 * @property {Number} [node.text.dy = 20] - Offset of a text from the top node edge
	 * @property {Object} line - Connecting line properties
	 * @property {Number} [line.width = 2] - Line width
	 * @property {Object} line.endMarker - Properties of an end marker
	 * @property {Number} [line.endMarker.width = 5] - Width of an end marker
	 * @property {Number} [line.endMarker.height = 5] - Height of an end marker
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
	// eslint-disable-next-line no-unused-vars
	setProperties(properties) {
		Parent.prototype.setProperties.apply(this, arguments);

		this.rescale();
	},

	/**
	 * Calculate the scaling factors for the real (rendered) coordinate system
	 */
	rescale() {
		const {dimensions, spacing} = this.properties.node;

		/* eslint-disable no-magic-numbers */
		// 2 means for both sides
		this._scale.x = dimensions.width + (2 * spacing.horizontal);
		this._scale.y = dimensions.height + (2 * spacing.vertical);
		/* eslint-enable no-magic-numbers */
	},

	/**
	 * Main processing routine
	 *
	 * @throws {TypeError} "grid" argument should be an array
	 * @throws {TypeError} "noi" argument should be an instance of GraphNode
	 *
	 * @param {Array[]} grid - 2D grid with positioned nodes. A cell can be "undefied" or an instance of {@link GraphNode}
	 * @param {GraphNode} noi - Node of interest with resolved dependecies
	 * @return {D3Selection} DOM element, that contains SVG diagram
	 */
	process(grid, noi) {
		if ( !(grid instanceof Array) ) {
			throw new TypeError('"grid" argument should be an array');
		}
		if ( !(noi instanceof GraphNode) ) {
			throw new TypeError('"noi" argument should be an instance of GraphNode');
		}

		let minX = Infinity;
		let maxX = -Infinity;
		let minY = Infinity;
		let maxY = -Infinity;

		// Create the base contained elements for the diagram
		// --------------------------------------------------
		const domContainer = d3.select('body');
		const domSvg = domContainer.append('svg');
		const domDefs = domSvg.append('defs');
		const domDiagram = domSvg.append('g');
		// --------------------------------------------------

		// Render the nodes and find the real diagram boundaries
		// --------------------------------------------------
		grid.forEach(row => {
			row.forEach(node => {
				if (!node) {
					return;
				}

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
		});
		// --------------------------------------------------

		/* eslint-disable no-magic-numbers */
		const endMarker = this.properties.line.endMarker;
		domDefs.append('marker')
			.attr('id', 'Arrow')
			.attr('refY', endMarker.width / 2)
			.attr('orient', 'auto')
			.style('overflow', 'visible')
			.append('path')
			.attr('d', `M 0 0 L ${endMarker.height} ${endMarker.width / 2} L 0 ${endMarker.height} z`);
		/* eslint-enable no-magic-numbers */

		// Render connection lines
		// --------------------------------------------------
		this.renderConnections(noi, 'Arrow', domDiagram);
		// --------------------------------------------------

		// Setup the properties for the diagram containers
		// --------------------------------------------------
		domSvg
			.attr('viewBox', `0 0 ${(maxX - minX) + this._scale.x} ${(maxY - minY) + this._scale.y}`)
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
	renderNode(node, domContainer) {
		const {dimensions, spacing, text} = this.properties.node;
		let nodeClass = node.type;

		// Reposition node by taking into the account the real element dimensions
		// --------------------------------------------------
		node.x = (node.x * this._scale.x) + spacing.horizontal;
		node.y *= this._scale.y;
		// --------------------------------------------------

		// Create a group for the all elements related to the node: rectangle, link, text
		// --------------------------------------------------
		const domGroup = domContainer.append('g');
		let domNode = domGroup;
		// --------------------------------------------------

		// App link element if possible and make that element as the main container of rectangle and text
		// --------------------------------------------------
		if (node.type !== 'noi') {
			if (node.data.link) {
				domNode = domGroup.append('a')
					.attr('xlink:href', node.data.link);
			} else {
				nodeClass += ' no-ref';
			}
		}
		// --------------------------------------------------

		domGroup
			.attr('class', nodeClass)
			.attr('transform', `translate(${node.x}, ${node.y})`);

		// Create rectangle element in the main container
		// --------------------------------------------------
		// eslint-disable-next-line no-unused-vars
		const domBorder = domNode.append('rect')
			.attr('width', dimensions.width)
			.attr('height', dimensions.height);
		// --------------------------------------------------

		// Add text (node name) into the main container
		// --------------------------------------------------
		const domText = domNode.append('text');
		for (let attr in text) {
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
	renderConnections(noi, endMarkerId, domContainer) {
		// Connect parents
		const parentStack = noi.parentStack;
		/* eslint-disable no-magic-numbers */
		if (parentStack.length > 0) {
			this._renderVerticalConnection(noi, parentStack[0], endMarkerId, domContainer, 'parent');

			for (let n = 0, N = parentStack.length - 1; n < N; n++) {
				this._renderVerticalConnection(parentStack[n], parentStack[n + 1], endMarkerId, domContainer, 'parent');
			}
		}
		/* eslint-enable no-magic-numbers */

		// Connect children
		this._connectChildren(noi, endMarkerId, domContainer);

		// Connect mixes
		noi.mixes.forEach(mixin => {
			this._renderHorizontalConnection(noi, mixin, endMarkerId, domContainer, 'mixin');
		});
	},

	/**
	 * Render the connections between a node and his children
	 *
	 * @param {GraphNode} node - node of interest
	 * @param {String} endMarkerId - ID of an end marker of the connection line
	 * @param {D3Selection} domContainer - DOM comntainer where the rendered connection will be placed
	 */
	_connectChildren(node, endMarkerId, domContainer) {
		node.children.forEach(child => {
			this._renderVerticalConnection(child, node, endMarkerId, domContainer, 'child');

			this._connectChildren(child, endMarkerId, domContainer);
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
	 * @param {String} [type = ''] - Type of a connection line. This will be directly added to the class attribute
	 */
	// eslint-disable-next-line id-length
	_renderHorizontalConnection(nodeA, nodeB, endMarkerId, domContainer, type = '') {
		domContainer.append('path')
			.attr('transform', this._buildOffsetForHorizontalPath(nodeA, nodeB))
			.attr('d', this._buildHorizontalPath(nodeA, nodeB))
			.attr('marker-end', `url(#${endMarkerId})`)
			.attr('stroke-width', this.properties.line.width)
			.attr('stroke', 'black')
			.attr('fill', 'none')
			.attr('class', type);
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
	 * @param {String} [type = ''] - Type of a connection line. This will be directly added to the class attribute
	 */
	// eslint-disable-next-line id-length
	_renderVerticalConnection(nodeA, nodeB, endMarkerId, domContainer, type = '') {
		domContainer.append('path')
			.attr('transform', this._buildOffsetForVerticalPath(nodeA, nodeB))
			.attr('d', this._buildVerticalPath(nodeA, nodeB))
			.attr('marker-end', `url(#${endMarkerId})`)
			.attr('stroke-width', this.properties.line.width)
			.attr('stroke', 'black')
			.attr('fill', 'none')
			.attr('class', type);
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
	_buildHorizontalPath(nodeA, nodeB) {
		const {dimensions, spacing} = this.properties.node;
		const endPoint = nodeB.x - nodeA.x + dimensions.width + (this.properties.line.endMarker.width * this.properties.line.width);
		const distance = endPoint + spacing.horizontal;

		return (nodeA.y === nodeB.y)
			? `M 0 0 h ${endPoint}`
			: `M 0 0 h ${distance} v ${nodeB.y - nodeA.y} H ${endPoint}`;
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
	_buildVerticalPath(nodeA, nodeB) {
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
	// eslint-disable-next-line id-length
	_buildOffsetForHorizontalPath(nodeA) {
		const dimensions = this.properties.node.dimensions;

		// eslint-disable-next-line no-magic-numbers
		return `translate(${nodeA.x}, ${nodeA.y + (dimensions.height / 2)})`;
	},

	/**
	 * Calculate value for `transform` attridute of a vertical path to position it near the start node
	 *
	 * NOTE: This should be called after the scaling of nodes to the real coordinate system
	 *
	 * @param {GraphNode} nodeA - Node from which the connection will be started
	 * @return {String} - The value for `transform` attribute
	 */
	// eslint-disable-next-line id-length
	_buildOffsetForVerticalPath(nodeA) {
		const dimensions = this.properties.node.dimensions;

		// eslint-disable-next-line no-magic-numbers
		return `translate(${nodeA.x + (dimensions.width / 2)}, ${nodeA.y})`;
	}
});

module.exports = Rendering;
