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
        .module('ice.directives', [])
        .directive('stepStagesDirective', ProgressDirective);

    function ProgressDirective($rootScope, iceConstants, localStorageService, usersService, $uibModal) {
        var directive = {};
        directive.restrict = 'E';
        directive.templateUrl = 'directives/step-stages/step-stages.html';
        directive.scope = {
            stage : "=stage",
            stage_num: "=stageNum",
            eng_uuid : "@engUuid",
            team: "=team",
            eng_name: "@engName",
            initactivitylogs: '&'
        };
        directive.controller =  ['$scope', 'vfService', '$log', function($scope, vfService, $log) {
            $scope.set_engagement_stage = function(scope, requested_stage){
                var modalInstance = $uibModal.open({
                    templateUrl: 'main/modals/set-eng-stage/set-eng-stage-modal.html',
                    controller: 'setEngStageModalController',
                    controllerAs: 'vm',
                    resolve: {
                        stage: function () {
                            return requested_stage;
                        },
                        eng_name: function () {
                            return $scope.eng_name;
                        },
                        current_stage: function () {
                            return $scope.stage;
                        }
                    }
                });

                modalInstance.result.then(function (bool) {
                    if(bool) {
                        vfService.set_engagement_stage(scope.eng_uuid, requested_stage)
                            .then(function (response) {
                                if (response.status === 202) {
                                    scope.stage = requested_stage;
                                    switch (requested_stage) {
                                        case 'Intake':
                                            scope.stage_num = 1;
                                            break;
                                        case 'Active':
                                            scope.stage_num = 2;
                                            break;
                                        case 'Validated':
                                            scope.stage_num = 3;
                                            break;
                                        case 'Completed':
                                            scope.stage_num = 4;
                                            break;
                                    }
                                    $rootScope.$broadcast('onUpdateNextSteps',{'stage': scope.stage, 'eng_uuid': scope.eng_uuid});
                                    $scope.initactivitylogs();
                                }
                                else {
                                    return false;
                                }
                            })
                            .catch(function (error) {
                                $log.error(error);
                            });
                    }
                    else {
                        return;
                    }
                });


            };

            $scope.hover_design = function(bool, num){
                $scope.temp_num = num;
                $scope.hover = bool;
                return;
            };


        }];


        directive.link = function (scope, element, attrs) {
            scope.hover = false;
            scope.temp_num = 0;
            scope.priviliged = false;
            scope.const = iceConstants.stages;
            scope.loaded = false;
            scope.user = usersService.getUserData();
            scope.$watchGroup(['user','team'], function(new_vals, old_vals, scope){
                if(!(new_vals[0]) || !(new_vals[1])){
                    return;
                }
                else if (!(scope.loaded)){
                    if( (usersService.isEngagementEL(scope.team)) || (usersService.isAdmin(scope.user))){
                        scope.priviliged = true;
                    };
                    scope.loaded = true;

                }
            });

            scope.hover_actions = function(bool, num){
                if(!(scope.priviliged)){
                    return;
                };
                scope.hover_design(bool, num);
            };

            scope.set_stage = function(requested_stage){
                if(!(scope.priviliged)){
                    return;
                };
                if (scope.stage === requested_stage){
                    $log.debug("Same stage was chosen, request ignored.");
                    return;
                };

                var result = scope.set_engagement_stage(scope, requested_stage);

            };

        };
        return directive;
    }

})();

