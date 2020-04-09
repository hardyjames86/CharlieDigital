angular.module("umbraco")
    .controller("seoDashboard1902.controller", function ($scope, $filter, seoDashboardResource1902, notificationsService, editorService , commonFactory1902Seo, $timeout, $location, $element, seoCommonResourceSeo1902) {

    var self = this;
    $scope.loading = false;
    $scope.indexing = { isIndexAll: false };
    $scope.isIndexAllOrigValue = false;
    $scope.isSavingAll = false;
    // $scope.isFirstTimeInstall = false;

    var pageSizeCookieKey = 'pages1902PageSize';
    var pageLanguageCookieKey = 'page1902PageLanguage'
    var pageSize = GetCookieValue(pageSizeCookieKey) == '' ? 10 : parseInt(GetCookieValue(pageSizeCookieKey));
    $scope.google = { goolePlusPage: '' };

    $scope.startUp = {
        isFirstTimeInstall: false,
        isImportComplete: false,
        isEnabled: false,
        hasDuplicate: false,
        isInterrupted: false,
        isConfirm: false
    };

    $scope.documentTypes = {
        loading: false,
        filter: {
            Page: 0,
            PageSize: 5,
            Search: ''
        },
        data: [],
        count: 0,
        isCheckAllDocumentType: false
    };

    $scope.import = {
        isProcessing: false,
        totalCount: 0,
        currentCount: 0,
        message: '',
        hasDuplicate: false,
        summaryFile: {
            CreatedDate: '',
            Path: ''
        },
        isGeneratingReport: false,
      
    };

    $scope.check = {
        isProcessing: false,
        totalCount: 0,
        currentCount: 0,
        message: '',
        errorMessage: '',
        hasDuplicate: false,
        summaryFile: {
            CreatedDate: '',
            Path: ''
        },
        confirmationText: '',
        isGeneratingReport: false,
        latest: {
            hasDuplicate: false
        }
    };

    $scope.verify = {
        isActivated: true,
        isVerifying: false
    };

    $scope.verifyForm = {
        isPopUpOpen: false,
        isClosed: true,
        countries: [],
        email: '',
        countryCode: '',
        isAcceptTerms: false,
        code: '',
        hasInputCode: false,
        isLoading: false,
        emailValidation: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        resendCodeTimer: 0
    };

    $scope.pages = {
        loading: false,
        filter: {
            Page: 1,
            PageSize: pageSize,
            Search: '',
            Culture: '',
            LanguageUniqueId: ''
        },
        data: [],
        paging: [],
        activePagingGroup: 0,
        pagingGroupSize: 5,
        lastPagingGroup: 0,
        pageLimits: [
            { value: 10 },
            { value: 20 },
            { value: 30 },
            { value: 40 },
            { value: 50 },
        ],
        autocomplete: [],
        isSearching: false,
        initializing: true,
    }

    $scope.languages = {
        data: [],
        loading: true
    }


    var pagingGroupSize = $scope.pages.pagingGroupSize;

    function GetGooglePublisherPage() {
        seoDashboardResource1902.getGooglePublisherPage().then(function (response) {
            $scope.google.goolePlusPage = response.data.GooglePublisherPage;
        });
    }
    function GetAutoComplete() {
        seoDashboardResource1902.getPageAutocompletePage().then(function (response) {
            $scope.pages.autocomplete = response.data;
        });
    }
    function GetCookieValue(key) {
        var name = key + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    function SetCookieValue(key, value) {
        document.cookie = key + "=" + value;
    }
    function StartUpValidation() {
        seoCommonResourceSeo1902.getStartUpStatus().then(
            function (response) {
                if (response.data.IsScrapped && response.data.IsScrappedComplete && response.data.IsFinished) {
                    $scope.startUp.isEnabled = response.data.IsEnabled;
                    $scope.startUp.isFirstTimeInstall = false;
                    $scope.checkIsRegistered(); // must be first
                    GetAutoComplete();
                    GetGooglePublisherPage();
                    $scope.getLanguages();
                    $scope.getDocumentTypes();
                    $scope.getImportFileInfo();

                    $timeout(function () {
                        $scope.checkProgress(false)
                        $scope.focusTab();
                    }, 1100);

                } else {

                    $scope.startUp.isImportComplete = response.data.IsScrappedComplete;
                    $scope.startUp.isInterrupted = response.data.IsScrapped && !response.data.IsScrappedComplete;



                    $scope.startUp.isFirstTimeInstall = true;
                    $scope.startUp.hasDuplicate = response.data.HasDuplicate;

                    $timeout(function () {
                        $scope.focusTab();
                        $scope.importProgess();
                    }, 1100);
                }

            });
    }


    function GetEnabledStatus() {
        if (!$scope.startUp.isEnabled) {
            seoCommonResourceSeo1902.getStartUpStatus().then(function (response) {
                $scope.startUp.isEnabled = response.data.IsEnabled;
            });
        }
    }

    $scope.filterPageAutoComplete = function (page) {
        return page.Text.toLowerCase().includes($scope.pages.filter.Search.toLowerCase())
            && page.Languages.findIndex(function (item) { return item.UniqueId == $scope.pages.filter.LanguageUniqueId; }) > -1;
    }

    $scope.$watch('verifyForm.resendCodeTimer', function () {
        $timeout(function () {
            if ($scope.verifyForm.resendCodeTimer > 0) {
                $scope.verifyForm.resendCodeTimer -= 1;
            }
        }, 1000);

    });

    $scope.checkIsRegistered = function () {
        $scope.verify.isVerifying = true;
        seoDashboardResource1902.validateIsRegistered().then(
          function (response) {
              if (response.data.Data != undefined) {
                  $scope.verify.isActivated = response.data.Data.IsRegistered;
              }
              if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != "") {
                  notificationsService.error("Error", "Unable validate registration.");
              }
              $scope.verify.isVerifying = false;
          },
          function (error) {
              notificationsService.error("Error", "Unable validate registration.");
              $scope.verify.isVerifying = false;
          });
    };


    $scope.verifyCode = function () {
        $scope.verifyForm.isLoading = true;
        seoDashboardResource1902.verifyRegistration($scope.verifyForm).then(
            function (response) {
                if (response.data.Data != undefined) {
                    $scope.verify.isActivated = response.data.Data;
                }
                if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != "") {
                    notificationsService.error("Error", response.data.ErrorMessage);
                } else {
                    if (response.data.Data) {
                        notificationsService.success("Success", "Successfully validated code. You can now use locked features.");
                        $scope.verifyForm.isClosed = true;
                    } else {
                        notificationsService.error("Error", "Invalid validation code.");
                    }
                }




                $scope.verifyForm.isLoading = false;
            },
            function (error) {
                notificationsService.error("Error", "Unable validate code.");
                $scope.verifyForm.isClosed = true;
                $scope.verifyForm.isLoading = false;
            });

    }

    $scope.submitRegistration = function () {
        $scope.verifyForm.isLoading = true;
        seoDashboardResource1902.registerInstance($scope.verifyForm).then(
             function (response) {
                 if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != "") {
                     notificationsService.error("Error", response.data.ErrorMessage);
                 } else {
                     notificationsService.success("Success", "Successfully subscribed.");
                     $scope.checkIsRegistered();
                 }

                 $scope.verifyForm.isClosed = true;
                 $scope.verifyForm.isLoading = false;
             },
             function (error) {
                 notificationsService.error("Error", "Unable submit subscription.");
                 $scope.verifyForm.isClosed = true;
                 $scope.verifyForm.isLoading = false;
             });
    }

    $scope.closeVerificationFormPopUp = function () {
        $scope.verifyForm.isClosed = true;
    }

    $scope.openVerificationFormOpen = function () {
        if (!$scope.verify.isActivated) {
            $scope.verifyForm.isClosed = false;
            if ($scope.verifyForm.countries != undefined && $scope.verifyForm.countries.length <= 0) {
                $scope.verifyForm.countries = seoDashboardResource1902.getAllCountries();
            }
            $scope.verifyForm.email = '';
            $scope.verifyForm.countryCode = '';
            $scope.verifyForm.isAcceptTerms = false;
        } else {
            seoDashboardResource1902.validateIsRegistered().then(
                     function (response) {
                         if (!response.data.Data.IsRegistered) {
                             $scope.verifyForm.isClosed = false;
                             if ($scope.verifyForm.countries != undefined && $scope.verifyForm.countries.length <= 0) {
                                 $scope.verifyForm.countries = seoDashboardResource1902.getAllCountries();
                             }
                             $scope.verifyForm.email = '';
                             $scope.verifyForm.countryCode = '';
                             $scope.verifyForm.isAcceptTerms = false;
                         }
                     });
        }
    }

    $scope.resendVerification = function () {
        if ($scope.verifyForm.resendCodeTimer <= 0) {
            seoDashboardResource1902.regenerateCode().then(function (response) {
                if (response.data.ErrorMessage != null && response.data.ErrorMessage != '') {
                    notificationsService.error("info", response.data.ErrorMessage);
                } else {
                    notificationsService.success("Success", "Resending email verification.");
                    $scope.verifyForm.resendCodeTimer = 60;
                }
            }, function (error) {
                notificationsService.error("Error", "Unable to resend code verification.");
            });
        }
    }

    $scope.searching = function (event) {
        if (event.keyCode == 13) {
            $scope.getPages(1);
            $scope.pages.isSearching = false;
        } else if (event.keyCode == 9 || event.keyCode == 27) {
            $scope.pages.isSearching = false;
        }
        else {
            $scope.pages.isSearching = true;
        }
    }

    $scope.searchOutFocus = function () {
        setTimeout(function () {
            $scope.pages.isSearching = false;
        });

    }

    $scope.selectAutoComplete = function (selected) {
        $scope.pages.filter.Search = selected;
        $scope.pages.isSearching = false;
        $scope.getPages(1);

    }

    $scope.$watch('pages.filter.PageSize', function () {
        if (!$scope.pages.initializing) {
            SetCookieValue(pageSizeCookieKey, $scope.pages.filter.PageSize);
            $scope.getPages(1);
        }
    });

    $scope.$watch('pages.filter.LanguageUniqueId', function () {
        if (!$scope.pages.initializing) {
            SetCookieValue(pageLanguageCookieKey, $scope.pages.filter.LanguageUniqueId);
            $scope.pages.filter.Search = "";
            $scope.getPages(1);
            $scope.getGlobalOpenGraphSettings();
        }
    });


        $scope.$watch('indexing.isIndexAll', function () {

        });

    $scope.checkIndexAll = function () {

        $timeout(function () {
            if ($scope.indexing.isIndexAll) {
                if (confirm("This will set ALL pages within your site to be indexed and follow by search engines. Are you sure you want to continue?")) {
                    $scope.pages.data.forEach(function (data) {

                        data.Index = $scope.indexing.isIndexAll;
                    });
                    return;
                }
            } else {
                if (confirm("This will set ALL pages within your site to be NOT indexed and NOT follow by search engines. Are you sure you want to continue?")) {
                    $scope.pages.data.forEach(function (data) {

                        data.Index = $scope.indexing.isIndexAll;
                    });
                    return;
                }
            }

            $scope.indexing.isIndexAll = !$scope.indexing.isIndexAll;
            return;

        });
    }

    $scope.getDocumentTypes = function () {
        $scope.documentTypes.loading = true;
        $scope.documentTypes.filter.Page = $scope.documentTypes.filter.Page + 1; //increment page on request
        seoDashboardResource1902.getDocumentTypes($scope.documentTypes.filter)
        .then(
        function (response) {

            response.data.Data.Data.forEach(function (data) {
                $scope.documentTypes.data.push(data);
            });

            $scope.documentTypes.count = response.data.Data.Count;
            $scope.documentTypes.loading = false;
            $scope.documentTypes.isCheckAllDocumentType = false;
            $scope.pages.initializing = false;
        },
        function (error) {
            $scope.documentTypes.loading = false;
            pages.initializing = false;
        }
        );
    }

    $scope.getLessDocumentType = function () {
        var itemToBeRemoved = $scope.documentTypes.data.length - $scope.documentTypes.filter.PageSize
        $scope.documentTypes.data.splice($scope.documentTypes.filter.PageSize, itemToBeRemoved);
        $scope.documentTypes.filter.Page = 1;

    }

    $scope.getLanguages = function () {
        $scope.languages.loading = true;
        $scope.languages.data = [];
        seoDashboardResource1902.getLanguages().then(
        function (response) {
            $scope.languages.data = response.data;
            if (response.data.length > 0) {
                if (GetCookieValue(pageLanguageCookieKey) == '') {
                    SetCookieValue(pageLanguageCookieKey, $scope.languages.data[0].UniqueId);
                }
                $scope.pages.filter.LanguageUniqueId = GetCookieValue(pageLanguageCookieKey)
                $scope.getPages(1);
                $scope.getGlobalOpenGraphSettings();
                $scope.languages.loading = false;
            }
        }
        );
    }

    $scope.getPages = function (pageNumber) {
        var currentParentId = 0;
        $scope.pages.loading = true;
        $scope.pages.filter.Page = pageNumber;
        seoDashboardResource1902.getPages($scope.pages.filter)
        .then(
        function (response) {
            $scope.pages.data = [];
            $scope.pages.data = response.data.Data.Data;
            $scope.setPagePaging(pageNumber, response.data.Data.Count);

            if ($scope.indexing.isIndexAll != $scope.isIndexAllOrigValue) {
                $scope.pages.data.forEach(function (data) {
                    data.Index = $scope.indexing.isIndexAll;
                });
            }


            $scope.pages.loading = false;
        },
        function (error) {
            $scope.pages.loading = false;
        }
        );


    }

    $scope.setPagePaging = function (currentPage, count) {

        var pageCount = Math.floor(count / $scope.pages.filter.PageSize);
        if (count % $scope.pages.filter.PageSize > 0) {
            pageCount += 1;
        }



        if (currentPage == 1) {
            $scope.pages.paging = [];
            for (var i = 1; i <= pageCount; i++) {
                var pagingDetail = {
                    isActive: i == currentPage,
                    pageNumber: i,
                    isFirst: i == 1,
                    isLast: i == pageCount,
                    group: (Math.floor(i / pagingGroupSize) + 1) - (i % pagingGroupSize == 0 ? 1 : 0)
                }
                $scope.pages.paging.push(pagingDetail)
            }
        } else {

            var activeIndex = $scope.pages.paging.findIndex(function (item) { return item.isActive == true; });
            var activeData = $scope.pages.paging[activeIndex];
            activeData.isActive = false;

            var index = $scope.pages.paging.findIndex(function (item) { return item.pageNumber == currentPage; });
            var data = $scope.pages.paging[index];
            data.isActive = true;



        }


        $scope.pages.activePagingGroup = (Math.floor(currentPage / pagingGroupSize) + 1) - (currentPage % pagingGroupSize == 0 ? 1 : 0);
        $scope.pages.lastPagingGroup = Math.floor($scope.pages.paging.length / pagingGroupSize) + 1;
    }

    $scope.getPagePagingSet = function (action) {
        var lastGroupId = Math.floor($scope.pages.paging.length / pagingGroupSize) + 1;
        if (action == 'first') {
            $scope.pages.activePagingGroup = 1;
        } else if (action == 'prev') {
            if ($scope.pages.activePagingGroup == 1) {
                $scope.pages.activePagingGroup = 1;
            } else {
                $scope.pages.activePagingGroup = $scope.pages.activePagingGroup - 1;
            }
        } else if (action == 'next') {
            if ($scope.pages.activePagingGroup == lastGroupId) {
                $scope.pages.activePagingGroup = lastGroupId;
            } else {
                $scope.pages.activePagingGroup = $scope.pages.activePagingGroup + 1;
            }
        } else if (action == 'last') {
            $scope.pages.activePagingGroup = lastGroupId;
        }

    }

        $scope.checkAllDocumentType = function () {
            $timeout(function () {
        $scope.documentTypes.data.forEach(function (row) {
            row.IsVisible = $scope.documentTypes.isCheckAllDocumentType;
                });
            });
    }

        $scope.checkDocumentType = function (id) {
            $timeout(function () {
                var index = $scope.documentTypes.data.findIndex(function (item) { return item.Id == id; });
                var data = $scope.documentTypes.data[index];
                if (data.IsVisible == false) {
                    $scope.documentTypes.isCheckAllDocumentType = false;
                }
            });
    }



    $scope.removeKeyword = function (id, keyword) {
        var index = $scope.pages.data.findIndex(function (item) { return item.Id == id; });
        var data = $scope.pages.data[index];
        var keywordIndex = data.Keywords.findIndex(function (item) { return item == keyword; });
        data.Keywords.splice(keywordIndex, 1);
    }

    $scope.openGlobalSettings = function () {
        var languageUniqueId = $scope.pages.filter.LanguageUniqueId;
        var languageIndex = $scope.languages.data.findIndex(function (item) { return item.UniqueId == languageUniqueId; });
        var languageDisplay = "";
        if (languageIndex > -1) {
            languageDisplay = $scope.languages.data[languageIndex].DisplayLanguage
        }

        editorService.open({
            title: "Global Open Graph Settings", size: "small", view: "/App_Plugins/1902Seo/Dashboard/1902GlobalSettings.html", show: true, dialogData: { LanguageUniqueId: $scope.pages.filter.LanguageUniqueId, LanguageDisplay: languageDisplay },
            submit: function (data) {
                $scope.getPages(1);
            }
        });
    }

    $scope.openGlobalBusinessSchema = function () {
        var languageUniqueId = $scope.pages.filter.LanguageUniqueId;
        var languageIndex = $scope.languages.data.findIndex(function (item) { return item.UniqueId == languageUniqueId; });
        var languageDisplay = "";
        if (languageIndex > -1) {
            languageDisplay = $scope.languages.data[languageIndex].DisplayLanguage
        }

        editorService.open({
            title: "Global Business Schema", size: "small", view: "/App_Plugins/1902Seo/Dashboard/1902GlobalBusinessSchema.html", dialogData: { LanguageUniqueId: $scope.pages.filter.LanguageUniqueId, LanguageDisplay: languageDisplay }, submit: function (data) {
                $scope.getPages(1);
            }
        });
    }

    $scope.openSchemaBuilder = function (type) {
        editorService.open({
            title: "Schema", view: "/App_Plugins/1902Seo/Dashboard/1902Schema.html", size: "small",dialogData: { Type: type }
        });
    }

    $scope.getGlobalOpenGraphSettings = function () {
        seoDashboardResource1902.getGlobalOpenGraphSettings($scope.pages.filter.LanguageUniqueId).then(
              function (response) {
                  $scope.indexing.isIndexAll = response.data.IsSetToIndex;
                  $scope.isIndexAllOrigValue = response.data.IsSetToIndex;
                  $scope.isOgDefault = response.data.OgTitle != undefined && response.data.OgTitle != null && response.data.OgTitle != "";
                  $scope.isTwitterDefault = response.data.TwitterTitle != undefined && response.data.TwitterTitle != null && response.data.TwitterTitle != "";
                  $scope.isGooglePlusDefault = response.data.GoogleTitle != undefined && response.data.GoogleTitle != null && response.data.GoogleTitle != "";
              },
              function (error) {
                  notificationsService.error("Error", "Unable to get global opengraph settings.");
              });
    }

    $scope.refresh = function () {
        $scope.getGlobalOpenGraphSettings();
        $scope.documentTypes.data = [];
        $scope.documentTypes.filter.Page = 0;
        $scope.getDocumentTypes();
        $scope.getPages(1);
    }

    $scope.saveAll = function () {
        if (confirm("Are you sure you want to save all changes?")) {


            $scope.isSavingAll = true;
            $scope.pages.loading = true;
            $scope.documentTypes.loading = true;
            seoDashboardResource1902.saveAll($scope.pages.data,
                $scope.documentTypes.data,
                $scope.indexing.isIndexAll,
                $scope.google.goolePlusPage,
                $scope.pages.filter.LanguageUniqueId).then(
                  function (respose) {
                      notificationsService.success("Success", "Successfully saved.");
                      $scope.getPages(1);
                      $scope.getDocumentTypes();
                      $scope.getGlobalOpenGraphSettings();
                      $scope.isSavingAll = false;
                  },
                  function (error) {
                      notificationsService.error("Error", "Unable save dashboard.");
                      $scope.isSavingAll = false;
                  });
        }
    }

    $scope.generateHint = function (content, url, urlText) {
        return commonFactory1902Seo.hintBuilder(content, "left", url, urlText).innerHTML;
    }

    $scope.importSeoPlus = function (byPassConfirm) {
        var isSkipConfirm = byPassConfirm == undefined ? false : byPassConfirm;

        if (isSkipConfirm || confirm("Are you sure you want to import SEO settings?")) {
            $scope.import.message = '';
            seoDashboardResource1902.importSeoPlus().
            then(function (response) {
                if (response.data.ErrorMessage == null || response.data.ErrorMessage == "") {
                    $scope.importProgess()
                } else {
                    notificationsService.warning("Warning", response.data.ErrorMessage);
                }
            });

            $timeout(function () {
                $scope.importProgess();
            }, 1200);
        }
    }

    $scope.importProgess = function () {
        seoDashboardResource1902.importProgess()
            .then(function (response) {
                if (response.data.Success) {
                    $scope.import.totalCount = response.data.Data.Total;
                    $scope.import.currentCount = response.data.Data.Current;
                    $scope.import.isProcessing = response.data.Data.IsProcessing;
                    $scope.import.isGeneratingReport = response.data.Data.IsGeneratingReport;
                    if ($scope.import.totalCount == $scope.import.currentCount
                    && $scope.import.totalCount != 0 && $scope.import.currentCount != 0
                     ) {
                        $scope.import.message = "Complete";

                        $scope.startUp.isImportComplete = true;
                        $scope.getPages(1);
                        GetGooglePublisherPage();
                    }

                    if (!$scope.import.hasDuplicate) {
                        $scope.import.hasDuplicate = response.data.Data.HasDuplicate;
                    }

                    if (response.data.Data.IsProcessing) {

                        $timeout(function () {
                            $scope.importProgess();
                        }, 1200);
                    } else {
                        $scope.getImportFileInfo();
                    }


                }
            }, function () {
                notificationsService.error("Error", "Unable to get progress.");
            });

    }

        $scope.focusTab = function () {
        if ($location.$$search.f != undefined && $location.$$search.f == '1902') {
            var tabs = document.querySelectorAll('.umb-nav-tabs li a:not(.dropdown-toggle)')
            tabs.forEach(function (tab) {
                if (tab.innerHTML == "1902 SEO+") {
                    tab.click();
                    $scope.openVerificationFormOpen();
                }
            });
        } else if ($location.$$search.f != undefined && $location.$$search.f == '1902a') {
            var tabs = document.querySelectorAll('.umb-nav-tabs li a:not(.dropdown-toggle)')
            tabs.forEach(function (tab) {
                if (tab.innerHTML == "1902 SEO+") {
                    tab.click();
                }
            });
        }
    }



    $scope.startStartUpImport = function () {
        seoDashboardResource1902.processFirstTimeScrapper().then(function (response) {
            if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != '') {
                notificationsService.error("Error", response.data.ErrorMessage);
            }
            $scope.importSeoPlus(true); //start process seo plus   

        });
    }

    $scope.checkAndTryEnable1902Seo = function () {

        if (confirm("This will rescan your pages for existing SEO properties and may take a while. Continue??")) {
            seoDashboardResource1902.checkAndEnableSEO(false).then(function (response) {

                if (response.data.ErrorMessage != null && response.data.ErrorMessage != "") {
                    notificationsService.warning("Warning", response.data.ErrorMessage);
                }
            });

            $timeout(function () {
                $scope.checkProgress(false);
            }, 1200);
        }
    };

    $scope.checkAndEnable1902SEo = function () {
        if ($scope.check.confirmationText.toLowerCase() == "yes") {
            if (confirm("Click OK to enable 1902 SEO+. We will scan your pages for existing SEO properties and may take a while depending on the number of pages on your website. We will provide a summary report (CSV file) after the scan which you can download anytime. \n\nOnce scanning is complete, 1902 SEO+ will be automatically enabled and you can start managing your SEO settings.")) {
                seoDashboardResource1902.checkAndEnableSEO(true).then(function (response) {
                    if (response.data.ErrorMessage != null && response.data.ErrorMessage != "") {
                        notificationsService.warning("Warning", response.data.ErrorMessage);
                    }
                });

                $timeout(function () {
                    $scope.checkProgress(true);
                }, 1200);
            }
        }
    }

    function CheckStatus() {
        seoDashboardResource1902.checkStatus().then(function (response) {
            $scope.check.latest.hasDuplicate = response.data.HasDuplicate;
        }, function (error) {
            notificationsService.warning("Error", "Unable to get check latest status");
        });

    }

    $scope.getImportFileInfo = function () {
        seoDashboardResource1902.getFileSummary(false)
            .then(function (response) {
                $scope.import.summaryFile.CreatedDate = response.data.ParsedDate;
                $scope.import.summaryFile.Path = response.data.PathUrl;
            }, function (error) {
                notificationsService.error("Error", "Unable to get import file summary.");
                console.log(error);
            });
    };

    $scope.getCheckFileInfo = function () {
        seoDashboardResource1902.getFileSummary(true)
            .then(function (response) {
                $scope.check.summaryFile.CreatedDate = response.data.ParsedDate;
                $scope.check.summaryFile.Path = response.data.PathUrl;
            }, function (error) {
                notificationsService.error("Error", "Unable to get check file summary.");
                console.log(error);
            });
    };

    $scope.checkProgress = function (isForcedEnabled) {
        seoDashboardResource1902.checkProgress(isForcedEnabled)
           .then(function (response) {
               if (response.data.Success) {
                   $scope.check.totalCount = response.data.Data.Total;
                   $scope.check.currentCount = response.data.Data.Current;
                   $scope.check.isProcessing = response.data.Data.IsProcessing;
                   $scope.check.isGeneratingReport = response.data.Data.IsGeneratingReport;

                   if (!$scope.check.hasDuplicate && response.data.Data.HasDuplicate) {
                       $scope.check.hasDuplicate = response.data.Data.HasDuplicate;
                   }

                   if ($scope.check.totalCount == $scope.check.currentCount
                  && $scope.check.totalCount != 0 && $scope.check.currentCount != 0) {

                       if ($scope.check.hasDuplicate) {
                           $scope.check.errorMessage = "Scan completed but 1902 SEO+ detected multiple tags on pages listed in the downloadable report";
                           $scope.check.message = "";
                           notificationsService.warning("Warning", "Scan completed but 1902 SEO+ detected multiple tags on pages listed in the downloadable report.");
                       } else {
                           $scope.check.errorMessage = "";
                           $scope.check.message = "Scanning is complete.";
                           notificationsService.success("Success", "Scanning is complete.");
                       }
                   }

                   if (response.data.Data.IsProcessing) {
                       $timeout(function () {

                           $scope.checkProgress(isForcedEnabled);
                           if (isForcedEnabled) {
                               GetEnabledStatus();
                           }
                       }, 1200);
                   } else {
                       GetEnabledStatus();
                       $scope.getCheckFileInfo();
                       CheckStatus();
                   }
               }
           }, function () {
               notificationsService.error("Error", "Unable to get progress.");
           });
    };
    $scope.startUpFinish = function () {
        seoDashboardResource1902.finishStartUp().then(function (response) {
            if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != '') {
                notificationsService.error("Error", response.data.ErrorMessage);
            }
            StartUpValidation();
        });
    }

    $scope.disableSeo = function () {
        if (confirm("Disable 1902 seo?")) {
            seoDashboardResource1902.disableSeo().then(function (response) {
                if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != '') {
                    notificationsService.error("Error", response.data.ErrorMessage);
                } else {
                    notificationsService.warning("Warning", "1902 SEO+ is now disabled.");
                }
                seoCommonResourceSeo1902.getStartUpStatus().then(function (response) {
                    $scope.startUp.isEnabled = response.data.IsEnabled;
                });
                $scope.check.message = '';
                $scope.check.errorMessage = '';
                $scope.check.confirmationText = '';

            }, function () {
                notificationsService.error("Error", "Unable to disable 1902 seo+");
            });
        }

    }



    StartUpValidation();

});


