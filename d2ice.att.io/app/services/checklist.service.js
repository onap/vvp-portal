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
    var current_checklist;

    angular.module('ice.services.checklist', [])

        .factory('checklistService', ['$rootScope', '$http', '$q', 'cacheService', '$log',
            function ($rootScope,$http, $q, cacheService, $log) {

            var urls = cacheService.get("configuration").urls;

            var vm = this;

            this.setState = function (clUuid, postData) {
                var deferred = $q.defer();
                $http.put(urls.checklist.state.put.replace('@cl_uuid',clUuid) ,postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.createChecklist = function (engUuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.checklist.createChecklist.replace("@engUuid", engUuid), postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getDataForCreateChecklist = function (engUuid) {
                var deferred = $q.defer();
                $http.get(urls.checklist.getDataForChecklist.replace('@engUuid',engUuid)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getChecklist = function (checklistUuid) {
                var deferred = $q.defer();
                $http.get(urls.checklist.getChecklist.replace('@checklistUuid',checklistUuid)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

             this.putDataForChecklist = function (checklist_uuid,putData) {
                var deferred = $q.defer();
                $http.put(urls.checklist.putDataForChecklist.replace('@checklist_uuid',checklist_uuid),putData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };
             this.putChecklistDecision = function (decisionUuid, putData) {
                var deferred = $q.defer();
                $http.put(urls.checklist.checklistDecision.replace('@decisionUuid',decisionUuid),putData).
                success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.createAuditlogChecklist = function (checklist_uuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.checklist.createAuditlogChecklist.replace('@checklist_uuid',checklist_uuid),postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.createAuditlogDecisionChecklist = function (decision_uuid,postData) {
                var deferred = $q.defer();
                $http.post(urls.checklist.createAuditlogDecisionChecklist.replace('@decision_uuid',decision_uuid),postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };


            this.setChecklistExitEntity = function(checklist_data) {
                current_checklist = checklist_data;
                $log.debug("set checklist");
            }


            this.callChecklistExit = function(page_view) {
                if (current_checklist != undefined && page_view == 'checklist') {

                    var modal_type = 'set_state';
                    angular.forEach(current_checklist.data.checklistDecisions, function (section,key) {
                        angular.forEach(section.decisions, function (decision,key) {
                            if (decision['view_value'] != 'approved' && decision['view_value'] != 'not_relevant' || decision['view_value'] == '') {
                                modal_type = 'next_step';
                            }
                        });
                    });
                    if (modal_type == 'next_step')
                        this.openNextSteps();
                    else if (modal_type == 'set_state')
                        this.openSetState();
                }
            }

            this.getChecklistTemplates = function () {
                var deferred = $q.defer();
                $http.get(urls.checklist.getChecklistTemplates).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getChecklistTemplate = function (templateUuid) {
            	var deferred = $q.defer();
            	$http.get(urls.checklist.getChecklistTemplate.replace('@templateUuid', templateUuid)).
            	success(function (data, status, headers, config) {
            		deferred.resolve({data: data, status: status});
            	}).
            	error(function (data, status, headers, config) {
            		deferred.reject({message: data, status: status});
            	});
            	return deferred.promise;
            };

            this.saveChecklistTemplate = function (putData) {
                var deferred = $q.defer();
                $http.put(urls.checklist.saveChecklistTemplate, putData).
                success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            return this;

        }]);

})();
