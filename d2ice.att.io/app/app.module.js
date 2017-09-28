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
        .module('ice', [
            // Core
            'ngSanitize',
            'ngAnimate',
            'wysiwyg.module',
            'ui.router',
            'ice.env',
            'ice.modals',
            'angularUtils.directives.dirPagination',
            'ui.select',
            'ui.multiselect',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ngMaterial', 'ngMessages',
            'angular-toArrayFilter',
            'ngIntlTelInput',
            'ui.sortable',
            'jm.i18next',

            // Modules
            'ice.toolbar',
            'ice.navigation',
            'ice.main',
            'ice.contactUs',
            'ice.dashboard.main',
            'ice.dashboard.overview',
            'ice.dashboard.dashboard',
            'ice.activation.login',
            'ice.activation.register',
            'ice.activation.addVf',
            'ice.activation.addVendorContact',
            'ice.activation.resendActivation',
            'ice.activation.terms',
            'ice.activation.activateUser',
            'ice.dashboard.account',
            'ice.documentation',
            'ice.activation.resetPassword',
            'ice.activation.updatePassword',
            'ice.dashboard.checklist',
            'ice.welcome',
            'ice.main.admin',

            // Services
            'ice.services.cacheService',
            'ice.services.users',
            'ice.services.localStorage',
            'ice.services.vf',
            'ice.services.steps',
            'ice.services.vfc',
            'ice.services.dtsite',
            'ice.services.checklist',
            'ice.services.status',
            'ice.services.feedback',
            'ice.services.toast',
            'ice.services.cms',
            'ice.services.sessionStorage',

            // Directives
            'ice.directives',

            // Filters
            'ice.filters',

            // Interceptors
            'ice.interceptors.http'
        ]);
})();
