angular.module('umbraco').controller('1902.Prevalue.ValidatorTypeController', function ($scope, dataTypeResource) {


    if ($scope.model.value !== undefined && $scope.model.value !== null) {
        $scope.model.value = parseInt($scope.model.value);
    }

    $scope.seoTypes = [];
    $scope.seoTypes.push({ id: -88, name: 'Textstring' }); // Umbraco.Textbox
    $scope.seoTypes.push({ id: -89, name: 'Textarea' }); // Umbraco.TextboxMultiple




});
