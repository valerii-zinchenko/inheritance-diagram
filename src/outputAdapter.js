/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Class = require('class-wrapper').Class;
var Parent = require('./ProcessingNode');


/**
 * Outuput adapter
 *
 * @class
 * @augments ProcessingNode
 *
 * @param {Object} [properties] - [Adapter properties]{@link OutputAdapter#properties}
 */
var OutputAdapter = Class(Parent, null, /** @lends OutputAdapter.prototype */ {
	/**
	 * Default CSS for a diagram
	 *
	 * @type {String}
	 * @default rect {stroke-width: 2; stroke: black; fill: white;} a text {fill: blue; text-decoration: underline;} path {stroke-width: 2; stroke: black; fill: none} marker path {stroke-width:0; fill:black;} .child rect, .parent rect {stroke: blue;} .mixin rect {stroke: green;}
	 */
	_css: `
		rect {stroke-width: 2; stroke: black; fill: white;}
		a text {fill: blue; text-decoration: underline;}
		path {stroke-width: 2; stroke: black; fill: none}
		marker path {stroke-width:0; fill:black;}

		.child rect, .parent rect {stroke: blue;}
		.mixin rect {stroke: green;}
	`,

	/**
	 * Output adapter properties
	 *
	 * @type {Object}
	 *
	 * @property {String} [css = ''] - Additional CSS for a diagram
	 */
	properties: {
		css: ''
	},

	/**
	 * Main processing routine
	 *
	 * @param {D3Selection} domSvgContainer - DOM element, that contains an SVG element (usually it is `body` DOM element)
	 */
	process: function(domSvgContainer) {
		// Add cusom CSS to the default CSS
		var styles = this._css + this.properties.css;
		styles = styles
			.trim()
			.replace(/\n/g, '')
			.replace(/\s+/g, ' ');

		// Inline CSS styles if they were provided
		// --------------------------------------------------
		let domDefs = domSvgContainer.select('defs');
		if (!domDefs.node()) {
			domDefs = domSvgContainer.select('svg').append('defs');
		}
		domDefs.append('style')
			.attr('type', 'text/css')
			.text('<![CDATA[' + styles + ']]>');
		// --------------------------------------------------

		return domSvgContainer.html();
	}
});

module.exports = OutputAdapter;
