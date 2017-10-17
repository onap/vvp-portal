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
 * Created by almog on 06/02/2017.
 */
(function () {
    'use strict';
    angular
        .module('ice.documentation', [])
        .controller('documentationNavigationController', ['_', '$state','cmsService', 'sessionStorageService', '$log',
            documentationNavigationController]);

    function documentationNavigationController(_, $state,cmsService, sessionStorageService, $log) {
        var vm = this;
        var documentationLastPageSessionKey = 'LastDocumentationPageId';

        var init = function()
        {


            cmsService.getPages("Documentation")
            .then(function(response) {
                if(response && response.data && response.data.length === 1) {
                    vm.documentationPage = response.data[0];

                    var lastPageId = sessionStorageService.getJson(documentationLastPageSessionKey);
                    if(lastPageId) {
                        vm.loadPageContent(lastPageId);
                    } else {
                        vm.loadPageContent(vm.documentationPage.id);
                    }
                }
            })
            .catch(function(error) {
                $log.error(error);
            });
        };

        vm.loadPageContent = function(pageId) {
            if(vm.selectedSearchedPage) {
                delete vm.selectedSearchedPage;
            }

            vm.pageId = pageId;
            sessionStorageService.setJson(documentationLastPageSessionKey, pageId);
            $state.go('app.documentation.page',{page_id: pageId});
        };

        vm.isPageCollapsed = function(page) {
            var result = true;

            if(page && page.children && page.children.length > 0) {
                var pages = _.flatMap(page.children, function(child) {
                    return _.concat(child.children, child);
                });
                result = (page.id != vm.pageId) && !_.some(pages, ['id', vm.pageId]);
            }

            return result;
        };

        init();
    }
})();
