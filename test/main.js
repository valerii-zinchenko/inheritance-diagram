var core = require('../src/main');

var Class = require('class-wrapper').Class;
var assert = require('chai').assert;
var sinon = require('sinon');
var jsdom = require('jsdom').jsdom;
var d3 = require('d3-selection');


var TestWrapper = Class(function(title, input, expected, testFn) {
	this.title = title;
	this.input = input;
	this.expected = expected;

	if (testFn) {
		this.testFn = testFn;
	}
}, {
	title: 'test',
	input: null,
	expected: null,

	testFn: function() {
		assert(false, 'Testing function is not defined');
	},
	run: function() {
		test(this.title, this.testFn());
	}
});

function createDOM(parentEl, newElConfig) {
	var newEl = parentEl.append(newElConfig.tag);

	for (var property in newElConfig.properties) {
		newEl.attr(property, newElConfig.properties);
	}

	if (newElConfig.hasOwnProperty('content')) {
		newEl.text(newElConfig.content);
	} else {
		newElConfig.children.forEach(function(childConfig) {
			createDOM(newEl, childConfig);
		});
	}

	return newEl;
}


suite('E2E', function() {
	var document = jsdom('body');
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

	suite('Core', function() {
		suiteSetup(function() {
			document.body.innerHTML = '';
		});

		teardown(function() {
			document.body.innerHTML = '';
		});

		function testFn() {
			var expectedDOM = createDOM(d3.select(document.body, this.expected));

			assert(expectedDOM.html(), resultDOM.html());
		}

		new TestWrapper('single class', [
			{
				name: 'Class'
			}
		], {
			tag: 'svg',
			properties: {
				xmlns: 'http://www.w3.org/1999/xlink',
				'xmlns:xlink': 'http://www.w3.org/1999/xlink',
				version: '1.1',
				width: properties.width,
				heigth: properties.heigth
			},
			children: [
				{
					tag: 'defs',
					children: [
						{
							tag: 'style',
							properties: {
								type: 'text/css'
							},
							content: '<![CDATA[ ]]>'
						}
					]
				},
				{
					tag: 'g',
					properties: {
						x: 1,
						y: 1,
						'class': 'current'
					},
					children: [
						{
							tag: 'a',
							properties: {},
							children: [
								{
									tag: 'rect',
									properties: {
										x: 1,
										y: 1,
										width: properties.width,
										height: properties.height
									}
								},
								{
									tag: 'text',
									content: 'Class',
									properties: {
										dx: properties.text.dx,
										dy: properties.text.dy,
										'text-anchor': properties.text['text-anchor']
									}
								}
							]
						}
					]
				}
			]
		},
			testFn
		).run();

		suite('parents', function() {
			[
				new TestWrapper(
					'class with one documented parent',
					[
						{
							name: 'Class',
							parent: 'Parent'
						},
						{
							name: 'Parent'
						}
					],
					{},
					testFn
				),
				new TestWrapper(
					'one class with undocemented parent',
					[
						{
							name: 'Class',
							parent: 'Parent'
						}
					],
					{},
					testFn
				),
				new TestWrapper(
					'five parent levels',
					[
						{
							name: 'Class',
							parent: 'Parent1'
						},
						{
							name: 'Parent1',
							parent: 'Parent2'
						},
						{
							name: 'Parent2',
							parent: 'Parent3'
						},
						{
							name: 'Parent3',
							parent: 'Parent4'
						},
						{
							name: 'Parent4',
							parent: 'Parent5'
						}
					],
					{},
					testFn
				)
			].forEach(function(testCase) {
				testCase.run();
			});
		});

		suite('children', function() {
			[
				new TestWrapper(
					'one documented child',
					[
						{
							name: 'Class',
							children: ['Child']
						},
						{
							name: 'Child',
							parent: 'Class'
						}
					],
					{},
					testFn
				),
				new TestWrapper(
					'one undocumented child',
					[
						{
							name: 'Class',
							children: ['Child']
						},
						{
							name: 'Child',
							parent: 'Class'
						}
					],
					{},
					testFn
				),
				new TestWrapper(
					'five different children',
					[
						{
							name: 'Class',
							children: ['Child1', 'Child2', 'Child3', 'Child4', 'Child5']
						},
						{
							name: 'Child1'
						},
						{
							name: 'Child2'
						},
						{
							name: 'Child4'
						}
					],
					{},
					testFn
				)
			].forEach(function(testCase) {
				testCase.run();
			});
		});

		suite('mixins', function() {
			[
				new TestWrapper(
					'class with one documented mixin',
					[
						{
							name: 'Class',
							mixins: ['Mixin']
						},
						{
							name: 'Mixin'
						}
					],
					{},
					testFn
				),
				new TestWrapper(
					'class with one undocumented mixin',
					[
						{
							name: 'Class',
							mixins: ['Mixin']
						}
					],
					{},
					testFn
				),
				new TestWrapper(
					'five different mixins',
					[
						{
							name: 'Class',
							children: ['Mixin1', 'Mixin2', 'Mixin3', 'Mixin4', 'Mixin5']
						},
						{
							name: 'Mixin1'
						},
						{
							name: 'Mixin2'
						},
						{
							name: 'Mixin4'
						}
					],
					{},
					testFn
				)
			].forEach(function(testCase) {
				testCase.run();
			});
		});

		suite('complex diagrams', function() {
			[
				new TestWrapper(
					'one parent, one undocumented grand parent, one documented and undocumented children and documented and undocumented mixins',
					[
						{
							name: 'Class',
							parent: 'Parent',
							children: ['DocChild', 'UndocChild'],
							mixins: ['DocMixin', 'UndocMixin']
						},
						{
							name: 'Parent',
							parent: 'UndocParent'
						},
						{
							name: 'DocChild',
							parent: 'Class'
						},
						{
							name: 'DocMixin'
						}
					],
					{},
					testFn
				)
			].forEach(function(testCase) {
				testCase.run();
			});
		});
	});
});
