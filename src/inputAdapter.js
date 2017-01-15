var Class = require('class-wrapper').Class;
var GraphNode = require('./GraphNode');

/**
 * Input adapter
 *
 * It converts the raw objects into GraphNodes and prepares node of interest for futher processing
 *
 * @class
 *
 * @param {Object} [properties] - Adapter properties. Any of already defined properties can be redefined and new one can be added. Only property names which are already defined for methods or if the value is undefined, then such properties will be skipped and warnong message will be displayed in the console.
 */
var InputAdapter = Class(function(properties) {
	if (properties) {
		Object.keys(properties).forEarch(property => {
			if (typeof this[property] === 'function') {
				console.warn(`InputAdapter(): property ${property} is skipped because this name is already reserved for a method`);

				return;
			}

			var value = properties[property];
			if (typeof value === 'undefined') {
				console.warn(`InputAdapter(): property ${property} is skipped because it's value is undefined`);

				return;
			}

			this[property] = properties[property];
		});
	}
}, /** @lends InputAdapter.prototype */{
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
	prepareNOI: function(noiName, map) {
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

		this._prepareOtherNodes(noi, map);

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

		var stack = [new GraphNode(data, {
			name: nodeName,
			type: 'parent'
		})];

		if (data && data.parent) {
			stack = stack.concat(this._prepareParentNodes(data.parent, map));
		}

		return stack;
	},

	/**
	 * Prepare children and mixin nodes
	 *
	 * It also sets the correct type of the node.
	 *
	 * @param {Object} map - Map of nodes
	 */
	_prepareOtherNodes: function(noi, map) {
		[
			['children', 'child'],
			['mixins', 'mixin']
		].forEach(setMap => {
			const [setName, groupName] = setMap;
			var set = noi[setName];

			if (!set) {
				return;
			}

			set.forEach((nodeName, index) => {
				var data = map[nodeName];

				// Replace node name with GraphNode
				set[index] = new GraphNode(data, {
					name: nodeName,
					type: groupName
				});
			});
		});
	}
});

module.exports = InputAdapter;
