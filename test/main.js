var Diagram = require('../src/main');

var Class = require('class-wrapper').Class;
var assert = require('chai').assert;
var sinon = require('sinon');
var fs = require('fs');


var TestWrapper = Class(function(title, noiName, nodeMap, expected, testFn) {
	this.title = title;
	this.noiName = noiName;
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
var TestSVG = Class(TestWrapper, function() {
	this.expected = fs.readFileSync(`./test/expected_data/${this.title}.svg`, 'utf-8');
}, {
	testFn: function() {
		assert.strictEqual(this.expected, new Diagram(this.noiName, this.nodeMap).getResult());
	}
});


// Unit tests
// --------------------------------------------------
suite('E2E', function() {
	var properties = {
		styles: '',
		nodeDimentions: {
			width: 100,
			heidth: 40
		},
		spacing: {
			horizontal: 20,
			vertical: 20
		},
		textPadding: {
			dx: 10,
			dy: 5,
			'text-anchor': 'middle'
		}
	};

	new TestSVG('single class', 'Class', {
		Class: {}
	}).run();

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
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});

	suite('mixins', function() {
		[
			new TestSVG('class with one undocumented mixin', 'Class', {
				Class: {
					mixins: ['Mixin']
				}
			}),
			new TestSVG('class with one documented mixin', 'Class', {
				Class: {
					mixins: ['Mixin']
				},
				Mixin: {
					link: '#Mixin'
				}
			}),
			new TestSVG('five different mixins', 'Class', {
				Class: {
					children: ['Mixin1', 'Mixin2', 'Mixin3', 'Mixin4', 'Mixin5']
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
					mixins: ['Mixin']
				}
			}),
			new TestSVG('one documented parent, one documented child, one documented mixin', 'Class', {
				Class: {
					parent: 'Parent',
					children: ['Child'],
					mixins: ['Mixin']
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
					mixins: ['DocMixin', 'UndocMixin']
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
			})
		].forEach(function(testCase) {
			testCase.run();
		});
	});
});
// --------------------------------------------------
