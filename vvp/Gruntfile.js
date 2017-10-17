//
// ============LICENSE_START==========================================
// org.onap.vvp/portal
// ===================================================================
// Copyright © 2017 AT&T Intellectual Property. All rights reserved.
// ===================================================================
//
// Unless otherwise specified, all software contained herein is licensed
// under the Apache License, Version 2.0 (the “License”);
// you may not use this software except in compliance with the License.
// You may obtain a copy of the License at
//
//          http:www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
//
//
// Unless otherwise specified, all documentation contained herein is licensed
// under the Creative Commons License, Attribution 4.0 Intl. (the “License”);
// you may not use this documentation except in compliance with the License.
// You may obtain a copy of the License at
//
//          https:creativecommons.org/licenses/by/4.0/
//
// Unless required by applicable law or agreed to in writing, documentation
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ============LICENSE_END============================================
//
// ECOMP is a trademark and service mark of AT&T Intellectual Property.
// Generated on 2016-05-30 using generator-angular 0.15.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Automatically load required Grunt tasks
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin',
        ngtemplates: 'grunt-angular-templates',
        cdnify: 'grunt-google-cdn',
        ngconstant: 'grunt-ng-constant'
    });

    // Configurable paths for the application
    var appConfig = {
        app: require('./bower.json').appPath || 'app',
        dist: 'dist'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: appConfig,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            js: {
                files: ['<%= yeoman.app %>/main/{,*/}*.js'],
                tasks: ['newer:jshint:all', 'newer:jscs:all'],
                options: {
                    livereload: '<%= connect.options.livereload %>'
                }
            },
            jsTest: {
                files: ['test/spec/{,*/}*.js'],
                tasks: ['newer:jshint:test', 'newer:jscs:test', 'karma']
            },
            injector: {
                files: [
                        'app/styles/*.less',
                        'app/core/**/*.less',
                        'app/directives/**/*.less',
                        'app/main/**/*.less',
                        'app/welcome/*.less'
                    ],
                taskd: ['injector']
            },
            less: {
                files: ['app/**/*.less'],
                tasks: ['less:development','copy:styles'],
                options: {
                    livereload: '<%= connect.options.livereload %>',
                    nospawn: true
                }
            },
            styles: {
                files: ['<%= yeoman.app %>/main/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'postcss']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/styles/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        ngconstant: {
            // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {\%= __ngModule %}',
                name: 'ice.env',
            },
            // Environment targets
            dev: {
                options: {
                    dest: '<%= yeoman.app %>/app.env.js'
                },
                constants: {
                    ENV: {
                        name: 'development',
                        apiBase: 'http://localhost:8000/vvp/v1/engmgr/'
                    }
                }
            },
            dist: {
                options: {
                    dest: '<%= yeoman.app %>/app.env.js'
                },
                constants: {
                    ENV: {
                        name: 'production',
                        apiBase: '/vvp/v1/engmgr/'
                    }
                }
            },
            staging: {
                options: {
                    dest: '<%= yeoman.app %>/app.env.js'
                },
                constants: {
                    ENV: {
                        name: 'staging',
                        apiBase: 'https://staging-api.d2ice.att.io/vvp/v1/engmgr/'
                    }
                }
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect().use(
                                '/app/styles',
                                connect.static('./app/styles')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    port: 9001,
                    middleware: function (connect) {
                        return [
                            connect.static('.tmp'),
                            connect.static('test'),
                            connect().use(
                                '/bower_components',
                                connect.static('./bower_components')
                            ),
                            connect.static(appConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // app.less contains all the less from all places, convert it to CSS
        less: {
            development: {
                files: {
                    'app/styles/app.css': 'app/styles/app.less'
                }
            },
            production: {
                    'app/styles/app.css': 'app/styles/app.less'
            }
        },

        injector: {
            options: {},
            // Inject all project less into app.less
            less: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/app/styles/', '../styles/');
                        filePath = filePath.replace('/app/main/', '../main/');
                        filePath = filePath.replace('/app/core/', '../core/');
                        filePath = filePath.replace('/app/directives/', '../directives/');
                        filePath = filePath.replace('/app/welcome/', '../welcome/');
                        return '@import \'' + filePath + '\';';
                    },
                    starttag: '// injector:less',
                    endtag: '// endinjector:less'
                },
                files: {
                    'app/styles/app.less': [
                        'app/styles/*.less',
                        'app/core/**/*.less',
                        'app/directives/**/*.less',
                        'app/main/**/*.less',
                        'app/welcome/*.less',
                        '!app/styles/app.less'
                    ]
                }
            }
        },

        // Make sure there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/main/{,*/}*.js'
                ]
            },
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Make sure code styles are up to par
        jscs: {
            options: {
                config: '.jscsrc',
                verbose: true
            },
            all: {
                src: [
                    'Gruntfile.js',
                    '<%= yeoman.app %>/main/{,*/}*.js'
                ]
            },
            test: {
                src: ['test/spec/{,*/}*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/{,*/}*',
                        '!<%= yeoman.dist %>/.git{,*/}*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        postcss: {
            options: {
                processors: [
                    require('autoprefixer-core')({browsers: ['last 1 version']})
                ]
            },
            server: {
                options: {
                    map: true
                },
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            app: {
                src: ['<%= yeoman.app %>/index.html'],
                ignorePath: /\.\.\//
            },
            test: {
                devDependencies: true,
                src: '<%= karma.unit.configFile %>',
                ignorePath: /\.\.\//,
                fileTypes: {
                    js: {
                        block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
                        detect: {
                            js: /'(.*\.js)'/gi
                        },
                        replace: {
                            js: '\'{{filePath}}\','
                        }
                    }
                }
            }
        },

        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/scripts/{,*/}*.js',
                    '<%= yeoman.dist %>/styles/{,*/}*.css',
                    '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= yeoman.dist %>/styles/fonts/*'
                ]
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat', 'uglifyjs'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },

        // Performs rewrites based on filerev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/scripts/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= yeoman.dist %>',
                    '<%= yeoman.dist %>/images',
                    '<%= yeoman.dist %>/styles'
                ],
                patterns: {
                    js: [[/(images\/[^''""]*\.(png|jpg|jpeg|gif|webp|svg))/g, 'Replacing references to images']]
                }
            }
        },

        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/images',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/styles/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/styles/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    conservativeCollapse: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: ['*.html'],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        ngtemplates: {
            dist: {
                options: {
                    module: 'ice',
                    htmlmin: '<%= htmlmin.dist.options %>',
                    usemin: 'scripts/scripts.js'
                },
                cwd: '<%= yeoman.app %>',
                src: [
                    'main/**/*.html',
                    'core/**/*.html',
                    'directives/**/*.html',
                ],
                dest: '.tmp/templateCache.js'
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/concat/scripts',
                    src: '*.js',
                    dest: '.tmp/concat/scripts'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '*.html',
                        'images/{,*/}*.{webp}',
                        'styles/fonts/{,*/}*.*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: ['generated/*']
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
                }, {
                    expand: true,
                    cwd: 'bower_components/components-font-awesome',
                    src: 'fonts/*',
                    dest: '<%= yeoman.dist %>'
                },
                {
                    expand: true,
                    cwd: '<%= yeoman.app %>/locales',
                    src: '**/*',
                    dest: '<%= yeoman.dist %>/locales'
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            welcome: {
                expand: true,
                cwd: '<%= yeoman.app %>/welcome',
                dest: '<%= yeoman.dist %>/welcome',
                src: '{,**/}*.*'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'less:development',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        }
    });

    grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',       // Delete .tmp folder
            'ngconstant:dev', // Configure constants
            'wiredep',            // Automatically inject Bower components into the app
            'injector',           // Inject the less files to app.less
            'less:development',
            'copy:styles',