angular.module("umbraco")
    .controller("seoDasgboardGlobalSettings.controller", function ($scope, seoDashboardResource1902, notificationsService, editorService, mediaHelper, userService, entityResource, commonFactory1902Seo, $timeout, mediaResource) {
        $scope.model = {
            images: [],
            imageIds: [],
            imageStartNodeId: '',
            imageMaxKb: 4000,
            imageMaxKbDisplay: '',
            imageIdealWidth: 1200,
            imageIdealHeight: 630,
            imageValue: '',
            imageSetAsDefault: false,
            ogTitle: '',
            ogDescription: '',
            twitterTitle: '',
            twitterDescription: '',
            googleTitle: '',
            googleDescription: '',
            warningMessage: '',
            LanguageUniqueId: $scope.model.dialogData.LanguageUniqueId,
            overWriteAll: false,
            LanguageDisplay: $scope.model.dialogData.LanguageDisplay,
            saving: false,
            loading: false,
            submit :  $scope.model.submit
        }

        $scope.model.imageMaxKbDisplay = $scope.model.imageMaxKb > 1000 ? Math.floor($scope.model.imageMaxKb / 1000) + ' mb' : $scope.model.imageMaxKb + ' kb';
        $scope.close = function () {
            editorService.close();
        }
        $scope.getMaxUploadKb = function () {
            $scope.model.loading = true;
            seoDashboardResource1902.getMaxUploadKb().then(function (response) {
                $scope.model.imageMaxKb = response.data;
                $scope.model.imageMaxKbDisplay = $scope.model.imageMaxKb > 1000 ? Math.floor($scope.model.imageMaxKb / 1000) + ' mb' : $scope.model.imageMaxKb + ' kb';
                $scope.getGlobalOpenGraphSettings();
                $scope.model.loading = false;
            }, function (error) {
                notificationsService.error("Error", "Unable to get max upload limit.");
                $scope.getGlobalOpenGraphSettings();
                $scope.model.loading = false;
            });

        }

        $scope.getGlobalOpenGraphSettings = function () {
            $scope.model.loading = true;
            seoDashboardResource1902.getGlobalOpenGraphSettings($scope.model.LanguageUniqueId).then(
                function (response) {
                    $scope.model.ogTitle = response.data.OgTitle,
                        $scope.model.ogDescription = response.data.OgDescription,
                        $scope.model.twitterTitle = response.data.TwitterTitle,
                        $scope.model.twitterDescription = response.data.TwitterDescription,
                        $scope.model.googleTitle = response.data.GoogleTitle,
                        $scope.model.googleDescription = response.data.GoogleDescription,
                        $scope.model.imageValue = response.data.DefaultImage,
                        $scope.model.hasMultipleLanguage = response.data.HasMultipleLanguage
                    setupViewModel();
                    $scope.model.loading = false;

                },
                function (error) {
                    $scope.model.loading = false;
                    notificationsService.error("Error", "Unable to get global opengraph settings.");
                    editorService.closeAll();
                });
        }




        $scope.save = function () {
            if ($scope.Settings.$valid) {
                $scope.model.saving = true;
                seoDashboardResource1902.saveGlobalOpenGraphValues($scope.model).then(
                    function (response) {
                        if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != '') {
                            notificationsService.Error("Error", response.data.ErrorMessage);
                        } else {
                            $scope.model.submit($scope.model); // this will trigger callback               
                            notificationsService.success("Success", "Page global open graph property updated.");
                            $scope.model.saving = false;
                            editorService.closeAll();
                        }
                    },
                    function (error) {
                        notificationsService.error("Error", "Unable to update page global open graph property.");
                        $scope.model.saving = false;
                    });
                $scope.model.dirtyClass = '';
            } else {
                angular.forEach($scope.Settings.$error.required, function (field) {
                    field.$dirty = true;
                    field.$pristine = false;
                    $scope.model.setDirty = true;
                });
            }
        }


        $scope.applyAllVerify = function () {
            $timeout(function () {
            if ($scope.model.overWriteAll == true && confirm("This will override the open graph values you have set for individual pages on your site. Are you sure you want to continue?")) {
                return;
            } else if ($scope.model.overWriteAll == false) {
                return;
            }
            $scope.model.overWriteAll = !$scope.model.overWriteAll;
                return;
            });
        }

        $scope.generateHint = function (content) {
            return commonFactory1902Seo.hintBuilder(content).innerHTML;
        }



        /*-------------MEDIA PICKER---------------*/
        function setupViewModel() {
            $scope.model.images = [];
            $scope.model.imageIds = [];

            if ($scope.model.imageValue) {
                var ids = $scope.model.imageValue.split(',');
                mediaResource.getByIds(ids).then(function (medias) {
                _.each(medias, function (media, i) {
                    if (media !== null) {
                        var properties = media.tabs[0].properties;
                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFile(media, true)
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.model.imageMaxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.model.images.push(media);
                             $scope.model.imageIds.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.model.imageIdealWidth || parseFloat(heightProperty.value) > $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.model.imageIdealWidth || parseFloat(heightProperty.value) < $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }
                    }
                });
                $scope.sync();
            });
            }
        }


        $scope.sync = function () {
            $scope.model.imageValue = $scope.model.imageIds.join();
        };


        $scope.showAdd = function () {
            if ($scope.model.imageValue && $scope.model.imageValue !== "") {
                return false;
            }
            return true;
        };

        if (!$scope.model.imageStartNodeId) {
            userService.getCurrentUser().then(function (userData) {
                $scope.model.imageStartNodeId = userData.startMediaId;
            });
        }


        $scope.remove = function (index) {
            $scope.model.images.splice(index, 1);
            $scope.model.imageIds.splice(index, 1);
            $scope.model.warningMessage = '';
            $scope.sync();
        }

       

    $scope.add = function () {

        editorService.mediaPicker({
            startNodeId: $scope.model.imageStartNodeId,
            multiPicker: false,
            submit: function (data) {
                $scope.model.warningMessage = "";
                $scope.model.images = []; //reset currenly selected image
                $scope.model.imageIds = [];//reset currenly selected image
                data = [data.selection[0]];

                _.each(data, function (media, i) {
                    mediaResource.getById(media.id).then(function (mediaRes) {
                        var properties = mediaRes.tabs[0].properties;


                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFileFromEntity(media, true);
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.model.imageMaxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.model.images.push(media);
                             $scope.model.imageIds.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.model.imageIdealWidth || parseFloat(heightProperty.value) > $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.model.imageIdealWidth || parseFloat(heightProperty.value) < $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }

                        $scope.sync();
                        editorService.close();

                    });
                });
             
            },
            close: function () {
                editorService.close();
            }
        });
    }


    $scope.getMaxUploadKb();

    /*-------------MEDIA PICKER---------------*/


});

