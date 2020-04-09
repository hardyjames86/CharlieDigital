angular.module("umbraco").controller("preview.1902Seo.controller", function ($rootScope, $scope, $element, $routeParams, previewResource1902, commonFactory1902Seo, editorState,appState) {
    debugger;
    if ($scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = '';
    }

    $scope.editorState = editorState;
    $scope.model.name = ' ';
    $scope.model.defaultUrl = '';
    $scope.model.actualUrl = window.location.origin;
    $scope.model.baseUrl = window.location.origin;
    $scope.model.display = {};
    $scope.model.display.Description = ' ';
    $scope.model.isCreate = $routeParams.create !== undefined;
 
    

    if ($scope.model.description !== undefined
        && $scope.model.description !== ""
        && $scope.model.description.trim() !== ""
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
   



    $scope.getPageSeoPreview = function (id) {
        var variantIndex = editorState.current.variants.findIndex(function (f) { return f.active; });
        var culture = "";
        if (variantIndex > -1) {
            if (editorState.current.variants[variantIndex].language !== null) {
                culture = editorState.current.variants[variantIndex].language.culture;
            }
        }

        if (id > 0) {
            previewResource1902.getPage(id, culture).then(
                function (response) {
                    $scope.model.display = response.data;
                    if ($scope.model.display.Description === "") {
                        $scope.model.display.Description = " ";
                    }
                });
        }
        
    };

    if ($routeParams.create === undefined) {
        $scope.getPageSeoPreview($routeParams.id);
    } else {
        $scope.getPageSeoPreview(0);
    }


    //$scope.$watch('editorState.current.name', function () {
    //    $scope.model.name = editorState.current.name == "" ? " " : editorState.current.name;
    //});
    $scope.$watch('editorState.current.updateDate', function () {
        if ($routeParams.create === undefined) { 
            $scope.getPageSeoPreview($routeParams.id);
        }

        if ($scope.editorState.current.id > 0) {
    
            var variantIndex = editorState.current.variants.findIndex(function (f) { return f.active; });
            var culture = "";
            if (variantIndex > -1) {
                if (editorState.current.variants[variantIndex].language !== null) {
                    culture = editorState.current.variants[variantIndex].language.culture;
                }
            }

            var urlIndex = 0;
            if (culture != "") {
                urlIndex = editorState.current.urls.findIndex(function (f) { return f.culture == culture });
            }

            if (editorState.current.urls[urlIndex].text.startsWith("/")) {
                $scope.model.actualUrl = $scope.model.baseUrl + editorState.current.urls[urlIndex].text;
            } else {
                $scope.model.actualUrl = editorState.current.urls[urlIndex].text;
            }
        }
    });

});


