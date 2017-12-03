/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Class = require('class-wrapper').Class;
var Parent = require('./ProcessingNode');
var GraphNode = require('./GraphNode');

/**
 * Position node of interest and all its related nodes
 *
 * The position is relative to the top left corner
 *
 * @class
 * @augments ProcessingNode
 */
var Position = Class(Parent, null, /** @lends Position.prototype */ {
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
	 * @param {GraphNode} noi - Node of interest
	 *
	 * @throws {TypeError} "noi" argument is expected to be an instance of GraphNode class
	 */
	process: function(noi) {
		if (!(noi instanceof GraphNode)) {
			throw new TypeError('"noi" argument is expected to be an instance of GraphNode class');
		}

		this.noi = noi;

		this._positionNOI();
		this._positionParents();
		this._positionChildNodes();
		this._positionMixinNodes();
	},

	/**
	 * Position node of interest
	 */
	_positionNOI: function() {
		// eslint-disable-next-line no-magic-numbers
		this.noi.x = ((this.noi.children.length || 1) - 1) / 2;
		this.noi.y = 0;
	},

	/**
	 * Position parent nodes of the NOI
	 */
	_positionParents: function() {
		const x = this.noi.x;
		this.noi.parentStack.forEach((node, index) => {
			node.x = x;
			// eslint-disable-next-line no-magic-numbers
			node.y = -1 - index;
		});
	},

	/**
	 * Position child nodes of the NOI
	 */
	_positionChildNodes: function() {
		// eslint-disable-next-line no-magic-numbers
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
		this.noi.mixes.forEach((node, index) => {
			// I do not like this -1.3, but this is fastest way for now to increase the distance between NOI and mixin
			node.x = -1.3;
			node.y = index;
		});
	}
});

module.exports = Position;
