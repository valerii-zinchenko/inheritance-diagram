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
var OutputAdapter = require('./outputAdapter');

global.document = require('jsdom').jsdom('<body>');

// eslint-disable-next-line new-cap
var Diagram = Class(function(noiName, nodeMap, css = null, options = {}) {
	global.document.body.innerHTML = '';

	// Populate properties to pcrocessing services
	if (options && options instanceof Object) {
		this.inAdapter.setProperties(options);
		this.positioning.setProperties(options);
		this.rendering.setProperties(options);
		this.outAdapter.setProperties(options);
	}

	// Organize processing chain
	process.stdout.write(`Building diagram for "${noiName}":\n`);
	var instructions = [
		{
			title: 'Preparing',
			action: () => {
				this.noi = this.inAdapter.process(noiName, nodeMap);
			}
		},
		{
			title: 'Positioning',
			action: () => {
				this.positioning.process(this.noi);
			}
		},
		{
			title: 'Rendering',
			action: () => {
				this.domContainer = this.rendering.process(this.noi);
			}
		},
		{
			title: 'Adapting the output',
			action: () => {
				this.out = this.outAdapter.process(this.domContainer);
			}
		}
	];
	instructions.forEach(function(instruction, index) {
		// eslint-disable-next-line no-magic-numbers
		process.stdout.write(`\t${index + 1}/${instructions.length}: ${instruction.title}...`);

		instruction.action();

		process.stdout.write('Done\n');
	});
	process.stdout.write('Done\n');
}, {
	noi: null,
	domContainer: null,

	inAdapter: new InputAdapter(),
	positioning: new Position(),
	rendering: new Rendering(),
	outAdapter: new OutputAdapter(),

	getResult: function() {
		return this.out;
	}
});

module.exports = Diagram;
