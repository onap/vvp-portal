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
        .module('ice.activation.register')
        .controller('RegisterController', ["usersService", "$state", "$location", "vfService", "$rootScope",
            "toastService", "$log",'$i18next', RegisterController]);

    function RegisterController(usersService, $state, $location, vfService, $rootScope, toastService, $log,$i18next) {

        var vm = this;
        vm.data = {};
        var programName = $i18next.t('program.name');
        var init = function()
        {

            $rootScope.headerTitle = "Sign Up";
            $rootScope.headerSubTitle = "Please use the form to Sign Up to " +programName;

            usersService.resetUserData();

            var companyParam = $location.search().company;

            vm.data.full_name = $location.search().full_name;
            vm.data.email = $location.search().email;
            vm.data.phone_number = $location.search().phone_number;

            $rootScope.ice.loader.show = true;
            vfService.getCompanies()
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200){
                        vm.vendors = response.data;
                        if (companyParam != undefined) {
                            angular.forEach(vm.vendors, function (value, key) {
                                if (value.uuid === companyParam) {
                                    vm.data.company = value.name;
                                };
                            });
                        }
                    }
                })
                .catch(function (error){
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };

        vm.submitForm = function () {
            if(grecaptcha.getResponse().length != 0)
            {
                $rootScope.ice.loader.show = true;
                if (vm.data.regular_email_updates != true) {
                    vm.data.regular_email_updates = false;
                }
                vm.data.inviter_uuid = $location.search().inviter_uuid;
                vm.data.eng_uuid = $location.search().eng_uuid;
                vm.data.invitation = $location.search().invitation;
                vm.data.is_contact_user = ($location.search().is_contact_user === "true");
                vm.email = $location.search().email;

                usersService.register(vm.data)
                    .then(function (response) {
                        $rootScope.ice.loader.show = false;
                        if (response.status === 200) {
                            $state.go('app.resend_activation');
                        }
                    })
                    .catch(function (error) {
                        toastService.setToast(error.message, 'danger');
                        $rootScope.ice.loader.show = false;
                        $log.error(error.message);
                    });
                $rootScope.PleaseFill = "";
            } else {
                toastService.setToast('Please fill CAPTCHA!', 'danger');
                $log.warn("Please fill CAPTCHA!");
            }
        };

        init();
    }
})();
