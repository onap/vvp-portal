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

    angular.module('ice.services.vf', [])

        .service('vfService', ['$http', '$q', 'cacheService', function ($http, $q, cacheService) {

            var urls = cacheService.get("configuration").urls;

            this.addVfs = function (postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.addVfs, postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.updateVfs = function (putData,vf_uuid) {
                var deferred = $q.defer();
                $http.put(urls.vf.updateVfs.put.replace('@vf_uuid',vf_uuid),putData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.inviteMembers = function (postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.inviteMembers, postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getCompanies = function () {
                var deferred = $q.defer();
                $http.get(urls.auth.getCompanies).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.getDeployTargets = function () {
                var deferred = $q.defer();
                $http.get(urls.vf.deployment_target.getDeployTargets).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.getECOMPReleases = function () {
                var deferred = $q.defer();
                $http.get(urls.vf.ecomp.getECOMPReleases).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };
            this.getVFVersion = function (vfUuid) {
                var deferred = $q.defer();
                $http.get(urls.vf.version.getVFVersion.replace('@vfUuid',vfUuid)).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.getEngagements = function (userUuid) {
                var deferred = $q.defer();
                $http.get(urls.auth.engagements).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.getExpandedEngagements = function (postData) {
                var deferred = $q.defer();
                $http.post(urls.engagement.engagementsExpanded, postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.getSingleEngagement = function (userUuid,engagementUuid) {
                var deferred = $q.defer();
                $http.get(urls.auth.single_engagement.replace('@engagementUuid',engagementUuid)).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.getStarredEngagements = function(){
                var deferred = $q.defer();
                $http.get(urls.engagement.starred_engagement.get).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.putStarredEngagements = function(engagementUuid){
                var deferred = $q.defer();
                var data = {}
                data['engagement_uuid'] = engagementUuid;
                $http.put(urls.engagement.starred_engagement.put,data).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getRecentEngagements = function(){
                var deferred = $q.defer();
                $http.get(urls.engagement.recent_engagement.get).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getActivities = function (engagementUuid) {
                var deferred = $q.defer();
                $http.get(urls.auth.activities.replace('@engagementUuid',engagementUuid)).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.updateProgress = function (engagementUuid, postData) {
                var deferred = $q.defer();
                $http.put(urls.engagement.updateProgress.replace('@engagementUuid',engagementUuid), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.updateDeployTargets = function (engagementUuid, dt_uuid) {
                var deferred = $q.defer();
                $http.put(urls.vf.deployment_target.updateDeployTargets.replace('@engagementUuid',engagementUuid).
                replace('@deployment_target_uuid',dt_uuid)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.updateECOMPReleases = function (engagementUuid, ECOMP_uuid) {
                var deferred = $q.defer();
                $http.put(urls.vf.ecomp.updateECOMPReleases.replace('@engagementUuid',engagementUuid).
                replace('@ecomp_uuid', ECOMP_uuid)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.updateDaysLeft = function (engagementUuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.updateDaysLeft.replace('@engagementUuid',engagementUuid), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };

            this.updateLabEntryDaysLeft = function (engagementUuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.updateLabEntryDaysLeft.replace('@engagementUuid',engagementUuid), postData).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                return deferred.promise;
            };


            this.set_engagement_stage = function(engagementUuid, requested_stage){
                var deferred = $q.defer();
                $http.put(urls.engagement.setStage.replace('@engagementUuid',engagementUuid).replace('@stage',requested_stage)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.exportEngagementsCSV = function (stage, keyword) {
                var deferred = $q.defer();

                if(stage == null || keyword == null) {
                    deferred.reject("Invalid arguments on engagements export csv.")
                } else {
                    $http({method: 'GET', url: urls.engagement.exportEngagementsCSV.replace('@stage',stage).replace("@keyword", keyword),
                        headers: {'Content-Type': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}, responseType: "arraybuffer"}).
                    success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).
                    error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                }

                return deferred.promise;
            };

            this.archiveEngagement = function(engagementUuid, reason) {
                var deferred = $q.defer();
                var putData = {"reason": reason};
                $http.put(urls.engagement.archive.put.replace('@engagementUuid',engagementUuid), putData)
                    .success(function (data, status, headers, config) {
                        deferred.resolve();
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });

                return deferred.promise;
            };

            this.updateEngagementReviewer = function(engagementUuid, userUuid) {
                var deferred = $q.defer();
                var putData = {"reviewer": userUuid};

                $http.put(urls.engagement.reviewer.put.replace('@engagementUuid',engagementUuid), putData)
                    .success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });

                return deferred.promise;
            };

            this.updateEngagementPeerReviewer = function(engagementUuid, userUuid) {
                var deferred = $q.defer();
                var putData = {"peerreviewer": userUuid};

                $http.put(urls.engagement.peerreviewer.put.replace('@engagementUuid',engagementUuid), putData)
                    .success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });

                return deferred.promise;
            };

            this.switchEngagementReviewers = function(engagementUuid, reviewer_uuid, peer_reviewer_uuid) {
                var deferred = $q.defer();
                var putData = {"reviewer": reviewer_uuid, "peerreviewer": peer_reviewer_uuid};

                $http.put(urls.engagement.switchReviewers.put.replace('@engagementUuid',engagementUuid), putData)
                    .success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });

                return deferred.promise;
            };

            this.updateEngagement = function(engagement, status) {
                var deferred = $q.defer();
                var putData = {"engagement": engagement, "status": status};

                $http.put(urls.engagement.put.replace('@engagementUuid',engagement.uuid), putData)
                    .success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    })
                    .error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });

                return deferred.promise;
            };


            this.remove_user_from_eng = function(postData) {
                var deferred = $q.defer();
                if (postData == null) {
                    deferred.reject("Invalid arguments on remove_user_from_eng.")
                }
                else {
                    $http.put(urls.engagement.engagement_team.put, postData).success(function (data, status, headers, config) {
                        deferred.resolve({data: data, status: status});
                    }).error(function (data, status, headers, config) {
                        deferred.reject({message: data, status: status});
                    });
                }
                return deferred.promise;
            };
        }]);

})();
