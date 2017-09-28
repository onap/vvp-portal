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
        .module('ice.modals')
        .controller('NextStepsModalController', ['$rootScope', '$uibModalInstance', 'stepsService', 'engagement_team',
            'title', 'associated_files', 'engagement_uuid', 'checklist', 'nextstep', 'toastService', '$log', NextStepsModalController]);

    function NextStepsModalController($rootScope, $uibModalInstance, stepsService, engagement_team, title,
                                      associated_files, engagement_uuid, checklist, nextstep, toastService, $log) {

        var vm = this;
        vm.nextSteps = [{assigneesUuids: '',description: '', files: '', duedate: ''}];

        var init = function() {

            vm.myDate = new Date();
            vm.minDate = new Date(
                vm.myDate.getFullYear(),
                vm.myDate.getMonth(),
                vm.myDate.getDate());
            vm.maxDate = new Date(
                vm.myDate.getFullYear() + 2,
                vm.myDate.getMonth(),
                vm.myDate.getDate());
            vm.onlyWeekendsPredicate = function (date) {
                var day = date.getDay();
                return day === 0 || day === 6;
            };

            vm.wysiwyg_menu = [
                ['bold', 'italic', 'strikethrough', 'underline'],
                ['unordered-list', 'ordered-list', 'outdent', 'indent']
            ];
            vm.select_str = {File: 'Select All'};
            vm.select_all_flag = false;
            vm.associated_files = [];
            vm.associated_files.push( vm.select_str);
            vm.assigness = [];
            vm.title = title;
            if (checklist == undefined)
            {
                vm.checklist = {};
                vm.checklist.uuid = undefined;
            } else {
                vm.checklist = checklist;
            }

            var unique_files = [];
            angular.forEach(associated_files, function (value, key) {
                if (unique_files.indexOf(value) == -1) {
                    unique_files.push(value);
                    vm.associated_files.push({File: value});
                }
            });
            angular.forEach(engagement_team, function (value, key) {
                vm.assigness.push({name: value.full_name, id: value.uuid});
            });
            vm.edit = false;

            if (nextstep != undefined)
            {
                vm.edit = true;
                var current = {};
                current.description = nextstep.description;
                current.files = [];
                current.duedate = new Date(nextstep.due_date);
                var unique_files = [];
                angular.forEach(nextstep.files, function(val, key1) {
                    if (unique_files.indexOf(value) == -1) {
                        unique_files.push(value);
                        current.files.push({File: val});
                    }
                });

                current.assigneesUuids = [];
                angular.forEach(nextstep.assignees, function(val, key1) {
                    current.assigneesUuids.push({name : val.full_name, id :val.uuid});

                });
                vm.nextSteps = [current];
            }
        };

        init();

        vm.get_chosen_files_num = function(ns){
            if (ns.files.length == associated_files.length+1) {
                return ns.files.length - 1;
            }
            return ns.files.length
        }

        vm.add_all_associated_files = function (ns , choose_option){
            if (choose_option == true) {
                ns.files = [];
                ns.files.push({File: 'Select All'});
                _.forEach(associated_files, function (value, key) {
                    ns.files.push({File: value});
                });
            }
            else {
                vm.select_all_flag = false;
                ns.files = [];
            }
            return;
        }

        vm.pull_select_all_from_list = function(ns){
            var shortened_files_list = [];
            _.forEach(ns.files, function(item) {
                if (!_.isEqual(item, vm.select_str)) {
                    shortened_files_list.push(item);
                }
            });
            ns.files = shortened_files_list;
        }

        vm.verify_files_choice = function(ns){
            _.forEach(ns.files, function(item) {
                if (ns.files.length == associated_files.length && vm.select_all_flag) {
                    if (item === vm.select_str) {
                        vm.select_all_flag = false;
                        vm.pull_select_all_from_list(ns);
                    }
                    else {
                        vm.add_all_associated_files(ns, false)
                    }
                }
                else if (ns.files.length == associated_files.length && !vm.select_all_flag) {
                    ns.files.push({File: 'Select All'});
                    vm.select_all_flag = true;
                }
                else if (item === vm.select_str) {
                    vm.select_all_flag = true;
                    vm.add_all_associated_files(ns, true)
                }
            })
        }

        vm.addNewStep = function () {
            var newItemNo = vm.nextSteps.length + 1;
            vm.nextSteps.push({'id': newItemNo});
        };

        vm.removeStep = function (index) {
            vm.nextSteps.splice(index,1);
        };

        vm.closeModal = function(){
            $rootScope.ice.loader.show = false;
            toastService.clearToast();
            $uibModalInstance.close();
        };

        vm.submitForm = function () {

            var jsonNextSteps = [];

            var objDate;
            var strDate;
            angular.forEach(vm.nextSteps, function(value, key) {
                var next_step = {};
                next_step.files = [];
                if (value.files.length > associated_files.length) {
                    vm.pull_select_all_from_list(value);
                }
                angular.forEach(value.files, function(val, key1) {
                    next_step.files.push(val.File);
                });
                next_step.assigneesUuids = [];
                angular.forEach(value.assigneesUuids, function(val, key1) {
                    next_step.assigneesUuids.push(val.id);
                });

                // TODO exho correct format in one command
                objDate = new Date(Date.parse((value.duedate) + moment().format("z")));
                next_step.duedate = objDate.getFullYear() + "-" + addZero(objDate.getMonth()+1) + "-" + addZero(objDate.getDate());
                next_step.description  = value.description;
                jsonNextSteps.push(next_step);
            });
            var checklist_uuid = vm.checklist.uuid;
            var engUuid = engagement_uuid;
            if (vm.edit){
                stepsService.edit(engagement_uuid, nextstep.uuid,jsonNextSteps[0])
                    .then(function (response) {
                        if (response.status === 202) {
                            $uibModalInstance.close(response.data);
                        }
                    })
                    .catch(function (error) {
                        $log.error(error);
                        toastService.setToast(error.status + ': Error adding next step!', 'danger', {displayFor: 'modal'});
                    });
            } else if (vm.checklist.uuid == undefined) {

                stepsService.add(engagement_uuid, jsonNextSteps)
                    .then(function (response) {
                        if (response.status === 200) {
                            $uibModalInstance.close(response.data);
                        }
                    })
                    .catch(function (error) {
                        $log.error(error);
                        toastService.setToast(error.status + ': Error adding next step!', 'danger', {displayFor: 'modal'});
                    });
            } else {
                stepsService.createChecklistNextStep(checklist_uuid, engUuid, jsonNextSteps)
                    .then(function (response) {
                        if (response.status === 200) {
                            $uibModalInstance.close(response.status);
                            vm.closeModal();
                        }
                        else
                        {
                            toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                            $rootScope.ice.loader.show = false;
                            $log.error(error);
                        }
                    })
                    .catch(function (error) {
                        toastService.setToast(error.message, 'danger', {displayFor: 'modal'});
                        $rootScope.ice.loader.show = false;
                        $log.error(error);
                    });
            }
        };

        var addZero = function(x)
        {
            if (x<10)
            {
                return("0"+x);
            } else
            {
                return(x);
            }
        }
    }
})();
