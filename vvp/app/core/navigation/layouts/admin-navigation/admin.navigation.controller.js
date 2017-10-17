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
/**
 * Created by le056g on 07/02/2017.
 */
(function () {
    'use strict';
    angular
        .module('ice.main.admin', ['ice.services.users'])
        .controller('adminNavigationController', ['$scope', '$log', 'checklistService', '$rootScope', '$state',
            adminNavigationController]);

    function adminNavigationController($scope, $log, checklistService, $rootScope, $state) {
        var vm = this;

        var init = function(){
        	vm.checkListTemplates=null;
            initChecklistTemplates();
            registerWatchers();
        };

        var registerWatchers = function() {
            $scope.$watch(function () { return $state.params.templateName; }, function (newValue, oldValue) {
                if (newValue !== oldValue && vm.selectedTemplate){
                    vm.selectedTemplate.name = newValue;
                };
            });
        };

        var initChecklistTemplates = function(){
        	checklistService.getChecklistTemplates()
            .then(function (response) {
            	$rootScope.ice.loader.show = false;
                if (response.status === 200 && response.data && response.data !== '') {
                    vm.checkListTemplates = response.data.checkListTemplates;
                }
                else {
                    $log.debug("getChecklistTemplates Failed. response.status="+response.status)
                }
            })
            .catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });
        };

        vm.selectTemplate = function(template){
        	if(template !== vm.selectedTemplate) {
        		vm.selectedTemplate = template;
            	$state.go('app.admin.checklisttemplate', {template_uuid:template.uuid});
        	}

        };

        init();
    }
})();
