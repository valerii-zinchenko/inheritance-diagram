#!/usr/bin/env node

var graph = new (require('./'))('node', {
	node: {
		parent: 'parentNode',
		children: ['child', 'child2'],
		mixes:['mixin', 'mixin2', 'mixin3']
	},
	parentNode: {
		parent: 'Object',
		children: ['node'],
		link: '#parentNode'
	},
	child2: {
		link: '#child2'
	},
	mixin3: {
		link: '#mixin3'
	}
}, '.no-ref rect {fill: lightgray;}', {
	rendering: {
		node: {
			dimensions: {
				width: 200
			}
		}
	}
});


const fileName = 'out.svg';
process.stdout.write(`Wrinting to the file "${fileName}"...`);
require('fs').writeFile(fileName, graph.getResult(), err => {
	if (err) {
		throw err;
	}

	process.stdout.write('Done\n');
});
