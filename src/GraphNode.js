var Class = require('class-wrapper').Class;

/**
 * Graph node
 *
 * @param {Objcet} data - Raw node data
 * @param {Object} [properties] - Additional properties for a graph node
 */
var GraphNode = Class(function(data, properties) {
	this.data = data;

	if (data.parents) {
		this.parents = data.parents;
	}
	if (data.children) {
		this.children = data.children;
	}
	if (data.mixins) {
		this.mixins = data.mixins;
	}

	if (properties) {
		Object.keys(properties).forEarch(property => {
			if (typeof this[property] === 'function') {
				console.warn(`GraphNode(): property ${property} is skipped because this name is already reserved for a method`);

				return;
			}

			var value = properties[property];
			if (typeof value === 'undefined') {
				console.warn(`GraphNode(): property ${property} is skipped because it's value is undefined`);

				return;
			}

			this[property] = value;
		});
	}
},{
	parents: [],
	children: [],
	mixins: [],

	type: '',
	state: 'none',
	parentStack: [],
	x: 0,
	y: 0
});

module.exports = GraphNode;
