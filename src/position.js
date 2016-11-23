var Class = require('class-wrapper').Class;
var GraphNode = require('./src/GraphNode');

/**
 * Position node of interest
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
	 * Node boundaries for positioning NOI and other nodes
	 *
	 * @type {Object}
	 */
	boundaries: {
		height: 0,
		width: 0
	},

	/**
	 * Maximal allowed children in one row
	 *
	 * @type {Number}
	 */
	maxChildrenInRow: 6,

	/**
	 * Offset by Y axis of children node relative to the NOI
	 *
	 * @type {Number}
	 */
	childYOffset: 1,

	/**
	 * Offset by X axis of mixin node relative to the NOI
	 *
	 * @type {Number}
	 */
	mixinXOffset: 1,

	/**
	 * An array of parent nodes
	 *
	 * @type {Array}
	 */
	_parentNodes: [],

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
	 * 1. _calcBoundaries
	 * 1. positionNOI
	 * 1. positionParentNodes
	 * 1. positionChildNodes
	 * 1. positionMixinNodes
	 */
	position: function() {
		this._calcBoundaries();

		this.positionNOI();
		this.positionParentNodes();
		this.positionChildNodes();
		this.positionMixinNodes();
	},

	/**
	 * Position node of interest
	 */
	positionNOI: function() {
		this.noi.x = this.boundaries.width / 2;
		this.noi.y = this.boundaries.height;
	},

	/**
	 * Position parent nodes of the NOI
	 */
	positionParents: function() {
		this._parentNodes = this.noi.parentStack.map((node, index) => {
			node.x = this.noi.x;
			node.y = index;
		});
	},

	/**
	 * Position child nodes of the NOI
	 */
	positionChildNodes: function() {
		var y = this.boundaries.height + this._childXOffset;

		this._childNodes = this.noi.children.map((node, index) => {
			node.x = index % this._maxChildrenInRow;
			node.y = y + Math.floor(index / this._maxChildrenInRow);
		});
	},

	/**
	 * Position mixin nodes of the NOI
	 */
	positionMixinNodes: function() {
		var x = this.boundaries.width + this._mixinOffset;

		this._mixinNodes = this.noi.mixins.map((node, index) => {
			node.x = x;
			node.y = index;
		});
	},

	/**
	 * Define the base grid dimensions where nodes will be positioned
	 */
	_calcBoundaries: function() {
		this.boundaries.height = this.noi.parents.length;

		var children = this.noi.children.length;
		this.boundaries.width = (children >= this._maxChildrenInRow) ? this._maxChildrenInRow : children;
	}
});

