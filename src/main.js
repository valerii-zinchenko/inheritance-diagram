var Class = require('class-wrapper').Class;
var fs = require('fs');

var InputAdapter = require('./inputAdapter');
var Position = require('./position');
var Rendering = require('./rendering');
var outputAdapter = require('./outputAdapter');

global.document = require('jsdom').jsdom('<body>');

var Diagram = Class(function(noiName, nodeMap, css) {
	this.noi = this.inAdapter.prepareNOI(noiName, nodeMap);

	this.positing.position(this.noi);

	this.domContainer = this.rendering.render(this.noi);
	var out = this.outAdapter(this.domContainer, css);

	fs.writeFile('out.svg', out, err => {
		if (err) {
			throw err;
		}

		console.log('Done.');
	});
}, {
	noi: null,
	domContainer: null,

	inAdapter: new InputAdapter(),
	positing: new Position(),
	rendering: new Rendering(),
	outAdapter: outputAdapter
});

module.exports = Diagram;
