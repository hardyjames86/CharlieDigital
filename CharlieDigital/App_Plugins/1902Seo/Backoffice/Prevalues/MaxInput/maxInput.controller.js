angular.module('umbraco').controller('maxInput.1902Seo.controller', function ($scope) {
    if ($scope.model.value === undefined || $scope.model.value === null || $scope.model.value === "") {
        $scope.model.value = 0;
    } else {
        $scope.model.value = parseInt($scope.model.value);
    }


})