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
        .module('ice.dashboard.main', ['ice.dashboard.get-started-modal'])
        .config(config);

    function config($stateProvider) {

        $stateProvider
            .state('app.dashboard', {
                abstract: true,
                views: {
                    'navigation@app': {
                        templateUrl: 'core/navigation/layouts/horizontal-navigation/navigation.html',
                        controller: 'NavigationController as vm'
                    }
                },
                bodyClass: 'dashboard'
            }).
            state('app.dashboard.dashboard', {
                url: '/dashboard/dashboard',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/dashboard/dashboard.html',
                        controller: 'DashboardMainController as vm'
                    },
                },
                params: {engagement_uuid: null,engagement:null,messagePass: null},
                bodyClass: 'dashboard'
            }).
            state('app.dashboard.overview', {
                url: '/dashboard/overview',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/overview/overview.html',
                        controller: 'OverviewMainController as vm'
                    },
                },
                params: {engagement_uuid: null,engagement:null,messagePass: null},
                bodyClass: 'dashboard'
            }).
            state('app.dashboard.detailedview', {
                url: '/dashboard/detailedview',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/detailed-view/detailed-view.html',
                        controller: 'detailedViewController as vm'
                    },
                },
                params: {engagement_uuid: null,engagement:null},
                bodyClass: 'dashboard'
            }).
            state('app.dashboard.checklist', {
                url: '/dashboard/checklist',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/checklist/checklist.html',
                        controller: 'DashboardChecklistController as vm'
                    },
                },
                params: {engagement_uuid: null,sub_id:null,engagement:null},
                bodyClass: 'dashboard'
            });

    }

})();
