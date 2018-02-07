/* eslint-disable no-shadow */
/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */

const assert = require('chai').assert;
const JSDOM = require('jsdom').JSDOM;
const d3 = require('d3-selection');

const Module = require('../src/outputAdapter');


suite('outputAdapter processor (edge cases only)', () => {
	suite('Methods', () => {
		let module;
		setup(() => {
			global.document = new JSDOM('<body>').window.document;

			module = new Module();
		});
		teardown(() => {
			delete global.document;

			module = null;
		});

		test('"defs" element should be added automatically, if it does not exist in SVG element', () => {
			const domContainer = d3.select('body');
			domContainer.append('svg');

			assert.equal(module.process(domContainer), '<svg><defs><style type="text/css"><![CDATA[rect {stroke-width: 2; stroke: black; fill: white;} a text {fill: blue; text-decoration: underline;} path {stroke-width: 2; stroke: black; fill: none} marker path {stroke-width:0; fill:black;} .child rect, .parent rect {stroke: blue;} .mixin rect {stroke: green;}]]></style></defs></svg>');
		});
	});
});
