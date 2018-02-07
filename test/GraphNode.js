/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */

const assert = require('chai').assert;

const Module = require('../src/GraphNode');


suite('GraphNode (edge cases only)', () => {
	suite('Constructor', () => {
		test('an instance should be created without exceptions if additional properties are not provided', () => {
			assert.instanceOf(new Module(), Module);
		});
	});
});

