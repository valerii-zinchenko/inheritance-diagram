/* eslint-disable no-magic-numbers, no-shadow, max-nested-callbacks */
/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */

const assert = require('chai').assert;

const Module = require('../src/rendering');
const GraphNode = require('../src/GraphNode');


suite('rendering processor (edge cases only)', () => {
	suite('Methods', () => {
		let module;
		setup(() => {
			module = new Module();
		});
		teardown(() => {
			module = null;
		});

		suite('process', () => {
			suite('exception should be thrown if grid of nodes is not an array', () => {
				let noi;
				suiteSetup(() => {
					noi = new GraphNode();
				});
				suiteTeardown(() => {
					noi = null;
				});

				[
					undefined,
					null,
					false,
					true,
					0,
					1,
					'',
					'str',
					{},
					function() {}
				].forEach(testCase => {
					test(`type: ${Object.prototype.toString.apply(testCase)}; value: ${testCase}`, () => {
						assert.throw(() => {
							module.process(testCase, noi);
						}, TypeError, '"grid" argument should be an array');
					});
				});
			});

			suite('exception should be thrown if NOI is not an instance of GraphNode', () => {
				[
					undefined,
					null,
					false,
					true,
					0,
					1,
					'',
					'str',
					{},
					function() {},
					[]
				].forEach(testCase => {
					test(`type: ${Object.prototype.toString.apply(testCase)}; value: ${testCase}`, () => {
						assert.throw(() => {
							module.process([], testCase);
						}, TypeError, '"noi" argument should be an instance of GraphNode');
					});
				});
			});
		});
	});
});

