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
        .controller('accountUserProfileSettingsController', ['toastService', 'usersService',
            accountUserProfileSettingsController]);

    function accountUserProfileSettingsController(toastService, usersService) {
        var vm = this;

        var init = function()
        {
            usersService.getIceUser()
                .then
                (function (response) {
                    vm.receiveEmails = response.data.regular_email_updates;
                    vm.receiveEmailsEveryTime = response.data.email_updates_on_every_notification;
                    vm.receiveDigestEmails = response.data.email_updates_daily_digest;

                    vm.receiveNotifications = vm.receiveEmailsEveryTime || vm.receiveDigestEmails;
                }
                ).catch(function (error) {
                    toastService.setToast(error.message, 'danger');
                    $log.error(error.message);
                });
        };

        vm.submitForm = function() {
            var user = usersService.getUserData();
            var userData = {};

            userData.regular_email_updates = vm.receiveEmails;
            userData.email_updates_on_every_notification = vm.receiveEmailsEveryTime;
            userData.email_updates_daily_digest = vm.receiveDigestEmails;
            userData.company = user.company.name;
            userData.full_name = user.full_name;
            userData.email = user.email;
            userData.phone_number = user.phone_number;

            usersService.updateAccount(user.uuid, userData)
                .then(function (response) {
                    if (response.status === 200) {
                        toastService.setToast('User profile settings was updated successfully!', 'success');
                    }
                })
                .catch(function (error) {
                    toastService.setToast(error.message.detail, 'danger');
                });
        };

        vm.changeReceiveNotifications = function() {
            if(!vm.receiveNotifications) {
                vm.receiveEmailsEveryTime = false;
                vm.receiveDigestEmails = false;
            }
        };

        init();
    }
})();
