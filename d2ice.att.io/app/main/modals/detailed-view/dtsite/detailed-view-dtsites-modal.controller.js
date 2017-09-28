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
        .controller('detailedViewDtsitesModalController', ["$rootScope", "$uibModalInstance", "$stateParams",
            "dtsiteService", "toastService", "vf_uuid", "$log", detailedViewDtsitesModalController]);

    function detailedViewDtsitesModalController($rootScope, $uibModalInstance, $stateParams, dtsiteService, toastService,
                                                                                                        vf_uuid, $log) {

        var vm = this;

        var init = function () {
            if($stateParams.engagement != undefined) {
                vm.vf = $stateParams.engagement.vf;
            }
            getDTsites();

        };

        vm.closeModal = function(){
            $uibModalInstance.close();
        };

        vm.json = '';

        vm.submitForm = function(){
            var postData={
                "name": vm.json,
                "vf_uuid": vf_uuid
            };

            dtsiteService.add(postData)
                .then(function (response) {
                    $uibModalInstance.close(response.status);
                })
                .catch(function (error) {
                    $log.error(error);
                    toastService.setToast(error.status + ': Error changing progress!', 'danger');
                });
        };

        var getDTsites = function() {
            $rootScope.ice.loader.show = true;
            dtsiteService.get()
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        vm.dtsites = response.data;
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
