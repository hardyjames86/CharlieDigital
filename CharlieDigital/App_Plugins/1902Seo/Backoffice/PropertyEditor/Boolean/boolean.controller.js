angular.module("umbraco").controller("boolean.1902Seo.controller", function ($scope, $element, commonFactory1902Seo) {
    if ($scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = 'False';
    }

    $scope.model.renderValue = $scope.model.value == "True" ? true : false;
    $scope.$watch('model.renderValue', function () {

        $scope.model.value = $scope.model.renderValue ? "True" : "False";
    });

    if ($scope.model.description != undefined
    && $scope.model.description != ""
    && $scope.model.description.trim() != ""
    && $element.closest('.umb-el-wrap').children('.control-label').length > 0) {
        var hint = commonFactory1902Seo.hintBuilder($scope.model.description);
        $element.closest('.umb-el-wrap').children('.control-label')[0].appendChild(hint);
        $scope.model.tooltip = $scope.model.description;
        if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 0) {
            if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 1) {
                $element.closest('.umb-el-wrap').children('.control-label').children('small')[1].setAttribute('style', 'display:none!important'); //hides description label
            } else {
                $element.closest('.umb-el-wrap').children('.control-label').children('small')[0].setAttribute('style', 'display:none!important'); //hides description label
            }
        }
    }

});

