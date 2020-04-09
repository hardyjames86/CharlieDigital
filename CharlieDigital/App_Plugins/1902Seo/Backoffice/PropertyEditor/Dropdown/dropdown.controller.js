angular.module("umbraco").controller("dropdown.1902Seo.controller",
    function ($scope, $element, commonFactory1902Seo, dropdown1902Resource) {
        var config = {
            items: [],
            multiple: false,
            enableApiSource: false,
            customApiUrl: ''
        };

        angular.extend(config, $scope.model.config);

        $scope.model.config = config;
        $scope.model.dropdownItems = [];
        function convertArrayToDictionaryArray(model) {
            var newItems = [];
            for (var i = 0; i < model.length; i++) {
                newItems.push({ id: model[i], sortOrder: 0, value: model[i] });
            }

            return newItems;
        }


        function convertObjectToDictionaryArray(model) {
            var newItems = [];
            var vals = _.values($scope.model.config.items);
            var keys = _.keys($scope.model.config.items);

            for (var i = 0; i < vals.length; i++) {
                var label = vals[i].value ? vals[i].value : vals[i];
                newItems.push({ id: keys[i], sortOrder: vals[i].sortOrder, value: label });
            }

            return newItems;
        }
        if ($scope.model.config.enableApiSource === "1") {
            
            if ($scope.model.config.customApiUrl != '') {
                dropdown1902Resource.getDropdownItems($scope.model.config.customApiUrl).then(function (response) {
                    $scope.model.dropdownItems = convertArrayToDictionaryArray(response.data);
                }, function () {
                    throw "Unable to get drop down items";
                })

            }

        } else {
            if (angular.isArray($scope.model.config.items)) {
                if (!angular.isObject($scope.model.config.items[0])) {
                    $scope.model.dropdownItems = convertArrayToDictionaryArray($scope.model.config.items);
                } else {
                    $scope.model.dropdownItems = $scope.model.config.items;
                }
            }
            else if (angular.isObject($scope.model.config.items)) {
                $scope.model.dropdownItems = convertObjectToDictionaryArray($scope.model.config.items);
            }
            else {
                throw "The items property must be either an array or a dictionary";
            }
        }
       

     
       // $scope.model.config.items.sort(function (a, b) { return (a.sortOrder > b.sortOrder) ? 1 : ((b.sortOrder > a.sortOrder) ? -1 : 0); });

        if ($scope.model.value === null || $scope.model.value === undefined) {
            if ($scope.model.config.multiple) {
                $scope.model.value = [];
            }
            else {
                $scope.model.value = "";
            }
        }


     
        var isHideLabel = $scope.model.config.hideDefaultLabel == "1";
        if (isHideLabel) {
            if ($element.closest('.umb-el-wrap').children('.control-label').length > 0) {
                $element.closest('.umb-el-wrap').children('.control-label')[0].setAttribute('style', 'opacity:0!important');
            }
            
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
        ///will be disalbed on inner label
        var toolTip = $scope.model.config.customInnerHint;
        $scope.model.tooltip = toolTip;
        $scope.model.rawHintHtml = "";
        if (toolTip != undefined && toolTip != "") {
            $scope.model.rawHintHtml = commonFactory1902Seo.hintBuilder(toolTip).innerHTML;
        }
        

    });