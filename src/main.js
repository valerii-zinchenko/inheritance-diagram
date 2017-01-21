/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Class = require('class-wrapper').Class;

var InputAdapter = require('./inputAdapter');
var Position = require('./position');
var Rendering = require('./rendering');
var outputAdapter = require('./outputAdapter');

global.document = require('jsdom').jsdom('<body>');

var Diagram = Class(function(noiName, nodeMap, css, options) {
	global.document.body.innerHTML = '';

	if (options && options instanceof Object && options.rendering) {
		this.rendering.setProprties(options.rendering);
	}

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
				this.out = this.outAdapter(this.domContainer, css);
			}
		}
	];
	instructions.forEach(function(instruction, index) {
		process.stdout.write(`${index + 1}/${instructions.length}: ${instruction.title}...`);

		instruction.action();

		process.stdout.write('Done\n');
	});
}, {
	noi: null,
	domContainer: null,

	inAdapter: new InputAdapter(),
	positing: new Position(),
	rendering: new Rendering(),
	outAdapter: outputAdapter,

	getResult: function() {
		return this.out;
	}
});

module.exports = Diagram;
