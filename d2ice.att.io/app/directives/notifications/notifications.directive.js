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
        .directive('notifications', notifications);
    
    String.prototype.replaceAll = function(str1, str2, ignore) 
    {
        return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    }   
    
    function notifications($compile,$filter,$rootScope,$location,localStorageService) {
        var directive = {};
        directive.restrict = 'E';
        directive.template = '<div></div>';
        directive.scope = {activity : '='};
	    directive.controller =  ['$scope', function($scope) {
	        $scope.addDateStamp = function(activity) {
	        	var description = "";
				var timeGapLocal = moment().format("z");// timeGap();
				
	            var ampm =  moment().format('A');
	            var mom =moment().tz( moment.tz.guess()).format('z');
				
				if (activity.description.indexOf(' at ') == -1)
				{
					if (activity.description.substr(activity.description.length - 1) == '.')
						description = activity.description.substr(0, activity.description.length - 1);
					else
						description = activity.description;
				} else {
					description = activity.description.substring(0, activity.description.indexOf(" at "));
				}	
				activity.description = description + ' at ' + $filter('date')(activity.create_time,'yyyy-MM-dd hh:mm:ss',timeGapLocal) + " " + ampm + " " + mom;

				return activity;
	        }
	        $scope.addPopover = function(activity,macro,short,long) {
	        	
	        	var template = "<span " +
        						"popover-trigger='mouseenter' " + 
        						"popover-html='true' " +
        						"popover-placement='top' "+
        						"uib-popover='" + long +"' " +
        						"class='' " +
        						" >" + short +"</span>";
	        	activity.description = activity.description.replaceAll(macro, template);
	        }
	        
	        $scope.addSelectEngagement = function (activity,macro,short,uuid) {
	        	var template = "<span " +
				'ng-click="goToEngagement('+"'"+uuid+"'"+')" ' + 
				"class='engagement_link' " +
				" >" + short +"</span>";
				activity.description = activity.description.replaceAll(macro, template);
	        }
	        
	        $scope.goToEngagement = function(uuid){
	            localStorageService.setJson("ice.settings.eng_uuid",uuid);
	        	$location.path('/dashboard/overview');
	        	$location.replace();
		        $rootScope.$broadcast('onUpdateEngagements',{select : {uuid:uuid,page_type:'overview',sub_id:undefined}});
	        };
	    	
	        
	      }];
	    directive.link =  function(scope, iElement, iAttrs, ctrl) {
	    	var activity = scope.activity;
	    	activity.meta_data = JSON.parse(activity.metadata);
	    	scope.addDateStamp(activity);
	    	angular.forEach(activity.meta_data.macros,function(macro,key){
	    		switch (macro.type)
    			{
	    			case 'popover':
	    				scope.addPopover(activity,key,macro.short,macro.long);
	    				break;
	    			case 'select_engagement':
	    				scope.addSelectEngagement(activity,key,macro.short,macro.eng_uuid);
	    				break;

    			}

	    	});
	    	var template = "<span>" + scope.activity.description + "</span>";
	    	
	    	iElement.html(template).show();
	    	$compile(iElement.contents())(scope);
	    };
        return directive;
    }

})();