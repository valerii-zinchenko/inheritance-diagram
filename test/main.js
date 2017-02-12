/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Diagram = require('../src/main');

var Class = require('class-wrapper').Class;
var assert = require('chai').assert;
var fs = require('fs');


// eslint-disable-next-line new-cap, max-params
var TestWrapper = Class(function(title, noiName, nodeMap, options, expected, testFn) {
	this.title = title;
	this.noiName = noiName;
	this.options = options;
	this.nodeMap = nodeMap;
	this.expected = expected;

	if (testFn) {
		this.testFn = testFn;
	}
}, {
	title: 'test',
	noiName: '',
	nodeMap: null,
	expected: null,

	testFn: function() {
		assert(false, 'Testing function is not defined');
	},
	run: function() {
		test(this.title, this.testFn.bind(this));
	}
});
// eslint-disable-next-line new-cap
var TestSVG = Class(TestWrapper, function() {
	this.expected = fs.readFileSync(`./test/expected_data/${this.title}.svg`, 'utf-8');
}, {
	testFn: function() {
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
			}),
			new TestSVG('undocumented parent class with external link', 'Class', {
				Class: {
					parent: 'Parent'
				}
			}, {
				externalLinks: {
					Parent: 'http://link.to/parent/class.html'
				}
			}),
			new TestSVG('documented parent class with provided external link', 'Class', {
				Class: {
					parent: 'Parent'
				},
				Parent: {
					link: '#Parent'
				}
			}, {
				externalLinks: {
					Parent: 'http://link.to/parent/class.html'
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
			}),
			new TestSVG('undocumented child class with external link', 'Class', {
				Class: {
					children: ['Child']
				}
			}, {
				externalLinks: {
					Child: 'http://link.to/child/class.html'
				}
			}),
			new TestSVG('documented child class with provided external link', 'Class', {
				Class: {
					children: ['Child']
				},
				Child: {
					link: '#Child'
				}
			}, {
				externalLinks: {
					Child: 'http://link.to/child/class.html'
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
			}),
			new TestSVG('undocumented mixin class with external link', 'Class', {
				Class: {
					mixes: ['Mixin']
				}
			}, {
				externalLinks: {
					Mixin: 'http://link.to/mixin/class.html'
				}
			}),
			new TestSVG('documented mixin class with provided external link', 'Class', {
				Class: {
					mixes: ['Mixin']
				},
				Mixin: {
					link: '#Mixin'
				}
			}, {
				externalLinks: {
					Mixin: 'http://link.to/mixin/class.html'
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
			new TestSVG('mix of documented, undocumented and undocumented classes with external links', 'Class', {
				Class: {
					parent: ['DocParent'],
					children: ['DocChild', 'UndocChild', 'UndocExtChild'],
					mixes: ['DocMixin', 'UndocMixin', 'UndocExtMixin']
				},
				DocParent: {
					parent: 'UndocExtParent',
					link: '#DocParent'
				},
				DocChild: {
					link: '#DocChild'
				},
				DocMixin: {
					link: '#DocMixin'
				}
			}, {
				externalLinks: {
					UndocExtParent: 'http://link.to/parent/class.html',
					UndocExtChild: 'http://link.to/child/class.html',
					UndocExtMixin: 'http://link.to/mixin/class.html'
				}
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});
});
// --------------------------------------------------
