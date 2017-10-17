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
        .module('ice.activation.resetPassword')
        .controller('ResetPasswordController', ["$state", "usersService", "toastService", "$rootScope", "$window",
                                                                                    "$log", ResetPasswordController]);

    function ResetPasswordController($state, usersService, toastService, $rootScope, $window,$log)
    {
        var vm = this;
        vm.data = {};
        var ngReq = true;
        $rootScope.headerTitle = "Reset Your Password";
        $rootScope.headerSubTitle = "Please follow the instructions below to reset your password";

        if($state.params.message!=undefined && $state.params.message!=""){
            toastService.setToast($state.params.message, 'danger');
            $rootScope.ice.loader.show = false;
            $log.warn($state.params.message);
        }

        vm.submitForm = function()
        {
            $rootScope.ice.loader.show = true;
            var jsonEmail =
            {
                email : vm.data.email
            };
            toastService.clearToast()
            usersService.sendResetPwdInstructions(jsonEmail)
                .then(function (response) {
                    if (response.status === 200) {
                        toastService.setToast('An email with detailed instructions on how to reset your password was sent to your Email.', 'success');
                        ngReq = false;
                        vm.data.email = "";
                        $rootScope.ice.loader.show = false;
                    }
                    else
                    {
                        toastService.setToast('Error sending reset password instructions email.', 'danger');
                        $rootScope.ice.loader.show = false;
                    }
                })
                .catch(function (error)
                {
                    toastService.setToast(error.message, 'danger');
                    $rootScope.ice.loader.show = false;
                    $log.error(error.message);
                });
        };

        vm.sendMail = function()
        {
            $window.open("mailto:d2ice@att.com","_self");
        }
    }
})();
