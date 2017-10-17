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
        .directive('iceLoader', iceLoader);

    function iceLoader($rootScope) {
        var directive = {};
        directive.restrict = 'E';
        directive.transclude = false;
        //directive.templateUrl = 'directives/ice-loader/ice-loader.html';
        directive.scope = {
            selector: "@selector"
        };

        directive.link = function (scope, element, attrs) {

            $rootScope.$watch('ice.loader.show', function(newVal, OldVal){
                //scope.loader = $rootScope.ice.loader;
                if (newVal===true) {
                    var selector = $(scope.selector);
                    var loaderId = calculateUniqueId();
                    var loader = $('<div class="ice-loader" id="' + loaderId + '"></div>');
                    $('body').append(loader);
                    selector.addClass('ice-loader-overlay');
                    var pos = selector.offset();
                    if (pos) {
                        loader.css({
                            top: pos.top + selector.height() / 2,
                            left: pos.left + selector.width() / 2,
                            position: 'fixed'
                        });
                    }
                 } else if (newVal===false) {
                    var selector = $(scope.selector);
                    selector.removeClass('ice-loader-overlay');
                    var loaderId = calculateUniqueId();
                    var loader = $('#' + loaderId);
                    loader.remove();
                }
            }, true);

            var calculateUniqueId = function(){
                var prefix = 'ice-loader-';
                var name = scope.selector;
                name = name.replace(".","");
                name = name.replace("#","");
                return prefix + name;
            };

        };
        return directive;

    }

})();
