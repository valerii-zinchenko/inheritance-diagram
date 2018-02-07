/* eslint-disable no-shadow */
/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */

const assert = require('chai').assert;

const Module = require('../src/ProcessingNode');


suite('ProcessingNode (edge cases only)', () => {
	suite('Methods', () => {
		let module;
		setup(() => {
			module = new Module();
		});
		teardown(() => {
			module = null;
		});

		test('process method should return nothing as it is abstract method', () => {
			const result = module.process();

			assert.isUndefined(result);
		});
	});
});
