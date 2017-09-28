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
 * Created by almog on 07/02/2017.
 */
(function () {
    'use strict';
    angular.module('ice.filters')
        .filter('htmlspecialchars', ['_','$filter', htmlspecialchars]);

    function htmlspecialchars(_,$filter) {
        return function(input) {
            input = _.replace(input,/\&amp\;/g,"&");
            input = _.replace(input,/\&lt\;/g,"<");
            input = _.replace(input,/\&gt\;/g,">");
            input = _.replace(input,/\&quot\;/g,'"');
            input = _.replace(input,/\&#03\;/g,"'");
            input = _.replace(input,/<(\s)*script/g,"_script");
//            input = _.replace(input,/style=\"font-weight: bold;\"/g,"class=\"bold\"");
//            input = _.replace(input,/style=\"font-style: italic;\"/g,"class=\"italic\"");
//            input = _.replace(input,/style=\"text-decoration-line: line-through;\"/g,"class=\"line-through\"");
//            input = _.replace(input,/style=\"text-decoration-line: underline;\"/g,"class=\"underline\"");
            return input;
        };
    }
})();
