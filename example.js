#!/usr/bin/env node

var graph = new (require('./'))(
	// Node for what the diagram will be built
	'Node',

	// Full map of nodes and relationships
	{
		Node: {
			parent: 'Parent',
			children: ['Child', 'Child2'],
			mixes:['Mixin', 'Mixin2', 'Mixin3']
		},
		Parent: {
			parent: 'Object',
			children: ['Node'],
			link: '#Parent'
		},
		Child: {
			link: '#Child',
		},
		Child2: {
			link: '#Child2',
			children: ['Child3', 'Child4']
		},
		Child3: {
			link: '#Child3',
		},
		Child4: {
			link: '#Child4',
		},
		Mixin3: {
			link: '#Mixin3'
		}
	},

	// Additional options
	{
		// Optional custom CSS
		css: '.no-ref rect {fill: lightgray;}',

		// Customize rendering properties
		node: {
			dimensions: {
				width: 80
			},
			spacing: {
				horizontal: 30,
				vertical: 30
			},
			text: {
				dx: 10
			}
		},

		// External links to 3rd-party classes
		externalLinks: {
			Mixin: 'http://link.to/mixin/class.html'
		}
	}
);

const fileName = 'out.svg';
process.stdout.write(`Wrinting to the file "${fileName}"...`);
require('fs').writeFile(fileName, graph.getResult(), err => {
	if (err) {
		throw err;
	}

	process.stdout.write('Done\n');
});
