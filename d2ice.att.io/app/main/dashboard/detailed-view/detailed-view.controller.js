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
        .module('ice.dashboard.main')
        .controller('detailedViewController', ["$rootScope", "$stateParams", "vfcService", "dtsiteService", "usersService",
                                                                "$uibModal", "vfService", "$log", "_", detailedViewController]);

    function detailedViewController($rootScope, $stateParams, vfcService, dtsiteService, usersService, $uibModal, vfService, $log, _) {
        var vm = this;

        var init = function () {
            $rootScope.timeGapLocal = moment().format("z");// timeGap();
            $rootScope.ampm = moment().format('A');
            $rootScope.mom = moment().tz(moment.tz.guess()).format('z');
            vm.is_aic_edit_mode = false;
            vm.is_ecomp_edit_mode = false;
            vm.aic_loaded = false;
            vm.ecomp_loaded = false;

            if($stateParams.engagement != undefined) {
                vm.engagement = $stateParams.engagement;
            }

            if (vm.engagement != undefined)
            {
                vm.me = usersService.getUserData();
                vfService.getSingleEngagement(vm.me.uuid,vm.engagement.uuid)
                    .then(function (response) {
                        $rootScope.ice.loader.show = false;

                        if (response.status === 200 && response.data && response.data !== '') {
                            var vf_data = response.data;

                            vm.engagement_manual_id = vf_data.engagement.engagement_manual_id;
                            vm.vf_name = vf_data.name;
                            vm.vf_version = vf_data.version;
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
                            initDTsites();
                            initVfcs();
                        }
                    })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });

            }
        };


        vm.addVfc = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/detailed-view/vfc/detailed-view-vfc-modal.html',
                controller: 'detailedViewVFCModalController',
                controllerAs: 'vm',
                resolve: {
            		 vf_uuid: function () {
                        return vm.vf_uuid;
                    },
                }
            });
            modalInstance.result.then(function (data) {
                if (data) {
                    initVfcs();
                }
            });
        };
        this.personArray = [vm.dtversion,vm.vf_uuid];
        
        vm.editValidationDetails = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/validation-details/detailed-view-validation-details-modal.html',
                controller: 'validationDetailsModalController',
                controllerAs: 'vm',
                resolve: {
                	vf_uuid: function () {
                        return vm.vf_uuid;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                if (data) {
                    init();
                }
            });
        };
        
        vm.addDTS = function () {
            if(vm.isEngagementEL || vm.isAdmin) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'main/modals/detailed-view/dtsite/detailed-view-dtsites-modal.html',
                    controller: 'detailedViewDtsitesModalController',
                    controllerAs: 'vm',
                    resolve: {
                        vf_uuid: function () {
                               return vm.vf_uuid;
                        },
                    }
                });

                modalInstance.result.then(function (data) {
                    if (data) {
                        if(data === 200) {
                            initDTsites();
                        }
                    }
                });
            }
        };
        
        
        vm.changeTargetLabEntry = function(){
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/target-lab-entry/change-lab-entry-date.html',
                controller: 'ChangeLabEntryDateModalController',
                controllerAs: 'vm',
                resolve: {
                    targetLabDate: function () {
                        return  vm.target_lab;
                    },
                    engagementUuid: function () {
                        return vm.engagement.uuid;
                    }
                }
            });
            modalInstance.result.then(function (data) {
            	if (!data){
                    return;
                }
            	else {
            		vm.target_lab = new Date(data.target_date);
            		$log.debug("data.target_date",data.target_date)
            		$log.debug("vm.target_lab",vm.target_lab)
            	}
            }, function () {
                $log.error('Modal dismissed at: ' + new Date());
            });
        };
        //In case user press the delete icon next to a VFC, this function would be activated
        vm.deleteVfc = function(vfc_uuid){
            vfcService.delete(vfc_uuid,vm.vf_uuid)
                .then(function (response) {
                    if (response.status === 204) {
                        initVfcs();
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        vm.deleteDTSite = function(vfUuid, dtsUuid){
            dtsiteService.delete(vm.vf_uuid, dtsUuid)
                .then(function (response) {
                    if (response.status === 204) {
                        initDTsites();
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };


        var initDTsites = function() {
            if(vm.isEngagementEL || vm.isAdmin) {
                $rootScope.ice.loader.show = true;
                dtsiteService.getVFSites(vm.vf_uuid)
                    .then(function (response) {
                        $rootScope.ice.loader.show = false;
                        if (response.status === 200) {
                            vm.dtsites = response.data;
                        }
                    })
                    .catch(function (error) {
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });
            }
        };

        var initVfcs = function() {
            $rootScope.ice.loader.show = true;
            vfcService.get(vm.vf_uuid)
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.vfcs = response.data;
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };
        init();
    }
})();
