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
(function () {

    'use strict';

    angular
        .module('ice')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider) {

        // #175 stop ui-route from redirect to #!
        $locationProvider.hashPrefix("");

        $urlRouterProvider.otherwise('/login');
        $urlRouterProvider.when('/dashboard', '/dashbaord/overview');

        var layoutStyle = 'horizontalNavigation';

        var layouts = {
            horizontalNavigation: {
                main: 'core/layouts/dashboard/dashboard.html',
                toolbar: 'core/toolbar/layouts/horizontal-navigation/toolbar.html',
                navigation: 'core/navigation/layouts/horizontal-navigation/navigation.html'
            },
            contentOnly: {
                main: 'core/layouts/content-only.html',
                toolbar: '',
                navigation: ''
            },
            contentWithToolbar: {
                main: 'core/layouts/content-with-toolbar.html',
                toolbar: 'toolbar/layouts/content-with-toolbar/toolbar.html',
                navigation: ''
            }
        };

        // State definitions
        $stateProvider
            .state('app', {
                abstract: true,
                views: {
                    'main@': {
                        templateUrl: layouts[layoutStyle].main,
                        controller: 'MainController as vm'
                    },
                    'toolbar@app': {
                        templateUrl: layouts[layoutStyle].toolbar,
                        controller: 'ToolbarController as vm'
                    },
                    'navigation@app': {
                        templateUrl: layouts[layoutStyle].navigation,
                        controller: 'NavigationController as vm'
                    }
                }
            });

    }

})();
