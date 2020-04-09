angular.module("umbraco.services").factory("mediaPicker1902SeoResource", function ($q, $http, umbRequestHelper) {
    var BASE_URL = "/umbraco/backoffice/Seo1902/Dashboard/";
    var self = {
        getMaxUploadKb: function (filter) {
            var url = BASE_URL + "GetMaxUploadLimit"
            var method = "GET";
            var contentType = "application/json; charset=UTF-8"
            return $http({
                method: method,
                url: url
            });
        }
    };

    return self;

});