# Inheritance diagram builder

## Description

This build an inheritance diagram for a some node of interest and is designed to be used in documentations. Parent stack, child nodes and mixed in nodes will be displayed.

Nodes that contains `link` property will be highlighted and behave as usual link element to allow fast jumping to the next interested node in the documentation.

The output is a SVG string.

## Usage exmaple

```js
var graph = new (require('inheritance-diagram'))(
	// Node for what the diagram will be built
	'Node',
	// Full map of nodes and relationships
	{
		Node: {
			parent: 'ParentNode',
			children: ['Child', 'Child2'],
			mixins:['Mixin', 'Mixin2', 'Mixin3']
		},
		ParentNode: {
			parent: 'Object',
			children: ['Node'],
			link: '#ParentNode'
		},
		Child2: {
			link: '#Child2'
		},
		Mixin3: {
			link: '#Mixin3'
		}
	},
	// Optional custom CSS
	'.no-ref rect {fill: lightgray;}'
);
```

### Output

![Example of an inheritance diagram](example.png)
