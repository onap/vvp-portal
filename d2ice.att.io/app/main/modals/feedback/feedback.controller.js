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
        .controller('FeedbackModalController', ['$rootScope','$uibModalInstance', 'feedbackService',
                                                            'action', 'toastService', '$log', FeedbackModalController]);

    function FeedbackModalController($rootScope, $uibModalInstance, feedbackService, action, toastService, $log) {
        var vm = this;

        var init = function() {
            vm.action = action;
            vm.feedback_modal_description = '';
        };

        init();

        vm.submitForm = function ()
        {
            var feedbackPostData = {"description":vm.feedback_modal_description};
            if (action == 'add') {
            	feedbackService.add(feedbackPostData)
                .then(function (response) {
                    if (response.status === 200) {
	                        $uibModalInstance.close(response.data);
	                        toastService.setToast('Feedback was sent successfully.', 'success');
                    	} else {
	                        toastService.setToast(response.error, 'danger');
	                        $rootScope.ice.loader.show = false;
	                    }
                })
                .catch(function (error) {
                    toastService.setToast(error.message, 'danger');
                    $log.error(error.message);
                });
            }
        };

        vm.closeModal = function(){
            $uibModalInstance.close();
        };
    }
})();
