/* eslint-disable no-magic-numbers, no-shadow */
/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */

const assert = require('chai').assert;

const Module = require('../src/position');


suite('position processor (edge cases only)', () => {
	suite('Methods', () => {
		let module;
		setup(() => {
			module = new Module();
		});
		teardown(() => {
			module = null;
		});

		suite('exception should be thrown if the input NOI is not an instance of GraphNode', () => {
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
						module.process(testCase);
					}, TypeError, '"noi" argument is expected to be an instance of GraphNode class');
				});
			});
		});
	});
});

