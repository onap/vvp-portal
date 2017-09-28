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
        .module('ice')
        .controller('AppController', ["$state", "$timeout", "$rootScope", "$log", AppController]);

    function AppController($state, $timeout, $rootScope, $log) {

        var vm = this;
        var nice = false;

        if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
            $log.debug('Smooth Scroll Off (Safari).');
        } else {
            try {
                // Initialise with options
                nice = $("#content-israel").niceScroll({
                    zindex:20000,
                    scrollspeed:60,
                    mousescrollstep:60,
                    cursorborderradius: '10px', // Scroll cursor radius
                    cursorborder: '1px solid rgba(255, 255, 255, 0.4)',
                    cursorcolor: 'rgba(0, 0, 0, 0.6)',     // Scroll cursor color
                    //autohidemode: 'true',     // Do not hide scrollbar when mouse out
                    cursorwidth: '10px'       // Scroll cursor width
                });
            } catch (err) {
                $log.debug('Smooth Scroll Off.');
            }
        }

    }

})();
