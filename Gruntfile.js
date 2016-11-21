module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var src = 'src/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		prepareForCoverage: {
			instrument: {
				files: [{
					expand: true,
					cwd: src,
					src: '*.js',
					dest: 'tmp-cov'
				}]
			}
		},
		mocha: {
			test: {
				options: {
					run: false,
					reporter: 'Spec',
					log: true,
					logErrors: true
				},
				src: ['<%= pkg.directories.test %>/index.html']
			},
			coverage: {
				options: {
					run: false,
					reporter: 'Spec',
					log: true,
					logErrors: true,
					coverage: {
						htmlReport: '<%= pkg.directories.coverage %>'
					}
				},
				src: ['<%= pkg.directories.test %>/index.html']
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
		},

		clean: {
			coverage: ['tmp-cov']
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
		['test', ['mocha:test']],
		['lint', ['eslint']],
		['coverage', ['prepareForCoverage', 'mocha:coverage', 'clean:coverage']],
		['doc', ['jsdoc']],
		['gh-pages', ['coverage', 'doc']]
	].forEach(function(registry){
		grunt.registerTask.apply(grunt, registry);
	});
};
