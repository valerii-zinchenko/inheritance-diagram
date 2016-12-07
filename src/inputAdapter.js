var Class = require('class-wrapper').Class;
var GraphNode = require('./GraphNode');

/**
 * Input adapter
 *
 * It converts the raw objects into GraphNodes and prepares node of interest for futher processing
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
	 * Node of interest
	 *
	 * @type {GraphNode}
	 */
	noi: null,

	/**
	 * Map of node name to their's raw data
	 *
	 * @type {Object}
	 */
	map: null,

	/**
	 * Set [node map]{@link GraphNode#map}
	 *
	 * @param {Object} map - Map of nodes
	 *
	 * @throws {TypeError} "map" argument is expected to be an instance of Object class
	 */
	setNodeMap: function(map) {
		if (!(map instanceof Object)) {
			throw new TypeError('"map" argument is expected to be an instance of Object class');
		}

		this.map = map;
	},

	/**
	 * Prepare raw NOI data for the further processing
	 *
	 * It also collects and sets the parent stack for NOI
	 *
	 * @param {String} noiName - NOI name
	 * @returns {GrapchNode} - NOI
	 *
	 * @throws {TypeError} "noi" argument is expected to be a string
	 * @throws {Error} Node data for "${noiName}" does not exist in the provided node map
	 */
	prepareNOI: function(noiName) {
		this.noi = null;

		if (typeof noiName !== 'string') {
			throw new TypeError('"noi" argument is expected to be a string');
		}

		var noiData = this.map[noiName];
		if (!noiData) {
			throw new Error(`Node data for "${noiName}" does not exist in the provided node map`);
		}

		this.noi = new GraphNode(noiData, {
			name: noiName,
			parentStack: noiData.parent ? this.prepareParentNodes(noiData.parent) : undefined
		});

		return this.noi;
	},

	/**
	 * Prepare parent node
	 *
	 * The first node in stack is the actual parent node of the NOI. The last parent node is the root node of the inheritance chain.
	 * It also sets the correct type of the parent node.
	 *
	 * @param {String} nodeName - Parent node name
	 * @returns {GraphNode[]} - Ordered stack of parent nodes
	 */
	prepareParentNodes: function(nodeName) {
		var data = this.map[nodeName];

		var stack = [new GraphNode(data, {
			name: nodeName,
			type: data ? 'parent' : 'no-ref'
		})];

		if (data && data.parent) {
			stack = stack.concat(this.prepareParentNodes(data.parent));
		}

		return stack;
	},

	/**
	 * Prepare children and mixin nodes
	 *
	 * It also sets the correct type of the node.
	 */
	prepareOtherNodes: function() {
		[
			'children',
			'mixin'
		].forEach(groupName => {
			var set = this.noi[groupName];

			if (!set) {
				return;
			}

			set.forEach((nodeName, index) => {
				var data = this.map[nodeName];

				// Replace node name with GraphNode
				set[index] = new GraphNode(data, {
					name: nodeName,
					type: data ? groupName : 'no-ref'
				});
			});
		});
	}
});

module.exports = InputAdapter;
