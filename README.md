# Inheritance diagram builder

This builds an inheritance diagram for some node of interest. Initially it is designed to use in documentations with class description to show parent stack, mixed in nodes and the whole tree of children.

Nodes that contains `link` property will be highlighted and behave as usual link element to allow fast jumping to the next interested node in the documentation.

Mainly this library was created for JSDoc (the JSDoc plugin is [`jsdoc-inheritance-diagram`](https://www.npmjs.com/package/jsdoc-inheritance-diagram)), but it can be used as a core for other plugins.


## Limitations and known issues

1. Rectangle dimensions around the text (node name) and text offset should be defined manually. SVG v1.1 does not have the feature like `box-model` for an element in HTML+CSS, so it is not possible to automatically calculate the border for a text by taking into account the font size and paddings.

	* [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) will have some interisting features which should simplify this: [Text layout – Content Area](https://www.w3.org/TR/2016/CR-SVG2-20160915/text.html#TextLayoutContentArea)

1. Arrows at the end of connection line cannot inherit the line styles (colors).

	* [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) will fix this by defining the context: [Specifying paint](https://www.w3.org/TR/2016/CR-SVG2-20160915/painting.html#TermContextElement)

Due to upcomming features/improvements in [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) the above limitations will not have coded workarounds.

Hope [SVG v2](https://www.w3.org/TR/2016/CR-SVG2-20160915/Overview.html) will be released and implemented by browsers soon, or maybe some other idea comes to me :)


## Usage exmaple

```
npm install inheritance-diagram
```

```js
var graph = new (require('inheritance-diagram'))(
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
```

The output is a string of SVG element. So if you want to save the output into the file, then you should write an additional code that will do this. The example of such is below:

```js
require('fs').writeFile('out.svg', graph.getResult(), err => {
	if (err) {
		throw err;
	}
});
```

The similar task is required if you want to get the CSS from an external file and apply it to the diagram. The example is below:

```js
require('fs').readFile('styles.css', 'utf8', (err, data) => {
	if (err) {
		throw err;
	}

	var graph = new (require('inheritance-diagram'))('...', {...}, {css: data});
});
```

The example can be found in [`example.js`](https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/example.js).


### Result

![Example of an inheritance diagram](example.png)


## Links

* [API](http://valerii-zinchenko.github.io/inheritance-diagram/doc/nightly/index.html)
* [Code coverage](http://valerii-zinchenko.github.io/inheritance-diagram/coverage/lcov-report/index.html)
