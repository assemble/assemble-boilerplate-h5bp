/*
 * boilerplate-h5bp
 * https://github.com/assemble/boilerplate-h5bp
 * Copyright (c) 2014, Jon Schlinkert, Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: grunt.file.readYAML('.assemblerc.yml'),
    vendor: grunt.file.readJSON('.bowerrc').directory,
    process: require('./src/sanitize.js'),

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', '<%= site.helpers %>/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        assets: '<%= site.assets %>',
        layouts: '<%= site.layouts %>',
        layout: '<%= site.layout %>'
      },
      docs: {
        options: {
          pages: {
            toc        : {content: '{{md "tmp/content/TOC.md"}}'},
            usage      : {content: '{{md "tmp/content/usage.md"}}'},
            faq        : {content: '{{md "tmp/content/faq.md"}}'},
            css        : {content: '{{md "tmp/content/css.md"}}'},
            html       : {content: '{{md "tmp/content/html.md"}}'},
            js         : {content: '{{md "tmp/content/js.md"}}'},
            crossdomain: {content: '{{md "tmp/content/crossdomain.md"}}'},
            extend     : {content: '{{md "tmp/content/extend.md"}}'},
            misc       : {content: '{{md "tmp/content/misc.md"}}'},
          }
        },
        files: {'<%= site.dest %>/': ['src/index.hbs'] }
      }
    },

    // Prettify test HTML pages from Assemble task.
    prettify: {
      all: {
        files: [
          {expand: true, cwd: '<%= site.dest %>', src: ['*.html'], dest: '<%= site.dest %>/', ext: '.html'}
        ]
      }
    },

    uglify: {
      // concat and minify scripts
    },

    // Copy H5BP files to new project, using replacement
    // patterns to convert files into templates.
    copy: {
      layout: {
        options: {
          processContent: '<%= process.replacements %>'
        },
        src: ['<%= site.origin %>/index.html'],
        dest: '<%= site.layouts %>/h5bp-layout.hbs'
      },
      content: {
        options: {
          processContent: '<%= process.links %>'
        },
        files: [
          {flatten: true, expand: true, cwd: '<%= vendor %>/h5bp/', src: ['doc/**'], dest: 'tmp/content/'}
        ]
      },
      essentials: {
        files: [{
            expand: true,
            cwd: '<%= vendor %>/h5bp/',
            src: ['**/*', '!**/index.html', '!**/docs'],
            dest: '<%= site.dest %>/'
          }
        ]
      }
    },

    // Before generating new files remove files from previous build.
    clean: {
      tmp: ['tmp/**/*', '<%= site.dest %>/*.html']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-prettify');
  grunt.loadNpmTasks('grunt-verb');

  // Default tasks to be run.
  grunt.registerTask('default', [
    'test',
    'copy:layout',
    'copy:content',
    'assemble',
    'copy:essentials',
    'prettify'
  ]);

  // Linting and tests.
  grunt.registerTask('test', ['clean', 'jshint']);
};
