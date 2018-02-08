/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

const Diagram = require('../src/main');
const GraphNode = require('../src/GraphNode');

const Class = require('class-wrapper').Class;
const assert = require('chai').assert;
const fs = require('fs');


// eslint-disable-next-line max-params
const TestWrapper = Class(function(title, noiName, nodeMap, options, expected, testFn) {
	this.title = title;
	this.noiName = noiName;
	this.nodeMap = nodeMap;
	this.options = options;
	this.expected = expected;

	if (testFn) {
		this.testFn = testFn;
	}
}, {
	title: 'test',
	noiName: '',
	nodeMap: null,
	expected: null,

	testFn() {
		assert(false, 'Testing function is not defined');
	},
	run() {
		test(this.title, this.testFn.bind(this));
	}
});

const TestSVG = Class(TestWrapper, function() {
	this.expected = fs.readFileSync(`./test/expected_data/${this.title}.svg`, 'utf-8');
}, {
	testFn() {
		const result = new Diagram(this.noiName, this.nodeMap, this.options).getResult();
		assert.strictEqual(result, this.expected);
	}
});


// Unit tests
// --------------------------------------------------
suite('E2E', function() {
	suite('single class', function() {
		[
			new TestSVG('without link', 'Class', {
				Class: {}
			}),
			new TestSVG('with link', 'Class', {
				Class: {
					link: '#Class'
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});

	suite('parents', function() {
		[
			new TestSVG('class with one undocumented parent', 'Class', {
				Class: {
					parent: 'Parent'
				}
			}),
			new TestSVG('class with one documented parent', 'Class', {
				Class: {
					parent: 'Parent'
				},
				Parent: {
					link: '#Parent'
				}
			}),
			new TestSVG('class with one parent already converted into GraphNode', 'Class', {
				Class: {
					parent: 'Parent'
				},
				/* eslint-disable indent */
				Parent: new GraphNode({
						link: '#Parent'
					}, {
						name: 'Parent',
						type: 'parent'
					})
				/* eslint-disable indent */
			}),
			new TestSVG('five parent levels', 'Class', {
				Class: {
					parent: 'Parent1'
				},
				Parent1: {
					parent: 'Parent2',
					link: '#Parent1'
				},
				Parent2: {
					parent: 'Parent3',
					link: '#Parent2'
				},
				Parent3: {
					parent: 'Parent4',
					link: '#Parent3'
				},
				Parent4: {
					parent: 'Parent5',
					link: '#Parent4'
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});

	suite('children', function() {
		[
			new TestSVG('one undocumented child', 'Class', {
				Class: {
					children: ['Child']
				}
			}),
			new TestSVG('one documented child', 'Class', {
				Class: {
					children: ['Child']
				},
				Child: {
					link: '#Child'
				}
			}),
			new TestSVG('one child already converted into GraphNode', 'Class', {
				Class: {
					children: [
						new GraphNode({
							link: '#Child'
						}, {
							name: 'Child',
							type: 'child'
						})
					]
				}
			}),
			new TestSVG('five different children', 'Class', {
				Class: {
					children: ['Child1', 'Child2', 'Child3', 'Child4', 'Child5']
				},
				Child1: {
					link: '#Child1'
				},
				Child2: {
					link: '#Child2'
				},
				Child4: {
					link: '#Child4'
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});

	suite('position multiple levels of children', function() {
		[
			new TestSVG('two levels with one children', 'Class', {
				Class: {
					children: ['Child0']
				},
				Child0: {
					children: ['Child1']
				}
			}),
			new TestSVG('two levels with two children on the second level', 'Class', {
				Class: {
					children: ['Child0']
				},
				Child0: {
					children: ['Child10', 'Child11']
				}
			}),
			new TestSVG('two levels with three children on 1 and two children on the 2 level', 'Class', {
				Class: {
					children: ['Child00', 'Child01', 'Child02']
				},
				Child01: {
					children: ['Child10', 'Child11']
				}
			}),
			new TestSVG('three levels', 'Class', {
				Class: {
					children: ['Child00', 'Child01', 'Child02', 'Child03']
				},
				Child01: {
					children: ['Child10', 'Child11']
				},
				Child03: {
					children: ['Child13']
				},
				Child10: {
					children: ['Child20', 'Child21']
				}
			}),
			new TestSVG('shifting of the last top children', 'Class', {
				Class: {
					children: ['Child00', 'Child01', 'Child02']
				},
				Child00: {
					children: ['Child10', 'Child11']
				},
				Child02: {
					children: ['Child13']
				},
				Child10: {
					children: ['Child20', 'Child21', 'Child22']
				},
				Child11: {
					children: ['Child23', 'Child24']
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});

	suite('mixins', function() {
		[
			new TestSVG('class with one undocumented mixin', 'Class', {
				Class: {
					mixes: ['Mixin']
				}
			}),
			new TestSVG('class with one documented mixin', 'Class', {
				Class: {
					mixes: ['Mixin']
				},
				Mixin: {
					link: '#Mixin'
				}
			}),
			new TestSVG('one mixin already converted into GraphNode', 'Class', {
				Class: {
					mixes: [
						new GraphNode({
							link: '#Mixin'
						}, {
							name: 'Mixin',
							type: 'mixin'
						})
					]
				}
			}),
			new TestSVG('five different mixins', 'Class', {
				Class: {
					mixes: ['Mixin1', 'Mixin2', 'Mixin3', 'Mixin4', 'Mixin5']
				},
				Mixin1: {
					link: '#Mixin'
				},
				Mixin2: {
					link: '#Mixin2'
				},
				Mixin4: {
					link: '#Mixin4'
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});

	suite('complex diagrams', function() {
		[
			new TestSVG('one parent, one child, one mixin', 'Class', {
				Class: {
					parent: 'Parent',
					children: ['Child'],
					mixes: ['Mixin']
				}
			}),
			new TestSVG('one documented parent, one documented child, one documented mixin', 'Class', {
				Class: {
					parent: 'Parent',
					children: ['Child'],
					mixes: ['Mixin']
				},
				Parent: {
					link: '#DocParent'
				},
				DocChild: {
					link: '#DocChild'
				},
				DocMixin: {
					link: '#DocMixin'
				}
			}),
			new TestSVG('one parent, one undocumented grand parent, one documented and undocumented children and documented and undocumented mixins', 'Class', {
				Class: {
					parent: 'Parent',
					children: ['DocChild', 'UndocChild'],
					mixes: ['DocMixin', 'UndocMixin']
				},
				Parent: {
					parent: 'UndocParent',
					link: '#Parent'
				},
				DocChild: {
					parent: 'Class',
					link: '#DocChild'
				},
				DocMixin: {
					link: '#DocMixin'
				}
			}),
			new TestSVG('mix of documented and undocumented classes', 'Class', {
				Class: {
					parent: 'DocParent',
					children: ['DocChild', 'UndocChild'],
					mixes: ['DocMixin', 'UndocMixin']
				},
				DocParent: {
					link: '#DocParent'
				},
				DocChild: {
					link: '#DocChild'
				},
				DocMixin: {
					link: '#DocMixin'
				}
			}),
			new TestSVG('few parents, few mixins, few levels of children', 'Class', {
				Class: {
					children: ['Child00', 'Child01', 'Child02', 'Child03'],
					parent: 'Parent1',
					mixes: ['Mixin0', 'Mixin1', 'Mixin2']
				},
				Parent1: {
					parent: 'Parent0',
					children: ['Class', 'SomeOtherClass'],
					mixes: ['Mix']
				},
				Parent0: {
					parent: 'Parent'
				},
				Child01: {
					children: ['Child10', 'Child11']
				},
				Child03: {
					children: ['Child13']
				},
				Child10: {
					children: ['Child20', 'Child21']
				},
				Child13: {
					children: ['Child23', 'Child24']
				}
			}),
			new TestSVG('complex diagram with nondefault properties', 'Class', {
				Class: {
					parent: 'Parent',
					children: ['Child', 'Child2'],
					mixes: ['Mixin', 'Mixin2', 'Mixin3']
				},
				Parent: {
					parent: 'Object',
					children: ['Node'],
					link: '#Parent'
				},
				Child: {
					link: '#Child'
				},
				Child2: {
					link: '#Child2',
					children: ['Child3', 'Child4']
				},
				Child4: {
					link: '#Child4'
				},
				Mixin3: {
					link: '#Mixin3'
				}
			}, {
				css: '.no-ref rect {fill: lightgray;}',
				node: {
					dimensions: {
						width: 120
					},
					spacing: {
						horizontal: 20,
						vertical: 30
					},
					text: {
						dx: 20
					}
				},
				externalLinks: {
					Mixin: 'http://link.to/mixin/class.html'
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});
});
// --------------------------------------------------
