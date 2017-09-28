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
        .controller('cmsPostModalController', ['$uibModalInstance', 'cmsService','post', '$log', cmsPostModalController]);

    function cmsPostModalController($uibModalInstance, cmsService, post, $log) {

        var vm = this;
        var init = function () {
            if(post) {
                vm.post = post;
            } else {
                cmsService.getLastAnnouncementPost()
                .then(function(response) {
                    if(response && response.data && response.data.length === 1) {
                        vm.post = response.data[0];
                    }
                })
                .catch(function(error) {
                    $log.error(error);
                });
            }

            loadRecentPosts();
        };

        vm.closeModal = function (bool) {
            $uibModalInstance.close(bool);
        };

        vm.loadSelectedPostData = function(post) {
            if(post) {
                vm.post = post;
            }
        };

        function loadRecentPosts() {
            var limit = 5;
            var fromLastDays = "";

            cmsService.getPosts(limit, fromLastDays, ['Announcement', 'News'])
            .then(function(response) {
                vm.recentPosts = response.data;
            })
            .catch(function(error) {
                $log.error(error);
            });
        }

        init();
    }
})();
