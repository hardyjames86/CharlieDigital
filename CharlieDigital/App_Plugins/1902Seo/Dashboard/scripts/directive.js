angular.module('umbraco.directives').directive('cOnBlur', ['$parse', function ($parse) {
    return function (scope, element, attr) {
        var fn = $parse(attr['cOnBlur']);
        element.bind('blur', function (event) {
            scope.$apply(function () {
                fn(scope, { $event: event });
            });
        });
    }
}]);

angular.module('umbraco.directives').directive('cOnScroll', ['$parse', function ($parse) {
    return function (scope, element, attr) {
        var fn = $parse(attr['cOnScroll']);
        element.on('scroll', function (event) {
            scope.$apply(function () {
                fn(scope, { $event: event });
            });
        });
    }
}]);



angular.module("umbraco.directives")
.directive('cDatePicker', function ($parse, $filter, assetsService) {
    return {
        restrict: 'E',
        scope: {
            field: '='
        },
        controller: function ($scope, $element) {
           
            $scope.$watch('_tempfield', function () {
                $scope.field = $scope._tempfield;
            });
          
        },
        templateUrl: '/App_Plugins/1902Seo/Dashboard/customcontrols/datepicker/view.html'
    }
});

angular.module("umbraco.directives")
.directive('cTimePicker', function ($parse, $filter, assetsService) {
    return {
        restrict: 'E',
        scope: {
            field: '='
        },
        controller: function ($scope, $element) {
            
            $scope.$watch('_tempfield', function () {
                $scope.field = $scope._tempfield;
            });
        },
        templateUrl: '/App_Plugins/1902Seo/Dashboard/customcontrols/timepicker/view.html'
    }
});



angular.module('umbraco.directives')
.directive('cListInputString', function ($parse) {
    return {
        restrict: 'E',
        scope: {
            field: '=',
            inputField: '=',
            validateType  : '@validate'
        },
        controller: function ($scope, notificationsService) {
            if ($scope._tempfield) {
                $scope._tempfield = [];
            }

            if ($scope._tempinput) {
                $scope._tempinput = "";
            }

            var urlValidationRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
            
           // $scope._tempfield = $scope.field;


            $scope.add = function () {
                if ($scope._tempinput.trim() == '') {
                    return;
                }
              


                if ($scope.validateType == 'url') {
                    if (!($scope._tempinput.match(urlValidationRegex))) {
                        $scope._tempfield[index] = "";
                        notificationsService.warning("Warning", "Invalid URL.");
                        return;
                    }
                }

                var index = $scope._tempfield.findIndex(function (item) { return item == $scope._tempinput; });
                if (index == -1) {
                    $scope._tempfield.push($scope._tempinput)
                } else {
                    notificationsService.warning("Warning", "Duplicate input");
                }
                $scope._tempinput = "";
            }



            $scope.validate = function (index) {
                var currentData = ''
                if (index == undefined) {
                    currentData = $scope._tempinput;
                }else{
                    currentData = $scope._tempfield[index];
                }
                 
                if (currentData.trim() != "") {
                    if ($scope.validateType == 'url') {
                        if (!currentData.match(urlValidationRegex)) {
                            if (index == undefined) {
                                $scope._tempinput = "";
                            } else {
                                $scope._tempfield[index] = "";
                            }
                            notificationsService.warning("Warning", "Invalid URL.");
                            return;
                        }
                    }
                }


               
                var ctr = 0;
                $scope._tempfield.forEach(function (data) {
                    if (data.trim() == currentData.trim() && ctr != index) {
                        if(index == undefined){
                            $scope._tempinput = "";
                        }else{
                            $scope._tempfield[index] = "";
                        }
                        notificationsService.warning("Warning", "Duplicate input");
                        return;
                    }
                    ctr++;
                })
            }

            $scope.remove = function (index) {
                $scope._tempfield.splice(index, 1);
            }

           
            $scope.$watch('field', function () {
                $scope._tempfield = $scope.field;
            });

          
            $scope.$watch('inputField', function () {
                $scope._tempinput = $scope.inputField;
            });

            $scope.$watch('_tempinput', function () {
                $scope.inputField = $scope._tempinput;
            });


          


        },
        templateUrl: '/App_Plugins/1902Seo/Dashboard/customcontrols/liststring/view.html'
        
    }

});
