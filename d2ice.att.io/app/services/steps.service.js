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

    angular.module('ice.services.steps', [])

        .service('stepsService', ['$http', '$q', 'cacheService', function ($http, $q, cacheService) {

            var urls = cacheService.get("configuration").urls;

            this.getByUser = function() {
                var deferred = $q.defer();

                $http.get(urls.steps.getByUser)
                    .success(function(data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });

                return deferred.promise;
            };

            this.get = function (engagement, progress) {
                var deferred = $q.defer();
                $http.get(urls.steps.get.replace('@engagement',engagement).replace('@progress',progress)).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.update = function (stepUuid, postData) {
                var deferred = $q.defer();
                $http.put(urls.steps.update.replace('@stepUuid',stepUuid), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.delete = function (stepUuid) {
                var deferred = $q.defer();
                $http.delete(urls.steps.delete.replace('@stepUuid',stepUuid)).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.add = function (engagement, postData) {
                var deferred = $q.defer();
                $http.post(urls.steps.add.replace('@engagement',engagement), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.edit = function (engagement_uuid, nextstep_uuid,postData) {
                var deferred = $q.defer();
                $http.put(urls.steps.edit.replace('@stepUuid',nextstep_uuid).replace('@engUuid',engagement_uuid), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };
            
            this.order_next_steps = function (engagement_uuid, postData) {
                var deferred = $q.defer();
                $http.put(urls.steps.order_next_steps.replace('@engUuid',engagement_uuid), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.createNextStep = function (checklist_uuid, engUuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.steps.createNextStep.replace('@engUuid',engUuid),postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.createChecklistNextStep = function (checklist_uuid, engUuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.steps.createChecklistNextStep.replace('@checkListUuid',checklist_uuid).replace('@engUuid',engUuid),postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };


        }]);

})();