//            'concurrent:server',  // Run some tasks in parallel to speed up the build process, need to see what the task run.
            'postcss:server',     // Add vendor prefixed styles
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve:' + target]);
    });

    grunt.registerTask('test', [
        'clean:server',
        'wiredep',
        'concurrent:test',
        'postcss',
        'connect:test',
        'karma'
    ]);


    grunt.registerTask('build-ci', function(target) {

        var tasks = [
             'clean:dist',
             'ngconstant:dist',
             'wiredep',
             'less:production',
             'copy:styles',
             'imagemin',
             'svgmin',
             //'concurrent:dist',
             'postcss',
             'useminPrepare',
             'ngtemplates',
             'concat',
             'ngAnnotate',
             'copy:dist',
             'copy:welcome',
             //'cdnify',
             'cssmin',
           //  'uglify',
             'filerev',
              'usemin',
			 'clean:server',       // Delete .tmp folder
			 'ngconstant:dev', // Configure constants
			 'wiredep',            // Automatically inject Bower components into the app
			 'injector',           // Inject the less files to app.less
			 'less:development',
			 'copy:styles',
			//                     'concurrent:server',  // Run some tasks in parallel to speed up the build process, need to see what the task run.
			 'postcss:server',     // Add vendor prefixed styles
            'clean:dist',
            'ngconstant:dist',
            'wiredep',
            'less:production',
            'copy:styles',
            'imagemin',
            'svgmin',
            //'concurrent:dist',
            'postcss',
            'useminPrepare',
            'ngtemplates',
            'concat',
            'ngAnnotate',
            'copy:dist',
            'copy:welcome',
            //'cdnify',
            'cssmin',
            'uglify',
            'filerev',
            'usemin',
            //'htmlmin'
        ];

        if (!target) {
            target = 'dist';
        }
        grunt.task.run.apply(grunt.task, tasks.map(function(task) {
            if (task === 'ngconstant:dist') {
                task = task.split(':')[0];
                return task + ':' + target;
            } else{
                return task;
            }
        }));
    });


    grunt.registerTask('build', function(target) {

      var tasks = [
          'clean:dist',
          'ngconstant:dist',
          'wiredep',
          'less:production',
          'copy:styles',
          'imagemin',
          'svgmin',
          //'concurrent:dist',
          'postcss',
          'useminPrepare',
          'ngtemplates',
          'concat',
          'ngAnnotate',
          'copy:dist',
          'copy:welcome',
          //'cdnify',
          'cssmin',
          'uglify',
          'filerev',
          'usemin',
          //'htmlmin'
      ];

      if (!target) {
          target = 'dist';
      }
      grunt.task.run.apply(grunt.task, tasks.map(function(task) {
          if (task === 'ngconstant:dist') {
              task = task.split(':')[0];
              return task + ':' + target;
          } else{
              return task;
          }
      }));
  });

    grunt.registerTask('default', [
        'newer:jshint',
        'newer:jscs',
        'test',
        'build',
        'build-ci'
    ]);
};
