angular.module('umbraco').controller('1902.PropertyEditor.TextInputController', function ($rootScope, $scope, $element, $routeParams, assetsService, contentTypeResource, editorState, commonFactory1902Seo) {
    if ($scope.model.value === undefined || $scope.model.value === null) {
        $scope.model.value = '';
    }

    $scope.model.isExpand = true;
    $scope.editorState = editorState;
    var type = $scope.model.config.validatortype || $scope.model.config[0];
    switch (type) {
        case -88:
            $scope.model.field = 'textstring';
            break;
        case -89:
            $scope.model.field = 'textarea';
            break;
        default:

    }

    var isHideLabel = $scope.model.config.hideDefaultLabel == "1";
    if (isHideLabel) {
        if ($element.closest('.umb-el-wrap').children('.control-label').length > 0) {
            $element.closest('.umb-el-wrap').children('.control-label')[0].setAttribute('style', 'opacity:0!important');
        }
        
    }

    //this will be displayed inside controls/label
    var toolTip = $scope.model.config.customInnerHint;
    $scope.model.tooltip = toolTip;
    $scope.model.rawHintHtml = "";
    if (toolTip != undefined && toolTip != "") {
        $scope.model.rawHintHtml = commonFactory1902Seo.hintBuilder(toolTip,"right").innerHTML; // will be displayed on textbox
    }

    //will be displayed on outher label
    if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 0) {
        if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 1) {
            $element.closest('.umb-el-wrap').children('.control-label').children('small')[1].setAttribute('style', 'display:none!important'); //hides description label
        } else {
            $element.closest('.umb-el-wrap').children('.control-label').children('small')[0].setAttribute('style', 'display:none!important'); //hides description label
        }
        if ($scope.model.description != undefined && $scope.model.description != "" && $scope.model.description.trim() != "") {
            var hint = commonFactory1902Seo.hintBuilder($scope.model.description);
            $element.closest('.umb-el-wrap').children('.control-label')[0].appendChild(hint);
        }
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
                $element.closest('.umb-property')[0].setAttribute('style', $scope.model.isExpand ? '' : 'display:none')
            }
        }
    });

    $rootScope.$on('clearGroup', function (e, p) {
        if (group != '' && p.group == group) {
            $scope.model.value = '';
        }
    });
});