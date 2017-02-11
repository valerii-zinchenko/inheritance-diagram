/*
 * Copyright (c) 2017  Valerii Zinchenko
 * Licensed under MIT (https://github.com/valerii-zinchenko/inheritance-diagram/blob/master/LICENSE.txt)
 * All source files are available at: https://github.com/valerii-zinchenko/inheritance-diagram
 */
'use strict';

var Class = require('class-wrapper').Class;
var utils = require('class-wrapper').utils;


/**
 * Abstract processing node
 *
 * @class
 *
 * @param {Object} [properties] - Set of properties for a processor
 */
// eslint-disable-next-line new-cap
var ProcessingNode = Class(function(properties) {
	if (properties) {
		this.setProperties(properties);
	}
}, /** @lends ProcessingNode.prototype */ {
	/**
	 * Set of properties
	 *
	 * @type {Object}
	 */
	properties: {},

	/**
	 * Reset properies
	 *
	 * @param {Object} [properties] - Properties. Any of already defined properties can be redefined and new one can be added
	 */
	setProperties: function(properties) {
		utils.deepCopy(this.properties, properties);
	},

	/**
	 * Main processing routine
	 *
	 * @abstract
	 */
	process: function() {}
});

module.exports = ProcessingNode;
