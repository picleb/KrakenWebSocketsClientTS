module.exports = function(grunt) {
	const sass = require('node-sass');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		//CSS tasks
		sass: {
			dist: {
				options: {
					sourceMap: false,
					implementation: sass,
				},
				files: [{
					expand: true,
					cwd: 'src/sass/',
					src: ['*.scss'],
					dest: 'public/css/',
					ext: '.css',
				}]
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'public/css',
					src: ['*.css', '!*.min.css'],
					dest: 'public/css',
					ext: '.min.css',
				}]
			}
		},

		//JavaScript tasks
		ts: {
			options : {
				rootDir: "src/ts"
			},
			default : {
				tsconfig: './tsconfig.json'
			}
		},
		uglify: {
			build: {
				src: ['public/js/*.js'],
				dest: 'public/js/script.min.js',
			}
		},

		//Watch configuration
		watch: {
			css: {
				files: 'src/**/*.scss',
				tasks: ['sass'],
			},
			ts: {
				files: 'src/**/*.ts',
				tasks: ['ts'],
			}
		}
	});

	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('dev', ['watch']);
	grunt.registerTask('prod', ['sass', 'cssmin', 'ts', 'uglify']);
}
