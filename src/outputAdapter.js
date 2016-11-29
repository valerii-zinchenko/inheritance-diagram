function d3ToStandaloneSVG(d3svg, styleFileName) {
	var css = '';

	var domStyle = (domSvg.select('defs') || domSvg.append('defs'))
			.append('style')
			.attr('type', 'text/css');
	domStyle.text('<![CDATA[' + css + ']]');

	var str = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

	str += d3svg.text();

	return str;
}
