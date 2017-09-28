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
        .module('ice.activation.addVf')
        .controller('AddVfController', ["$scope", "$state", "vfService", "toastService", "$location", "$rootScope",
            "localStorageService", 'usersService', '$log', AddVfController])
        .directive('addVf', function () {
            return {
                restrict: 'AEC',
                templateUrl: 'main/activation/addVf/addVf.html',
                link: function(scope, elm, attrs) {

                },
                controller: AddVfController,
                controllerAs: 'vm',
                scope: {
                    isModal: '=isModal'
                }
            }
        });

    function AddVfController($scope, $state, vfService, toastService, $location, $rootScope,localStorageService,
                             usersService, $log) {
        var vm = this;
        vm.data = [];
        vm.isModal = $scope.isModal;
        vm.user = usersService.getUserData();
        if (vm.user == undefined) {
            $state.go('app.login');
        }

        $rootScope.headerTitle = "Add Virtual Function";
        $rootScope.headerSubTitle = "<center>Please use the form below to submit the virtual functions you would " +
            "like to engage with ICE.<br/>Please do note that each VF will be tracked separately.</center>";

        if (!vm.isModal && $location.search().activation_success) {
            toastService.setToast('You have successfully activated your account', 'success', {displayFor: 'modal'});
        }

        var targetLabDate1 = [];
        //vm.targetLabDate = iceConstants.targetLabDate;
        vm.targetLabDate = monthesPlus12();


        $rootScope.ice.loader.show = true;
        vfService.getDeployTargets()
            .then(function (response) {
                $rootScope.ice.loader.show = false;
                if (response.status === 200) {
                    vm.deployTargets = response.data;
                }
            }).catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });

        vfService.getECOMPReleases()
            .then(function (response) {
                if (response.status === 200) {
                    vm.ECOMPReleases = response.data;
                }
            }).catch(function (error) {
                $rootScope.ice.loader.show = false;
                $log.error(error);
            });

        vm.choices = [{VirtualFunction: '', TargetLab: '', TargetAic: '', is_service_provider_internal: ''}];

        vm.addNewChoice = function () {
            var newItemNo = vm.choices.length + 1;
            vm.choices.push({'id': newItemNo});
        };

        vm.removeChoice = function (index) {
            vm.choices.splice(index,1);
        };

        vm.submitForm = function () {
            var is_service_provider_internal;
            var jsonAddVf = [];
            angular.forEach(vm.choices, function (value, key) {
                if (value.is_service_provider_internal == true) {
                    is_service_provider_internal = "True";
                } else {
                    is_service_provider_internal = "False";
                }
                vm.item = [];
                var jsonItem = new Object();
                jsonItem.virtual_function = value.VirtualFunction;
                var objDate = new Date(Date.parse((value.TargetLab) + moment().format("z")));
                jsonItem.target_lab_entry_date = objDate.getFullYear() + "-"
                            + addZero(objDate.getMonth()+1) + "-" + addZero(objDate.getDate());
                jsonItem.version = value.VFVersion;
                jsonItem.target_aic_uuid = value.TargetAic;
                jsonItem.ecomp_release = value.ECOMPRelease;
                jsonItem.is_service_provider_internal = (is_service_provider_internal === "True");
                jsonAddVf.push(jsonItem);
            });

            $rootScope.ice.loader.show = true;
            vfService.addVfs(JSON.stringify(jsonAddVf))//vm.data))
                .then(function (response) {
                    $rootScope.ice.loader.show = false;
                    if (response.status === 200) {
                        localStorageService.setJson("vfs", response.data);

                        if (!vm.isModal) {
                            if (response.data.is_active) {
                                $state.go('app.dashboard.overview');
                            } else {
                                $state.go('app.resend_activation');
                            }
                        } else {
                            $scope.$emit('onUpdateEngagements',{
                                select: {
                                    uuid:response.data[0].engagement.uuid,page_type:'overview',
                                    sub_id:undefined
                                }
                            });
                            $scope.$emit('moveWizardNextStep', response.data[0]);
                        }
                    }
                })
                .catch(function (error) {
                    $rootScope.ice.loader.show = false;
                    $log.error(error);
                });
        };


        vm.skipAddVf = function () {
            if (!vm.isModal && $location.search().activation_success) {
                $state.go('app.dashboard.overview');
            } else {
            	$state.go('app.resend_activation');
            }
        };
        vm.myDate = new Date();
        vm.minDate = new Date(
            vm.myDate.getFullYear(),
            vm.myDate.getMonth(),
            vm.myDate.getDate());
        vm.maxDate = new Date(
            vm.myDate.getFullYear() + 2,
            vm.myDate.getMonth(),
            vm.myDate.getDate());

    }


    var monthesPlus12 = function()
    {
        var i;
        var arrMonthYear=[];
        var startingMonth = (new Date().getMonth()+1);
        var startingYear = (new Date().getFullYear());
        for (i = startingMonth ; i<=12;i++)
        {
            arrMonthYear.push({"val": monthZero(i) + "-" + startingYear, "nam": MonthNumToName(i) + " " +
            startingYear});
        }
        for (i=1; i < startingMonth ; i++)
        {
            arrMonthYear.push({"val": monthZero(i) + "-" + (startingYear+1), "nam": MonthNumToName(i) + " " +
            (startingYear + 1)});
        }
        return(arrMonthYear);
    }

    var monthZero = function(m)
    {
        var ret = m;
        if (m<10)
        {
            ret = "0"+m;
        }
        return(ret);
    }

    var MonthNumToName = function(m)
    {
        var MonthName;
        switch (m)
        {
            case 1:
                MonthName = "January";
                break;
            case 2:
                MonthName = "February";
                break;
            case 3:
                MonthName = "March";
                break;
            case 4:
                MonthName = "April";
                break;
            case 5:
                MonthName = "May";
                break;
            case 6:
                MonthName = "June";
                break;
            case 7:
                MonthName = "July";
                break;
            case 8:
                MonthName = "August";
                break;
            case 9:
                MonthName = "September";
                break;
            case 10:
                MonthName = "October";
                break;
            case 11:
                MonthName = "November";
                break;
            case 12:
                MonthName = "December";
                break;
        }
        return(MonthName);
    }

    var addZero = function(x)
    {
        if (x<10)
        {
            return("0"+x);
        }
        else
        {
            return(x);
        }
    }
})();

