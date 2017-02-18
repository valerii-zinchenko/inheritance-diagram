#!/usr/bin/env node

var graph = new (require('./'))('Node', {
	Node: {
		parent: 'ParentNode',
		children: ['Child', 'Child2'],
		mixes:['Mixin', 'Mixin2', 'Mixin3']
	},
	ParentNode: {
		parent: 'Object',
		children: ['Node'],
		link: '#parentNode'
	},
	Child2: {
		link: '#child2'
	},
	Mixin3: {
		link: '#mixin3'
	}
},  {
	css: '.no-ref rect {fill: lightgray;}'
});


const fileName = 'out.svg';
process.stdout.write(`Wrinting to the file "${fileName}"...`);
require('fs').writeFile(fileName, graph.getResult(), err => {
	if (err) {
		throw err;
	}

	process.stdout.write('Done\n');
});
