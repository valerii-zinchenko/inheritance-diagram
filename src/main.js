/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

const Class = require('class-wrapper').Class;

const InputAdapter = require('./inputAdapter');
const Position = require('./position');
const Rendering = require('./rendering');
const OutputAdapter = require('./outputAdapter');

global.document = new (require('jsdom').JSDOM)('<body>').window.document;

/**
 * Diagram builder
 *
 * @class
 *
 * @param {String} noiName - Name of a node for what the diagram should be built
 * @param {Object} nodeMap - Map of nodes, where key is a node name and the value is an object of node properties
 * @param {Object} [options] - Options for processing nodes: [InputAdapter]{@link InputAdapter#properties}, [Position]{@link Position#properties}, [Rendering]{@link Rendering#properties}, [OutputAdapter]{@link OutputAdapter#properties}
 */
const Diagram = Class(function(noiName, nodeMap, options) {
	global.document.body.innerHTML = '';

	// Populate properties to processing services
	if (options && options instanceof Object) {
		[
			this.inAdapter,
			this.positioning,
			this.rendering,
			this.outAdapter
		].forEach((processor) => {
			processor.setProperties(options);
		});
	}

	// Organize processing chain
	process.stdout.write(`Building diagram for "${noiName}":\n`);
	const instructions = [
		{
			title: 'Preparing',
			action: () => {
				this.noi = this.inAdapter.process(noiName, nodeMap);
			}
		},
		{
			title: 'Positioning',
			action: () => {
				this.grid = this.positioning.process(this.noi);
			}
		},
		{
			title: 'Rendering',
			action: () => {
				this.domContainer = this.rendering.process(this.grid, this.noi);
			}
		},
		{
			title: 'Creating the output',
			action: () => {
				this.out = this.outAdapter.process(this.domContainer);
			}
		}
	];
	instructions.forEach(function(instruction, index) {
		process.stdout.write(`\t${index + 1}/${instructions.length}: ${instruction.title}...`);

		instruction.action();

		process.stdout.write('Done\n');
	});
	process.stdout.write('Done\n');
}, /** @lends Diagram.prototype */{
	/**
	 * Node of interest
	 *
	 * @type {GraphNode}
	 */
	noi: null,
	/**
	 * 2D grid with positioned nodes
	 *
	 * @type {Array[]}
	 */
	grid: [],
	/**
	 * Resulting SVG element
	 *
	 * @type {D3Selection}
	 */
	domContainer: null,

	/**
	 * Input adapter
	 *
	 * @type {InputAdapter}
	 */
	inAdapter: new InputAdapter(),
	/**
	 * Positioning processor
	 *
	 * @type {Position}
	 */
	positioning: new Position(),
	/**
	 * Rendering processor
	 *
	 * @type {Rendering}
	 */
	rendering: new Rendering(),
	/**
	 * Output adapter
	 *
	 * @type {OutputAdapter}
	 */
	outAdapter: new OutputAdapter(),

	/**
	 * Get the diagram result
	 *
	 * @return {String}
	 */
	getResult() {
		return this.out;
	}
});

module.exports = Diagram;
