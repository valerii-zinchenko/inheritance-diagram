var Class = require('class-wrapper').Class;
var GraphNode = require('./src/GraphNode');

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
	 */
	position: function() {
		this.positionNOI();
		this.positionParentNodes();
		this.positionChildNodes();
		this.positionMixinNodes();

		return [noi].concat(noi.parentStack, noi.children, noi.mixins);
	},

	/**
	 * Position node of interest
	 */
	positionNOI: function() {
		this.noi.x = Math.floor(this.noi.children.length / 2);
		this.noi.y = this.noi.parents.length + 1;
	},

	/**
	 * Position parent nodes of the NOI
	 */
	positionParents: function() {
		this.noi.parentStack.forEach((node, index) => {
			node.x = this.noi.x;
			node.y = index;
		});
	},

	/**
	 * Position child nodes of the NOI
	 */
	positionChildNodes: function() {
		var yOffset = this.noi.y + 1;

		this.noi.children.forEach((node, index) => {
			node.x = index;
			node.y = yOffset + index;
		});
	},

	/**
	 * Position mixin nodes of the NOI
	 */
	positionMixinNodes: function() {
		var yOffset = this.noi.y - Math.floor(this.noi.mixins.length / 2);

		this.noi.mixins.forEach((node, index) => {
			node.x = -1;
			node.y = yOffset + index;
		});
	}
});

