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
 *
 * @param {Object} [properties] - [Adapter properties]{@link InputAdapter#properties}
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
	 * @param {String} nodeName - Parent node name
	 * @param {Object} map - Map of nodes
	 * @returns {GraphNode[]} - Ordered stack of parent nodes
	 */
	_prepareParentNodes(nodeName, map) {
		const data = map[nodeName];

		let stack = [this._createGraphNode(nodeName, map, 'parent')];

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
	_prepareChildNodes(noi, map) {
		const set = noi.children;

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
	_prepareMixinNodes(noi, map) {
		const set = noi.mixes;

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
	_createGraphNode(nodeName, map, type) {
		return new GraphNode(map[nodeName], {
			name: nodeName,
			type: type
		});
	}
});

module.exports = InputAdapter;
