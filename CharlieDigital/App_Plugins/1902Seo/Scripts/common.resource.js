angular.module("umbraco.services").factory("seoCommonResourceSeo1902", function ($q, $http, umbRequestHelper) {

    var BASE_DASHBOARD_URL = "/umbraco/backoffice/Seo1902/Dashboard/";
    var self = {
        getStartUpStatus: function () {
            var url = BASE_DASHBOARD_URL + "GetStartUp"
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        },
        getHideStart: function () {
            var url = BASE_DASHBOARD_URL + 'GetIsHideMetaTitle'
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        }
    }
    return self;
});