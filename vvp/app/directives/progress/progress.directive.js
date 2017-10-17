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
        .module('ice.directives')
        .directive('progressDirective', ["$uibModal", "$rootScope", "$log", "vfService", ProgressDirective]);

    function ProgressDirective($uibModal, $rootScope, $log, vfService) {
        var directive = {};
        directive.restrict = 'E';
        directive.templateUrl = 'directives/progress/progress.html';
        directive.scope = {
            progress: "@progress",
            data: "=data",
            callback: "=callback",
            statuses: "@statuses",
            enable_refresh: "@enableRefresh",
        };
        directive.link = function (scope, element, attrs) {
            var init = function() {
                if(!scope.statuses){
                    scope.statuses = false;
                }

                calculateDaysLeft();
                registerWatches();
            };

            var calculateDaysLeft = function(){
                var currentDate = moment();
                var completionDate = moment(scope.data.completion_date);
                var days_diff = Math.ceil(completionDate.diff(currentDate, 'days',true));
                if (days_diff < 0 )
                    days_diff = 0;
                scope.daysLeft = days_diff;
            };

            var registerWatches = function() {
                scope.$watch('data.completion_date', function(oldVal, newVal) {
                    if (oldVal !== newVal){
                        calculateDaysLeft();
                    }
                });

                scope.$watch('data.heat_validated_time', function(oldVal, newVal) {
                    if (oldVal !== newVal){
                        normalizeData();
                    }
                });

                scope.$watch('data.vnf_version', function(oldVal, newVal) {
                    if (oldVal !== newVal){
                        normalizeData();
                    }
                });

                scope.$watch('data.image_scan_time', function(oldVal, newVal) {
                    if (oldVal !== newVal){
                        normalizeData();
                    }
                });

                scope.$watch('data.aic_instantiation_time', function(oldVal, newVal) {
                    if (oldVal !== newVal){
                        normalizeData();
                    }
                });

                scope.$watch('data.asdc_onboarding_time', function(oldVal, newVal) {
                    if (oldVal !== newVal){
                        normalizeData();
                    }
                });
            };

            var normalizeData = function() {
                if(scope.data) {
                    if(!scope.data.ecomp_release){
                        scope.data.ecomp_release = "-";
                    }
                    if(!scope.data.aic_version){
                        scope.data.aic_version = "-";
                    }

                    if(!scope.data.aic_instantiation_time){
                        scope.data.aic_instantiation_time = "-";
                    }

                    if(!scope.data.vnf_version){
                        scope.data.vnf_version = "-";
                    }

                    if(!scope.data.asdc_onboarding_time){
                        scope.data.asdc_onboarding_time = "-";
                    }

                    if(!scope.data.heat_validated_time){
                        scope.data.heat_validated_time = "-";
                    }

                    if(!scope.data.image_scan_time){
                        scope.data.image_scan_time = "-";
                    }
                }
            };

            scope.starEngagement = function () {
                vfService.putStarredEngagements(scope.data.engagement_uuid)
                    .then(function (response) {
                        $rootScope.ice.loader.show = false;
                        if (response.status === 200 && response.data && response.data !== '') {
                            $rootScope.$broadcast('onUpdateEngagements', {select: {
                                uuid: scope.data.engagement_uuid,
                                page_type: 'dashboard',
                                sub_id: undefined,
                                enable_refresh: scope.enable_refresh
                            }
                            });
                            if(scope.data.starred == false){
                                scope.data.starred = true;
                            }
                            else {
                                scope.data.starred = false;
                            }
                        }
                    })
                    .catch(function (error) {
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });
            };

            scope.goToEngagement = function(uuid){
            	$rootScope.$broadcast('searchSelectEngagement',uuid);
            };

            scope.changeProgress = function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'main/modals/change-progress/change-progress.html',
                    controller: 'ChangeProgressModalController',
                    controllerAs: 'vm',
                    resolve: {
                        progress: function () {
                            return scope.progress;
                        },
                        engagementUuid: function () {
                            return scope.data.engagement_uuid;
                        }
                    }
                });

                // Update the progress after modal closed.
                modalInstance.result.then(function (data) {
                    if (!data){
                        return;
                    }
                    scope.progress = data.progress || scope.progress;
                    if (data.progress) {
                        scope.callback(data);
                    }
                }, function () {
                    $log.debug('Modal dismissed at: ' + new Date());
                });
            };

            init();
        };

        return directive;
    }

})();
