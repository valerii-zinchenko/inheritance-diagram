/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var css = `
	rect {stroke-width: 2; stroke: black; fill: white;}
	a text {fill: blue; text-decoration: underline;}
	path {stroke-width: 2; stroke: black; fill: none}
	marker path {stroke-width:0; fill:black;}

	.child rect, .parent rect {stroke: blue;}
	.mixin rect {stroke: green;}
`;

/**
 * Outuput adapter
 *
 * @param {D3Selection} domSvgContainer - DOM element, that contains an SVG element (usually it is `body` DOM element)
 * @param {String} [customCSS] - String with custom CSS styles
 */
function outputAdapter(domSvgContainer, customCSS) {
	var out = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

	// Add cusom CSS to the default CSS
	if (customCSS) {
		css += customCSS;
	}
	css = css
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
		.text('<![CDATA[' + css + ']]>');
	// --------------------------------------------------

	out += domSvgContainer.html();

	return out;
}

module.exports = outputAdapter;
