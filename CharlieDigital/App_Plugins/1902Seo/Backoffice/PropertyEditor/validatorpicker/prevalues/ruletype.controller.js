angular.module('umbraco').controller('1902.Prevalue.RuleTypeController', function ($scope) {
    if ($scope.model.value === undefined || $scope.model.value === null)  {
        $scope.model.value = [];
    }


    $scope.targets = [];

    $scope.targets.push({ id: 2, text: "Value" });
    $scope.targets.push({ id: 1, text: "Character count" });
    $scope.targets.push({ id: 3, text: "Word count" });

    $scope.conditions = [];
    $scope.conditions.push({ sign: '>', text: "greater than" });
    $scope.conditions.push({ sign: '<', text: "less than" });
    $scope.conditions.push({ sign: '==', text: "equal to" });
    $scope.conditions.push({ sign: '>=', text: "greater than or equal to" });
    $scope.conditions.push({ sign: '<=', text: "less than or equal to" });
    $scope.conditions.push({ sign: 'regex', text: "Regex" });

    $scope.add = function () {
        $scope.model.value.push({ targetId: '', conditionSign: '', message: '', value: '', color: '', reverse: false });
    }

    $scope.delete = function (item) {
        $scope.model.value.splice($scope.model.value.indexOf(item), 1);
    }

});
