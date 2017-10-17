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

    angular.module('ice.services.toast', [])
        .service('toastService', ['$rootScope', function ($rootScope) {
            var message;
            var messageType;
            var sticky;
            var showMessage = false;
            var readMore;
            var displayFor = 'all';

            var setToast = function(incomingMessage, incomingType, options) {
            	if (incomingMessage && incomingMessage.detail != undefined)
            		incomingMessage = incomingMessage.detail
                if(incomingMessage && incomingType) {
                    message = incomingMessage;
                    messageType = incomingType;
                    sticky = options && options.sticky ? options.sticky : false;
                    readMore = options && options.readMoreCallback ? options.readMoreCallback : undefined;
                    displayFor = options && options.displayFor ? options.displayFor : 'all';
                    showMessage = true;
                    $rootScope.showToast = true;
                } else {
                    throw "You must provide both message an type in order to set new message toast"
                }
            };

            var clearToast = function() {
                message = undefined;
                messageType = undefined;
                showMessage = false;
                displayFor = 'all';
                $rootScope.showToast = false;
            };

            var getToast = function() {
                return {
                    "message": message,
                    "type": messageType,
                    "show": showMessage,
                    "sticky": sticky,
                    "readMore": readMore,
                    "displayFor": displayFor
                };
            };

            return {
                setToast: setToast,
                clearToast: clearToast,
                getToast: getToast
            };
        }]);
})();
