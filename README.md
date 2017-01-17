# Inheritance diagram builder

## Description

This build an inheritance diagram for a some node of interest and is designed to be used in documentations. Parent stack, child nodes and mixed in nodes will be displayed.

Nodes that contains `link` property will be highlighted and behave as usual link element to allow fast jumping to the next interested node in the documentation.

The output is a SVG string.


## Limitations

1. Rectangle dimensions around the text (node name) and text offset should be defined manually. SVG v1.1 does not have the feature like `box-model` for an element in HTML+CSS, so it is not possible to automatically calculate the border for a text by taking into account the font size and paddings.

	* [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) will have some interisting features which should simplify this: [Text layout – Content Area](https://www.w3.org/TR/2016/CR-SVG2-20160915/text.html#TextLayoutContentArea)

1. Arrows at the end of connection line cannot inherit the line styles (colors).

	* [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) will fix this by defining the context: [Specifying paint](https://www.w3.org/TR/2016/CR-SVG2-20160915/painting.html#TermContextElement)

Due to upcomming features/improvements in [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) the above limitations will not have coded workarounds and you should manually tune them.

Hope [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) will be released and implemented by browsers soon :)


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
	'.no-ref rect {fill: lightgray;}',

	// Customize rendering properties
	{
		node: {
			dimensions: {
				width: 80
			},
			spacing: {
				horizontal: 30,
				vertical: 30
			},
			text: {
				dx: 20
			}
		}
	}
);
```

## Output example

![Example of an inheritance diagram](example.png)
