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
        .module('ice.directives')
        .directive('iceNewsAndAnnouncement', ['cmsService', '$uibModal', '$log', iceNewsAndAnnouncement]);

    function iceNewsAndAnnouncement(cmsService, $uibModal, $log) {
        var directive = {};
        directive.restrict = 'E';
        directive.templateUrl = 'directives/ice-news-and-announcement/ice-news-and-announcement.html';
        directive.scope = {limit: '=limit', fromLastDays: '=fromLastDays', showDescription: "=showDescription"};
        directive.link = function (scope, element, attrs) {
            var limit = scope.limit || 5;
            var fromLastDays = scope.fromLastDays || "";
            var init = function () {
                cmsService.getPosts(limit, fromLastDays, ['Announcement', 'News'])
                .then(function(response) {
                    scope.cmsPosts = response.data;
                })
                .catch(function(error) {
                    $log.error(error);
                });
            };

            scope.openCMSReadMoreModal = function(cmsPost) {
                if(cmsPost) {
                    $uibModal.open({
                        templateUrl: 'main/modals/cms-post-modal/cms-post-modal.html',
                        controller: 'cmsPostModalController',
                        controllerAs: 'vm',
                        size: 'cms-post-read-more',
                        resolve: {
                            post: function () {
                                return cmsPost;
                            }
                        }
                    });
                } else {
                    $log.debug("Cannot open cms post.")
                }
            };

            init();
        };

        return directive;
    }
})();
