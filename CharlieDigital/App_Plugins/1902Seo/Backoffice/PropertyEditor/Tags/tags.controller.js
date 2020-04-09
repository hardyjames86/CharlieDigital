angular.module("umbraco").controller("tags.1902Seo.controller", function ($scope, $element, commonFactory1902Seo, notificationsService) {
    if ($scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = '';
    }

    $scope.model.inputedTag = "";
    $scope.model.tags = [];
    $scope.addTag = function (event) {
        if (event.keyCode == 13) {
            if ($scope.model.inputedTag.trim() != "") {
                var index = $scope.model.tags.findIndex(function (item) { return item.toLowerCase() == $scope.model.inputedTag.toLowerCase(); });
                if ($scope.model.inputedTag.trim().indexOf(',') > -1) {
                    notificationsService.error("Invalid keyword", "Keyword contain/s comma.");
                } else if ($scope.model.inputedTag.trim().indexOf('<') > -1 || $scope.model.inputedTag.trim().indexOf('>') > -1) {
                    notificationsService.error("Invalid keyword", "Keyword contain/s invalid character.");
                }else {
                    if (index == -1) {
                        $scope.model.tags.push($scope.model.inputedTag)
                        $scope.model.inputedTag = "";
                        $scope.sync();
                    } else {
                        notificationsService.error("Invalid keyword", "Keyword already exists.");
                    }
                }
            }
            event.preventDefault();
        }
    }

    $scope.removeTag = function (tag) {
        var index = $scope.model.tags.findIndex(function (item) { return item == tag; });
        $scope.model.tags.splice(index, 1);
        $scope.sync();
    }
    
    function SetValues() {
        if ($scope.model.value != undefined && $scope.model.value != null && $scope.model.value != "") {
            var splitedValue = $scope.model.value.split(",")
            $scope.model.tags = splitedValue;
        }

    }

    SetValues();
    $scope.sync = function () {
        $scope.model.value = $scope.model.tags.join(",");
    }


    var toolTip = $scope.model.description;
    $scope.model.tooltip = toolTip;
    if ($scope.model.description != undefined
    && $scope.model.description != ""
    && $scope.model.description.trim() != ""
    && $element.closest('.umb-el-wrap').children('.control-label').length > 0) {
        var hint = commonFactory1902Seo.hintBuilder($scope.model.description);
        $element.closest('.umb-el-wrap').children('.control-label')[0].appendChild(hint);
        if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 0) {
            if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 1) {
                $element.closest('.umb-el-wrap').children('.control-label').children('small')[1].setAttribute('style', 'display:none!important'); //hides description label
            } else {
                $element.closest('.umb-el-wrap').children('.control-label').children('small')[0].setAttribute('style', 'display:none!important'); //hides description label
            }
        }
    }



});