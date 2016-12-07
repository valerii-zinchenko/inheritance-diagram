var Class = require('class-wrapper').Class;
var fs = require('fs');

var InputAdapter = require('./inputAdapter');
var Position = require('./position');
var Rendering = require('./rendering');
var outputAdapter = require('./outputAdapter');

global.document = require('jsdom').jsdom('<body>');

var Diagram = Class(function(noiName, nodeMap, css) {
	this.inAdapter.setNodeMap(nodeMap);
	var noi = this.inAdapter.prepareNOI(noiName);
	this.inAdapter.prepareOtherNodes();

	this.position.setNOI(noi);
	var nodes = this.position.position();

	var domElement = this.rendering.render(nodes);

	var out = this.outAdapter(domElement, css);

	fs.writeFile('out.svg', out, err => {
		if (err) {
			throw err;
		}

		console.log('Done.');
	});
}, {
	inAdapter: new InputAdapter(),
	position: new Position(),
	rendering: new Rendering(),
	outAdapter: outputAdapter
});

module.exports = Diagram;
