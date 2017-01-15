#!/usr/bin/env node

const testName = 'five different mixins';
var graph = new (require('./'))('Class', {
				Class: {
					mixins: ['Mixin1', 'Mixin2', 'Mixin3', 'Mixin4', 'Mixin5']
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
			});


const fileName = `test/expected_data/${testName}.svg`;
process.stdout.write(`Wrinting to the file "${fileName}"...`);
require('fs').writeFile(fileName, graph.getResult(), err => {
	if (err) {
		throw err;
	}

	process.stdout.write('Done\n');
});
