var Class = require('class-wrapper').Class;
var fs = require('fs');

var InputAdapter = require('./inputAdapter');
var Position = require('./position');
var Rendering = require('./rendering');
var outputAdapter = require('./outputAdapter');

global.document = require('jsdom').jsdom('<body>');

var Diagram = Class(function(noiName, nodeMap, css) {
	var instructions = [
		{
			title: 'Preparing NOI',
			action: () => {
				this.noi = this.inAdapter.prepareNOI(noiName, nodeMap);
			}
		},
		{
			title: 'Positioning NOI',
			action: () => {
				this.positing.position(this.noi);
			}
		},
		{
			title: 'Rendering NOI',
			action: () => {
				this.domContainer = this.rendering.render(this.noi);
			}
		},
		{
			title: 'Adapting the output',
			action: () => {
				var out = this.outAdapter(this.domContainer, css);

				const fileName = 'out.svg';
				process.stdout.write(`Wrinting to the file "${fileName}"...`);
				fs.writeFile(fileName, out, err => {
					if (err) {
						throw err;
					}

					process.stdout.write('Done\n');
				});
			}
		}
	];
	instructions.forEach(function(instruction, index) {
		process.stdout.write(`${index+1}/${instructions.length}: ${instruction.title}...`);

		instruction.action();

		process.stdout.write('Done\n');
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
