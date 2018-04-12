/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

const Class = require('class-wrapper').Class;
const Parent = require('./ProcessingNode');
const GraphNode = require('./GraphNode');

/**
 * Position node of interest and all its related nodes
 *
 * The position is relative to the top left corner
 *
 * @class
 * @augments ProcessingNode
 */
const Position = Class(Parent, null, /** @lends Position.prototype */ {
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
	 * Main processing routine
	 *
	 * It executes in the sequence the folowing processors:
	 * 1. Position node of interest
	 * 1. Position parent nodes
	 * 1. Position child nodes
	 * 1. Position mixin nodes
	 *
	 * @throws {TypeError} "noi" argument is expected to be an instance of GraphNode class
	 *
	 * @param {GraphNode} noi - Node of interest
	 * @return {Array[]} 2D grid with positioned nodes. A cell can be "undefied" or an instance of {@link GraphNode}
	 */
	process(noi) {
		if (!(noi instanceof GraphNode)) {
			throw new TypeError('"noi" argument is expected to be an instance of GraphNode class');
		}

		this.noi = noi;

		const grid = [];

		this._positionNOI(grid);
		this._positionChildNodes(grid);

		this._center(grid);

		this._positionParents(grid);
		this._positionMixinNodes(grid);

		return grid;
	},

	/**
	 * Position node of interest
	 *
	 * @param {Array[]} grid - 2D grid
	 */
	_positionNOI(grid) {
		this.noi.x = 0;
		this.noi.y = grid.length;

		grid.push([this.noi]);
	},

	/**
	 * Position parent nodes of the NOI
	 *
	 * @param {Array[]} grid - 2D grid
	 */
	_positionParents(grid) {
		let yoffset = 0;
		this.noi.parentStack.forEach((node, index) => {
			node.x = this.noi.x;
			node.y = -1 - index - yoffset;
			if (node.mixes.length > 1) {
				yoffset += node.mixes.length - 1
				node.y -= yoffset;
			}

			grid.unshift([node]);
		});
	},

	/**
	 * Position child nodes of the NOI
	 *
	 * @param {Array[]} grid - 2D grid
	 */
	_positionChildNodes(grid) {
		const nextY = grid.length;
		const row = grid[nextY - 1];
		const nextRow = [];
		let anyMoreChildren = false;

		row.forEach(item => {
			if (item && item.children.length > 0) {
				anyMoreChildren = true;

				item.children.forEach(node => {
					node.x = nextRow.length;
					node.y = nextY;
					nextRow.push(node);
				});
			} else {
				nextRow.push(undefined);
			}
		});

		if (anyMoreChildren) {
			grid.push(nextRow);
			this._positionChildNodes(grid);
		}
	},

	/**
	 * Position mixin nodes of the NOI
	 *
	 * @param {Array[]} grid - 2D grid
	 */
	_positionMixinNodes(grid) {
		// I do not like this -1.3, but this is fastest way for now to increase the distance between NOI and mixin
		const xoffset = -1.3;
		const allMixes = [];

		this.noi.mixes.forEach((node, index) => {
			node.x = xoffset;
			node.y = index;

			allMixes.push(node);
		});

		this.noi.parentStack.forEach(parent => {
			parent.mixes.forEach((node, index) => {
				node.x = xoffset;
				node.y = parent.y + index;

				allMixes.push(node);
			});
		});

		grid.push(allMixes);
	},

	/**
	 * Center the nodes
	 *
	 * @param {Array[]} grid - 2D grid
	 */
	_center(grid) {
		const offsets = [];
		grid[grid.length - 1].forEach(() => offsets.push(0));

		// The centering is going from bottom to top relative to the last row. So the last row is taking as is and there is no reason to center it.
		for (let n = grid.length - 2; n >= 0; n--) {
			grid[n].forEach((node, m) => {
				// propagate offset to the next cell
				if (offsets[m] > offsets[m + 1]) {
					offsets[m + 1] = offsets[m];
				}

				if (!node) {
					return;
				}

				if (node.children.length > 0) {
					// center the node relative to his children
					node.x = (node.children[node.children.length - 1].x + node.children[0].x) / 2;

					// update offset for current and next cells
					const dx = node.children.length - 1;
					offsets[m] += dx;
					offsets[m + 1] += dx;
				} else {
					node.x += offsets[m];
				}
			});
		}
	}
});

module.exports = Position;
