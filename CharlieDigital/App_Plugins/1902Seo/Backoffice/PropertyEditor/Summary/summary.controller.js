
angular.module("umbraco").controller("summary.1902Seo.controller", function ($scope, $routeParams, $element, commonFactory1902Seo, summaryResource1902, editorState, contentResource, editorService) {
    $scope.editorState = editorState;

    $scope.model.expands = [{
        title: "Template",
        type: "Template",
        content: [],
        isExpand: false,
        badges: [],
        gettingData: false,
        message: ''
    }, {
        title: "Keyword Analysis",
        type: "Keyword",
        content: [],
        isExpand: false,
        badges: [],
        gettingData: false,
        keywordBadges: [],
        keyword: '',
        message: ''
    }, {
        title: "Performance",
        type: "Performance",
        content: [],
        isExpand: false,
        badges: [],
        gettingData: false,
        message: ''
    }]

    $scope.model.isCreate = $routeParams.create !== undefined;

    $scope.refresh = function (type, notCache, isRetry) {


        setTimeout(function () {
            var variantIndex = editorState.current.variants.findIndex(function (f) { return f.active; });
            var culture = "";
            if (variantIndex > -1) {
                if (editorState.current.variants[variantIndex].language !== null) {
                    culture = editorState.current.variants[variantIndex].language.culture;
                }
            }
            var contentId = $routeParams.id;
            if ($scope.model.isCreate) {
                contentId = 0;
            }


            var index = $scope.model.expands.findIndex(function (item) { return item.type == type; });
            var keyword = '';
            if ($scope.model.keyword)
                keyword = $scope.model.keyword;
            if (type != 'Keyword')
                keyword = '';

            if (type == 'Keyword' && !keyword) {
                $scope.model.expands[index].message = "No keyword to analyze";
                $scope.model.expands[index].keywordBadges = [];
                $scope.model.expands[index].keyword = "";
                $scope.model.expands[index].content = [];
                $scope.model.expands[index].badges = [];

                return;
            }

            $scope.model.expands[index].gettingData = true;

            if (type == 'Keyword' && keyword)
                $scope.model.expands[index].keyword = ' for ' + '"' + keyword + '"';

            summaryResource1902.getSummary(contentId, type, keyword, notCache, culture).then(function (response) {
                var i = $scope.model.expands.findIndex(function (item) { return item.type == type; });
                $scope.model.expands[i].gettingData = false;
                if (response.data.Success) {
                    $scope.model.expands[i].message = '';
                    $scope.model.expands[i].content = response.data.Data.Result;
                    $scope.model.expands[i].badges = getBadges(i);

                    if (type == 'Keyword')
                        $scope.model.expands[i].keywordBadges = getKeywordBadges();
                } else {
                    $scope.model.expands[i].message = response.data.ErrorMessage;
                }



            }, function (error) {
                if (error != undefined) {
                    console.log(error);
                }
                if (isRetry == undefined || isRetry == null || !isRetry) {
                    $scope.refresh(type, notCache, true);
                }


            });
        });
    }

    function getBadges(i) {
        var badges = [];
        var good = 0;
        var improvement = 0;
        var bad = 0;

        var data = $scope.model.expands[i].content;

        for (var i = 0; i < data.length; i++) {
            switch (data[i].Status) {
                case 1:
                    good++;
                    break;
                case 2:
                    improvement++;
                    break;
                case 3:
                    bad++;
                    break;
                default:
                    break;

            }
        }


        if (bad > 0)
            badges.push({ status: 'bad', count: bad });

        if (improvement > 0)
            badges.push({ status: 'improvement', count: improvement });

        if (good > 0)
            badges.push({ status: 'good', count: good });

        return badges;
    }

    function getKeywordBadges() {
        var badges = [];
        var good = 0;
        var improvement = 0;
        var bad = 0;

        var keywordExpand = $scope.model.expands[1];

        for (var i = 0; i < keywordExpand.content.length; i++) {
            switch (keywordExpand.content[i].Alias) {
                case 'keywordgoodchecker':
                    badges.push({ status: 'good', count: keywordExpand.content[i].Messages.length });
                    break;
                case 'improvementChecker':
                    badges.push({ status: 'improvement', count: keywordExpand.content[i].Messages.length });
                    break;
                default:
                    break;

            }
        }

        return badges;
    }

    $scope.expandsContent = function (type, isOpenOnly) {
        var index = $scope.model.expands.findIndex(function (item) { return item.type == type; });
        var data = $scope.model.expands[index];
        if (isOpenOnly != undefined && isOpenOnly) {
            data.isExpand = true;;
        } else {
            data.isExpand = !data.isExpand;
        }


    }

    $scope.reloadAll = function () {
        var variantIndex = editorState.current.variants.findIndex(function (f) { return f.active; });

        if (variantIndex > -1) {
            var seoTabIndex = editorState.current.variants[variantIndex].tabs.findIndex(function (f) { return f.alias == '1902 SEO+'; });

            if (seoTabIndex > -1) {
                var seoTab = editorState.current.variants[variantIndex].tabs[seoTabIndex];
                var keywordIndex = seoTab.properties.findIndex(function (f) { return f.alias == 'keyword1902Seo'; });
                if (keywordIndex > -1) {
                    var keyword = seoTab.properties[keywordIndex];
                    if (keyword.value != undefined && keyword.value != "") {
                        $scope.model.keywords = keyword.value.split(',');

                        if ($scope.model.keywords.length > 0)
                            $scope.model.keyword = $scope.model.keywords[0];
                    } else {
                        $scope.model.keywords = null;
                        $scope.model.keyword = '';
                    }

                }
            }
        }


        for (var i = 0; i < $scope.model.expands.length; i++) {
            $scope.refresh($scope.model.expands[i].type);
        }
    }

    $scope.$watch('editorState.current.updateDate', function () {
        $scope.reloadAll();
    });

    $scope.GetKeywordPageUrl = function (message) {
        var searchMessage = 'Focus keyword was used in';
        var url = '';
        if (message.indexOf(searchMessage) > -1) {
            url = message.replace(searchMessage, '');
            url = url.trim();
        }


        return url;
    }


    $scope.openKeywordUsage = function (keyword, expandData) {

        if (expandData != null
            && expandData != undefined
            && expandData.AdditionalData != undefined
            && keyword != null
            && keyword != undefined) {


            var urls = expandData.AdditionalData.filter(function (x) {
                return x.Name == "used-in-page-" + keyword.toLowerCase();
            });



            editorService.open({
                title: "Keyword Analysys", size:"small",view: "/App_Plugins/1902Seo/Backoffice/PropertyEditor/Summary/popup.keyword.usage.html", dialogData: { keyword: keyword, urls: urls }
            });

        }
    }



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



    $scope.generateHint = function (content) {
        return commonFactory1902Seo.hintBuilder(content).innerHTML;
    }
});

angular.module("umbraco").controller("summary.1902Seo.keywordUsage", function ($scope, editorService) {
    var dialogData = $scope.model.dialogData;
    $scope.model = {
        keyword: dialogData.keyword,
        urls: dialogData.urls
    };

    $scope.close = function () {
        editorService.close();
    };
});