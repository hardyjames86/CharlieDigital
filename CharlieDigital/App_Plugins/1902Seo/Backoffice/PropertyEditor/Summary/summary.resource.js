angular.module("umbraco.services").factory("summaryResource1902", function ($q, $http, umbRequestHelper) {
  
    var BASE_URL = "/umbraco/backoffice/Seo1902/Page/";
    var self = {
        getSummary: function (id, type, keyword, notCache, culture) {
            var url = BASE_URL + "GetSummary?id=" + id + '&groupName=' + type + '&keyword=' + keyword + '&notCache=' + notCache  + '&culture=' +  culture; 
            var method = "GET";
            return $http({
                method: method,
                url: url
            });
        }
    };
    return self;
});