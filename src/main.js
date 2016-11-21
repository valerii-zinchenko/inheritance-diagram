var Position = Class(function(x, y) {
	if (typeof x === 'number') {
		this.x = x;
	}
	if (typeof y === 'number') {
		this.y = y;
	}
},{
	x: 0,
	y: 0
});

var GraphNode = Class(function(data) {
	this.data = data;

	this.position = new Position();
	this.parentStack = [];
},{
	state: 'none',
	parentStack: []
});

/**
 * Create a diagram.
 *
 * @param {Object} [configuration] - Diagram configuration.
 * configurations: {
 * 	inputAdapter: {}
 * 	positioningStrategy: {},
 * 	rendeEngine: {},
 * 	outputAdapter: {},
 * 	renderingProperties: {
 * 		styles: 'file.css',
 * 		nodeDimensions: {
 * 			width: 0,
 * 			height: 0
 * 		},
 * 		spacing: {
 * 			horizontal: 0,
 * 			vertical: 0
 * 		},
 * 		text: {
 * 			dx: 0,
 * 			dy: 0,
 * 			'text-anchor': 'middle'
 * 		}
 * 	}
 * }
 */
var Diagram = Class(function(configurations) {
	if (configurations) {
		if (configurations.inputAdapter) {
			this._inputAdapter = configurations.inputAdapter.bind(this);
		}

		if (configurations.positioningStategy) {
			this._positioningStrategy = configurations.positioningStrategy.bind(this);
		}

		if (configurations.renderEngine) {
			this._renderEngine = configurations.renderEngine.bind(this);
		}

		if (configurations.outputAdapter) {
			this._outputAdapter = configurations.outputAdapter.bind(this);
		}

		if (configurations.renderingProperties) {
			this._renderingOptions = configurations.renderingProperties;
		}
	}
}, {
	build: function() {
		this._inputAdapter(this._data);
		this._positioningStrategy();
		this._renderEngine();
		this._outputAdapter();
	},

	_inputAdapter: function() {
	},
	_positioningStrategy: function() {
	},
	_renderEngine: function() {
	},
	_outputAdapter: function() {
	},
	_renderingProperties: {}
});
