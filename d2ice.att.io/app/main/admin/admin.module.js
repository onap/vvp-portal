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
    .module('ice.main.admin')
        .config(config);

    function config($stateProvider) {
        $stateProvider
            .state('app.admin', {
                url: '/admin',
                views: {
                    'navigation@app': {
                        templateUrl: 'core/navigation/layouts/admin-navigation/navigation.html',
                        controller: 'adminNavigationController as vm'
                    }
                },
                bodyClass: 'nav-admin',
                resolve: { authenticate: authenticate }
            })
            .state('app.admin.checklisttemplate', {
            	url: '/admin/checklist-template',
                views: {
                	'content@app': {
                        templateUrl: 'main/admin/checklist-template/checklist-template.html',
                        controller: 'checklistTemplateController as vm'
                    }
                },
                params: {template_uuid: undefined},
                bodyClass: 'checklist-template',
            });

        function authenticate(usersService, $q, $timeout, $state) {
        	var result = usersService.isAdmin(usersService.getUserData());

        	if(result === true) {
        		return $q.when();
        	} else {
        		$timeout(function() {
        			$state.go('app.login');
        		});
        	}

        	return $q.reject();
        }
    }



})();
