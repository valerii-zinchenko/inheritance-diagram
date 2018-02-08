/*
 * Copyright (c) 2016-2018  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

const Class = require('class-wrapper').Class;
const utils = require('class-wrapper').utils;


/**
 * Abstract processing node
 *
 * @class
 */
const ProcessingNode = Class(null, /** @lends ProcessingNode.prototype */ {
	/**
	 * Set of properties
	 *
	 * @type {Object}
	 */
	properties: {},

	/**
	 * Reset properies
	 *
	 * @param {Object} properties - Properties. Any of already defined properties can be redefined and new one can be added
	 */
	setProperties(properties) {
		utils.deepCopy(this.properties, properties);
	},

	/**
	 * Main processing routine
	 *
	 * @abstract
	 */
	process() {}
});

module.exports = ProcessingNode;
