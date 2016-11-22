var Class = require('class-wrapper').Class;
var GraphNode = require('./src/GraphNode');


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
}, {
	noi: null,
	map: null,

	setNodeMap: function(map) {
		if (!(map instanceof Object)) {
			throw new TypeError('"map" argument is expected to be an instance of Object class');
		}

		this.map = map;
	},

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
			parentStack: noiData.parent ? this.prepareParentNodes(noiData.parent) : undefined
		});

		return this.noi;
	},

	prepareSecondaryNodes: function() {
		var others = [];

		[
			'children',
			'mixin'
		].forEach(nodeSet => {
			var set = this.noi[nodeSet];

			if (!set) {
				return;
			}

			set.forEach(nodeName => {
				var data = this.map[nodeName];
				others.push(new GraphNode(data, {
					type: data ? nodeSet : 'no-ref'
				}));
			});
		});

		return others;
	},

	prepareParentNodes: function(nodeName) {
		var data = this.map[nodeName];

		var stack = [new GraphNode(data, {
			type: data ? 'parent' : 'no-ref'
		})];

		if (data && data.parent) {
			stack = stack.concat(this.prepareParentNodes(data.parent));
		}

		return stack;
	}
});

module.exports = InputAdapter;
