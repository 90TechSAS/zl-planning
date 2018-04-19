/**
 @toc
 2. load grunt plugins
 3. init
 4. setup variables
 5. grunt.initConfig
 6. register grunt tasks

 */

'use strict'

module.exports = function (grunt) {
  /**
   Load grunt plugins
   @toc 2.
   */
  grunt.loadNpmTasks('grunt-contrib-concat')
  grunt.loadNpmTasks('grunt-contrib-less')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-jshint')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-angular-templates')

  /**
   Function that wraps everything to allow dynamically setting/changing grunt options and config later by grunt task. This init function is called once immediately (for using the default grunt options, config, and setup) and then may be called again AFTER updating grunt (command line) options.
   @toc 3.
   @method init
   */
  function init (params) {
    /**
     Project configuration.
     @toc 5.
     */
    grunt.initConfig({
      concat: {
        devCss: {
          src: [],
          dest: []
        }
      },
      jshint: {
        options: {
          // force:          true,
          globalstrict: true,
          // sub:            true,
          node: true,
          loopfunc: true,
          browser: true,
          devel: true,
          globals: {
            angular: false,
            $: false,
            moment: false,
            Pikaday: false,
            module: false,
            forge: false
          }
        },
        beforeconcat: {
          options: {
            force: false,
            ignores: ['**.min.js']
          },
          files: {
            src: []
          }
        },
        // quick version - will not fail entire grunt process if there are lint errors
        beforeconcatQ: {
          options: {
            force: true,
            ignores: ['**.min.js']
          },
          files: {
            src: ['**.js']
          }
        }
      },
      ngtemplates: {
        '90Tech.planning': {
          src: 'planning/**/*.html',
          dest: 'planning/templates.js',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
          }
        }

      },
      uglify: {
        options: {
          mangle: false,
          sourceMap: 'planning.sourcemap'
        },
        build: {
          files: {},
          src: 'planning/**/*.js',
          dest: 'planning.min.js'
        }
      },
      less: {
        development: {
          options: {},
          files: {
            'planning.css': '_planning.less'
          }
        }
      },
      cssmin: {
        dev: {
          src: ['planning.css'],
          dest: 'planning.min.css'
        }
      },
      watch: {
        files: ['**/*.less', 'planning/**/*.js', 'planning/**/*.html'],
        tasks: ['default']
      }
    })
    grunt.registerTask('default', ['less:development', 'cssmin', 'ngtemplates', 'uglify:build'])
  }

  init({}) // initialize here for defaults (init may be called again later within a task)
}
