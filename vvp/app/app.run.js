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
        .run(runBlock);

    function runBlock($rootScope, toastService, sessionStorageService, $state, cacheService, ENV, $window, $log) {
        var documentationLastPageSessionKey = 'LastDocumentationPageId';
        var init = function() {
            $rootScope.user = {};
            $rootScope.ice = {};
            $rootScope.ice.loader = {};
            $rootScope.state = $state;
            $rootScope.baseURL = ENV.apiBase;

            i18NextSetup();

            var stateChangeStartEvent = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
                clearToastData();
                clearDocumentationLastPage(toState);
            });

            var stateChangeSuccessEvent = $rootScope.$on('$stateChangeSuccess', function () {

            });

            $rootScope.$on('$destroy', function () {
                stateChangeStartEvent();
                stateChangeSuccessEvent();
            });

            cacheService.set('configuration', {
            "urls": {
                "auth": {
                    "login": $rootScope.baseURL + "login/@t",
                    "register": $rootScope.baseURL + "signup",
                    "addVfs": $rootScope.baseURL + "vf/",
                    "getCompanies": $rootScope.baseURL + "vendors",
                    "resendActivationMail": $rootScope.baseURL + "users/activation-mail/@user_uuid",
                    "addVendorContact": $rootScope.baseURL + "add-contact",
                    "single_engagement": $rootScope.baseURL + "single-engagement/@engagementUuid",
                    "engagements": $rootScope.baseURL + "engagement",
                    "inviteMembers": $rootScope.baseURL + "invite-team-members",
                    "activities": $rootScope.baseURL + "engagement/@engagementUuid/activities/",
                    "updateDaysLeft": $rootScope.baseURL + "engagements/@engagementUuid/target_date", //set_attr
                    "updateLabEntryDaysLeft": $rootScope.baseURL + "engagements/@engagementUuid/target_lab_date",
                    "setSSHKey": $rootScope.baseURL + "users/ssh",
                    "getIceUser": $rootScope.baseURL + "users",
                    "getRGWASecret": $rootScope.baseURL + "users/account/rgwa/",
                    "account": $rootScope.baseURL + "users/account",
                    "updatePassword": $rootScope.baseURL + "users/pwd/",
                    "sendResetPwdInstructions": $rootScope.baseURL + "users/pwd/reset-instructions/"
                },
                "notifications": {
                    "getNotifications": $rootScope.baseURL + "notifications/num",
                    "resetNotificationNum": $rootScope.baseURL + "notifications/reset",
                    "notificationsDelete": $rootScope.baseURL + "notifications/@uuid",
                    "getNotificationsDescription": $rootScope.baseURL + "notifications/@userUuid/@offset/@limit"
                },
                "steps": {
                    "get": $rootScope.baseURL + "engagements/@engagement/nextsteps/@progress",
                    "add": $rootScope.baseURL + "engagements/@engagement/nextsteps", // set_attr
                    "edit": $rootScope.baseURL + "nextsteps/@stepUuid/engagement/@engUuid",
                    "order_next_steps": $rootScope.baseURL + "engagements/@engUuid/nextsteps/order_next_steps",

                    "update": $rootScope.baseURL + "nextsteps/@stepUuid/state", // put
                    "delete": $rootScope.baseURL + "nextsteps/@stepUuid",
                    "createChecklistNextStep":  $rootScope.baseURL + "engagement/@engUuid/checklist/@checkListUuid/nextstep/",
                    "createNextStep":  $rootScope.baseURL + "eng/@engUuid/nextstep/",
                    "getByUser": $rootScope.baseURL + "engagements/user/nextsteps/"
                },
                "vf": {
                	"updateVfs": {
                		"put": $rootScope.baseURL + "vf/@vf_uuid/validation-details/",
                	},
                	"deployment_target": {
                        "getDeployTargets": $rootScope.baseURL + "deployment-targets",
                        "updateDeployTargets": $rootScope.baseURL + "engagement/@engagementUuid//deployment-targets/@deployment_target_uuid",
                    },
                    "ecomp": {
                        "getECOMPReleases": $rootScope.baseURL + "ecomp-releases",
                        "updateECOMPReleases": $rootScope.baseURL + "engagement/@engagementUuid/ecomp-releases/@ecomp_uuid",
                    },
                    "version": {
                        "getVFVersion": $rootScope.baseURL + "vf/@vfUuid/vf-version/",
                    }

                },
                "vfcs": {
                    "add": $rootScope.baseURL + "vfcs/",
                    "get": $rootScope.baseURL + "vf/@vfUuid/vfcs/",
                    "delete": $rootScope.baseURL + "vf/@vfUuid/vfcs/@vfcUuid",
                },
               "status": {
	                   "get": $rootScope.baseURL + "engagements/@engagement/status",
	                    "add": $rootScope.baseURL + "engagements/@engagement/status",// set_attr
	                    "update": $rootScope.baseURL + "engagements/@engagement/status"
                },
                "feedback": {
	                    "add":$rootScope.baseURL + "add-feedback"

                },
                "dtsite": {
                    "get": $rootScope.baseURL + "dtsites/",
                    "getVFSites": $rootScope.baseURL + "vf/@vfUuid/dtsites/",
                    "add": $rootScope.baseURL + "dtsites/",
                    "delete": $rootScope.baseURL + "vf/@vfUuid/dtsites/@dtsUuid",
                },
                "checklist": {
                    "state":{
                        "put": $rootScope.baseURL + "checklist/@cl_uuid/state/",
                    },
                    "createChecklist": $rootScope.baseURL + "engagement/@engUuid/checklist/new/",
                    "getDataForChecklist": $rootScope.baseURL + "engagement/@engUuid/checklist/new/",
                    "getChecklist": $rootScope.baseURL + "checklist/@checklistUuid",
                    "putDataForChecklist": $rootScope.baseURL + "checklist/@checklist_uuid",
                    "checklistDecision": $rootScope.baseURL + "checklist/decision/@decisionUuid",
                    "createAuditlogChecklist": $rootScope.baseURL + "checklist/@checklist_uuid/auditlog/",
                    "createAuditlogDecisionChecklist": $rootScope.baseURL + "checklist/decision/@decision_uuid/auditlog/",
                    "getChecklistTemplates": $rootScope.baseURL + "checklist/templates/",
                    "getChecklistTemplate":  $rootScope.baseURL + "checklist/template/@templateUuid",
                    "saveChecklistTemplate":  $rootScope.baseURL + "checklist/template/"
                },
                "engagement": {
                    "put": $rootScope.baseURL + "engagements/@engagementUuid/",
                    "updateProgress": $rootScope.baseURL + "engagements/@engagementUuid/progress", // put
                    "setStage": $rootScope.baseURL + "single-engagement/@engagementUuid/stage/@stage",
                    "starred_engagement": {
                        "put" : $rootScope.baseURL + "engagements/starred_eng/",
                        "get" : $rootScope.baseURL + "engagements/starred_eng/",
                    },
                    "recent_engagement": {
                        "get" : $rootScope.baseURL + "engagements/recent_eng/",
                    },
                    "engagement_team": {
                        "put" : $rootScope.baseURL + "engagements/engagement-team/",
                    },
                    "engagementsExpanded": $rootScope.baseURL + "engagement/expanded/",
                    "exportEngagementsCSV": $rootScope.baseURL + "engagement/export/?stage=@stage&keyword=@keyword",
                    "reviewer": {"put": $rootScope.baseURL + "engagements/@engagementUuid/reviewer/"},
                    "peerreviewer": {"put": $rootScope.baseURL + "engagements/@engagementUuid/peerreviewer/"},
                    "switchReviewers": {"put": $rootScope.baseURL + "engagements/@engagementUuid/switch-reviewers/"},
                    "archive": {"put": $rootScope.baseURL + "engagements/@engagementUuid/archive/"},
                },
                "welcome": {
                    "welcome": $rootScope.baseURL + "welcome/",
                },
                "cms":{
                	"posts": {
                		"get": $rootScope.baseURL + "cms/posts/?limit=@limit&offset=@offset&fromLastDays=@fromLastDays&category=@category",
                	},
                    "pages": {
                	    "get": $rootScope.baseURL + "cms/pages/?title=@title",
                        "getById": $rootScope.baseURL + "cms/pages/@id/",
                        "search": $rootScope.baseURL + "cms/pages/search/?keyword=@keyword"
                    }
                },
                "users": {
                    "engagementleads": {
                        "get": $rootScope.baseURL + "users/engagementleads/",
                    },
                    "activate": $rootScope.baseURL + "users/activate/@userid/@token"
                },
            }
        });
        };

        var clearToastData = function () {
            var toast = toastService.getToast();
            if (toast && !toast.sticky) {
                toastService.clearToast();
            }
        };

        var clearDocumentationLastPage = function(toState) {
            if(toState && toState.name && toState.name !== 'app.documentation.page' && toState.name !== 'app.documentation') {
                sessionStorageService.delete(documentationLastPageSessionKey);
            }
        };

        var i18NextSetup = function() {
            if($window.i18next) {
                $window.i18next.use($window.i18nextXHRBackend)

                $window.i18next.init({
                    debug: false,
                    lng: 'en',
                    fallbackLng: 'en',
                    backend: {
                        loadPath: 'locales/{{lng}}/{{ns}}.json'
                    },
                    useCookie: false,
                    useLocalStorage: false
                }, function (err, t) {
                    if(err) {
                        $log.error(err);
                    }
                });
            }
        };

        init();
    }
})();
