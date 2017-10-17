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
        .module('ice.dashboard.dashboard',['angularUtils.directives.dirPagination', 'ngFileSaver'])
        .controller('DashboardMainController', ["$rootScope", "pageService", "stepsService", "vfService", "usersService",
            "iceConstants", "localStorageService", "FileSaver", "Blob", "cmsService", "$uibModal", "$log", dashboardMainController]);

    function dashboardMainController($rootScope, pageService, stepsService, vfService, usersService, iceConstants,
                                                        localStorageService, FileSaver, Blob, cmsService, $uibModal, $log) {
        var vm = this;

        var init = function () {
            pageService.setPage('dashboard');
            cmsService.setAnnouncementToast();
        	localStorageService.setJson("ice.settings.eng_uuid",undefined);
            vm.stages = iceConstants.stages;
            vm.stages.all = 'All';
            vm.search_keyword = '';
            vm.search_stage = 'All';
            vm.statistic_stage_filter = 'All';
            vm.current_starting_offset = "0";
            vm.num_of_returned_items = 0;
            vm.pagination_num_of_objects = 8;
            vm.me = vm.user = usersService.getUserData();
            vm.isAdminRo = usersService.isUserInRole(iceConstants.roles.admin_ro);
            vm.isEngagmentEL = usersService.isUserInRole(iceConstants.roles.el);
            vm.isEngagmentLead = usersService.isEngagementEL(vm.team);
            vm.isAdmin = usersService.isAdmin(vm.me);
            vm.page_num = 1;
            vm.searchEngagements(1);
            vm.request_statistics_data();
            getUserNextSteps();
        };

        vm.request_statistics_data = function(){
            vfService.getEngagements(vm.me.uuid)
            .then(function (response) {
                if (response.status === 200 && response.data && response.data !== '') {
                	vm.enagements_search_list = response.data;
                    var vfc_array = undefined;
                    var vfc_num = 0;
                    var eng_num = 0;
                    vm.enagements_search_list.forEach(function (engagement) {
                        if(vm.statistic_stage_filter == "All") {
                            eng_num++;
                            if (engagement.engagement_stage == "Validated" || engagement.engagement_stage == "Completed") {
                                if (engagement.vfc.length > 1) {
                                    vfc_array = engagement.vfc.split(", ").length;
                                    vfc_num += vfc_array;
                                }
                            }
                        }
                        else {
                            if(engagement.engagement_stage == vm.statistic_stage_filter){
                                eng_num++;
                                if (engagement.vfc.length > 1 && (engagement.engagement_stage == "Validated" || engagement.engagement_stage == "Completed")) {
                                    vfc_array = engagement.vfc.split(", ").length;
                                    vfc_num += vfc_array;
                                }
                            }
                        }

                    });

                    vm.vfc_num = vfc_num;
                    vm.eng_num = eng_num;
                }
            })
            .catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });

        };

        vm.onStageChange = function() {
            vm.page_num = 1;

            vm.searchEngagements();
        };

        vm.onKeywordChange = function() {
            vm.page_num = 1;

            vm.searchEngagements();
        };

        vm.searchEngagements = function () {
            vm.current_starting_offset = (vm.page_num-1)*vm.pagination_num_of_objects;
            vm.postData = {'stage': vm.search_stage, 'keyword': vm.search_keyword, 'offset': vm.current_starting_offset, 'limit': vm.pagination_num_of_objects};
            vfService.getExpandedEngagements(vm.postData)
                .then(function (response) {
                    if (response.status === 200 && response.data && response.data !== '') {
                        vm.vf_search_list = response.data['array'];
                        vm.num_of_returned_items = response.data['num_of_objects'];
                        vm.vf_search_list.forEach(function (vf){
                            var progress_needed_data = {
                                enable_edit: false,
                                completion_date: vf.engagement__target_completion_date,
                                ecomp_release: vf.ecomp_release__name,
                                vnf_version: vf.version,
                                aic_version: vf.deployment_target__version,
                                aic_instantiation_time:vf.engagement__aic_instantiation_time,
                                asdc_onboarding_time:vf.engagement__asdc_onboarding_time,
                                heat_validated_time:vf.engagement__heat_validated_time,
                                image_scan_time: vf.engagement__image_scan_time,
                                engagement_uuid: vf.engagement__uuid,
                                manual_id: vf.engagement__engagement_manual_id,
                                name: vf.vf__name,
                                starred: false
                            };
                            vf.progress_needed_data = progress_needed_data;
                            vf.starred_users.forEach(function (user) {
                                if (vm.me.uuid == user) {
                                    vf.progress_needed_data.starred = true;
                                }
                            });


                        });
                        vm.vf_display_list = vm.vf_search_list;

                        addStatusesLoadedAttr();
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };

        vm.goToEngagement = function(uuid){
        	$rootScope.$broadcast('searchSelectEngagement',uuid);
        };

        vm.exportEngagementCSV = function() {
            var stage = vm.search_stage || "";
            var keyword = vm.search_keyword || "";
            $rootScope.ice.loader.show = true;

            vfService.exportEngagementsCSV(stage, keyword)
                .then(function(response) {
                    if(response && response.data) {
                        var data = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
                        FileSaver.saveAs(data, 'D2Ice.xlsx');
                        $rootScope.ice.loader.show = false;
                    }
                })
                .catch(function (error) {
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });
        };

        vm.openCMSReadMoreModal = function(cmsPost) {
            if(cmsPost) {
                $uibModal.open({
                    templateUrl: 'main/modals/cms-post-modal/cms-post-modal.html',
                    controller: 'cmsPostModalController',
                    controllerAs: 'vm',
                    size: 'cms-post-read-more',
                    resolve: {
                        post: function () {
                            return cmsPost;
                        }
                    }
                });
            } else {
                $log.warn("Cannot open cms post.")
            }
        };

        function getUserNextSteps() {
            vm.userNextSteps = [];

            stepsService.getByUser()
            .then(function(response) {
                vm.userNextSteps = response.data.data;
                vm.userNextStepsCount = response.data.count;
            })
            .catch(function (error) {
                $log.error(error);
            });
        };

        function addStatusesLoadedAttr() {
        	angular.element(document).ready(function () {
            	var statusesTitleElement = angular.element( document.querySelector('#dashboard-title'));
                if(statusesTitleElement && statusesTitleElement.length === 1) {
                	statusesTitleElement.attr('list-loaded', 'true');
                }
            });
        };

        init();
    }
})();
