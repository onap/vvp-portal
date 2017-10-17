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
        .controller('ChecklistModalController', ['toastService', '$rootScope', '$uibModalInstance', 'checklistService',
                                        'engagementUuid', 'modal_type', 'wizardData', '$log', ChecklistModalController]);

    function ChecklistModalController(toastService, $rootScope, $uibModalInstance, checklistService, engagementUuid,
                                                                                        modal_type, wizardData, $log) {
        var vm = this;
        vm.checkListAssociatedFiles = [];
        vm.selectedCheckListAssociatedFiles = [];
        vm.isDisabled = false;

        var init = function() {
            switch(modal_type) {
                case 'create':
                    vm.create = true;
                    vm.createUpadeTitle = "Create";
                    vm.modalType = 'create';
                    vm.modalTitle = "Create";
                    checklistService.getDataForCreateChecklist(engagementUuid)
                        .then(function (response) {
                            if (response.status === 200) {
                                vm.checkListTemplatesLists = [];
                                vm.checkListTemplates = response.data.checkListTemplates;
                                angular.forEach(response.data.checkListAssociatedFiles, function (value, key) {
                                    vm.checkListAssociatedFiles.push({File: value});
                                });
                                $rootScope.ice.loader.show = false;
                            }
                        })
                        .catch(function (error) {
                            toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                            $rootScope.ice.loader.show = false;
                            $log.error(error.message);
                        });
                    break;
                case 'update':
                    vm.update = true;
                    vm.createUpadeTitle = "Update";
                    vm.modalType = 'udpate';
                    vm.modalTitle = "Update";
                    vm.checklistUuid = wizardData.uuid;
                    vm.checkListName = wizardData.name;
                    checklistService.getDataForCreateChecklist(engagementUuid)
                        .then(function (response) {
                            if (response.status === 200) {
                                vm.checkListAssociatedFiles = []
                                angular.forEach(response.data.checkListAssociatedFiles, function (value, key) {
                                    vm.checkListAssociatedFiles.push({File: value});
                                });
                                $rootScope.ice.loader.show = false;

                                vm.selectedCheckListAssociatedFiles =[]

                                angular.forEach(wizardData.associatedFiles, function(val, key1) {
                                    vm.selectedCheckListAssociatedFiles.push({File: val});
                                });

                            }
                        })
                        .catch(function (error) {
                            toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                            $rootScope.ice.loader.show = false;
                            $log.error(error.message);
                        });
                    vm.selectedTemplateUuid = wizardData.selectedTemplateUuid;
                    vm.selectedTemplateName = wizardData.selectedTemplateName;

                    break;
            }
        }
        init();

        vm.addFile = function ()
        {
            var newItemNo = vm.selectedCheckListAssociatedFiles.length + 1;
            vm.selectedCheckListAssociatedFiles.push({'id': newItemNo});
        };

        vm.removeFile = function (index)
        {
            vm.selectedCheckListAssociatedFiles.splice(index,1);
        };

        vm.closeModal = function(){
            toastService.clearToast();
            $rootScope.$emit('onChecklistUpdate');
            $uibModalInstance.close(vm.checkListName);
            $uibModalInstance.close();
        };


        vm.submitForm = function ()
        {
        	vm.isDisabled = true;
            var checklist_files = [];
            switch(modal_type){
                case 'create':
                    angular.forEach(vm.selectedCheckListAssociatedFiles, function(val, key1) {
                        checklist_files.push(val.File);
                    });
                    var jsonPost = {
                        "checkListAssociatedFiles": checklist_files,
                        "checkListName": vm.checkListName,
                        "checkListTemplateUuid" : vm.selectedTemplateUuid
                    };

                    checklistService.createChecklist(engagementUuid, jsonPost)
                        .then(function (response) {
                            if (response.status === 200) {
                                $uibModalInstance.close(response.data);
                                $rootScope.ice.loader.show = false;
                                vm.closeModal();
                            }
                        })
                        .catch(function (error) {
                            toastService.setToast(error.message || 'Error creating check list.', 'danger', {displayFor: 'modal'});
                            $rootScope.ice.loader.show = false;
                            vm.isDisabled = false;
                            $log.error(error.message);
                        });
                    break;
                case 'update':

                    var updated_file_list = [];
                    angular.forEach(vm.selectedCheckListAssociatedFiles, function(val, key1) {
                        updated_file_list.push(val.File);
                    });
                    $log.debug("update", updated_file_list);
                    var jsonPut = {
                        "checklistUuid": vm.checklistUuid,
                        "checkListAssociatedFiles": updated_file_list,
                        "checkListName": vm.checkListName,
                        "checkListTemplateUuid" : vm.selectedTemplateUuid
                    };
                    checklistService.putDataForChecklist(vm.checklistUuid, jsonPut)
                        .then(function (response) {
                            if (response.status === 200) {
                                $rootScope.$broadcast('onUpdateEngagements',{select:{uuid: engagementUuid, view_type : 'checklist', sub_id: vm.checklistUuid}});
                                $rootScope.ice.loader.show = false;

                                var response_data = {};
                                response_data.checklist_name = vm.checkListName;
                                response_data.associated_files = updated_file_list;
                                var array1 = vm.checkListAssociatedFiles.sort();
                                var array2 = updated_file_list.sort();

                                var is_same_files = (array1.length == array2.length) && array1.every(function(element, index) {
                                        return element === array2[index];
                                    });
                                // if file list changed reject checklist
                                if (!is_same_files && wizardData.state != 'pending')
                                {
                                    var postData = {};
                                    postData["description"] = "Rejected due to file list change";
                                    postData["decline"] =  "True";

                                    checklistService.setState(vm.checklistUuid, postData)
                                        .then(function (response) {
                                            if (response.status === 200) {
                                                $rootScope.$broadcast('onUpdateEngagements');
                                            }
                                            else {
                                                toastService.setToast(response.error, 'danger', {displayFor: 'modal'});
                                                $rootScope.ice.loader.show = false;
                                                vm.isDisabled = false;
                                                return;
                                            }
                                        })
                                        .catch(function (error) {
                                            $log.error(error);
                                            toastService.setToast(error.status + ': Error changing progress!', 'danger');
                                            vm.isDisabled = false;
                                            return;
                                        });
                                }

                                $uibModalInstance.close(response_data);
                                vm.closeModal();
                            }
                        })
                        .catch(function (error) {
                            toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                            $rootScope.ice.loader.show = false;
                            $log.error(error.message);
                            vm.isDisabled = false;

                        });
                    break;
                default:
                    $log.debug('no submit action found');
                	vm.isDisabled = false;
                    break;
            }
        }
    }
})();
