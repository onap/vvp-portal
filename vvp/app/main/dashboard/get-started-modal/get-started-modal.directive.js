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
        .module('ice.dashboard.get-started-modal')
        .directive('getStartedModal', function () {
            return {
                restrict: 'AEC',
                scope: {},
                link: function (scope, elm, attrs) {
                    scope.$emit('openGettingStartedWizardLoaded');
                },
                controller: ['$rootScope', '$scope', '$uibModal', 'toastService', '$log',
                    function ($rootScope, $scope, $uibModal, toastService, $log) {

                    var gm = this;
                    gm.data = {};

                    gm.openModal = function () {
                        toastService.clearToast();
                        var modalInstance = $uibModal.open({
                            templateUrl: 'main/dashboard/get-started-modal/wizard/wizard-container.html',
                            controller: 'ModalCtrl',
                            controllerAs: 'wizard',
                            resolve: {
                                wizardData: function () {
                                    return gm.wizardData;
                                }
                            },
                            backdrop: 'static'
                        });
                    };

                    $scope.$on('openGettingStartedWizard', function (event, args) {

                        gm.wizardData = args;
                        gm.openModal();
                    });
                }],
                controllerAs: 'gm'
            };
        })
        .controller('ModalCtrl', ['$rootScope', '$scope', '$uibModalInstance', 'vfService', 'usersService', 'localStorageService', 'wizardData', 'toastService', '$log', '$i18next',
            function ($rootScope, $scope, $uibModalInstance, vfService, usersService, localStorageService, wizardData, toastService, $log, $i18next) {

            var wizard = this;
            wizard.steps = [];
            wizard.data = {};
            wizard.user = wizardData.user;
            wizard.is_service_provider_internal = wizardData.is_service_provider_internal;
            wizard.eng_uuid = wizardData.eng_uuid;
            wizard.requiredStep = wizardData.requiredStep;
            
            var serviceProviderName = $i18next.t('serviceProvider.name');

            var availableSteps = {
                addVF: {name: 'addVF', title: 'Add a VF'},
                addSponsor: {
                    name: 'addContact',
                    title: 'Add ' + serviceProviderName +' Sponsor',
                    mode: 'sponsor',
                    submitButton: 'Add ' + serviceProviderName + ' Sponsor'
                },
                addVendor: {
                    name: 'addContact',
                    title: 'Add Vendor Contact',
                    mode: 'vendor',
                    submitButton: 'Add Vendor Cotact',
                },
                inviteMembers: {name: 'inviteMembers', title: 'Invite Team Members'},
                addSSH: {name: 'addSSH', title: 'Add SSH Key'}
            };

            wizard.setStep = function (step) {
                wizard.currentStep = step
                wizard.title = step.title;
                step.completed = true;
            };

            function initWizard() {

                $rootScope.ice.loader.show = true;

                if (wizardData.showActivationMessage) {
                    toastService.setToast('You have successfully activated your account!', 'success', {displayFor: 'modal'});
                }

                wizard.stepIndex = 0;

                if (wizard.requiredStep) {
                    wizard.steps.push(availableSteps[wizard.requiredStep]);
                    wizard.setStep(wizard.steps[wizard.stepIndex]);
                    $rootScope.ice.loader.show = false;
                    return;
                }

                if (!wizard.eng_uuid || wizard.eng_uuid === "") {
                    wizard.steps.push(availableSteps.addVF);
                }
                if (wizard.user.is_service_provider_contact === true && !wizard.is_service_provider_internal) {
                    wizard.steps.push(availableSteps.addVendor);
                } else if (!wizard.user.is_service_provider_contact) {
                    wizard.steps.push(availableSteps.addSponsor);
                }

                getCompanies();

                wizard.steps.push(availableSteps.inviteMembers);

                var userData = usersService.getUserData() || {};
                var ssh_public_key = userData.ssh_public_key;
                if ((wizard.user.ssh_public_key === "" || wizard.user.ssh_public_key === null) &&
                    (ssh_public_key === "" || ssh_public_key === null)) {
                    wizard.steps.push(availableSteps.addSSH);
                }

                $rootScope.ice.loader.show = false;
                wizard.setStep(wizard.steps[wizard.stepIndex]);
            }

            initWizard();

            wizard.getCurrentStep = function () {
                return wizard.currentStep.name;
            };

            wizard.nextStep = function () {
                wizard.clearMessage();
                wizard.stepIndex++;

                if (wizard.stepIndex === (wizard.steps.length)) {
                    wizard.closeWizard();
                    return;
                }

                wizard.setStep(wizard.steps[wizard.stepIndex]);
            };

            wizard.closeWizard = function () {
                wizard.clearMessage();
                $uibModalInstance.close();

            };

            wizard.clearMessage = function () {
                toastService.clearToast();
            };

            wizard.onAddContactSubmit = function () {
                $rootScope.ice.loader.show = true;
                wizard.data.addContact.eng_uuid = wizard.eng_uuid;

                if (wizard.user.is_main_vendor_contact === true && !wizard.is_service_provider_internal) {
                    wizard.data.addContact.company = wizard.data.addContact.company;
                } else if (!wizard.user.is_main_vendor_contact) {
                    wizard.data.addContact.company = wizard.data.attCompanyUuid;
                }

                usersService.addVendorContact(wizard.data.addContact)
                    .then(function (response) {
                        if (response.status === 200) {
                            $rootScope.ice.loader.show = false;
                            wizard.nextStep();
                        }
                    }, function	(error) {
                        toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                        $log.error(error.message);
                        $rootScope.ice.loader.show = false;
                    })
                    .catch(function (error) {
                        wizard.Msg = error.status + " : " + error.statusText;
                        wizard.bgColor = "#FFEBEB"; // RED #FFEBEB green DFF0D9
                        $log.error(error);
                        $rootScope.ice.loader.show = false;
                    });
            };

            wizard.onInviteSubmit = function () {
                $rootScope.ice.loader.show = true;
                var is_service_provider_internal;
                var jsonInviteMembers = [];
                angular.forEach(wizard.inviteMembers.choices, function (value, key) {
                    wizard.item = [];
                    var jsonItem = new Object();
                    jsonItem.email = value.email;
                    jsonItem.eng_uuid = wizard.eng_uuid;
                    jsonInviteMembers.push(jsonItem);
                });

                vfService.inviteMembers(JSON.stringify(jsonInviteMembers))
                    .then(function (response) {
                        if (response.status === 200) {
                            wizard.nextStep();
                        }
                        $rootScope.ice.loader.show = false;
                    })
                    .catch(function (error) {
                        toastService.setToast(error.message.detail, 'danger', {displayFor: 'modal'});
                        $rootScope.ice.loader.show = false;
                        $log.error(error.message);
                    });
            };

            wizard.inviteMembers = {
                choices: [
                    {
                        email: '',
                        eng_uuid: ''
                    }]
            };

            wizard.addNewChoice = function () {
                var newItemNo = wizard.inviteMembers.choices.length + 1;
                wizard.inviteMembers.choices.push({'id': newItemNo});
            };

            wizard.removeChoice = function () {
                var lastItem = wizard.inviteMembers.choices.length - 1;
                wizard.inviteMembers.choices.splice(lastItem);
            };

            wizard.onAddSSHSubmit = function () {
                $rootScope.ice.loader.show = true;
                usersService.setSSHKey(wizard.user.uuid, wizard.data.addSSH)
                    .then(function (response) {
                        if (response.status === 200) {
                            usersService.getIceUser()
                                .then(function (response) {
                                    if (response.status === 200 && response.data && response.data !== '') {
                                        wizard.user = response.data;
                                        $rootScope.ice.loader.show = false;
                                        $scope.$emit('onUpdateEngagements');
                                    }
                                });
                            wizard.nextStep();
                        }

                    }).catch(function (error) {
                    toastService.setToast(error.message.detail, 'danger', {displayFor: 'modal'});
                    $rootScope.ice.loader.show = false;
                    $log.error(error.message.detail);
                });
            };

            $scope.$on('moveWizardNextStep', function (event, args) {
                wizard.is_service_provider_internal = args.is_service_provider_internal;
                wizard.eng_uuid = args.engagement.uuid;
                wizard.nextStep();
            });

            function getCompanies() {
                vfService.getCompanies()
                    .then(function (response) {
                        if (response.status === 200) {
                            wizard.companies = response.data;
                            if(wizard.companies!=undefined){
                                for(var i=0; i<wizard.companies.length; i++){
                                    if(wizard.companies[i].name=="AT&T"){
                                        wizard.data.attCompanyUuid=wizard.companies[i].uuid;
                                        break;
                                    }
                                }
                            }
                        }
                    })
                    .catch(function (error) {
                        $log.error(error);
                    });
            }
        }]);
})();
