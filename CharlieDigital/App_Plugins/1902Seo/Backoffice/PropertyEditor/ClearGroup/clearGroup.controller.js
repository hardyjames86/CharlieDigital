angular.module("umbraco").controller("clearGroup.1902Seo.controller", function ($rootScope, $scope ,$element,$routeParams) {
    var group = $scope.model.config.group;
    var buttonText = $scope.model.config.buttonText;
    if ($scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = '';
    }
    $scope.model.isExpand = true;
    $scope.model.buttonText = buttonText;
    $scope.model.hideLabel = true;
    $scope.clear = function () {
        $rootScope.$broadcast('clearGroup', {group: group})
    }
    
    var group = $scope.model.config.group || '';
    $rootScope.$on('collapsibleClick', function (e, p) {
        if (group != '' && p.group == group) {
            $scope.model.isExpand = !$scope.model.isExpand;
            if ($element.closest('.umb-property').length > 0) {
                $element.closest('.umb-property')[0].setAttribute('style', $scope.model.isExpand ? '' : 'display:none')
            }
            
        }

    });

    $rootScope.$on('setIsExpand', function (e, p) {
        if (group != '' && p.group == group) {
            $scope.model.isExpand = p.isExpand;
            if ($element.closest('.umb-property').length > 0) {
                if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 1) {
                    $element.closest('.umb-el-wrap').children('.control-label').children('small')[1].setAttribute('style', 'display:none!important'); //hides description label
                } else {
                    $element.closest('.umb-el-wrap').children('.control-label').children('small')[0].setAttribute('style', 'display:none!important'); //hides description label
                }
            }
        }
    });
   

});