angular.module("umbraco")
    .controller("seoDashboardGlobalBusinessSchema.controller", function ($scope, seoDashboardResource1902, notificationsService, commonFactory1902Seo, editorService, userService, entityResource, mediaHelper, mediaResource) {

    $scope.model = {
        saving: false,
        daysCheckAll: false,
        days: [{
            key: "Mo",
            value: "Monday",
            selected: false,
            open: '',
            close: ''
        }, {
            key: "Tu",
            value: "Tuesday",
            selected: false,
            open: '',
            close: ''
        }, {
            key: "We",
            value: "Wednesday",
            selected: false,
            open: '',
            close: ''
        }, {
            key: "Th",
            value: "Thursday",
            selected: false,
            open: '',
            close: ''
        }, {
            key: "Fr",
            value: "Friday",
            selected: false,
            open: '',
            close: ''
        }, {
            key: "Sa",
            value: "Saturday",
            selected: false,
            open: '',
            close: ''
        }, {
            key: "Su",
            value: "Sunday",
            selected: false,
            open: '',
            close: ''
        }
        ], contactTypes: [
            "Customer Support",
            "Technical Support",
            "Billing Support",
            "Bill Payment",
            "Sales",
            "Reservations",
            "Credit Card Support",
            "Emergency",
            "Baggage Tracking",
            "Roadside Assistance",
            "Package Tracking"
        ],
        daysOptionClosed: true,
        languageUniqueId: $scope.model.dialogData.LanguageUniqueId,
        languageDisplay: $scope.model.dialogData.LanguageDisplay,
        images: [],
        imageIds: [],
        imageStartNodeId: '',
        imageMaxKb: 4000,
        imageMaxKbDisplay: '',
        imageIdealWidth: 100,
        imageIdealHeight: 120,
        imageValue: '',
        ContactTypeInput: '',
        ContactTelephoneInput: '',
        ContactEmailInput: '',
        emailValidation: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        scriptPatern: /<script[^>]*>[^<]*<[\/]script>/,
        countries: [],
        loading: false,
        inputFounders: '',
        inputBrands: '',
        inputSameAs: '',
        submit: $scope.model.submit
    }

    $scope.getCountries = function () {
        $scope.model.countries = seoDashboardResource1902.getAllCountries();
        }

        $scope.close = function () {
            editorService.close();
        }

    $scope.$watch('model.daysCheckAll', function () {
        $scope.model.days.forEach(function (data) {
            data.selected = $scope.model.daysCheckAll;
        });
    });

    $scope.getCountries();

    $scope.save = function () {

        if ($scope.globalSchema.$valid) {
            $scope.model.saving = true;
            $scope.model.BusinessSchema.OpeningDays = [];
            $scope.model.days.forEach(function (data) {
                if (data.selected) {
                    $scope.model.BusinessSchema.OpeningDays.push(data.key);
                }
            });

            if ($scope.model.inputFounders != undefined
                && $scope.model.inputFounders != null
                && $scope.model.inputFounders.trim() != '') {
                $scope.model.BusinessSchema.Founders.push($scope.model.inputFounders);
            }

            if ($scope.model.inputBrands != undefined
                && $scope.model.inputBrands != null
                && $scope.model.inputBrands.trim() != '') {
                $scope.model.BusinessSchema.Brands.push($scope.model.inputBrands);
            }

            if ($scope.model.inputSameAs != undefined
                && $scope.model.inputSameAs != null
                && $scope.model.inputSameAs.trim() != '') {
                $scope.model.BusinessSchema.SameAS.push($scope.model.inputSameAs);
            }


            if ($scope.model.ContactEmailInput != ''
                || $scope.model.ContactTypeInput != ''
                || $scope.model.ContactTelephoneInput != '') {
                var data = {
                    ContactType: $scope.model.ContactTypeInput,
                    ContactTelephone: $scope.model.ContactTelephoneInput,
                    ContactEmail: $scope.model.ContactEmailInput
                }

                $scope.model.BusinessSchema.ContactPoints.push(data);

            }

            seoDashboardResource1902.saveGlobalBusinessSchema($scope.model.BusinessSchema).then(
            function (response) {
                $scope.model.submit($scope.model); // this will trigger callback
                editorService.closeAll();
                notificationsService.success("Success", "Global business schema updated.");
                $scope.model.saving = false;

            },
            function (error) {
                notificationsService.error("Error", "Unable to update global business schema updated.");
                $scope.model.saving = false;
            });
            $scope.model.dirtyClass = '';
        } else {
            angular.forEach($scope.globalSchema.$error.required, function (field) {
                field.$dirty = true;
                field.$pristine = false;
                $scope.model.setDirty = true;
            });
        }
    };

    $scope.saveCustom = function () {
        if ($scope.customGlobalSchema.$valid) {
            seoDashboardResource1902.saveGlobalBusinessSchema($scope.model.BusinessSchema).then(
                       function (response) {
                           $scope.model.submit($scope.model); // this will trigger callback
                           editorService.closeAll();
                           notificationsService.success("Success", "Global business schema updated.");
                           $scope.model.saving = false;

                       },
                       function (error) {
                           notificationsService.error("Error", "Unable to update global business schema updated.");
                           $scope.model.saving = false;
                           editorService.closeAll();
                       });
        }
    }


    $scope.getGlobalSchemaSettings = function () {
        $scope.model.loading = true;
        seoDashboardResource1902.getGlobalSchemaSettings($scope.model.LanguageUniqueId).then(
           function (response) {
               $scope.model.BusinessSchema = response.data;
               $scope.model.days.forEach(function (data) {
                   $scope.model.BusinessSchema.OpeningDays.forEach(function (data2) {
                       if (data.key == data2) {
                           data.selected = true;
                       }
                   });
               });

               setupViewModelGlobalSchema();
               $scope.model.loading = false;


           },
           function (error) {
               $scope.model.loading = false;
               notificationsService.error("Error", "Unable to get global business schema settings.");
           });
    };




    $scope.openDaysOptions = function () {
        $scope.model.daysOptionClosed = !$scope.model.daysOptionClosed;
    }
    $scope.containerClick = function () {
        $scope.model.daysOptionClosed = true;
    }

    $scope.generateHint = function (content) {
        return commonFactory1902Seo.hintBuilder(content).innerHTML;
    }






    $scope.AddContactPoint = function () {

        if ($scope.model.ContactTelephoneInput == '' && $scope.model.ContactTypeInput == '' && $scope.model.ContactEmail == '') {
            return;
        }

        if ($scope.model.ContactEmailInput != '' && !$scope.model.ContactEmailInput.match($scope.model.emailValidation)) {
            notificationsService.warning("Warning", "Invalid email.");
            return;
        }

        var data = {
            ContactType: $scope.model.ContactTypeInput,
            ContactTelephone: $scope.model.ContactTelephoneInput,
            ContactEmail: $scope.model.ContactEmailInput
        }




        $scope.model.BusinessSchema.ContactPoints.push(data);

        $scope.model.ContactTypeInput = '';
        $scope.model.ContactTelephoneInput = '';
        $scope.model.ContactEmailInput = '';
    }

    $scope.RemoveContactPoint = function (index) {
        $scope.model.BusinessSchema.ContactPoints.splice(index, 1);

    }

    $scope.ValidateEmailContactPoint = function (index) {

        if (index == undefined) {
            var data = $scope.model.ContactEmailInput;
            if (data == undefined || (data != '' && !data.match($scope.model.emailValidation))) {
                notificationsService.warning("Warning", "Invalid email.");
                $scope.model.ContactEmailInput = "";
                return;
            }
        } else {
            var data = $scope.model.BusinessSchema.ContactPoints[index];
            if (data.ContactEmail == undefined || (data.ContactEmail != '' && !data.ContactEmail.match($scope.model.emailValidation))) {
                notificationsService.warning("Warning", "Invalid email.");
                data.ContactEmail = "";
                return;
            }
        }



    }




    /*-------------MEDIA PICKER---------------*/


    $scope.model.imageMaxKbDisplay = $scope.model.imageMaxKb > 1000 ? Math.floor($scope.model.imageMaxKb / 1000) + ' mb' : $scope.model.imageMaxKb + ' kb';

    $scope.getMaxUploadKb = function () {
        seoDashboardResource1902.getMaxUploadKb().then(function (response) {
            $scope.model.imageMaxKb = response.data;
            $scope.model.imageMaxKbDisplay = $scope.model.imageMaxKb > 1000 ? Math.floor($scope.model.imageMaxKb / 1000) + ' mb' : $scope.model.imageMaxKb + ' kb';
            $scope.getGlobalSchemaSettings();
        }, function (error) {
            notificationsService.error("Error", "Unable to get max upload limit.");
            $scope.getGlobalSchemaSettings();
        });

    }

    function setupViewModelGlobalSchema() {
        $scope.model.images = [];
        $scope.model.imageIds = [];

        if ($scope.model.BusinessSchema && $scope.model.BusinessSchema.Logo) {
            var ids = $scope.model.BusinessSchema.Logo.split(',');
            mediaResource.getByIds(ids).then(function (medias) {
                _.each(medias, function (media, i) {
                    if (media !== null) {
                        var properties = media.tabs[0].properties;
                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFile(media, true)
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.model.imageMaxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.model.images.push(media);
                             $scope.model.imageIds.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.model.imageIdealWidth || parseFloat(heightProperty.value) > $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.model.imageIdealWidth || parseFloat(heightProperty.value) < $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }
                    }
                });
                $scope.sync();
            });

        }
    }


    $scope.sync = function () {
        $scope.model.BusinessSchema.Logo = $scope.model.imageIds.join();
    };


    $scope.showAdd = function () {
        if ($scope.model.BusinessSchema && $scope.model.BusinessSchema.Logo && $scope.model.BusinessSchema.Logo !== "") {
            return false;
        }
        return true;
    };

    if (!$scope.model.imageStartNodeId) {
        userService.getCurrentUser().then(function (userData) {
            $scope.model.imageStartNodeId = userData.startMediaId;
        });
    }


    $scope.remove = function (index) {
        $scope.model.images.splice(index, 1);
        $scope.model.imageIds.splice(index, 1);
        $scope.model.warningMessage = '';
        $scope.sync();
    }

    $scope.add = function () {

        editorService.mediaPicker({
            startNodeId: $scope.model.imageStartNodeId,
            multiPicker: false,
            submit: function (data) {
                $scope.model.warningMessage = "";
                $scope.model.images = []; //reset currenly selected image
                $scope.model.imageIds = [];//reset currenly selected image
                data = [data.selection[0]];

                _.each(data, function (media, i) {
                    
                    mediaResource.getById(media.id).then(function (mediaRes) {
                        var properties = mediaRes.tabs[0].properties;


                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFileFromEntity(media, true);
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.model.imageMaxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.model.images.push(media);
                             $scope.model.imageIds.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.model.imageIdealWidth || parseFloat(heightProperty.value) > $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.model.imageIdealWidth || parseFloat(heightProperty.value) < $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }

                        $scope.sync();
                        editorService.close();

                    });
                });

         
            },
            close: function () {
                editorService.Close();
            }
        });
    }


    $scope.getMaxUploadKb();

    /*MEDIA PICKER*/














});

