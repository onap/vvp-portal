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
        .controller('ChangeDateModalController', ["$uibModalInstance", "completionDate", "engagementUuid", "vfService", "$rootScope", "toastService", changeDateModalController]);

    function changeDateModalController($uibModalInstance, completionDate, engagementUuid, vfService, $rootScope, toastService) {

        var vm = this;
        //vm.completionDate = new Date(completionDate);
        vm.completionDate = completionDate;

        vm.dateOptions = {
            minDate: new Date(),
            showWeeks: true
        };

        vm.closeModal = function(){
            $uibModalInstance.close();
        };

        vm.submitForm = function(){
            var postData={"target_date": moment(vm.completionDate).format("YYYY-MM-DD")};
            vfService.updateDaysLeft(engagementUuid, postData)
                .then(function (response) {
                    if (response.status === 200) {
                        $uibModalInstance.close(postData);
                    }
                })
                .catch(function (error) {
                    toastService.setToast(error.status + ': Error changing completion date!', 'danger');
                });
        };
    }
})();
