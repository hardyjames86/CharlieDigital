angular.module('umbraco').controller('logo.1902Seo.controller', function ($scope, editorState, $element, $timeout, $location, logoResource1902, notificationsService, seoCommonResourceSeo1902) {
    if ($scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = '';
    }
    $scope.model.startup = {
        isEnabled : false
    }
    $scope.model.verify = {
        isActivated: true
    };

    $scope.model.hideLabel = true;
   

    $scope.model.check = {
        summaryFile: {
            CreatedDate: '',
            Path: ''
        }
    };

    $scope.model.import = {
        summaryFile: {
            CreatedDate: '',
            Path: ''
        }
    };
    

    $scope.validateRegistration = function () {
        $scope.model.verify.isVerifying = true;
        logoResource1902.validateRegistration().then(function (response) {
            if (response.data.Data != undefined) {
                $scope.model.verify.isActivated = response.data.Data.IsRegistered;
            }
        }, function (error) {
            if (error != undefined && error != null) {
                notificationsService.error("Error", "Unable validate registration.");
            }
            $scope.model.verify.isInitializing = false;
            $scope.model.verify.isVerifying = false ;
        });
    }

    
    function GetCheckFileInfo() {
        logoResource1902.getFileSummary(true)
            .then(function (response) {
                $scope.model.check.summaryFile.CreatedDate = response.data.ParsedDate;
                $scope.model.check.summaryFile.Path = response.data.PathUrl;
            }, function (error) {
                notificationsService.error("Error", "Unable to get check file summary.");
                console.log(error);
            });
    };

    function GetImportFileInfo() {
        logoResource1902.getFileSummary(false)
            .then(function (response) {
                $scope.model.import.summaryFile.CreatedDate = response.data.ParsedDate;
                $scope.model.import.summaryFile.Path = response.data.PathUrl;
            }, function (error) {
                notificationsService.error("Error", "Unable to get check file summary.");
                console.log(error);
            });
    };

    function GetEnableProperty() {
        seoCommonResourceSeo1902.getStartUpStatus().then(function (response) {
            $scope.model.startup.isEnabled = response.data.IsEnabled;
            GetCheckFileInfo();
            GetImportFileInfo();
        }, function (error) {
            if (error != undefined) {
                console.log(error)
            }
        });
    }


    function GetTabProperty() {
        logoResource1902.getTabProperty(editorState.current.contentTypeAlias).then(
            function (response) {
                if (response.data.IsHidden) {
                    var containerSeo = contentForm.querySelectorAll('[data-element="group-1902 SEO+"]');
                    if (containerSeo.length > 0) {
                        $timeout(function () {
                            containerSeo[0].classList.add('hide');
                        },300);
                    }
                    var dropdownSubs = contentForm.querySelectorAll('.umb-sub-views-nav-item__anchor_dropdown li')
                    if (dropdownSubs.length > 0) {
                        $(dropdownSubs).each(function (e, data) {
                           
                            if (data.innerHTML.includes("1902 SEO+")) {
                                data.classList.add('hide');
                            }
                        });
                    }
                    


                } else {
                    FocusSeoTab();
                }
            },

            function () { });
    }
    function FocusSeoTab() {
       // if (editorState.current != undefined
       //&& editorState.current != null
       //&& editorState.current.tabs != undefined
       //&& editorState.current.tabs != null) {
       //     var seoTabIndex = editorState.current.tabs.findIndex(function (f) { return f.alias == '1902 SEO+'; });
       //     if (seoTabIndex > -1) {
       //         var tabs = contentForm.querySelectorAll('.umb-nav-tabs li a:not(.dropdown-toggle)');
       //         if (tabs != undefined && tabs != null && $location.$$search.f != undefined && $location.$$search.f == '1902') {
       //             $timeout(function () {
       //                 contentForm.querySelectorAll('.umb-nav-tabs li a:not(.dropdown-toggle)')[seoTabIndex].click();
       //             }, 500);
       //         }
       //     }
       // }
    }
    $scope.validateRegistration();
    GetEnableProperty();
    GetTabProperty();
    
});