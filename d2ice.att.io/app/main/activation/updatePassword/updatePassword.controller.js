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
        .module('ice.activation.updatePassword')
        .controller('UpdatePasswordController', ["$state", "usersService", "localStorageService", "$rootScope", "toastService", "$window", UpdatePasswordController]);

    function UpdatePasswordController($state, usersService, localStorageService, $rootScope, toastService, $window) {

        var vm = this;
        vm.data = {};

        var ngReq = true;

        $rootScope.headerTitle = "Update Your Password";
        $rootScope.headerSubTitle = "Please follow the instructions below to update your password";

        vm.submitForm = function()
        {
            $rootScope.ice.loader.show = true;
            var jsonPasswordConfirm =
            {
                password : vm.data.password,
                confirm_password : vm.data.confirm_password
            }

            usersService.updatePassword(usersService.getUserData().uuid, jsonPasswordConfirm)
                .then(function (response) {
                    if (response.status === 200) {
                        toastService.setToast('Password was updated Successfully!', 'success');
                        ngReq = false;
                        vm.data.password = "";
                        vm.data.confirm_password = "";
                        $rootScope.ice.loader.show = false;
                        //$timeout(function() {  $state.go("app.dashboard"); }, 2000);
                        $state.go('app.dashboard.dashboard', {"messagePass": "Password was updated Successfully!"});
                    }
                    else
                    {
                        toastService.setToast('Error updating your password.', 'danger');
                        $rootScope.ice.loader.show = false;
                    }
                })
                .catch(function (error) {
                    toastService.setToast(error.message, 'danger');
                    $rootScope.ice.loader.show = false;
                });
        };

        vm.sendMail = function()
        {
            $window.open("mailto:d2ice@att.com","_self");
        }
    }

})();
