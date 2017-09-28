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
        .module('ice.activation.inviteMembers')
        .controller('InviteMembersController', ["$state", "vfService", "$rootScope", "$log", InviteMembersController]);

    function InviteMembersController($state, vfService, $rootScope, $log) {
        var vm = this;
        vm.data = [];

        var init = function() {
            $rootScope.headerTitle = "Invite Team Members";
            $rootScope.headerSubTitle = "You can invite as many team members to collaborate around your virtual" +
                " function as you would like. Please do remember that anyone invited to collaborate with you around" +
                " the virtual function will have equal access.";
            vm.choices = [{ Email: '' }];
        };

        vm.submitForm = function () {
            var jsonInviteMembers=[];
            angular.forEach(vm.choices, function(value, key) {
                vm.item=[];
                var jsonItem = new Object();
                jsonItem.email = value.email;
                jsonInviteMembers.push(jsonItem);
            });

            $rootScope.ice.loader.show = true;
            vfService.inviteMembers(JSON.stringify(jsonInviteMembers))
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
                    $log.error(error);
                });
        };

        vm.addNewChoice = function () {
            var newItemNo = vm.choices.length + 1;
            vm.choices.push({ 'id':  newItemNo });
        };

        vm.removeChoice = function () {
            var lastItem = vm.choices.length - 1;
            vm.choices.splice(lastItem);
        };

        init();
    }
})();

