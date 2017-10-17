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

    angular.module('ice.services.users', [])
        .service('usersService', ['$http', '$q', 'cacheService','iceConstants', 'localStorageService', '$state',
            'sessionStorageService', '_', '$log', userService]);

    function userService ($http, $q, cacheService, iceConstants, localStorageService, $state, sessionStorageService,
                                                                                                            _, $log) {
            var urls = cacheService.get("configuration").urls;
            var userDataSessionStorageKey = 'user';
            var userData = sessionStorageService.getJson(userDataSessionStorageKey);

            this.isEngagementEL = function(engagement_team) {
                var found_uuid = _.find(engagement_team, {'uuid': userData.uuid});
                if (found_uuid == undefined)
                    return false;
                if (userData && userData.role.name === iceConstants.roles.el)
                    return true;
                return false;
            }

            this.isUserInRole = function(role) {
                return userData && userData.role && userData.role.name === role;
            }

            this.isReviewer = function(user, reviewer_uuid) {
                return user && reviewer_uuid && user.uuid == reviewer_uuid;
            }

            this.isPeerReviewer = function(user, peer_reviewer_uuid) {
                return user && peer_reviewer_uuid && user.uuid == peer_reviewer_uuid;
            }

            this.isAdmin = function(user) {
                return user && user.role && user.role.name === iceConstants.roles.admin;
            };

            this.updatePassword = function (userUuid, postData) {
                var deferred = $q.defer();
                $http.put(urls.auth.updatePassword, postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.sendResetPwdInstructions = function (postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.sendResetPwdInstructions, postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.login = function (postData, t) {
                var deferred = $q.defer();
                $http.post(urls.auth.login.replace("/@t", t), postData).
                success(function (data, status, headers, config) {
                    userData = data;
                    delete userData.password;
                    userData.jwtToken = data.token;
                    sessionStorageService.setJson(userDataSessionStorageKey, userData);

                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.register = function (postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.register, postData).
                success(function (data, status, headers, config) {
                    userData = data;
                    userData.jwtToken = data.token;
                    sessionStorageService.setJson(userDataSessionStorageKey, userData);

                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.addVendorContact = function (postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.addVendorContact, postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.resendActivationMail = function (user_uuid) {
                var deferred = $q.defer();
                $http.get(urls.auth.resendActivationMail.replace("@user_uuid", user_uuid), {skipAuth: true}).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getNotifications = function (userUuid) {
                var deferred = $q.defer();
                $http.get(urls.notifications.getNotifications).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.resetNotificationNum = function (userUuid) {
                var deferred = $q.defer();
                $http.put(urls.notifications.resetNotificationNum).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.notificationsDelete = function (uuid) {
                var deferred = $q.defer();
                $http.delete(urls.notifications.notificationsDelete.replace("@uuid", uuid)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getNotificationsDescription = function (userUuid,offset,limit) {
                var deferred = $q.defer();
                $http.get(urls.notifications.getNotificationsDescription.replace("@userUuid", userUuid).replace("@offset", offset).replace("@limit", limit)).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getIceUser = function () {
                var deferred = $q.defer();
                $http.get(urls.auth.getIceUser).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.updateAccount = function (userUuid, putData) {
                var deferred = $q.defer();
                $http.put(urls.auth.account, putData).
                success(function (data, status, headers, config) {
                    var oldToken = userData.jwtToken;
                    userData = data;
                    userData.jwtToken = oldToken;
                    sessionStorageService.setJson(userDataSessionStorageKey, userData);

                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.setSSHKey = function (userUuid, postData) {
                var deferred = $q.defer();
                $http.post(urls.auth.setSSHKey, postData).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };

            this.getUserData = function(undefinedCallback) {
                if(!userData) {
                    if(undefinedCallback) {
                        $log.debug("There is no user data, will invoke callback pass as argument.");
                        undefinedCallback();
                    } else {
                        $log.debug("There is no user data, will be redirected into /login page.");
                        $state.go('app.login');
                    }
                }

                return userData;
            };

            this.resetUserData = function() {
                $log.debug('Clearing user from cache...');
                userData = undefined;
                sessionStorageService.delete(userDataSessionStorageKey);
                localStorageService.setJson("ice.settings.view_type", undefined);
                localStorageService.setJson("ice.settings.eng_uuid", undefined);
                localStorageService.setJson("ice.settings.sub_id", undefined);
            };

            this.setUserActivationSuccess = function(activationSuccess) {
                if(userData) {
                    userData.activationSuccess = activationSuccess;
                    sessionStorageService.setJson(userDataSessionStorageKey, userData);
                }
            };

            this.getEngagementLeads = function() {
                var deferred = $q.defer();
                var user = this.getUserData();
                if(this.isAdmin(user)) {
                    $http.get(urls.users.engagementleads.get)
                        .success(function (data, status, headers, config) {
                            deferred.resolve({data: data, status: status});
                        })
                        .error(function (data, status, headers, config) {
                            deferred.reject({message: data, status: status});
                        });
                } else {
                    deferred.reject("Just admin allowed to get engagement leads list.");
                }

                return deferred.promise;
            };

            this.activateUser = function(userId, token) {
                var deferred = $q.defer();

                $http.get(urls.users.activate.replace("@userid", userId).replace("@token", token), {skipAuth: true})
                .success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                })
                .error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });

                return deferred.promise;
            };

            this.getRGWASecret = function () {
                var deferred = $q.defer();
                $http.get(urls.auth.getRGWASecret).
                success(function (data, status, headers, config) {
                    deferred.resolve({data: data, status: status});
                }).
                error(function (data, status, headers, config) {
                    deferred.reject({message: data, status: status});
                });
                return deferred.promise;
            };
        };
})();
