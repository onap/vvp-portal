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
        .module('ice.activation.addVendorContact')
        .controller('AddVendorContactController', ["$state", "vfService", "usersService", "$log", "$rootScope",
            AddVendorContactController]);

    function AddVendorContactController($state, vfService, usersService, $log, $rootScope) {

        var vm = this;
        vm.data = {};

        var init = function() {
            $rootScope.ice.loader.show = true;
            $rootScope.headerTitle = "";
            $rootScope.headerSubTitle = "";

            vm.choices = [{ VirtualFunction: '', TargetLab: '', TargetAic: '',is_service_provider_internal: '' }];

            vfService.getCompanies()
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.companies = response.data;
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });

        };

        vm.submitForm = function () {
            vm.data.company = vm.data.company.uuid;

            $rootScope.ice.loader.show = true;
            usersService.addVendorContact(vm.data)
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        if (response.data.is_active) {
                            $state.go('app.dashboard.overview');
                        } else {
                            $state.go('app.resend_activation');
                        }
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    vm.Msg = response.status + " : " + response.statusText;
                    vm.bgColor = "#FFEBEB"; // RED #FFEBEB green DFF0D9
                    $log.error(error);
                });
        };

        vm.addNewChoice = function (){
            var newItemNo = vm.choices.length + 1;
            vm.choices.push({ 'id':  newItemNo });
        };

        vm.removeChoice = function (){
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(lastItem);
        };

        init();
    }

})();

