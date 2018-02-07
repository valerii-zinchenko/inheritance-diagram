/* eslint-disable no-magic-numbers, no-shadow, max-nested-callbacks */
/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */

const assert = require('chai').assert;

const Module = require('../src/inputAdapter');


suite('inputAdapter processor (edge cases only)', () => {
	suite('Methods', () => {
		let module;
		setup(() => {
			module = new Module();
		});
		teardown(() => {
			module = null;
		});

		suite('process', () => {
			suite('exception should be thrown if name of NOI is not a string or an empty string', () => {
				[
					undefined,
					null,
					false,
					true,
					0,
					1,
					{},
					function() {},
					[],
					''
				].forEach(testCase => {
					test(`type: ${Object.prototype.toString.apply(testCase)}; value: ${testCase}`, () => {
						assert.throw(() => {
							module.process(testCase, {});
						}, TypeError, '"noi" argument is expected to be a non-empty string');
					});
				});
			});

			suite('exception should be thrown if map of nodes is not an instance of Object', () => {
				[
					undefined,
					null,
					false,
					true,
					0,
					1,
					'',
					'str'
				].forEach(testCase => {
					test(`type: ${Object.prototype.toString.apply(testCase)}; value: ${testCase}`, () => {
						assert.throw(() => {
							module.process('noi', testCase);
						}, TypeError, '"map" argument is expected to be an instance of Object class');
					});
				});
			});

			test('exception should be thrown if name of NOI is not in map of nodes', () => {
				assert.throw(() => {
					module.process('noi', {});
				}, Error, 'Node data for "noi" does not exist in the provided node map');
			});
		});
	});
});