angular.module("umbraco").controller("seoDashboardSchema.controller", function ($scope, seoDashboardResource1902, notificationsService, editorService, commonFactory1902Seo) {
    $scope.model = {
        Type: $scope.model.dialogData.Type,
        Name: "",
        SchemaScript: "",
        LocalBusinesses: [],
        SelectedLocalBusiness: '',
        IsAdd: false,
        scriptPatern: /<script[^>]*>[^<]*<[\/]script>/,
        IsUpdate : false
    };


    $scope.close = function () {
        editorService.close();
    }

    $scope.getSchema = function () {
        seoDashboardResource1902.getSchema($scope.model).then(function (response) {

            $scope.model.Name = response.data.Name;
            $scope.model.SchemaScript = response.data.SchemaScript
            if (response.data.SchemaScript != undefined && response.data.SchemaScript != null && response.data.SchemaScript != '')
            {
                $scope.model.IsUpdate = true;
            }
                

        }, function (error) { });
    }

    $scope.getLocalBusineses = function () {
        seoDashboardResource1902.getLocalBusinesses().then(
            function (response) {
                $scope.model.LocalBusinesses = response.data;
            },
            function (error) {
                notificationsService.error("Error", "Unable to get list of local businesses.");
                console.log(error);
            });
    }

    $scope.needHelp = function () {
        editorService.open({
            title: "Schema Builder", view: "/App_Plugins/1902Seo/Dashboard/1902SchemaBuilder.html", size: "small", dialogData: { Type: $scope.model.Type }
        });
    };

    $scope.dropdownChange = function () {
        $scope.model.Name = $scope.model.SelectedLocalBusiness;
        $scope.getSchema();
    };

    $scope.save = function () {
        seoDashboardResource1902.saveSchema($scope.model).then(function (response) {
            if (response.data.ErrorMessage != undefined && response.data.ErrorMessage != null && response.data.ErrorMessage != "") {
                notificationsService.error("Error", response.data.ErrorMessage);
            } else {
                notificationsService.success("Success", "Schema saved.");
                editorService.close();
            }

        }, function (error) {

        });
    }

    $scope.cancelAddNew = function () {
        $scope.model.IsAdd = false;
        $scope.model.Name = "";
        $scope.model.SchemaScript = "";
        $scope.model.SelectedLocalBusiness = "";
    }

    $scope.addNew = function () {
        $scope.model.IsAdd = true;
        $scope.model.Name = "";
        $scope.model.SchemaScript = "";
    }

    $scope.reset = function () { }

    if ($scope.model.Type == 1) {
        $scope.getSchema();
    } else if ($scope.model.Type == 2) {
        $scope.getLocalBusineses();
    }
    $scope.generateHint = function (content) {

        return commonFactory1902Seo.hintBuilder(content).innerHTML;
    }



});
angular.module("umbraco")
    .controller("seoDashboardSchemaBuilder.controller", function ($scope, seoDashboardResource1902, notificationsService, commonFactory1902Seo, editorService, userService, entityResource, mediaHelper, $timeout, mediaResource) {

    $scope.model = {
        type: $scope.model.dialogData.Type,
        saving: false,
        daysCheckAll: false,
        days: [{
            key: "Mo",
            value: "Monday",
            selected: false
        }, {
            key: "Tu",
            value: "Tuesday",
            selected: false
        }, {
            key: "We",
            value: "Wednesday",
            selected: false
        }, {
            key: "Th",
            value: "Thursday",
            selected: false
        }, {
            key: "Fr",
            value: "Friday",
            selected: false
        }, {
            key: "Sa",
            value: "Saturday",
            selected: false
        }, {
            key: "Su",
            value: "Sunday",
            selected: false
        }
        ], contactTypes: [
            "Customer Support",
            "Technical Support",
            "Billing Support",
            "Bill Payment",
            "Sales",
            "Reservations",
            "Credit Card Support",
            "Emergency",
            "Baggage Tracking",
            "Roadside Assistance",
            "Package Tracking"
        ],
        daysOptionClosed: true,
        images: [],
        imageIds: [],
        imageStartNodeId: '',
        imageMaxKb: 4000,
        imageMaxKbDisplay: '',
        imageIdealWidth: 100,
        imageIdealHeight: 120,
        imageValue: '',
        ContactTypeInput: '',
        ContactTelephoneInput: '',
        ContactEmailInput: '',
        emailValidation: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i,
        scriptPatern: /<script[^>]*>[^<]*<[\/]script>/,
        qeuryStringPatern: /^((\/)?(\w+))*?(\/)?\?((\w*)(-)*)*?(\w+)=$/,
        countries: [],
        loading: false,
        inputFounders: '',
        inputBrands: '',
        inputSameAs: ''
    }

    $scope.getCountries = function () {
        $scope.model.countries = seoDashboardResource1902.getAllCountries();
    }

    $scope.$watch('model.daysCheckAll', function () {
        $scope.model.days.forEach(function (data) {
            data.selected = $scope.model.daysCheckAll;
        });
    });

    $scope.getCountries();



    $scope.copy = function (id) {
        document.getElementById(id).select()
        document.execCommand("copy");
        notificationsService.success("Success", "Generated schema is now in your clipboard");
    }
    $scope.getSettingsModel = function () {
        seoDashboardResource1902.getSchemaModel().then(function (response) {
            $scope.model.BusinessSchema = response.data;
        });
    };


    $scope.generateBasicSchema = function () {
        var type = $scope.model.type;
        $scope.model.BusinessSchema.Type = type;
        $scope.model.BusinessSchema.OpeningDays = [];
        $scope.model.days.forEach(function (data) {
            if (data.selected) {
                $scope.model.BusinessSchema.OpeningDays
                    .push({
                        Day: data.value,
                        Open: data.open,
                        Close: data.close
                    });
            }
        });
        if ($scope.model.inputFounders != undefined
            && $scope.model.inputFounders != null
            && $scope.model.inputFounders.trim() != '') {
            $scope.model.BusinessSchema.Founders.push($scope.model.inputFounders);
            $scope.model.inputFounders = '';
        }

        if ($scope.model.inputBrands != undefined
            && $scope.model.inputBrands != null
            && $scope.model.inputBrands.trim() != '') {
            $scope.model.BusinessSchema.Brands.push($scope.model.inputBrands);
            $scope.model.inputBrands = '';
        }

        if ($scope.model.inputSameAs != undefined
            && $scope.model.inputSameAs != null
            && $scope.model.inputSameAs.trim() != '') {
            $scope.model.BusinessSchema.SameAS.push($scope.model.inputSameAs);
            $scope.model.inputSameAs = '';
        }


        if ($scope.model.ContactEmailInput != ''
            || $scope.model.ContactTypeInput != ''
            || $scope.model.ContactTelephoneInput != '') {
            var data = {
                ContactType: $scope.model.ContactTypeInput,
                ContactTelephone: $scope.model.ContactTelephoneInput,
                ContactEmail: $scope.model.ContactEmailInput
            }

            $scope.model.BusinessSchema.ContactPoints.push(data);
            $scope.model.ContactTypeInput = '';
            $scope.model.ContactTelephoneInput = '';
            $scope.model.ContactEmailInput = '';
        }
        seoDashboardResource1902.buildBasicSchema($scope.model.BusinessSchema).then(function (response) {
            $scope.model.BuiltSchema = response.data;
            notificationsService.success("Success", "Generated schema can now be copied.");
        });
    }

    $scope.openDaysOptions = function () {
        $scope.model.daysOptionClosed = !$scope.model.daysOptionClosed;
    }
    $scope.containerClick = function () {
        $scope.model.daysOptionClosed = true;
    }

    $scope.generateHint = function (content) {
        return commonFactory1902Seo.hintBuilder(content).innerHTML;
    }

    $scope.close = function () {
        editorService.close();
    }




    $scope.AddContactPoint = function () {

        if ($scope.model.ContactTelephoneInput == '' && $scope.model.ContactTypeInput == '' && $scope.model.ContactEmail == '') {
            return;
        }

        if ($scope.model.ContactEmailInput != '' && !$scope.model.ContactEmailInput.match($scope.model.emailValidation)) {
            notificationsService.warning("Warning", "Invalid email.");
            return;
        }

        var data = {
            ContactType: $scope.model.ContactTypeInput,
            ContactTelephone: $scope.model.ContactTelephoneInput,
            ContactEmail: $scope.model.ContactEmailInput
        }




        $scope.model.BusinessSchema.ContactPoints.push(data);

        $scope.model.ContactTypeInput = '';
        $scope.model.ContactTelephoneInput = '';
        $scope.model.ContactEmailInput = '';
    }

    $scope.RemoveContactPoint = function (index) {
        $scope.model.BusinessSchema.ContactPoints.splice(index, 1);

    }

    $scope.ValidateEmailContactPoint = function (index) {

        if (index == undefined) {
            var data = $scope.model.ContactEmailInput;
            if (data == undefined || (data != '' && !data.match($scope.model.emailValidation))) {
                notificationsService.warning("Warning", "Invalid email.");
                $scope.model.ContactEmailInput = "";
                return;
            }
        } else {
            var data = $scope.model.BusinessSchema.ContactPoints[index];
            if (data.ContactEmail == undefined || (data.ContactEmail != '' && !data.ContactEmail.match($scope.model.emailValidation))) {
                notificationsService.warning("Warning", "Invalid email.");
                data.ContactEmail = "";
                return;
            }
        }



    }




    /*-------------MEDIA PICKER---------------*/


    $scope.model.imageMaxKbDisplay = $scope.model.imageMaxKb > 1000 ? Math.floor($scope.model.imageMaxKb / 1000) + ' mb' : $scope.model.imageMaxKb + ' kb';

    $scope.getMaxUploadKb = function () {
        seoDashboardResource1902.getMaxUploadKb().then(function (response) {
            $scope.model.imageMaxKb = response.data;
            $scope.model.imageMaxKbDisplay = $scope.model.imageMaxKb > 1000 ? Math.floor($scope.model.imageMaxKb / 1000) + ' mb' : $scope.model.imageMaxKb + ' kb';
        }, function (error) {
            notificationsService.error("Error", "Unable to get max upload limit.");
        });

    }

    function setupViewModelGlobalSchema() {
        $scope.model.images = [];
        $scope.model.imageIds = [];

        if ($scope.model.BusinessSchema && $scope.model.BusinessSchema.Logo) {
            var ids = $scope.model.BusinessSchema.Logo.split(',');
            mediaResource.getByIds(ids).then(function (medias) {
                _.each(medias, function (media, i) {
                    if (media !== null) {
                        var properties = media.tabs[0].properties;
                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFile(media, true)
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.model.imageMaxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.model.images.push(media);
                             $scope.model.imageIds.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.model.imageIdealWidth || parseFloat(heightProperty.value) > $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.model.imageIdealWidth || parseFloat(heightProperty.value) < $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }
                    }
                });
                $scope.sync();
            });
        }
    }


    $scope.sync = function () {
        $scope.model.BusinessSchema.Logo = $scope.model.imageIds.join();
    };


    $scope.showAdd = function () {
        if ($scope.model.BusinessSchema && $scope.model.BusinessSchema.Logo && $scope.model.BusinessSchema.Logo !== "") {
            return false;
        }
        return true;
    };

    if (!$scope.model.imageStartNodeId) {
        userService.getCurrentUser().then(function (userData) {
            $scope.model.imageStartNodeId = userData.startMediaId;
        });
    }


    $scope.remove = function (index) {
        $scope.model.images.splice(index, 1);
        $scope.model.imageIds.splice(index, 1);
        $scope.model.warningMessage = '';
        $scope.sync();
    }

    $scope.add = function () {

        editorService.mediaPicker({
            startNodeId: $scope.model.imageStartNodeId,
            multiPicker: false,
            submit: function (data) {
                $scope.model.warningMessage = "";
                $scope.model.images = []; //reset currenly selected image
                $scope.model.imageIds = [];//reset currenly selected image
                data = [data.selection[0]];

                _.each(data, function (media, i) {

                    mediaResource.getById(media.id).then(function (mediaRes) {

                        var properties = mediaRes.tabs[0].properties;


                        if (!media.thumbnail) {
                            media.thumbnail = mediaHelper.resolveFileFromEntity(media, true);
                        }

                        var bytedPropertyIndex = properties.findIndex(function (x) { return x.alias === 'umbracoBytes'; });
                        var bytedProperty = properties[bytedPropertyIndex];
                        if (parseFloat($scope.model.imageMaxKb) >= (parseFloat(bytedProperty.value) / 1000)) {

                            $scope.model.images.push(media);
                             $scope.model.imageIds.push(media.id);
                        } else {
                            $scope.warningMessage = "Invalid image filesize";
                            return;
                        }
                        var widthPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoWidth"; });
                        var widthProperty = properties[widthPropertyIndex];

                        var heightPropertyIndex = properties.findIndex(function (x) { return x.alias === "umbracoHeight"; });
                        var heightProperty = properties[heightPropertyIndex];

                        if (parseFloat(widthProperty.value) > $scope.model.imageIdealWidth || parseFloat(heightProperty.value) > $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too large";
                        }

                        else if (parseFloat(widthProperty.value) < $scope.model.imageIdealWidth || parseFloat(heightProperty.value) < $scope.model.imageIdealHeight) {
                            $scope.warningMessage = "Image is too small";
                        }

                        $scope.sync();
                        editorService.close();

                    });

                });
            },
            close: function () {
                editorService.close();
            }
            
        });
    }


    $scope.getMaxUploadKb();

    /*MEDIA PICKER*/


    $scope.getSettingsModel();

});