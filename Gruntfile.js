module.exports = function(grunt) {
	require('load-grunt-tasks')(grunt);

	var src = 'src/';

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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
				fix: false
			},
			target: [src + '*.js', '<%= pkg.directories.test %>/*.js', '!<%= pkg.directories.test %>/polifills.js']
		}
	});


	[
		['lint', ['eslint']],
		['doc', ['jsdoc']]
	].forEach(function(registry){
		grunt.registerTask.apply(grunt, registry);
	});
};
