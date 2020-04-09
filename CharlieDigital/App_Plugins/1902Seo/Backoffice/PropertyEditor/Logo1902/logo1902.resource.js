angular.module("umbraco.services").factory("logoResource1902", function ($q, $http, umbRequestHelper) {

    var BASE_URL = "/umbraco/backoffice/Seo1902/Dashboard/";
    var self = {
        validateRegistration: function (id, type, keyword, notCache) {
            var url = BASE_URL + "ValidateIsRegistered"
            var method = "POST";
            var contentType = "application/json; charset=UTF-8";

            return $http({
                method: method,
                headers: { 'Content-Type': contentType },
                url: url
            });
        }, getFileSummary: function (isCheck) {
            var url = BASE_URL + "GetSummaryFileInfo?isCheck=" + isCheck;
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        }, getTabProperty: function (alias) {
            var url = BASE_URL + "GetTabProperty?alias=" + alias;
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        }
    };
    return self;
});