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
        .controller('stateDecisionModalController', ['$rootScope','$uibModalInstance', 'checklistService',
                                        'toastService', 'action', 'checklist', '$log', stateDecisionModalController]);

    function stateDecisionModalController($rootScope, $uibModalInstance, checklistService, toastService, action,
                                                                                                    checklist, $log) {

        var vm = this;

        var init = function () {
            vm.description = null;
            vm.checklist_name = checklist.name;
            vm.state = checklist.state;
            vm.action = action;
            vm.modalText = (vm.state == 'pending') ? "Are you sure you want to move the checklist state to Automation?":
                "Please use the button below to either approve or reject the " +
                                                                "checklist.<br>You can also add a log entry comment.";
        };

        vm.submitForm = function(decision) {
            var postData = {};
            if (vm.description != null) {
                postData["description"] = vm.description;
            }
            else{
                postData["description"] = '';
            }

            if (decision === true) {
                postData["decline"] = "False";
            }
            else {
                postData["decline"] =  "True";
            }



         checklistService.setState(checklist.uuid, postData)
                .then(function (response) {
                    if (response.status === 200) {
                        $uibModalInstance.close(response.data);
                        vm.closeModal();
                    }
                    else {
                        toastService.setToast(response.error, 'danger');
                        $rootScope.ice.loader.show = false;
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                    toastService.setToast(error.status + ': Error changing progress!', 'danger');
                });

        };

        vm.closeModal = function () {
            $uibModalInstance.close();
        };

        init();
    }
})();
