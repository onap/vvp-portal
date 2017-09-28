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
        .module('ice.dashboard.account')
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.account', {
                url: '/account',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/account/account.html',
                        controller: 'DashboardAccountController as vm'
                    },
                    'navigation@app': {
                        templateUrl: 'core/navigation/layouts/account-navigation/navigation.html',
                        controller: 'accountNavigationController as vm'
                    }
                },
                params: {engagement_uuid: null},
                bodyClass: 'account'
            })
            .state('app.account.notifications', {
                url: '/account/notifications',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/account/notifications/notifications.html',
                        controller: 'DashboardNotificationsController as vm'
                    }
                },
                bodyClass: 'notifications'
            })
            .state('app.account.userProfile', {
                url: '/account/userProfile',
                views: {
                    'content@app': {
                        templateUrl: 'main/dashboard/account/user-profile-settings/user-profile-settings.html',
                        controller: 'accountUserProfileSettingsController as vm'
                    }
                },
                bodyClass: 'account'
            });
    }
})();
