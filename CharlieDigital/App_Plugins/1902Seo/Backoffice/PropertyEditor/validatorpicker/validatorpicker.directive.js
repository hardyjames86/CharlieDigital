angular.module('umbraco.directives').directive('1902TextInput', function ($timeout, localizationService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        priority: -1,
        link: function (scope, elem, attrs, ctrl) {

            function refreshCounters() {

                $timeout(function () {
                    // find any non-initialised inputs
                    var textField = elem.find('input[type="text"], textarea');
                    var counter = elem.find('.validator-picker-counter');


                    var textFieldVal = '';

                    if ($(textField).val())
                        textFieldVal = $(textField).val();

                    if (scope.model.config.maxInput !== undefined && scope.model.config.maxInput !== null && parseInt(scope.model.config.maxInput) > 0) {
                       
                        $(counter).html(textFieldVal.length + "/" + scope.model.config.maxInput  + " characters left.");
                    } else {                     
                        $(counter).html(textFieldVal.length + " characters");
                    }


                   

                    var rules = scope.model.config.ruletype || scope.model.config[2];
                    var messages;
                    var $message = elem.find('.validator-picker-message');
                    $message.html('');

                    for (var i = 0; i < rules.length; i++) {

                        var isMatch = false;
                        var rule = rules[i];
                        var value;

                        switch (rule.targetId) {
                            case 2: // Value
                                value = textFieldVal;
                                break;

                            case 1: // Character count
                                value = textFieldVal.length;
                                break;
                            case 3: // Word count
                                value = textFieldVal.split(' ').length;
                                break;

                            default:
                                break;

                        }

                        switch (rule.conditionSign) {
                            case '<':
                                if (value < rule.value)
                                    isMatch = true;
                                break;
                            case '>':
                                if (value > rule.value)
                                    isMatch = true;
                                break;
                            case '==':
                                if (value == rule.value)
                                    isMatch = true;
                                break;
                            case '<=':
                                if (value <= rule.value)
                                    isMatch = true;
                                break;
                            case '>=':
                                if (value >= rule.value)
                                    isMatch = true;
                                break;
                            case 'regex':
                                var patt = new RegExp(rule.value);

                                if (rule.reverse) {

                                    if (!patt.test(value))
                                        isMatch = true;

                                } else {

                                    if (patt.test(value))
                                        isMatch = true;
                                }
                                break;
                            default:
                                break;

                        }


                        if (isMatch) {
                            $message.append('<li style="color:' + rule.color + '">' + rule.message + '</li>')
                        }

                    }


                });
            };



            scope.$watch('model.value', refreshCounters, true);

           


        }
    };

});
