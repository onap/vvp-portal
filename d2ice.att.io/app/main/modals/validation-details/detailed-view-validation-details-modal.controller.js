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
        .controller('validationDetailsModalController', ["$rootScope", "$uibModalInstance", "vfcService", "vfService", "$stateParams", "toastService", "vf_uuid", "usersService", "$log", "_", validationDetailsModalController]);

    function validationDetailsModalController($rootScope, $uibModalInstance, vfcService,vfService, $stateParams,toastService, vf_uuid, usersService,$log,_) {

        var vm = this;
        var init = function () {
            if($stateParams.engagement) {
                vm.engagement = $stateParams.engagement;
            }
                vm.me = usersService.getUserData();
                vfService.getSingleEngagement(vm.me.uuid,vm.engagement.uuid)
                    .then(function (response) {
                        $rootScope.ice.loader.show = false;

                        if (response.status === 200 && response.data && response.data !== '') {
                            var vf_data = response.data;
                            vm.engagement_manual_id = vf_data.engagement.engagement_manual_id;
                            vm.vf_name = vf_data.name;
                            vm.vf_uuid = vf_data.uuid;
                            vm.ecomp_release = vf_data.ecomp_release;
                            vm.target_lab = new Date(vf_data.target_lab_entry_date);
                            vm.dtversion = vf_data.deployment_target;
                            vm.selected_dt_uuid = vm.dtversion.uuid;
                            vm.selected_ecomp_uuid = vm.ecomp_release.uuid;
                            vm.me = usersService.getUserData();
                            vm.name = vm.engagement.name;
                            vm.isEngagementEL = usersService.isEngagementEL(vf_data.engagement.engagement_team);
                            vm.isAdmin = usersService.isAdmin(vm.me);
                            vm.choices = [{TargetLab: '', TargetAic: ''}];
                            getDeployTargets();
                            getECOMPReleases();
                            getVFVersion();
                        }
                    })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };

        vm.closeModal = function(){
            $uibModalInstance.close();
        };

        vm.addNewChoice = function () {
            var newItemNo = vm.choices.length + 1;
            vm.choices.push({'id': newItemNo});
        };

        function getDeployTargets() {
            vfService.getDeployTargets()
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.deployTargets = response.data;
                        if (_.filter(vm.deployTargets, {'uuid': vm.dtversion.uuid}).length === 0) {
                            vm.dtversion.disabled = true;
                            vm.deployTargets.push(vm.dtversion);
                        }
                    }
            }).catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });
        }
        function getECOMPReleases(){
	        vfService.getECOMPReleases()
	        .then(function (response) {
	            if (response.status === 200) {
	                vm.ECOMPReleases = response.data;
	                if (_.filter(vm.ECOMPReleases, {'uuid':vm.ecomp_release.uuid}).length === 0) {
	                    vm.ecomp_release.disabled = true;
	                    vm.ECOMPReleases.push(vm.ecomp_release);
	                }
	            }
	        }).catch(function (error) {
	            $rootScope.ice.loader.show = false;
	            $log.error(error);
	        });
        }
        function getVFVersion(){
	        vfService.getVFVersion(vf_uuid)
	        .then(function (response) {
	            $rootScope.ice.loader.show = false;
	            if (response.status === 200) {
	                vm.VFVersion = response.data;
	            }
	        }).catch(function (error) {
	            $rootScope.ice.loader.show = false;
	            $log.debug(error);
	        });
        }
        vm.removeChoice = function (index) {
            vm.choices.splice(index,1);
        };

        vm.submitForm = function(){
        	var validationDetailsSelection = {
        			"vf_uuid": vm.vf_uuid,
        			"version": vm.VFVersion,
        			"target_aic_uuid": vm.TargetAic,
        			"ecomp_release": vm.ECOMPRelease
        	};

            vfService.updateVfs(validationDetailsSelection,vm.vf_uuid)
                .then(function (response) {
                    if (response.status === 200) {
                        $uibModalInstance.close(response.status);
                    }
                })
                .catch(function (error) {
                	$log.error(error);
                    toastService.setToast(error.status + ': Error changing progress!', 'danger');
                });
        };

        vm.update_deployment_target = function(){
            if(vm.dtversion.uuid == vm.selected_dt_uuid){
                return
            }
            angular.forEach(vm.dt_AIC_versions, function (value, key) {
                if (value.uuid === vm.selected_dt_uuid) {
                    vm.dtversion = value;
                };
            });
            vfService.updateDeployTargets(vm.engagement.uuid, vm.selected_dt_uuid)
                .then(function (response) {
                $rootScope.ice.loader.show = false;
            }).catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });
            vm.set_edit_mode('aic');
        };
        vm.update_ECOMP_release = function(){
            if( vm.ecomp_release.uuid == vm.selected_ecomp_uuid){
                return;
            }
            _.each(vm.ECOMPReleases, function (value, key) {
                if (value.uuid === vm.selected_ecomp_uuid) {
                    vm.ecomp_release = value;
                };
            });
            vfService.updateECOMPReleases(vm.engagement.uuid, vm.selected_ecomp_uuid)
                .then(function (response) {
                $rootScope.ice.loader.show = false;
            }).catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });
            vm.set_edit_mode('ecomp');
        };

        init();
    }

})();
