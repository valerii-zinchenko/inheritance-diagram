var Class = require('class-wrapper').Class;
var GraphNode = require('./GraphNode');

/**
 * Position node of interest and all its related nodes
 *
 * The position is relative to the top left corner
 *
 * @class
 */
var Position = Class(null, /** @lends Position.prototype */ {
	/**
	 * Node of interest
	 *
	 * @type {GraphNode}
	 */
	noi: null,

	/**
	 * Maximal allowed children in one row
	 *
	 * @type {Number}
	 */
	maxChildrenInRow: 6,

	/**
	 * An array of children nodes
	 *
	 * @type {Array}
	 */
	_childNodes: [],

	/**
	 * An array of mixin nodes
	 *
	 * @type {Array}
	 */
	_mixinNodes: [],

	/**
	 * Set NOI
	 *
	 * @param {GraphNode} noi - Node of interest
	 *
	 * @throws {TypeError} "noi" argument is expected to be an instance of GraphNode class
	 */
	setNOI: function(noi) {
		if (!(noi instanceof GraphNode)) {
			throw new TypeError('"noi" argument is expected to be an instance of GraphNode class');
		}

		this.noi = noi;
	},

	/**
	 * Main method that does the positioning of required nodes
	 *
	 * It executes in the sequence the folowing methods:
	 * 1. positionNOI
	 * 1. positionParentNodes
	 * 1. positionChildNodes
	 * 1. positionMixinNodes
	 *
	 * @returns {GraphNode[]} - All nodes as a single array
	 */
	position: function() {
		this._positionNOI();
		this._positionParents();
		this._positionChildNodes();
		this._positionMixinNodes();

		return [this.noi].concat(this.noi.parentStack, this.noi.children, this.noi.mixins);
	},

	getConnections: function() {
		var connections = [];

		// Connect parents
		const parentStack = this.noi.parentStack;
		if (parentStack.length > 0) {
			connections.push(this.noi, parentStack[0]);

			for (var n = 0, N = parentStack.length - 1; n < N; n++) {
				connections.push(parentStack[n], parentStack[n+1]);
			}
		}

		//Connect children
		this.noi.children.forEach(child => {
			connections.push(child, this.noi);
		});

		// Connect mixins
		this.noi.mixins.forEach(mixin => {
			connections.push(mixin, this.noi);
		});

		return connections;
	},

	/**
	 * Position node of interest
	 */
	_positionNOI: function() {
		this.noi.x = (this.noi.children.length - 1) / 2;
		this.noi.y = this.noi.parentStack.length;
	},

	/**
	 * Position parent nodes of the NOI
	 */
	_positionParents: function() {
		this.noi.parentStack.forEach((node, index) => {
			node.x = this.noi.x;
			node.y = index;
		});
	},

	/**
	 * Position child nodes of the NOI
	 */
	_positionChildNodes: function() {
		var yOffset = this.noi.y + 1;

		this.noi.children.forEach((node, index) => {
			node.x = index;
			node.y = yOffset;
		});
	},

	/**
	 * Position mixin nodes of the NOI
	 */
	_positionMixinNodes: function() {
		var yOffset = this.noi.y - Math.floor(this.noi.mixins.length / 2);

		this.noi.mixins.forEach((node, index) => {
			node.x = -1;
			node.y = yOffset + index;
		});
	}
});

module.exports = Position;
