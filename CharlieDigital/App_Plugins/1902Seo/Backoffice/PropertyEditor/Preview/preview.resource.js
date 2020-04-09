angular.module("umbraco.services").factory("previewResource1902", function ($q, $http, umbRequestHelper) {
    var BASE_URL = "/umbraco/backoffice/Seo1902/Dashboard/";
    var self = {
        getPage: function (id, culture) {
            var url = BASE_URL + "GetPage?id=" + id + "&culture="  + culture;
            var method = "GET";
            var contentType = "application/json; charset=UTF-8";
            return $http({
                method: method,
                url: url
            });
        }
    };
    return self;

});