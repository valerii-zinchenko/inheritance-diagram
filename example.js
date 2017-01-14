#!/usr/bin/env node

var graph = new (require('./'))('node', {
	node: {
		parent: 'parentNode',
		children: ['child', 'child 2'],
		mixins:['mixin', 'mixin2', 'mixin3']
	},
	parentNode: {
		children: ['node'],
		link: '#parentNode'
	}
}, `
	rect {stroke-width: 2; stroke: blue; fill: white;}
	path {stroke-width: 2; stroke: black; fill: none}
	marker path {stroke-width:0; fill:black;}
	.mixin {stroke: green;}
`);


const fileName = 'out.svg';
process.stdout.write(`Wrinting to the file "${fileName}"...`);
require('fs').writeFile(fileName, graph.getResult(), err => {
	if (err) {
		throw err;
	}

	process.stdout.write('Done\n');
});
