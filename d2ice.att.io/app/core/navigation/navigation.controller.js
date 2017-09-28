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
        .module('ice.navigation', ['ui.bootstrap'])
        .controller('NavigationController', ["$rootScope", "$q", "iceConstants","pageService","$location", "vfService",
            "localStorageService", "$state", "usersService", "$uibModal",'$scope','$window', 'toastService',
            '$log', NavigationController]);

    function NavigationController($rootScope, $q,iceConstants, pageService, $location, vfService, localStorageService,
                                  $state, usersService, $uibModal, $scope, $window, toastService, $log) {
        var vm = this;

        $scope.selected = undefined;
        $scope.states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
            'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
            'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
            'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota',
            'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina',
            'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
            'Wisconsin', 'Wyoming'];

        vm.formatted_engagements = {};
        vm.starred_engagements = {};
        vm.recent_engagements = {};
        vm.showOpenWizardButton = false;
        var userData = usersService.getUserData();
        if(userData!=undefined &&
           userData.activationSuccess==true){
        	vm.activation_success = true;
        }
        vm.selectEngagement = function (uuid, view_type, sub_id, enable_refresh) {
            var w = angular.element($window);

            if (view_type != undefined && w.width() < 992) {
            	$('.navbar-collapse').collapse("hide");
            }

            if ($state.params.messagePass != null)
            {
                toastService.setToast($state.params.messagePass, 'success');
                $state.params.messagePass == null;
            }

            if (uuid == undefined  && localStorageService.getJson("ice.settings.eng_uuid") != undefined)
            	uuid = localStorageService.getJson("ice.settings.eng_uuid");
            else
            	$state.go('app.dashboard.dashboard');

            var deferred = $q.defer();

            if (view_type != undefined) {
            	vm.view_type = view_type;
            } else if ( pageService.getPage() != '') {
            	vm.view_type = pageService.getPage();
            } else if (  localStorageService.getJson("ice.settings.view_type") != undefined) {
            	vm.view_type = localStorageService.getJson("ice.settings.view_type");
            } else {
            	vm.view_type = 'overview';
        	}

            if (sub_id != undefined) {
            	sub_id = sub_id;
            } else if (localStorageService.getJson("ice.settings.sub_id") != undefined) {
            	sub_id = localStorageService.getJson("ice.settings.sub_id");
            }

            localStorageService.setJson("ice.settings.view_type",vm.view_type);
            localStorageService.setJson("ice.settings.sub_id",sub_id);
            pageService.setPage(vm.view_type);
            $scope.$watch(function () { return pageService.getPage(); }, function (newValue, oldValue) {
                if (newValue !== oldValue) vm.view_type = newValue;
            });

            // Select | unselect the engagement on navigation panel.
            vm.engagement = undefined;
            angular.forEach(vm.recent_engagements,function (item,key) {
            	if (item.uuid === uuid) {
                    vm.engagement = item;
            		vm.engagement.selected = true;
                    vm.engagement.page = vm.view_type
                    vm.engagement.sub_id = sub_id;
                    vm.engagement.view_type = vm.view_type;
                } else {
                    item.selected = undefined;
                }
                var uuidJson = {
                    selectedUuid: uuid
                };
                vm.recent_engagements[key] = item;
            });

            angular.forEach(vm.starred_engagements, function (item,key) {
            	if (item.uuid === uuid) {
                    vm.engagement = item;
            		vm.engagement.selected = true;
                    vm.engagement.page = vm.view_type
                    vm.engagement.sub_id = sub_id;
                    vm.engagement.view_type = vm.view_type;

                } else {
                    item.selected = undefined;
                }
                var uuidJson = {
                    selectedUuid: uuid
                };
                vm.starred_engagements[key] = item;
            });

            if (!vm.engagement) {
            	if (vm.last_not_found_engagement != true) {
                    localStorageService.setJson("ice.settings.eng_uuid", undefined);
            		initEngagements();
            	} else {
            		initEngagements(true);
            	}
            } else {

                localStorageService.setJson("ice.settings.eng_uuid", uuid);
                vm.showOpenWizardButton = true;

                if(enable_refresh === undefined || enable_refresh === true){ //We won't refresh the page if located on the new dashboard view (dashboard.dashboard) (because it's wrong to refresh and we lose the page number).
                    if (vm.activation_success)
                    {
                        $state.go('app.dashboard.'+vm.view_type,{engagement_uuid:uuid,engagement:vm.engagement,sub_id:sub_id,messagePass: "You have successfully activated your account!"});
                    }
                    else {
                        $state.go('app.dashboard.'+vm.view_type,{engagement_uuid:uuid,engagement:vm.engagement,sub_id:sub_id,messagePass: null});
                    }
                }
            }

            vm.isReviewer = usersService.isReviewer(vm.me, vm.engagement.reviewer_uuid);
            vm.isPeerReviewer = usersService.isPeerReviewer(vm.me, vm.engagement.peer_reviewer_uuid);
            deferred.resolve(uuid);
            return deferred.promise;

        };


        vm.searchSelectEngagement = function (engagement_uuid){
            vfService.getSingleEngagement(vm.me.uuid,engagement_uuid)
            .then(function (response) {
                $rootScope.ice.loader.show = false;

                if (response.status === 200 && response.data && response.data !== '') {
                	initEngagements(false, {uuid : engagement_uuid,page_type:'overview',sub_id:undefined});

	                }
	            })
	        .catch(function (error) {
	            $rootScope.ice.loader.show = false;
	            $log.error(error);
	        });
        }

        var init = function () {

            // In case the url is dashboard/<user_uuid> then we come from server redirect, need to load user withuot login.
            // This is a workaround to remove slash at the beginning.
            // The slash is there because the ui-router does not support optional params in URL address, and I used regex:
            // url: '/dashboard{user_uuid: (?:/[^/]+)?}' and the value returned for user_uuid contains slash at the start.
        	vm.me = vm.user = usersService.getUserData();
            vm.isAdmin = usersService.isAdmin(vm.me);
            vm.isEngagementEL = usersService.isUserInRole(iceConstants.roles.el);
            vm.vfc_num = 0;
            // In case user exist in localStorage but not active redirect to activation link.
            if (vm.user && vm.user.is_active===false) {
                $state.go('app.resend_activation', {"message": "Please activate your account first"});
                return;
            }

            // In case user is not in localStorage redirect to login page
            if (vm.user === undefined) {
                $state.go('app.login', {"message": "Please login first"});
                return;
            }
            initEngagements(false);

            $rootScope.$on('onUpdateEngagements', function (event,args) {

                if (args != undefined && args.select != undefined)
               	{
                	initEngagements(false,args.select);
                } else {
                    initEngagements(true);
                }
            });

        };

        var initEngagements = function (selectLast,manual_select) {
            $rootScope.ice.loader.show = true;
        	vm.starred_engagements = {};
        	vm.recent_engagements = {};
        	vm.formatted_engagements = {};
            vfService.getStarredEngagements()
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200 && response.data && response.data !== '') {
                        iterate_over_engagements(response.data,true, false);
                    }
                    else if (response.status === 204){
                        $log.error("no starred VFs were found for you.");
                    }
                    else {
                        $log.error("getStarredEngagements Failed.")
                    }

                    vfService.getRecentEngagements()
                    .then(function (response) {
                    	$rootScope.ice.loader.show = false;
                        if (response.status === 200 && response.data && response.data !== '') {
                        	if (response.data.length > 0) {
                                iterate_over_engagements(response.data, false, true, selectLast, manual_select);
                            }
                        	else {
                                $state.go('app.dashboard.overview', {
                                    engagement_uuid: undefined,
                                    engagement: undefined,
                                    sub_id: undefined
                                });
                            }
                        }
                        else if (response.status === 204){
                            $log.error("no recent VFs were found for you.");
                            select_active_engagements(selectLast);
                        }
                        else {
                            $log.error("getRecentEngagements Failed.")
                        }
                    })
                    .catch(function (error) {
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });

                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });

        };

        $rootScope.$on('searchSelectEngagement', function (event,eng_uuid) {
        	vm.searchSelectEngagement(eng_uuid);
        });

        var iterate_over_engagements = function(engagements, starred, recent,selectLast,manual_select) {
            var i = undefined;
            for( i = 0 ; i < engagements.length; i++){
                var engagement = {};
                if (starred === true)
            	{
                    engagement.creator = engagements[i].engagement__creator__uuid;
                    engagement.is_service_provider_internal = engagements[i].is_service_provider_internal;
                    engagement.name = engagements[i].engagement__engagement_manual_id + ": " + engagements[i].name;
                    engagement.engagement_manual_id = engagements[i].engagement__engagement_manual_id;
                    engagement.reviewer_uuid = engagements[i].engagement__reviewer__uuid;
                    engagement.uuid = engagements[i].engagement__uuid;
                    engagement.peer_reviewer_uuid = engagements[i].engagement__peer_reviewer__uuid;
                } else {
                    engagement.creator = engagements[i].vf__engagement__creator__uuid;
                    engagement.is_service_provider_internal = engagements[i].vf__is_service_provider_internal;
                    engagement.name = engagements[i].vf__engagement__engagement_manual_id + ": " + engagements[i].vf__name;
                    engagement.engagement_manual_id = engagements[i].vf__engagement__engagement_manual_id;
                    engagement.uuid = engagements[i].vf__engagement__uuid;
                    engagement.last_update =  engagements[i].last_update;
                    engagement.reviewer_uuid = engagements[i].vf__engagement__reviewer__uuid;
                    engagement.peer_reviewer_uuid = engagements[i].vf__engagement__peer_reviewer__uuid;
                }

            	if (engagements[i].action_type !="NAVIGATED_INTO_ENGAGEMENT")
            		engagement.red_dot = engagements[i].action_type.split("_").join(" ");
            	else
            		engagement.red_dot = false;

                engagement.checklists = engagements[i].checklists;

                engagement.page = 'overview';

                vm.formatted_engagements[engagement.engagement_manual_id] = engagement;
                if(starred === true){
                    vm.starred_engagements[engagement.engagement_manual_id] = engagement;
                }
                else if (recent === true){
                	if (vm.starred_engagements[engagement.engagement_manual_id] == undefined)
                		vm.recent_engagements[engagement.engagement_manual_id] = engagement;
                }
            }
            if (manual_select !=undefined) {
                if(!manual_select.view_type) {
                    vm.selectEngagement(manual_select.uuid, manual_select.page_type, manual_select.sub_id, manual_select.enable_refresh);
                }
                else{
                    vm.selectEngagement(manual_select.uuid, manual_select.view_type, manual_select.sub_id, manual_select.enable_refresh);
                }
            }
            else if (selectLast != undefined)
        	{
            	select_active_engagements(selectLast);
        	}

            return new Promise(function(resolve, reject) {
                resolve(vm.formatted_engagements);
            });
        }

        var select_active_engagements = function (selectLast) {
            var eng_uuid = false;
            var selected_eng_uuid = localStorageService.getJson("ice.settings.eng_uuid");
            var currUser = usersService.getUserData();
            var keys = Object.keys(vm.formatted_engagements);
            if ( keys.length > 0 ){ // This case represents a user has any engagements to work on
                if (selectLast == true) {
                      eng_uuid = vm.formatted_engagements[Object.keys(vm.formatted_engagements)[0]].uuid;
                }
                else if ($location.search().eng_uuid) {
                    eng_uuid = $location.search().eng_uuid;
                }
            	else if (selected_eng_uuid != null) { // if you re-visit the page after you already been inside, than the last select eng is stored in the storage
                    eng_uuid = selected_eng_uuid;
                }
            	else if($state.params.engagement_uuid!=undefined){
                	// if we came from  any different page  or came from activation and is an invited user or has already been attached to an engagement ('contact' user) so the login url has consisted a engagement uuid as a path param
            		eng_uuid = $state.params.engagement_uuid;
            	}
                if (eng_uuid != false) {
                	var selectPromise = vm.selectEngagement(eng_uuid);
                } else {
                	$state.go('app.dashboard.dashboard');
                    if ($state.params.messagePass != null)
                    {
                        toastService.setToast($state.params.messagePass, 'success');
                        $state.params.messagePass == null;
                    }
                }

                if (eng_uuid == false)
                {
                	eng_uuid = vm.formatted_engagements[Object.keys(vm.formatted_engagements)[0]].uuid;
                	vm.engagement = vm.formatted_engagements[Object.keys(vm.formatted_engagements)[0]];
                }
                /* If user performs activation and he is the creator of current engagement*/
                if (vm.engagement != undefined && vm.engagement.creator!=null &&
                	currUser.uuid == vm.engagement.creator &&
                	vm.activation_success==true) {
                    vm.openGettingStartedWizard(eng_uuid);
                }
            }
            else if (currUser.activationSuccess==true) {
                //This case handles new user with no engs that performs activation
                vm.openGettingStartedWizard();
            	$state.go('app.dashboard.dashboard');
            } else {
            	$state.go('app.dashboard.dashboard');
            }
            vm.activation_success = false;
            usersService.setUserActivationSuccess(undefined);// Cleaning the activationSuccess flag
        };


        init();


        vm.openGettingStartedWizard = function (eng_uuid) {
            var is_service_provider_internal = vm.engagement && eng_uuid ? vm.engagement.is_service_provider_internal : false;
            eng_uuid = eng_uuid || '';
            var args = {
                user: vm.user,
                eng_uuid: eng_uuid,
                is_service_provider_internal: is_service_provider_internal,
                showActivationMessage: vm.activation_success
            }
            $rootScope.$broadcast('openGettingStartedWizard', args);

            vm.activation_success = false;
        };

        vm.addChecklist = function(engagementUuid){
            var modalInstance = $uibModal.open({
                templateUrl: 'main/modals/checklist/checklist.html',
                controller: 'ChecklistModalController',
                controllerAs: 'vm',
                size: 'lg',
                resolve: {
                    engagementUuid: function () {
                        return engagementUuid;
                    },
                    modal_type: function () {
                        return 'create';
                    },
                    wizardData: function () {
                        return false;
                    }
                }
            });

            // Update the progress after modal closed.
            modalInstance.result.then(function (data) {
            	var sub_id = undefined;
            	if (data != undefined) {
            	    sub_id = data.uuid;
            	    initEngagements(false,{uuid:engagementUuid,page_type: 'checklist',sub_id:sub_id});

            	    if(data.progress) {
            	        vm.callback(data);
                        }
                }
            }, function () {
                $log.debug('Modal dismissed at: ' + new Date());
            });
        };

    }
})();
