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
        .module('ice.activation.login')
        .controller('LoginController', ["$state", "usersService", "$log", "$rootScope", "$location", "toastService",
            "$stateParams", LoginController]);

    function LoginController($state, usersService, $log, $rootScope, $location, toastService, $stateParams) {
        var vm = this;
        vm.data = {};
        $rootScope.headerTitle = "Login";
        $rootScope.headerSubTitle = "Please use the form below to login";
        usersService.resetUserData();
        var t="";

        if ($state.params.message){
            toastService.setToast($state.params.message, 'danger');
            $log.warn($state.params.message);
        }

        if ($location.search().t != undefined){
            t = "token"+$location.search().t
        }

        vm.data.invitation = $location.search().invitation;

        vm.submitForm = function () {
            $rootScope.ice.loader.show = true;
            usersService.login(JSON.stringify(vm.data), t)
                .then(function (response) {
                    if (response.status === 200) {
                        $rootScope.ice.loader.show = false;

                        usersService.setUserActivationSuccess($state.params.activation_success);

                        if(response.data.isResetPwdFlow!=undefined && response.data.isResetPwdFlow==true){
                            $state.go("app.updatePassword");
                        }
                        else{
                        	// This is a workaround to remove slash at the beginning.
                            // The slash is there because the ui-router does not support optional
                            // params in URL address, and I used regex:
                            // url: '/login{enggement_uuid: (?:/[^/]+)?}' and the value returned for engagement_uuid
                            // contains slash at the start.
                            var engagement_uuid = $state.params.engagement_uuid;
                            if (response.data.eng_uuid != undefined)
                            	engagement_uuid = response.data.eng_uuid;

                            if (engagement_uuid){
                                engagement_uuid = engagement_uuid.replace('/','');
                                $state.go("app.dashboard.overview", {"engagement_uuid": engagement_uuid});
                            } else {
                                $state.go("app.dashboard.dashboard");
                            }
                        }
                    }
                })
                .catch(function (error) {
                    if(error && error.message && error.message.detail) {
                        toastService.setToast(error.message.detail, 'danger');
                    } else {
                        toastService.setToast(error.message, 'danger');
                    }

                    $rootScope.ice.loader.show = false;
                    $log.error(error.message);
                    if(error.status===403){ // The server will return 403 if the user.is_active==false
                        $log.error('User is not active, redirecting to resend_activation page');
                        $state.go("app.resend_activation", {"message": "Please activate your account first"});
                    }
                    if(error.status===302){ // The server will return 302 if the temporary password has expired
                        $log.error('Temporary password has expired, redirecting to reset_password page');
                        $state.go('app.resetPassword', {"message":"Your temporary password has expired, please" +
                                                                                                " generate a new one"});
                    }
                });
        };
    }
})();
