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
        .module('ice.modals')
        .controller('detailedViewVFCModalController', ["$rootScope", "$uibModalInstance", "vfcService", "toastService",
                                                    "vf_uuid", "usersService", "$log", detailedViewVFCModalController]);

    function detailedViewVFCModalController($rootScope, $uibModalInstance, vfcService, toastService, vf_uuid, usersService, $log) {

        var vm = this;

        var init = function () {
            vm.me = usersService.getUserData();

            getVendors()
        };

        vm.vfcs = [{name:'',external_ref_id:'',company:''}];
        vm.companies = [];

        vm.closeModal = function(){
            $uibModalInstance.close();
        };

        vm.addNewChoice = function () {
            var newItemNo = vm.vfcs.length + 1;
            vm.vfcs.push({'id': newItemNo});
        };

        vm.removeChoice = function (index) {
            vm.vfcs.splice(index,1);
        };

        vm.submitForm = function(){
            var jsonAddVfc = [];
            angular.forEach(vm.vfcs, function (value, key) {
                vm.item = [];
                var jsonItem = new Object();
                jsonItem.name = value.name;
                jsonItem.external_ref_id = value.external_ref_id;
                jsonItem.company = value.company;
                jsonAddVfc.push(jsonItem);
            });

            var postData={
                "vfcs": jsonAddVfc,
                "vf_uuid": vf_uuid,
                "creator": vm.me,
            };

            vfcService.add(postData)
                .then(function (response) {
                    if (response.status === 200) {
                        $uibModalInstance.close(response.status);
                    }
                })
                .catch(function (error) {
                    $log.error(error);
                    toastService.setToast(error.status + ': Error changing progress!', 'danger');
                });
        };

        var getVendors = function() {
            $rootScope.ice.loader.show = true;
            vfcService.getCompanies()
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.companies = response.data;
                        if(vm.companies.length === 0 ){
                            console.warn("No vendors pulled, request was successfull")
                        }
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };

        init();
    }
})();
