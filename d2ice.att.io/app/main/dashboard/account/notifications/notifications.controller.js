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
        .module('ice.dashboard.account')
        .controller('DashboardNotificationsController', ["$state","pageService","usersService", "toastService", "$rootScope", "$scope", "$log", dashboardNotificationsController]);

    function dashboardNotificationsController($state,pageService, usersService, toastService, $rootScope, $scope, $log) {
        var vm = this;
        vm.data = {};
        var init = function()
        {
        	pageService.setPage('notification');
        	$rootScope.timeGapLocal = moment().format("z");// timeGap();
            $rootScope.ampm =  moment().format('A');
            $rootScope.mom =moment().tz( moment.tz.guess()).format('z');
            
            vm.pagination_num_of_objects = 10;
            vm.current_starting_offset = "0";
            vm.page_num = 1;
            vm.user = usersService.getUserData();
            if (vm.user == undefined) {
                $state.go('app.login');
                return;
            }
            vm.getNotifications(true)
        }
        
        vm.getNotifications = function (reset) {
        	var user_uuid =  vm.user.uuid;
            $rootScope.ice.loader.show = true;
            vm.current_starting_offset = (vm.page_num-1)*vm.pagination_num_of_objects;
            usersService.getNotificationsDescription(vm.user.uuid,vm.current_starting_offset,vm.pagination_num_of_objects)
                .then
                (function (response)
                    {
                        if (response.status === 200)
                        {
                            vm.notifications = response.data['serilizedActivitySet'];
                            vm.num_of_returned_items = response.data['num_of_objects'];
                            vm.notifications_display_list =  vm.notifications;
                            if (reset){
	                            usersService.resetNotificationNum(user_uuid)
	                            .then
	                            (function (response)
	                                {
	                                    if (response.status === 200)
	                                    {
	                                        $scope.$emit('eventClearNotifications',0);
	                                    }
	                                }
	                            )
	                            .catch(function (error) {
	                                toastService.setToast(error.message, 'danger');
	                                $rootScope.ice.loader.show = false;
	                                $log.error(error);
	                            });
                            }
                            $rootScope.ice.loader.show = false;
                        }
                        else
                        {
                            toastService.setToast(response.error, 'danger');
                            $rootScope.ice.loader.show = false;
                        }
                    }
                )
                .catch(function (error) {
                    toastService.setToast(error.message, 'danger');
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                 }
            );
        };

    	vm.delNotification = function(uuid)
        {
            var itemIndex = 0;

            for(var i=0; i < vm.notifications.length; i++)
            {
                if (vm.notifications[i].uuid == uuid)
                {
                    itemIndex = i;
                    break;
                }
            }
            usersService.notificationsDelete(uuid)
                .then
                (function (response) {
                    if (response.status != 400){
                        vm.notifications.splice(itemIndex , 1);
                    }
                })
                .catch(function (error) {
                    toastService.setToast(error.message, 'danger');
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        }
        init();
    }
})();