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
        .controller('checklistTemplateController', ["_", "$scope", "checklistService", "$stateParams", "toastService",
                                                                    "$uibModal", "$log", checklistTemplateController]);

    function checklistTemplateController(_, $scope, checklistService, $stateParams, toastService, $uibModal, $log) {
        var vm = this;
        var templateToRevert;

        var init = function(){
            if ($stateParams['template_uuid']){
                vm.inlineEditingElements = {};
                vm.wysiwyg_menu = [
                    ['bold', 'italic', 'strikethrough', 'underline'],
                    ['unordered-list', 'ordered-list', 'outdent', 'indent']
                ];

                checklistService.getChecklistTemplate($stateParams['template_uuid'])
                    .then(function (response) {
                        if (response.status === 200) {
                            vm.template = response.data;
                            registerWatchers();
                            orderTemplateItems();
                            templateToRevert = angular.copy(response.data);
                            initFirstLineItemSelection();
                        }
                    })
                    .catch(function (err){
                        $log.error("got error with getChecklistTemplate");
                    });
            }
        };

        vm.switchElementInlineEditing = function(elementName) {
            vm.inlineEditingElements[elementName] = !vm.inlineEditingElements[elementName];
        };

        vm.save = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/general-prompt-modal/general-prompt-modal.html',
                controller: 'generalPromptModalController',
                controllerAs: 'vm',
                resolve: {
                    modalDetails: function () {
                        return {
                            "upper_headline": 'Master Checklist Template: ',
                            "upper_headline_value": vm.template.name,
                            "headline": 'Are you done editing?',
                            "is_message":true,
                            "message":  'Editing a master checklist template will effect all checklists currently ' +
                                'created of that type and will also restart the validation for all active engagements',
                            "approve":  'Yes',
                            "cancelText": 'No',
                            "is_close_modal_button":false
                        };
                    }
                }
            });

            modalInstance.result.then(function (saveApproved) {
                if(saveApproved) {
                    checklistService.saveChecklistTemplate(vm.template)
                    .then(function (response) {
                        if (response.status === 200) {
                            templateToRevert = angular.copy(vm.template);
                            toastService.setToast("Template was saved successfully.", 'success');
                        }
                    })
                    .catch(function (err){
                        toastService.setToast("Problem occurred while saving template.", 'danger');
                        $log.error("got error with saveChecklistTemplate");
                    });
                }
            });
        };

        vm.cancel = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/general-prompt-modal/general-prompt-modal.html',
                controller: 'generalPromptModalController',
                controllerAs: 'vm',
                resolve: {
                    modalDetails: function () {
                        return {
                            "upper_headline": 'Master Checklist Template: ',
                            "upper_headline_value": vm.template.name,
                            "headline": 'Are you sure you want to revert all changes?',
                            "is_message":false,
                            "approve":  'Yes',
                            "cancelText": 'No',
                            "is_close_modal_button":false
                        };
                    }
                }
            });

            modalInstance.result.then(function (revertApproved) {
                if(revertApproved) {
                    vm.template = angular.copy(templateToRevert);
                    initFirstLineItemSelection();
                    toastService.setToast("All changes discarded.", 'success');
                }
            });
        };

        vm.deleteSection = function(sectionToDelete) {
            _.remove(vm.template.sections, function(section) {return sectionToDelete === section;});
            initFirstLineItemSelection();
        };

        vm.selectLineItem = function(lineItem, section, $event) {
            if(vm.selectedLineItem != lineItem) {
                vm.selectedSection = section;
                vm.selectedLineItem = lineItem;
                $scope.$$postDigest(function () {
                    // Make extended window follow selected decision line
                    if ($event != undefined)
                    {
                        var line_item_bottom_offset = angular.element($event.target).prop('offsetHeight') + angular.element($event.target).prop('offsetTop');
                        var extendended_item_height = angular.element("#line-item-extended").prop('offsetHeight');
                        var diff_between_elements = line_item_bottom_offset - extendended_item_height;
                        if (diff_between_elements > 0) {
                            angular.element("#line-item-extended").css('margin-top',(20+diff_between_elements) +'px');
                        } else {
                            angular.element("#line-item-extended").css('margin-top','');
                        }
                    }
                });
            }
        };

        vm.addLineItem = function(section) {
            if(section) {
                var maxWeight = _.maxBy(section.lineItems, function(lineItem) {return lineItem.weight;}) + 1;
                var newLineItem = {"uuid": "newEntity",
                    "name": "Untitled line item",
                    "description": "Please add a description",
                    "weight": maxWeight,
                    "validation_instructions": "Please add validation instructions for the line item."};

                section.lineItems.push(newLineItem);
            }
        };

        vm.addSection = function() {
            if(vm.template) {
                var maxWeight = _.maxBy(vm.template.sections, function(section) {return section.weight;}) + 1;
                var newSection = {"uuid": "newEntity",
                    "name": "Untitled section",
                    "description": "Section added from portal",
                    "validation_instructions": "valid instructions",
                    "weight": maxWeight,
                    "lineItems": []};

                vm.template.sections.push(newSection);
            }
        };

        vm.deleteLineItem = function(lineItemToDelete) {
            _.remove(vm.selectedSection.lineItems, function(lineItem) {return lineItemToDelete === lineItem;});
            initFirstLineItemSelection();
        };

        vm.isSaveInvalid = function() {
            var result = false;
            if(vm.template) {
                result = _.find(vm.template.sections, function(section) { return section.lineItems.length === 0; }) != undefined;
            }

            return result;
        };

        var registerWatchers = function() {
            $scope.$watch('vm.template.name', function(newVal, OldVal){
                $stateParams.templateName = newVal;
            }, true);
        };

        var initFirstLineItemSelection = function () {
            vm.selectedSection = vm.template.sections && vm.template.sections.length > 0
                ? vm.template.sections[0]
                : undefined;

            vm.selectedLineItem = vm.selectedSection ? vm.selectedSection.lineItems[0] : undefined;

            angular.element("#line-item-extended").css('margin-top','');
        };

        var orderTemplateItems = function() {
            if(vm.template) {
                vm.template.sections = _.orderBy(vm.template.sections, 'weight');

                _.forEach(vm.template.sections, function(section) {
                    section.lineItems = _.orderBy(section.lineItems, 'weight');
                });
            }
        };

        init();
    }
})();
