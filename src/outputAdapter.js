/**
 *
 * @param {D3Selection} domSvgContainer - DOM element, that contains an SVG element (usually it is `body` DOM element)
 * @param {String} [css] - String with CSS styles for a SVG
 */
function outputAdapter(domSvgContainer, css) {
	var out = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

	// Inline CSS styles if they were provided
	// --------------------------------------------------
	if (css) {
		(domSvg.select('defs') || domSvg.append('defs'))
			.append('style')
				.attr('type', 'text/css');
				.text('<![CDATA[' + css + ']]');
	}
	// --------------------------------------------------

	out += domSvgContainer.text();

	return out;
}

module.exports = outputAdapter;
