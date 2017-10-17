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
        .module('ice.dashboard.checklist',[])
        .controller('DashboardChecklistController', ["$scope", "$stateParams", "$rootScope", "checklistService",
                    "iceConstants", "usersService", "$uibModal", "toastService", "$log", DashboardChecklistController]);
        function DashboardChecklistController($scope, $stateParams, $rootScope, checklistService, iceConstants,
                                                                        usersService, $uibModal, toastService, $log) {

        var vm = this;
        vm.data = {};
        var engagementUuid = $stateParams.engagement_uuid;
        vm.checklistUuid = $stateParams.sub_id;
        vm.selected_decision = false;

        var init = function() {
            if (vm.checklistUuid == null)
               	return;

        	checklistService.getChecklist(vm.checklistUuid)
            .then(function (response) {
                if (response.status === 200) {
                    vm.data = response.data;
                    vm.data.states = iceConstants.checklist_states;
                    vm.me = usersService.getUserData();
                    vm.is_peer_reviewer = usersService.isPeerReviewer(vm.me, response.data.checklist.engagement.peer_reviewer.uuid);
                    // if state pending dont allow changing data manually
                    if(vm.data.checklist.associated_files) {
                        vm.has_files = true;
                    }
                    else {
                        vm.has_files = false;
                    }
                    vm.formatDecisions();

                }
            })
            .catch(function (error) {
                if (error.status === 410) {
                    $rootScope.$broadcast('onUpdateEngagements',{
                        select:{
                            uuid: $stateParams.engagement_uuid,
                            view_type : 'overview',
                            sub_id: undefined
                        }
                    });
                }
                else{
                    $log.error(error.message);
                    return false;
                }
            });
        };


        vm.formatDecisions = function () {
        	var section_counter = 0;
        	vm.data.checklistDecisions = _.orderBy(vm.data.checklistDecisions, 'weight');
            angular.forEach(vm.data.checklistDecisions, function(section,section_key) {
                section_counter ++;
                section.counter = section_counter;
                var decision_counter = 0;
                section.decisions = _.orderBy(section.decisions, 'weight');
                angular.forEach(section.decisions,function(decision,decision_key) {
                    decision_counter++;
                    // add text of section and line number E.g 2.1
                    decision.counter = section_counter+'.'+decision_counter;

                    // set selected decision default value
                    if (vm.selected_decision == false)
                    {
                        vm.selected_decision = decision;
                        vm.selectDecision(decision);
                    }

                    // choose which decision value to show
                    var view_value;
                    switch(vm.data.checklist.state)
                    {
                        case 'peer_review':
                            view_value = decision.peer_review_value;
                            break;
                        case 'review':
                        case 'approval':
                        case 'handoff':
                        case 'closed':
                            view_value = decision.review_value;
                            break;
                    }

                    // choose which ucib to show
                    var view_value_css;
                    switch(view_value)
                    {
                        case 'approved':
                            view_value_css = 'sprite approved-cl';
                            break;
                        case 'denied':
                            view_value_css = 'sprite denied-cl';
                            break;
                        case 'not_relevant':
                            view_value_css = 'sprite not-relevant-cl';
                            break;
                    }

                    // choose which line item type icon to show
                    var auto_icon_css
                    switch(decision.lineitem.line_type)
                    {
                        case 'auto':
                            auto_icon_css = 'sprite automation-state';
                    }
                    vm.data.checklistDecisions[section_key].decisions[decision_key]['selected-value'] = view_value
                    vm.data.checklistDecisions[section_key].decisions[decision_key]['view_value'] = view_value;
                    vm.data.checklistDecisions[section_key].decisions[decision_key]['view_value_css'] = view_value_css;
                    vm.data.checklistDecisions[section_key].decisions[decision_key]['auto_icon_css'] = auto_icon_css;
                });
            });
            // after decision change refresh which state buttons to shows
            vm.refreshStateOptions();

        };

        // set decision value
        vm.setDecision = function(decision,value) {
            checklistService.putChecklistDecision(decision.uuid,{value:value})
                .then(function (response) {
                    if (response.status === 200) {
                        switch(vm.data.checklist.state)
                        {
                            case 'peer_review':
                                decision.peer_review_value = value;
                                break;
                            case 'review':
                                decision.review_value = value;
                                break;
                        }
                        vm.formatDecisions();
                    }
                });

        };

        // decice which state change buttons to choose
        vm.refreshStateOptions = function () {
            var force_break = false;
            vm.is_able_to_approve = true;
            angular.forEach(vm.data.checklistDecisions, function (section,key) {
                if (!force_break)
            	angular.forEach(section.decisions, function (decision,key) {
                    if (!force_break){
	                    // if not all decisions have value only only next_step
                    	if ( decision['view_value'] != 'approved' &&  decision['view_value'] != 'not_relevant' ) {
	                    	vm.is_able_to_approve = false;
	                        force_break=true;
	                    }
                    }
                });

            });
        };

        // set state
        vm.stateAction = function(action) {
        	switch(action)
        	{
	        	case 'approve':
	                var postData = {};
                    postData["description"] = '';
                    postData["decline"] =  "False";
                    checklistService.setState(vm.data.checklist.uuid, postData)
	                    .then(function (response) {
	                        if (response.status === 200) {
	                           	$rootScope.$broadcast('onUpdateEngagements',{select:{uuid:engagementUuid,page_type:'overview',sub_id:vm.data.checklist.uuid}});
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
	        		break;
	        	case 'reject':
	        		vm.openSetState(action,vm.data.checklist);
	        		break;
	        	case 'next_step':
	        		vm.openNextSteps(vm.data.checklist);
	        		break;
        	}
        };

        vm.formatDate = function (create_time) {
            var region = moment().tz( moment.tz.guess()).format('z');
            var dt = "";
            dt = moment(create_time).local().format('YYYY-MM-DD hh:mm:ss A') + " " + region;
            return dt;
        };

        // add decision log
        vm.submitDecisionAuditLog = function () {

            var jsonPost = {"description":vm.selected_decision.new_audit_log_description};
            checklistService.createAuditlogDecisionChecklist(vm.selected_decision.uuid, jsonPost)
            .then(function (response) {
                if (response.status === 200)
                {
                    if (vm.data.decisionAuditLogs[vm.selected_decision.uuid] == undefined)
                        vm.data.decisionAuditLogs[vm.selected_decision.uuid] = []
                    vm.data.decisionAuditLogs[vm.selected_decision.uuid].push(response.data);
                    vm.selected_decision.new_audit_log_description = ""
                }
                else
                {
                    toastService.setToast(response.error, 'danger');
                    $rootScope.ice.loader.show = false;
                }
            })
            .catch(function (error) {
                toastService.setToast(error.message, 'danger');
                $log.error(error.message);
            });
        }

        // choose active decision
        vm.selectDecision = function(decision,$event) {
            if(vm.selected_decision != decision || vm.selected_decision.selected === undefined) {
                // remove status from previos decision
                vm.selected_decision.selected = false;

                // populate new decision
                vm.selected_decision = decision;
                vm.selected_decision.selected = true;

                $scope.$$postDigest(function () {
                    // Make extended window follow selected decision line
                    if ($event != undefined)
                    {
                        var line_item_bottom_offset = angular.element($event.target).prop('offsetHeight') + angular.element($event.target).prop('offsetTop');
                        var extendended_item_height = angular.element("#line-item-extended").prop('offsetHeight');
                        var diff_between_elements = line_item_bottom_offset - extendended_item_height;
                        if (diff_between_elements > 0)
                        {
                            angular.element("#line-item-extended").css('margin-top',(20+diff_between_elements) +'px')
                        } else {
                            angular.element("#line-item-extended").css('margin-top','')
                        }
                    }
                });
            }
        };

        // next steps modal
        vm.openNextSteps = function(checklist) {
            var modalInstance = $uibModal.open(
                {
                    templateUrl: 'main/modals/next-steps/next-steps.html',
                    controller: 'NextStepsModalController',
                    controllerAs: 'vm',
                    size: 'lg',
                    resolve: {
                    	engagement_team: function () {
                            return checklist.engagement.engagement_team;
                        },
                        title: function () {
                            return checklist.name;
                        },
                        associated_files: function () {
                            return checklist.repo_associated_files;
                        },
                        engagement_uuid: function () {
                            return checklist.engagement.uuid;
                        },
                        checklist: function () {
                            return checklist;
                        },
                    	nextstep: function () {
                            return undefined;
                        }

                    }
                });

            modalInstance.result.then(function (data) {
                if (data === 200) {
                   	$rootScope.$broadcast('onUpdateEngagements',{select:{uuid:engagementUuid,page_type:'overview',sub_id:checklist.uuid}});
                }
            }, function () {
            });
        };

        // set state modal
        vm.openSetState = function(action,checklist) {
            var modalInstance = $uibModal.open(
                {
                    templateUrl: 'main/modals/checklist/state-approve-or-reject/state-approve-or-reject.html',
                    controller: 'stateDecisionModalController',
                    controllerAs: 'vm',
                    resolve: {
                        checklist: function () {return checklist},
                        action: function () {return action}
                    }
                });

            modalInstance.result.then(function (data) {
            	if (data) {
                     $rootScope.$broadcast('onUpdateEngagements',{select:{uuid:engagementUuid,page_type:'overview',sub_id:checklist.uuid}});
            	 }
            }, function () {
            });

        };

        vm.openJenkinsLogModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/general-log-modal/general-log-modal.html',
                controller: 'GeneralLogModalController',
                controllerAs: 'vm',
                size: 'general-log-modal',
                resolve: {
                    modalDetails: function () {
                        return {
                            "headline": 'Jenkins log',
                            "body":  vm.data.checklist.jenkins_log,
                        };
                    }
                }
            });
        };

        // audit log modal
        vm.auditLog = function() {

            var auditLogData = {
                name:vm.data.checklist.name,
                uuid:vm.data.checklist.uuid,
                checklistAuditLogs: vm.data.checklistAuditLogs

              };

            var modalInstance = $uibModal.open(
            {
                templateUrl: 'main/modals/audit-log/audit-log.html',
                controller: 'AuditLogModalController',
                controllerAs: 'vm',
                size: 'lg'

                ,
                resolve: {
                    wizardData: function () {
                        return auditLogData;
                    }
                }
            });

            modalInstance.result.then(function (data) {
                if (data) {
                    vm.data.checklistAuditLogs.push(data);
                }
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
        };

        // edit checklist
        vm.editChecklist = function() {
            var checklistData = {
                uuid:vm.data.checklist.uuid,
                name:vm.data.checklist.name,
                templates:vm.data.checklist.templates,
                selectedTemplateUuid:vm.data.checklist.template.uuid,
                selectedTemplateName:vm.data.checklist.template.name,
                associatedFiles:vm.data.checklist.associated_files,
                state:vm.data.checklist.state
            };

            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/checklist/checklist.html',
                controller: 'ChecklistModalController',
                controllerAs: 'vm',
                size: 'lg'
                ,
                resolve: {
                    wizardData: function () {
                        return checklistData;
                    },
                    engagementUuid: function () {
                        return engagementUuid;
                    },
                    modal_type: function () {
                        return 'update';
                    }
                }
            });
            modalInstance.result.then(function (data) {
                if (data) {
                    vm.data.checklist.name = data.checklist_name;
                    vm.data.checklist.associated_files = data.associated_files;
                }
            });
        };

        init();
    }
})();
