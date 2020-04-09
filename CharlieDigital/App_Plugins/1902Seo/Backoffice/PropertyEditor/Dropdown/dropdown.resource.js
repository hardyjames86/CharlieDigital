angular.module("umbraco.services").factory("dropdown1902Resource", function ($q, $http, umbRequestHelper) {
    var self = {
        getDropdownItems: function (apiUrl) {
            var url = apiUrl;
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        }
    };
    return self;
});