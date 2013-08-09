/*
 * boilerplate-h5bp
 * https://github.com/Jon Schlinkert/boilerplate-h5bp
 * Copyright (c) 2013
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    site: {
      destination: '_gh-pages',
      origin: 'vendor/h5bp'
    },

    // Lint JavaScript
    jshint: {
      all: ['Gruntfile.js', 'src/helpers/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    copy: {
      layout: {
        options: {
          processContent: function(content) {
            return content
              .replace(/<!-- .*\s*<p>Hello world!.*<\/p>/, "{{> body }}")
              .replace(/(\].*)(\.md)/g, '$1.html')
              .replace(/(<title>)(<\/title>)/, '{{#isnt basename "index"}}$1{{titleize basename}}$2{{else}}$1Home$2{{/isnt}}');
          }
        },
        src: ['<%= site.origin %>/index.html'],
        dest: 'src/layouts/h5bp-layout.hbs'
      },
      content: {
        options: {
          processContent: function(content) {
            return content.replace(/(\].*)(\.md)/g, '$1.html');
          }
        },
        files: [{
            flatten: true,
            expand: true,
            cwd: 'vendor/h5bp/',
            src: ['doc/**'],
            dest: 'tmp/content/'
          }
        ]
      },
      essentials: {
        files: [{
            expand: true,
            cwd: 'vendor/h5bp/',
            src: ['**/*', '!**/index.html', '!**/docs'],
            dest: '_gh-pages/'
          }
        ]
      }
    },

    // Build HTML from templates and data
    assemble: {
      options: {
        flatten: true,
        engine: 'handlebars',
        assets: '<%= site.destination %>/assets',
        layoutdir: 'src/layouts',
        layout: 'default.hbs'
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
        files: {'<%= site.destination %>/': ['src/index.hbs'] }
      }
    },

    // Prettify test HTML pages from Assemble task.
    prettify: {
      options: {
        prettifyrc: '.prettifyrc'
      },
      all: {
        files: [{
            expand: true,
            cwd: '<%= copy.layout.dest %>',
            src: ['*.hbs'],
            dest: '<%= copy.layout.dest %>/',
            ext: '.hbs'
          }, {
            expand: true,
            cwd: '<%= site.destination %>',
            src: ['*.html'],
            dest: '<%= site.destination %>/',
            ext: '.html'
          }
        ]
      }
    },

    uglify: {
      // concat and minify scripts
    },

    // Before generating new files remove files from previous build.
    clean: {
      tmp: ['tmp/**/*', '_gh-pages/*.html']
    }
  });

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-prettify');

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