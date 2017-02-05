/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Class = require('class-wrapper').Class;

/**
 * Graph node
 *
 * @class
 *
 * @param {Objcet} data - Raw node data
 * @param {Object} [properties] - Properties for a graph node. Any of already defined properties can be defined and new one can be added. Only property names which are already defined as class methods or if the value is undefined, then such properties will be skipped.
 */
// eslint-disable-next-line new-cap
var GraphNode = Class(function(data, properties) {
	if (data) {
		this.data = data;

		// set references to some raw data properties for easier access
		// --------------------------------------------------
		if (data.parent) {
			this.parent = data.parent;
		}
		if (data.children) {
			this.children = data.children;
		}
		if (data.mixes) {
			this.mixes = data.mixes;
		}
		// --------------------------------------------------
	}

	if (properties) {
		Object.keys(properties).forEach(property => {
			var value = properties[property];
			if (typeof value === 'undefined' || typeof this[property] === 'function') {
				return;
			}

			this[property] = value;
		});
	}
}, /** @lends GraphNode.prototype */{
	/**
	 * Node data
	 *
	 * @type {Object}
	 */
	data: {},

	/**
	 * Node name
	 *
	 * @type {String}
	 */
	name: '',

	/**
	 * Name of parent node
	 *
	 * @type {String}
	 */
	parent: '',

	/**
	 * An array of children node names
	 *
	 * @type {String[]}
	 */
	children: [],

	/**
	 * An array of mixin node names
	 *
	 * @type {String[]}
	 */
	mixes: [],

	/**
	 * Type of a node
	 *
	 * For example:
	 * * noi - node of interest
	 * * parent - parent node
	 * * child - child node
	 * * mixin - mixed in node
	 * * no-ref - node without reference tonode data
	 *
	 * @type {String}
	 */
	type: '',

	/**
	 * Stack of parent nodes
	 *
	 * @type {GraphNode}
	 */
	parentStack: [],

	/**
	 * X coordinate of the node
	 *
	 * @type {Number}
	 */
	x: 0,

	/**
	 * Y coordinate of the node
	 *
	 * @type {Number}
	 */
	y: 0
});

module.exports = GraphNode;
