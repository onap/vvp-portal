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
/**
 * Created by almog on 17/01/2017.
 */
(function () {
    'use strict';

    angular.module('ice.services.cms', [])
        .service('cmsService', ['$http', '$q', 'cacheService', 'localStorageService', '$uibModal', '$rootScope', '$log', cmsService]);

    function cmsService($http, $q, cacheService, localStorageService, $uibModal, $rootScope, $log) {
        var urls = cacheService.get("configuration").urls;
        var lastAnnouncementStorageKey = 'lastAnnouncement';
        var lastAnnouncementMessage;

        this.getPosts = function(limit, fromLastDays, categories) {
            var deferred = $q.defer();
            var categoriesParam = categories && categories instanceof Array ? categories.join() : '';

            $http.get(urls.cms.posts.get.replace('@limit',limit).replace('@offset',0).replace('@fromLastDays',fromLastDays).replace('@category',categoriesParam)).
            success(function (data, status, headers, config) {
                deferred.resolve({data: data, status: status});
            }).
            error(function (data, status, headers, config) {
                deferred.reject({message: data, status: status});
            });

            return deferred.promise;
        };

        this.getLastAnnouncementPost = function() {
            var deferred = $q.defer();
            var limit = 1;

            $http.get(urls.cms.posts.get.replace('@limit', limit).replace('@offset',0).replace('@fromLastDays','').replace('@category','Announcement')).
            success(function (data, status, headers, config) {
                deferred.resolve({data: data, status: status});
            }).
            error(function (data, status, headers, config) {
                deferred.reject({message: data, status: status});
            });

            return deferred.promise;
        };

        this.setAnnouncementToast = function() {
            var openCMSPostModal = function() {
                $uibModal.open({
                    templateUrl: 'main/modals/cms-post-modal/cms-post-modal.html',
                    controller: 'cmsPostModalController',
                    controllerAs: 'vm',
                    size: 'cms-post-read-more',
                    resolve: {
                        post: function () {
                            return undefined;
                        }
                    }
                });
            };

            this.getLastAnnouncementPost()
            .then(function(response) {
                if(response && response.data && response.data.length === 1) {
                    var lastAnnouncement = localStorageService.getJson(lastAnnouncementStorageKey);
                    if(!lastAnnouncement || lastAnnouncement.id != response.data[0].id || !lastAnnouncement.closed) {
                        localStorageService.setJson(lastAnnouncementStorageKey, {"id": response.data[0].id, "closed": false});
                        var toastMessage = "<b>Important announcement</b>: <i>" + response.data[0].title + ".</i>";
                        lastAnnouncementMessage = {message: toastMessage, readMore: openCMSPostModal, type: 'warning', show: true, displayFor: 'all', publishDate: response.data[0].publish_date};
                        $rootScope.showAnnouncement = !$rootScope.showAnnouncement;
                    }
                }
            })
            .catch(function(error) {
                $log.error(error);
            });
        };

        this.getAnnouncement = function() {
            return lastAnnouncementMessage;
        };

        this.getPages = function(title) {
            var deferred = $q.defer();

            if(!title) { title = ''; }
            $http.get(urls.cms.pages.get.replace('@title',title))
            .success(function (data, status, headers, config) {
                deferred.resolve({data: data, status: status});
            })
            .error(function (data, status, headers, config) {
                deferred.reject({message: data, status: status});
            });

            return deferred.promise;
        };

        this.getPage = function(id) {
            var deferred = $q.defer();

            $http.get(urls.cms.pages.getById.replace('@id',id))
            .success(function (data, status, headers, config) {
                deferred.resolve({data: data, status: status});
            })
            .error(function (data, status, headers, config) {
                deferred.reject({message: data, status: status});
            });

            return deferred.promise;
        };

        this.searchPages = function(keyword) {
            var deferred = $q.defer();

            $http.get(urls.cms.pages.search.replace('@keyword',keyword))
            .success(function (data, status, headers, config) {
                deferred.resolve({data: data, status: status});
            })
            .error(function (data, status, headers, config) {
                deferred.reject({message: data, status: status});
            });

            return deferred.promise;
        }
    };
})();
