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
//test
    'use strict';

    angular
        .module('ice.dashboard.overview',[])
        .controller('OverviewMainController', ["$scope","$rootScope", "_","$stateParams", "statusService", "stepsService", "vfService", "usersService", "iceConstants", "$uibModal", "cmsService", "toastService", "$state", "$log", overviewMainController]);

    function overviewMainController($scope,$rootScope,_, $stateParams, statusService, stepsService, vfService, usersService, iceConstants, $uibModal, cmsService, toastService, $state, $log) {
        var vm = this;

        vm.sortableOptions = {
        		  handle: ' .order-nextstep',
        		  axis: 'y',
        		  update: function(e, ui) {
        			  stepsService.order_next_steps(vm.engagement.uuid, vm.steps)
		                .then(function (response) {
		                    if (response.status === 200) {
		                    	$log.debug('updated');
		                    }
		                })
		                .catch(function (error) {
		                    $log.error(error);
		                });
        		  }
        		};

        var init = function () {
            cmsService.setAnnouncementToast();
            $rootScope.timeGapLocal = moment().format("z");// timeGap();
            $rootScope.ampm =  moment().format('A');
            $rootScope.mom =moment().tz( moment.tz.guess()).format('z');

            vm.engagement = $stateParams.engagement;

            if (vm.engagement != undefined)
            {
                vm.me = usersService.getUserData();
                vfService.getSingleEngagement(vm.me.uuid,vm.engagement.uuid)
                    .then(function (response) {
                        $rootScope.ice.loader.show = false;

                        if (response.status === 200 && response.data && response.data !== '') {
                            vm.vf = response.data;
                            vm.is_service_provider_internal = vm.vf.is_service_provider_internal;
                            vm.name = vm.vf.name;
                            vm.manual_id = vm.vf.engagement.engagement_manual_id;
                            if(!vm.vf.git_repo_url || vm.vf.git_repo_url==-1){
                                vm.git_repo_url = false;
                            }
                            else {
                                vm.git_repo_url = vm.vf.git_repo_url;
                            }
                            vm.storage_bucket_url = vm.manual_id + '_' + vm.name.toLowerCase();
                            vm.team = vm.vf.engagement.engagement_team;
                            vm.me = usersService.getUserData();
                            vm.stages = iceConstants.stages;
                            vm.stage = vm.vf.engagement.engagement_stage;
                            vm.stage_num = 0;
                            vm.set_stage_num(vm.stage);
                            vm.in_overview_page = true;
                            vm.uuid = vm.engagement.uuid;
                            vm.progress = vm.vf.engagement.progress;
                            vm.completion_date = vm.vf.engagement.target_completion_date;
                            vm.starred = false;
                            vm.isEngagmentLead = usersService.isUserInRole('el');
                            vm.isEngagementEL = usersService.isEngagementEL(vm.team);
                            vm.isAdmin = usersService.isAdmin(vm.me);
                            vm.does_user_role_allow_action_array = [vm.isAdmin, vm.isEngagementEL];
                            vm.unremoveable_users_from_eng_team_array = [vm.vf.engagement.reviewer.uuid, vm.vf.engagement.peer_reviewer.uuid,
                                vm.vf.engagement.creator.uuid]
                            if (vm.vf.engagement.contact_user != null) {
                                vm.unremoveable_users_from_eng_team_array.push(vm.vf.engagement.contact_user.uuid);
                            }
                            vm.states = iceConstants.states;
                            vm.states_select = serializeStates(iceConstants.states);
                            vm.selected_state_filter = getSelectedStatesByUserType();
                            vm.steps = [];
                            vm.vf_name = vm.vf.name;
                            vm.vf.engagement.starred_engagement.forEach(function(user) {
                                if (vm.me.uuid == user.uuid)
                                    vm.starred = true;
                            });
                            vm.all_states = false;
                            vm.all_files = true;
                            initSteps();
                            vm.initActivityLogs();
                            vm.files = vm.vf.files;
                            vm.files_filter_options = [];
                            vm.files_filter_options = vm.files_filter_options.concat(vm.files);
                            vm.files_filter_options.push("Any file");
                            vm.chosen_files_filter = ["Any file"];
                            vm.show_step = true;
                        	vm.status = false;
                            statusService.get(vm.uuid)
                            .then(function (response) {
                                if (response.status === 200)
                                {
                                	vm.status = response.data;
                                } else
                                {
                                    $log.error(response);
                                }
                            })
                            .catch(function (error) {
                            	vm.status = false;
                                $log.error(error.message);
                            });
                            vm.progress_needed_data = getEngagementProgressData();
                        }
                    })
                    .catch(function (error) {
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });

            }
        };

        vm.set_stage_num = function(state) {
            switch (state) {
                case 'Intake':
                    vm.stage_num = 1;
                    break;
                case 'Active':
                    vm.stage_num = 2;
                    break;
                case 'Validated':
                    vm.stage_num = 3;
                    break;
                case 'Completed':
                    vm.stage_num = 4;
                    break;
            };
        };

        vm.checkIfAdmin = function(user){
            return usersService.isAdmin(user);
        };


        vm.is_user_allowed = function(){
            if(_.includes(vm.does_user_role_allow_action_array, true) == true){
                return true;
            }
            else {
                return false;
            }
        }


        vm.is_able_to_delete = function(requested_user){
            if(vm.is_user_allowed() && !_.includes(vm.unremoveable_users_from_eng_team_array, requested_user.uuid)
               && !vm.checkIfAdmin(requested_user)) {
                        return true;
            }
            else {
                return false;
            }
        };


        vm.remove_user_from_eng = function(requested_user){
            if(vm.is_able_to_delete(requested_user)) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'main/modals/general-prompt-modal/general-prompt-modal.html',
                    controller: 'generalPromptModalController',
                    controllerAs: 'vm',
                    resolve: {
                        modalDetails: function () {
                            return {
                                "upper_headline": 'Remove user from engagement team: ',
                                "upper_headline_value": requested_user.full_name,
                                "headline": 'Are you sure you would like to remove the user out of the team members?',
                                "is_message":false,
                                "message":  '',
                                "approve":  'Yes',
                                "cancelText": 'No',
                                "is_close_modal_button":true
                            };
                        }
                    }
                });
                //in order to close the ui-popover before opening the confirmation modal.
                angular.element('body').click();

                modalInstance.result.then(function (approve_deletion) {
                    if(approve_deletion) {
                        var data = {'eng_uuid': vm.vf.engagement.uuid, 'user_uuid': requested_user.uuid}
                        vfService.remove_user_from_eng(data).then(function (response) {
                            $rootScope.ice.loader.show = false;
                            if (response.status === 204) {
                                $rootScope.$broadcast('onUpdateEngagements',{select : {uuid:vm.engagement.uuid,page_type:'overview',sub_id:undefined}});
                            }
                        })
                            .catch(function (error) {
                                $rootScope.ice.loader.show = false;
                                $log.error(error);
                            });
                    }
                });
            }
            else {
                toastService.setToast('Action is not allowed.', 'danger');
                $rootScope.ice.loader.show = false;
                return;
            }
        };


        $scope.is_match_both_filters = function () {
            return function (step) {

                var result = false;

                if(vm.all_files && vm.all_states) {
                    result = true;
                }
                else if (vm.all_states && vm.is_contain_files(step)){
                    result = true;
                }
                else if (vm.all_files && vm.is_same_state(step.state)){
                    result = true;
                }
                else if (vm.is_contain_files(step) && vm.is_same_state(step.state)){
                    result = true;
                }

				if (result) {
					 return step;
				}
				return false;
            }
          }

        vm.is_all_files = function() {
            vm.all_files = vm.chosen_files_filter.indexOf("Any file") !== -1;
        }

        vm.is_contain_files = function(step) {
            if (step.files) {
                for (var i = 0; i < step.files.length; i++) {
                    if (vm.chosen_files_filter.indexOf(step.files[i]) !== -1) {
                        return true;
                    }
                }
            }

            return false;
        };

        vm.is_same_state = function(step_state){
            return vm.selected_state_filter.indexOf(step_state) !== -1;
        };

        vm.update_next_steps_choice = function(){
            if(vm.selected_state_filter.indexOf("All") !== -1){
                vm.all_states = true;
            }
            else {
                vm.all_states = false;
            }
        };

        vm.editStatus = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/status/status.html',
                controller: 'StatusModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {

                    engagement_uuid: function () {
                        return vm.engagement.uuid;
                    },
                    action: function () {
                        return 'edit';
                    }
                }
            });

            // Update the progress after modal closed.
            modalInstance.result.then(function (data) {
                if (data) {
                	vm.status = data;
                }
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
        };

	    vm.addStatus = function () {
	         var modalInstance = $uibModal.open({
	             templateUrl: 'main/modals/status/status.html',
	             controller: 'StatusModalController',
	             controllerAs: 'vm',
	             size: 'lg',
	                 resolve: {

	                     engagement_uuid: function () {
	                         return vm.engagement.uuid;
	                     },
	                     action: function () {
	                         return 'add';
	                     }
	                 }
	             });

	             // Update the progress after modal closed.
	         modalInstance.result.then(function (data) {
	             if (data) {
	             	vm.status = data;
	             }
	         }, function () {
	             $log.debug('Modal dismissed at: ' + new Date());
	         });
	     };

        vm.deleteStep = function(step_uuid){
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/general-prompt-modal/general-prompt-modal.html',
                controller: 'generalPromptModalController',
                controllerAs: 'vm',
                resolve: {
                    modalDetails: function () {
                        return {
                        	"headline": 'Delete Step',
                        	"is_message":true,
                            "message": 'Are you sure you want to delete this step?',
                            "approve": 'Delete Step',
                            "is_close_modal_button":true
                        };
                    }
                }
            });

            modalInstance.result.then(function (deletionApproved) {
                if(deletionApproved) {
                    stepsService.delete(step_uuid)
                        .then(function (response) {
                            if (response.status === 204) {
                                initSteps();
                                initActivityLogs();
                            }
                        })
                        .catch(function (error) {
                            $log.error(error);
                        });
                }
            });
        };

        // next steps modal
        vm.editStep = function (nextstep) {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/next-steps/next-steps.html',
                controller: 'NextStepsModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {

                    engagement_team: function () {
                        return vm.team;
                    },
                    title: function () {
                        return vm.engagement.name;
                    },
                    associated_files: function () {
                        return vm.files;
                    },
                    engagement_uuid: function () {
                        return vm.engagement.uuid;
                    },
                    checklist: function () {
                        return undefined;
                    },
                    nextstep: function () {
                        return nextstep;
                    }
                }
            });

            // Update the progress after modal closed.
            modalInstance.result.then(function (data) {
                if (data) {
                    initSteps();
                }
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
        };

        vm.addStep = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/next-steps/next-steps.html',
                controller: 'NextStepsModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    engagement_team: function () {
                        return vm.team;
                    },
                    title: function () {
                        return vm.engagement.name;
                    },
                    associated_files: function () {
                        return vm.files;
                    },
                    engagement_uuid: function () {
                        return vm.engagement.uuid;
                    },
                    checklist: function () {
                        return undefined;
                    },
                    nextstep: function () {
                        return undefined;
                    }
                }
            });

            // Update the progress after modal closed.
            modalInstance.result.then(function (data) {
                if (data) {
                    data.forEach(function (step) {
                        step['creator'] = vm.me;
                        vm.steps.push(step);
                    });
                    initSteps();
                }
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
        };

        $rootScope.$on('onUpdateNextSteps', function (event, args) {
            if(args.eng_uuid && args.stage){
                vm.uuid = args.eng_uuid;
                vm.stage = args.stage;
            }
            else{
                $log.error("onUpdateNextStep expecting args");
                return;
            }
            initSteps();
        });

        vm.starEngagement = function () {

            vfService.putStarredEngagements(vm.engagement.uuid)
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200 && response.data && response.data !== '') {
                        if (vm.starred == true)
                            vm.starred = false
                        else
                            vm.starred = true
                        $rootScope.$broadcast('onUpdateEngagements',{select : {uuid:vm.engagement.uuid,page_type:'overview',sub_id:undefined}});

                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        }

        vm.updateStep = function (stepUuid, stepState) {
            var data = {"state":stepState};
            stepsService.update(stepUuid, data)
                .then(function (response) {
                    if (response.status === 200) {
                        var step = getStepByUuid(stepUuid);
                        if (step){
                            initSteps();
                            vm.initActivityLogs();
                        }
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                });
        };

        vm.toggleCompleted = function (stepUuid) {
            var step = getStepByUuid(stepUuid);
            if (step){
                if(step.state == vm.states.incomplete){
                    vm.updateStep(stepUuid, iceConstants.states.completed);
                }else if(step.state == vm.states.completed){
                    vm.updateStep(stepUuid, iceConstants.states.incomplete);
                }

            }
        };

        vm.updateProgress = function(data) {
            if (data && data.progress){
                vm.progress = data.progress;
            } else if (data && data.target_date){
                vm.completion_date = data.target_date;
                vm.target_completion_date = data.target_date;
            }
        };

        vm.addPeople = function () {

            var args = {
                user: vm.me,
                eng_uuid: vm.engagement.uuid,
                is_service_provider_internal: vm.is_service_provider_internal,
                requiredStep: 'inviteMembers'
            };

            $rootScope.$broadcast('openGettingStartedWizard', args);
        };

        var initSteps = function() {
            $rootScope.ice.loader.show = true;
            stepsService.get(vm.uuid, vm.stage)
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.steps = [];
                        response.data.forEach(function (step) {
                                vm.steps.push(step);
                        });
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };

        vm.initActivityLogs = function() {
            $rootScope.ice.loader.show = true;
            vfService.getActivities(vm.uuid)
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.activities = response.data;

                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };

        var getStepByUuid = function(stepUuid) {
            var foundStep;
            if (vm.steps) {
                vm.steps.forEach(function (step) {
                    if (step.uuid === stepUuid) {
                        foundStep = step;
                    }
                });
            }
            return foundStep;
        };

        var serializeStates = function(states) {
            var result = []
            for(var key in states) {
                result.push(states[key])
            }

            return result;
        };

        var getSelectedStatesByUserType = function() {
            var result = [];

//            if(vm.isEngagementEL || vm.isAdmin) {
//                result.push("All","Completed","Incomplete");
//            } else { //For normal users:
                result.push("Incomplete")
//            }

            return result;
        };

        var getEngagementProgressData = function() {
            var result = {
                "enable_edit": ((vm.isEngagementEL || vm.isAdmin) && vm.in_overview_page),
                "completion_date":vm.vf.engagement.target_completion_date,
                "ecomp_release": vm.vf.ecomp_release.name,
                "vnf_version": vm.vf.version,
                "aic_version":vm.vf.deployment_target.version,
                "aic_instantiation_time":vm.vf.engagement.aic_instantiation_time,
                "asdc_onboarding_time":vm.vf.engagement.asdc_onboarding_time,
                "heat_validated_time":vm.vf.engagement.heat_validated_time,
                "image_scan_time":vm.vf.engagement.image_scan_time,
                "engagement_uuid": vm.uuid, manual_id: vm.manual_id
            };

            return result;
        };

        vm.archiveEngagement = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/archive-engagement-modal/archive-engagement-modal.html',
                controller: 'archiveEngagementModalController',
                controllerAs: 'vm',
                resolve: {
                    engagementDetails: function () {
                        return {
                            "manual_id": vm.manual_id,
                            "name": vm.name,
                            "engagement": vm.engagement
                        };
                    }
                }
            });

            modalInstance.result.then(function (archiveReason) {
                if(archiveReason && vm.engagement && vm.engagement.uuid) {
                    vfService.archiveEngagement(vm.engagement.uuid, archiveReason)
                        .then(function() {
                            $state.go('app.dashboard.dashboard');
                            toastService.setToast("Engagement '" + vm.engagement.name + "' archived successfully.", 'success');
                        })
                        .catch (function(error) {
                            toastService.setToast("Server failed archiving engagement.", 'danger');
                            $rootScope.ice.loader.show = false;
                            $log.error(error);
                        });
                } else {
                    toastService.setToast("No reason was supplied, therefor engagement cannot be archived.", 'danger');
                }
            });
        };

        vm.changeReviewer = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/select-el-modal/select-el-modal.html',
                controller: 'selectELModalController',
                controllerAs: 'vm',
                resolve: {
                    // We are not allow the reviewer and peer reviewer to be the same:
                    excludeUuids: function () {
                        return [vm.engagement.peer_reviewer_uuid];
                    },
                    selectedOption: function() {
                        return vm.engagement.reviewer_uuid;
                    }
                }
            });

            modalInstance.result.then(function (userUuid) {
                if(vm.engagement && vm.engagement.uuid) {

                    if (userUuid == vm.engagement.peer_reviewer_uuid) {
                        vfService.switchEngagementReviewers(vm.engagement.uuid, userUuid, vm.engagement.reviewer_uuid)
                            .then(function (response) {
                                vm.engagement.reviewer_uuid = response.data.reviewer;
                                vm.engagement.peer_reviewer_uuid = response.data.peerreviewer;
                                toastService.setToast("Reviewer and peer reviewer updated successfully.", 'success');
                            })
                            .catch(function (error) {
                                toastService.setToast("Server failed to update engagement reviewers.", 'danger');
                                $rootScope.ice.loader.show = false;
                                $log.error(error);
                            });
                    } else {
                        vfService.updateEngagementReviewer(vm.engagement.uuid, userUuid)
                            .then(function(response){
                                _.remove(vm.team, function(user) {return user.uuid === vm.engagement.reviewer_uuid;});
                                vm.team.push(response.data);
                                vm.engagement.reviewer_uuid = response.data.uuid;
                                toastService.setToast("Reviewer updated successfully.", 'success');
                            })
                            .catch(function(error) {
                                toastService.setToast("Server failed to update engagement reviewer.", 'danger');
                                $rootScope.ice.loader.show = false;
                                $log.error(error);
                            });
                }} else {
                    toastService.setToast("Problem occurred while updating reviewer - missing engagement uuid.", 'danger');
                }
            })
        };

        vm.changePeerReviewer = function() {
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/select-el-modal/select-el-modal.html',
                controller: 'selectELModalController',
                controllerAs: 'vm',
                resolve: {
                    // We are not allow the reviewer and peer reviewer to be the same:
                    excludeUuids: function () {
                        return [vm.engagement.reviewer_uuid];
                    },
                    selectedOption: function() {
                        return vm.engagement.peer_reviewer_uuid;
                    }
                }
            });

            modalInstance.result.then(function (userUuid) {
                if(vm.engagement && vm.engagement.uuid) {

                    if (userUuid == vm.engagement.reviewer_uuid) {
                        vfService.switchEngagementReviewers(vm.engagement.uuid, vm.engagement.peer_reviewer_uuid, userUuid)
                            .then(function (response) {
                                vm.engagement.reviewer_uuid = response.data.reviewer;
                                vm.engagement.peer_reviewer_uuid = response.data.peerreviewer;
                                toastService.setToast("Peer reviewer and reviewer updated successfully.", 'success');
                            })
                            .catch(function (error) {
                                toastService.setToast("Server failed to update engagement reviewers.", 'danger');
                                $rootScope.ice.loader.show = false;
                                $log.error(error);
                            });
                    } else {
                        vfService.updateEngagementPeerReviewer(vm.engagement.uuid, userUuid)
                        .then(function(response) {
                            $log.debug("vm.team", vm.team);
                            _.remove(vm.team, function(user) {return user.uuid === vm.engagement.peer_reviewer_uuid;});
                            vm.team.push(response.data);
                            vm.engagement.peer_reviewer_uuid = response.data.uuid;
                            toastService.setToast("Peer reviewer updated successfully.", 'success');
                        })
                        .catch(function(error) {
                            toastService.setToast("Server failed to update engagement peer reviewer.", 'danger');
                            $rootScope.ice.loader.show = false;
                            $log.error(error);
                        });
                }} else {
                    toastService.setToast("Problem occurred while updating peer reviewer - missing engagement uuid.", 'danger');
                }
            })
        };

        vm.updateEngagementStatus = function() {
        	vm.vf.engagement.progress = parseInt(vm.progress);
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/update-engagement-status-modal/update-engagement-status-modal.html',
                controller: 'updateEngagementStatusModalController',
                controllerAs: 'vm',
                resolve: {
                    engagement: function () {
                        // We will deliver a copy of the engagement so if the user hit 'Cancel' we won't change the original:
                        return angular.copy(vm.vf.engagement);
                    }
                }
            });

            modalInstance.result.then(function (result) {
                vfService.updateEngagement(result.engagement, result.status)
                    .then(function(response) {
                        vm.vf.engagement = result.engagement;
                        vm.progress = vm.vf.engagement.progress;
                        vm.progress_needed_data = getEngagementProgressData();
                        vm.status = response.data;
                        toastService.setToast("Engagement status updated successfully.", 'success');
                    })
                    .catch(function(error){
                        toastService.setToast("Server failed to update engagement status.", 'danger');
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });
            })
        };

        vm.changeTargetCompletion = function(){
                var modalInstance = $uibModal.open({
                    templateUrl: 'main/modals/change-date/change-date.html',
                    controller: 'ChangeDateModalController',
                    controllerAs: 'vm',
                    resolve: {
                        completionDate: function () {
                            return vm.vf.engagement.target_completion_date;
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
                    vm.completion_date = data.target_date || vm.vf.engagement.target_completion_date;
                    vm.vf.engagement.target_completion_date = vm.completion_date;
                }, function () {
                    $log.debug('Modal dismissed at: ' + new Date());
                });
            };

        init();
    }
})();
