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
        .module('ice.modals')
        .controller('AuditLogModalController', ['$rootScope', '$uibModalInstance', 'checklistService', 'wizardData',
                                                                    'toastService', '$log', AuditLogModalController]);

    function AuditLogModalController($rootScope, $uibModalInstance,  checklistService, wizardData, toastService, $log) {
        var vm = this;

        var init = function()
        {
            var arr = [];
            var i;
            var region = moment().tz( moment.tz.guess()).format('z');
            var dt = "";
            vm.name = wizardData.name;
            vm.checklistAuditLogs = wizardData.checklistAuditLogs;
            vm.checklistAuditLogs.forEach(function (cl)
            {
                dt = moment(cl.create_time).local().format('YYYY-MM-DD hh:mm:ss A') + " " + region;
                arr.push({"name":cl.creator.full_name,"dt":dt,"desc":cl.description});
            });
            vm.checklistAuditLogs = arr;
        }

        init();

        vm.submitForm = function ()
        {
            var jsonPost = {"description":vm.description};
            checklistService.createAuditlogChecklist(wizardData.uuid, jsonPost)
            .then(function (response) {
                if (response.status === 200)
                {
                    $uibModalInstance.close(response.data);
                    vm.closeModal();
                }
                else
                {
                    toastService.setToast(response.error, 'danger', {displayFor: 'modal'});
                    $rootScope.ice.loader.show = false;
                }
            })
            .catch(function (error) {
                toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                $log.error(error.message);
            });
        };

        vm.closeModal = function(){
            toastService.clearToast();
            $uibModalInstance.close();
        };
    }
})();
