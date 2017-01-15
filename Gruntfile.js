module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var src = 'src/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		mochaTest: {
			test: {
				options: {
					reporter: 'Spec',
					ui: 'tdd',
					root: './src'
				},
				src: ['<%= pkg.directories.test %>/*.js']
			}
		},

		mocha_istanbul: {
			test: {
				options: {
					ui: 'tdd',
					root: './src',
					coverage: {
						htmlReport: '<%= pkg.directories.coverage %>'
					}
				},
				src: ['<%= pkg.directories.test %>/*.js']
			}
		},

		jsdoc: {
			options: {
				configure: 'jsdoc.conf.json',
			},

			doc: {
				src: src + '*.js',
				options: {
					package: "package.json",
				}
			},

			nightly: {
				src: src + '*.js',
				options: {
					destination: 'doc/nightly'
				}
			}
		},

		eslint: {
			options: {
				configFile: '.eslintrc.js',
				envs: [
					'node',
					'commonjs',
					'mocha'
				],
				fix: true
			},
			target: [src + '*.js', '<%= pkg.directories.test %>/*.js', '!<%= pkg.directories.test %>/polifills.js']
		}
	});


	grunt.registerMultiTask('prepareForCoverage', 'Generates coverage reports for JS using Istanbul', function() {
		var istanbul = require('istanbul');
		var ignore = this.data.ignore || [];
		var instrumenter = new istanbul.Instrumenter();

		this.files.forEach(function(file) {
			var filename = file.src[0];
			var instrumented = grunt.file.read(filename);

			if (!grunt.file.isMatch(ignore, filename)) {
				instrumented = instrumenter.instrumentSync(instrumented, filename);
			}

			grunt.file.write(file.dest, instrumented);
		});
	});


	[
		['test', ['mochaTest']],
		['lint', ['eslint']],
		['coverage', ['mocha_istanbul']],
		['doc', ['jsdoc']],
		['gh-pages', ['coverage', 'doc']]
	].forEach(function(registry){
		grunt.registerTask.apply(grunt, registry);
	});
};
