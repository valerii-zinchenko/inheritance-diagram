const Diagram = require('inheritance-diagram');

var graph = new Diagram(
	// Node for what the diagram will be built
	'Node',

	// Full map of nodes and relationships
	{
		Node: {
			parent: 'Parent',
			children: ['Child', 'Child2'],
			mixes:['Mixin', 'Mixin2']
		},
		Parent: {
			parent: 'Object',
			children: ['Node'],
			mixes: ['MixinP1', 'MixinP2'],
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
		Mixin2: {
			link: '#Mixin2'
		}
	},

	// Additional options
	{
		// Optional custom CSS
		css: '.no-ref rect {fill: lightgray;}',

		// Customize rendering properties
		node: {
			dimensions: {
				height: 25
			},
			spacing: {
				horizontal: 10
			},
			text: {
				dx: 5
			}
		}
	}
);

const fileName = 'out.svg';
process.stdout.write(`Wrinting to "${fileName}"...`);
require('fs').writeFile(fileName, graph.getResult(), err => {
	if (err) {
		throw err;
	}

	process.stdout.write('Done\n');
});
