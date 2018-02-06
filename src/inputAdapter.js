/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Class = require('class-wrapper').Class;
var Parent = require('./ProcessingNode');
var GraphNode = require('./GraphNode');

/**
 * Input adapter
 *
 * It converts the raw objects into GraphNodes and prepares node of interest for futher processing
 *
 * @class
 * @augments ProcessingNode
 *
 * @param {Object} [properties] - [Adapter properties]{@link InputAdapter#properties}
 */
var InputAdapter = Class(Parent, null, /** @lends InputAdapter.prototype */{
	/**
	 * Input adapter properties
	 *
	 * @example
	 * properties: {
	 * 	externalLinks: {
	 * 		ExternalClass: 'http://link.to/some/external/class.html',
	 * 		ExternalClass2: 'http://link.to/some/external/class2.html'
	 * 	}
	 * }
	 *
	 * @type {Object}
	 *
	 * @property {Object} [externalLinks = {}] - Map of external links. Usefull to have a direct link to the documentation of 3rd-party class.
	 */
	properties: {
		externalLinks: {}
	},

	/**
	 * Prepare raw NOI data for the further processing
	 *
	 * It also collects and sets the parent stack for NOI
	 *
	 * @param {String} noiName - NOI name
	 * @param {Object} map - Map of nodes
	 * @returns {GrapchNode} - NOI
	 *
	 * @throws {TypeError} "noi" argument is expected to be a string
	 * @throws {TypeError} "map" argument is expected to be an instance of Object class
	 * @throws {Error} Node data for "${noiName}" does not exist in the provided node map
	 */
	process: function(noiName, map) {
		if (typeof noiName !== 'string') {
			throw new TypeError('"noi" argument is expected to be a string');
		}
		if (!(map instanceof Object)) {
			throw new TypeError('"map" argument is expected to be an instance of Object class');
		}

		var noiData = map[noiName];
		if (!noiData) {
			throw new Error(`Node data for "${noiName}" does not exist in the provided node map`);
		}

		var noi = new GraphNode(noiData, {
			name: noiName,
			type: 'noi',
			parentStack: noiData.parent ? this._prepareParentNodes(noiData.parent, map) : undefined
		});

		this._prepareChildNodes(noi, map);
		this._prepareMixinNodes(noi, map);

		return noi;
	},

	/**
	 * Prepare parent node
	 *
	 * The first node in stack is the actual parent node of the NOI. The last parent node is the root node of the inheritance chain.
	 * It also sets the correct type of the parent node.
	 *
	 * @param {String} nodeName - Parent node name
	 * @param {Object} map - Map of nodes
	 * @returns {GraphNode[]} - Ordered stack of parent nodes
	 */
	_prepareParentNodes: function(nodeName, map) {
		var data = map[nodeName];

		var stack = [this._createGraphNode(nodeName, map, 'parent')];

		if (data && data.parent) {
			stack = stack.concat(this._prepareParentNodes(data.parent, map));
		}

		return stack;
	},

	/**
	 * Prepare children nodes
	 *
	 * @param {Object} map - Map of nodes
	 */
	_prepareChildNodes: function(noi, map) {
		var set = noi.children;

		set.forEach((nodeName, index) => {
			// Replace node name with GraphNode
			let childNode = set[index] = this._createGraphNode(nodeName, map, 'child');

			this._prepareChildNodes(childNode, map);
		});
	},

	/**
	 * Prepare mixin nodes
	 *
	 * @param {Object} map - Map of nodes
	 */
	_prepareMixinNodes: function(noi, map) {
		var set = noi.mixes;

		set.forEach((nodeName, index) => {
			// Replace node name with GraphNode
			set[index] = this._createGraphNode(nodeName, map, 'mixin');
		});
	},

	/**
	 * Create GraphNode from the map of nodes
	 *
	 * @param {String} nodeName - Name of a node from a node map
	 * @param {Object} map - Map of node names and their's data
	 * @param {String} type - Type of a node: parent, child, mixin
	 * @return {GraphNode}
	 */
	_createGraphNode: function(nodeName, map, type) {
		var data = map[nodeName];

		// If no 'data' - means that node is not documented,
		// but if some external link is provided - create a node data with link info only
		if (!data && this.properties.externalLinks[nodeName]) {
			data = {
				link: this.properties.externalLinks[nodeName]
			};
		}

		return new GraphNode(data, {
			name: nodeName,
			type: type
		});
	}
});

module.exports = InputAdapter;
