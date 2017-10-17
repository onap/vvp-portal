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
        .controller('DashboardAccountController', ["$state", "usersService", "vfService", "$log",
                                                            "$rootScope", "toastService", dashboardAccountController]);

    function dashboardAccountController($state,usersService,vfService, $log, $rootScope, toastService) {

        var vm = this;
        vm.data = {};

        var init = function()
        {

            vm.user = usersService.getUserData();

            if (vm.user == undefined) {
                $state.go('app.login');
                return;
            }

            var user_uuid =  vm.user.uuid;

            $rootScope.ice.loader.show = true;
            usersService.getIceUser(user_uuid)
                .then
                (function (response)
                    {
                        if (response.status === 200)
                        {
                            vm.data.full_name = response.data.full_name;
                            vm.data.email = response.data.email;
                            vm.data.phone_number = response.data.phone_number;
                            vm.data.password = ''; //user.password;
                            vm.data.ssh_key = response.data.ssh_public_key;
                            vm.data.company = response.data.company.name;
                            vm.data.access_key = response.data.rgwa_access_key;
                            vm.data.access_secret = "•••••••••••••••";
                            $rootScope.ice.loader.show = false;
                        }
                        else
                        {
                            toastService.setToast('Error getting account', 'danger');
                            $log.error("Error getting account: " + uuid);
                            $rootScope.ice.loader.show = false;
                        }
                    }
                ).catch(function (error) {
                    toastService.setToast(error.message, 'danger');
                    $log.error(error.message);
                });

            vfService.getCompanies()
                .then(function (response) {
                    if (response.status === 200)
                    {
                        vm.companies = response.data;
                    }
                })
                .catch(function (error)
                {
                    $log.error(error.message);
                });



        };

        init();

        vm.getAccessSecret = function ()
        {
            usersService.getRGWASecret()
                .then
                (function (response)
                    {
                        if (response.status === 200)
                        {
                            vm.data.access_secret = response.data.rgwa_secret_key;
                        }
                        else
                        {
                            toastService.setToast('Error getting user\'s access secret', 'danger');
                            $log.error("Error getting access secret: " + uuid);
                            $rootScope.ice.loader.show = false;
                        }
                    }
                ).catch(function (error) {
                toastService.setToast(error.message, 'danger');
                $log.error(error.message);
            });
        }

        vm.submitForm = function ()
        {
                var user = usersService.getUserData();
                usersService.updateAccount(user.uuid, vm.data)
                    .then(function (response) {
                        if (response.status === 200) {
                            toastService.setToast('Account was updated successfully!', 'success');
                        }
                    })
                    .catch(function (error) {
                        toastService.setToast(error.message.detail, 'danger');
                    });
        };
    }

})();
