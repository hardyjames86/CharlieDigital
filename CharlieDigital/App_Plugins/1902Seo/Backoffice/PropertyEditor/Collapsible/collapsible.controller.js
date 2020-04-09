angular.module("umbraco").controller("collapsible.1902Seo.controller", function ($rootScope, $scope, $routeParams, $element, editorState, entityResource, commonFactory1902Seo, appState, mediaHelper) {
    var group = $scope.model.config.group;
    var isExpanded = $scope.model.config.defaultExpanded === "1";
    $scope.expand = function () {
        $rootScope.$broadcast('collapsibleClick', { group: group });
        $scope.model.isExpand = !$scope.model.isExpand;
    }
    $scope.model.isExpand = isExpanded;

    setTimeout(function () {
        $rootScope.$broadcast('setIsExpand', { group: group, isExpand: isExpanded });
    }, 500);


    $scope.model.showOgDetails =  $scope.model.config.showOgDetails ==="1";

    $scope.model.editorState = editorState;

    $scope.tooltip = $scope.model.description;
    $scope.ogTitle = ' ';
    $scope.ogDescription = ' ';
    $scope.ogUrl = ' ';
    $scope.baseUrl = window.location.origin;
    $scope.model.actualUrl = window.location.origin;
    $scope.ogImage = '';
    if ($scope.model.showOgDetails) {
        getOgSnippet();
        $scope.$watch('model.editorState.current.updateDate', function () {
            getOgSnippet();
        });
    }

    function getOgSnippet() {
        $scope.model.hideLabel = true;

        var variantIndex = editorState.current.variants.findIndex(function (f) { return f.active; });
        if (variantIndex > -1) {
            var seoTabIndex = editorState.current.variants[variantIndex].tabs.findIndex(function (f) { return f.alias === '1902 SEO+'; });

            if (seoTabIndex > -1) {
                var seoTab = editorState.current.variants[variantIndex].tabs[seoTabIndex];

                var ogTitleIndex = seoTab.properties.findIndex(function (f) { return f.alias === 'ogTitle1902Seo'; });
                if (ogTitleIndex > -1 && seoTab.properties[ogTitleIndex].value !== '') {
                    var ogTitle = seoTab.properties[ogTitleIndex]
                    $scope.ogTitle = commonFactory1902Seo.ellipsis(ogTitle.value, 20);
                }

                var ogDescriptionIndex = seoTab.properties.findIndex(function (f) { return f.alias === 'ogDescription1902Seo'; });
                if (ogDescriptionIndex > -1 && seoTab.properties[ogDescriptionIndex].value !== '') {
                    var ogDescription = seoTab.properties[ogDescriptionIndex];
                    $scope.ogDescription = commonFactory1902Seo.ellipsis(ogDescription.value, 60);
                }

                var ogImageIndex = seoTab.properties.findIndex(function (f) { return f.alias === 'ogImage1902Seo'; });
                if (ogImageIndex > -1) {
                    var ogImage = seoTab.properties[ogImageIndex];
                    var imageId = ogImage.value;

                    entityResource.getById(imageId, "Media").then(function (media) {
                        if (media !== undefined && media !== null) {
                            $scope.ogImage = mediaHelper.resolveFileFromEntity(media, true);
                        }
                    });
                }



                if (editorState.current.published) {
                    var culture = "";
                    if (variantIndex > -1) {
                        if (editorState.current.variants[variantIndex].language !== null) {
                            culture = editorState.current.variants[variantIndex].language.culture;
                        }
                    }

                    var urlIndex = 0;
                    if (culture != null) {
                        urlIndex = editorState.current.urls.findIndex(function (f) { return f.culture == culture });
                    }
                    if (editorState.current.urls[urlIndex].startsWith("/")) {
                        $scope.ogUrl = commonFactory1902Seo.ellipsis($scope.baseUrl + editorState.current.urls[urlIndex], 30);
                    } else {
                        $scope.ogUrl = commonFactory1902Seo.ellipsis(editorState.current.urls[urlIndex], 30);
                    }
                }

            }
        }

        if ($scope.model.description !== undefined
            && $scope.model.description !== ""
            && $scope.model.description.trim() !== ""
            && $element.closest('.umb-el-wrap').children('.control-label').length > 0) {
            if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 0) {
                if ($element.closest('.umb-el-wrap').children('.control-label').children('small').length > 1) {
                    $element.closest('.umb-el-wrap').children('.control-label').children('small')[1].setAttribute('style', 'display:none!important'); //hides description label
                } else {
                    $element.closest('.umb-el-wrap').children('.control-label').children('small')[0].setAttribute('style', 'display:none!important'); //hides description label
                }
            }
        }
    }

});

