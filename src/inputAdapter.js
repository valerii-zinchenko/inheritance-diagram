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
 * Input adapter
 *
 * It converts the raw objects into GraphNodes and prepares node of interest for futher processing
 *
 * @class
 * @augments ProcessingNode
 */
const InputAdapter = Class(Parent, null, /** @lends InputAdapter.prototype */{
	/**
	 * Prepare raw NOI data for the further processing
	 *
	 * It also collects and sets the parent stack for NOI
	 *
	 * @param {String} noiName - NOI name
	 * @param {Object} map - Map of nodes
	 * @returns {GrapchNode} - NOI
	 *
	 * @throws {TypeError} "noi" argument is expected to be a non-empty string
	 * @throws {TypeError} "map" argument is expected to be an instance of Object class
	 * @throws {Error} Node data for "${noiName}" does not exist in the provided node map
	 */
	process(noiName, map) {
		if (typeof noiName !== 'string' || !noiName) {
			throw new TypeError('"noi" argument is expected to be a non-empty string');
		}
		if (!(map instanceof Object)) {
			throw new TypeError('"map" argument is expected to be an instance of Object class');
		}

		const noiData = map[noiName];
		if (!noiData) {
			throw new Error(`Node data for "${noiName}" does not exist in the provided node map`);
		}

		const noi = new GraphNode(noiData, {
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
	 * @throws {TypeError} The parent for a node should be either a name of a parent node or be already an instance of GraphNode
	 *
	 * @param {String} nodeName - Parent node name
	 * @param {Object} map - Map of nodes
	 * @returns {GraphNode[]} - Ordered stack of parent nodes
	 */
	_prepareParentNodes(nodeName, map) {
		if (typeof nodeName !== 'string') {
			throw new TypeError('The parent for a node should be either a name of a parent node or be already an instance of GraphNode');
		}

		const data = map[nodeName];

		// the nodes in the map can be already converted into GraphNode
		let stack = [data instanceof GraphNode ? data : this._createGraphNode(nodeName, map, 'parent')];

		if (data && data.parent) {
			stack = stack.concat(this._prepareParentNodes(data.parent, map));
		}

		return stack;
	},

	/**
	 * Prepare children nodes
	 *
	 * @throws {TypeError} The children for a node should contain either name of a child node or be already an instance of GraphNode
	 *
	 * @param {Object} map - Map of nodes
	 */
	_prepareChildNodes(noi, map) {
		const set = noi.children;

		set.forEach((nodeName, index) => {
			// the nodes in the map can be already converted into GraphNode
			if (nodeName instanceof GraphNode) {
				return;
			}
			if (typeof nodeName !== 'string' || !nodeName) {
				throw new TypeError('The children for a node should contain either name of a child node or be already an instance of GraphNode');
			}

			// Replace node name with GraphNode
			let childNode = set[index] = this._createGraphNode(nodeName, map, 'child');

			this._prepareChildNodes(childNode, map);
		});
	},

	/**
	 * Prepare mixin nodes
	 *
	 * @throws {TypeError} The mixes for a node should contain either name of a mixin node or be already an instance of GraphNode
	 *
	 * @param {Object} map - Map of nodes
	 */
	_prepareMixinNodes(noi, map) {
		const set = noi.mixes;

		set.forEach((nodeName, index) => {
			// the nodes in the map can be already converted into GraphNode
			if (nodeName instanceof GraphNode) {
				return;
			}
			if (typeof nodeName !== 'string' || !nodeName) {
				throw new TypeError('The mixes for a node should contain either name of a mixin node or be already an instance of GraphNode');
			}

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
	_createGraphNode(nodeName, map, type) {
		return new GraphNode(map[nodeName], {
			name: nodeName,
			type: type
		});
	}
});

module.exports = InputAdapter;
