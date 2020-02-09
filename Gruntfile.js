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
					dest: 'css/',
					ext: '.css',
				}]
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'css',
					src: ['*.css', '!*.min.css'],
					dest: '',
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
				tsconfig: './tsconfig.json',
				/*files: [{
					expand: true,
					cwd: 'src/ts',
					src: ["*.ts"],
					//dest: 'js',
					ext: '.js',
				}]*/
			}
		},
		uglify: {
			build: {
				src: ['js/*.js'],
				dest: 'js/script.min.js',
			}
		},

		//Watch configuration
		watch: {
			css: {
				files: 'src/**/*.scss',
				tasks: ['sass'/*, 'cssmin'*/],
			},
			ts: {
				files: 'src/**/*.ts',
				tasks: ['ts'],
			}/*,
			js: {
				files: 'src/js/*.js',
				tasks: ['uglify'],
			}*/
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
