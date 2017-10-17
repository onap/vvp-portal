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
        .directive('iceAnnouncement', ['$rootScope', 'cmsService', 'localStorageService', iceAnnouncement]);

    function iceAnnouncement($rootScope, cmsService, localStorageService) {
        var directive = {};
        directive.restrict = 'E';
        directive.templateUrl = 'directives/ice-announcement/ice-announcement.html';
        directive.link = function (scope, element, attrs) {
            var lastAnnouncementStorageKey = 'lastAnnouncement';

            var init = function() {
                var announcement = cmsService.getAnnouncement();

                if(announcement) {
                    scope.toast = announcement;

                    //announcement will be presented for two days:
                    var twoDaysBeforeDate = new Date();
                    twoDaysBeforeDate.setDate(twoDaysBeforeDate.getDate() - 2);
                    var publishedDate = new Date(scope.toast.publishDate);
                    if(publishedDate < twoDaysBeforeDate) {
                        scope.closeAlert();
                    }
                }
            };

            scope.closeAlert = function() {
                scope.toast.show = false;
                setLastAnnouncementClosedParam(true);
            };

            function setLastAnnouncementClosedParam(closed) {
                var lastAnnouncement = localStorageService.getJson(lastAnnouncementStorageKey) || {};
                lastAnnouncement['closed'] = closed;
                localStorageService.setJson(lastAnnouncementStorageKey, lastAnnouncement);
            };

            init();

            //whenever the announcement updated we will update the directive view:
            $rootScope.$watch('showAnnouncement', function(newVal, OldVal){
                init();
            }, true);
        };

        return directive;
    }
})();
