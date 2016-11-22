var Class = require('class-wrapper').Class;
var GraphNode = require('./src/GraphNode');

/**
 * Position node of interest
 *
 * @param {GraphNode} noi - Node of interest
 */
var Position = Class(null, {
	noi: null,
	boundaries: {
		height: 0,
		width: 0
	},

	maxChildrenInRow: 6,
	childYOffset: 1,
	mixinXOffset: 1,

	_parentNodes: [],
	_childNodes: [],
	_mixinNodes: [],

	setNOI: function(noi) {
		if (!(noi instanceof GraphNode)) {
			throw new TypeError('"noi" argument is expected to be an instance of GraphNode class');
		}

		this.noi = noi;
	},

	calcBoundaries: function() {
		this.boundaries.height = this.noi.parents.length;

		var children = this.noi.children.length;
		this.boundaries.width = (children >= this._maxChildrenInRow) ? this._maxChildrenInRow : children;
	},

	position: function() {
		this.positionNode();
		this.positionParentNodes();
		this.positionChildNodes();
		this.positionMixinNodes();
	},

	positionNode: function() {
		this.noi.x = this.boundaries.width / 2;
		this.noi.y = this.boundaries.height;
	},

	positionParents: function() {
		this._parentNodes = this.noi.parentStack.map((node, index) => {
			node.x = this.noi.x;
			node.y = index;
		});
	},

	positionChildNodes: function() {
		var y = this.boundaries.height + this._childXOffset;

		this._childNodes = this.noi.children.map((node, index) => {
			node.x = index % this._maxChildrenInRow;
			node.y = y + Math.floor(index / this._maxChildrenInRow);
		});
	},

	positionMixinNodes: function() {
		var x = this.boundaries.width + this._mixinOffset;

		this._mixinNodes = this.noi.mixins.map((node, index) => {
			node.x = x;
			node.y = index;
		});
	}
});

