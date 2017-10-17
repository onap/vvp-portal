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
'use strict';

angular.module('ice.interceptors.http', [])
    .factory('httpRequestInterceptor', function ($injector, $rootScope) {
        return {
            request: function (config) {
                // Send the user only for API requests
                if (config.url.indexOf($rootScope.baseURL) !== -1) {
                    config.headers = config.headers || {};
                    var user = $injector.get('usersService').getUserData(function() {});
                    if (user && !config.skipAuth) {
                        config.headers.Authorization = "token "+user.jwtToken;
                    }
                }
                return config;
            }
        };
    })
    .factory('httpResponseInterceptor', function ($rootScope) {
        return {
            response: function (response) {
                return response;
            }
        }
    })
    .factory('httpRequestErrorInterceptor', function ($q) {
        return {
            requestError: function (request) {
                // Do something
                return request;
            }
        }
    })
    .factory('httpResponseErrorInterceptor', ["$q", "$rootScope", "$injector", "toastService", function ($q, $rootScope, $injector, toastService) {
        return {
            responseError: function (response) {
                var $state = $injector.get('$state');
                var status = response.status;
                switch (status) {
                    case 401:
                        //AuthFactory.clearUser();
                        toastService.setToast(response.statusText, 'danger');
                        //$window.location = "/auth/login?redirectUrl=" + redirectUrl;
                        break;
                    case 403:
                        $state.go('app.login');
                        break;
                    case 404:
                        //$state.go("app.errors_error-404");
                        break;
                }

                // otherwise
                return $q.reject(response);
            }
        }
    }]);
