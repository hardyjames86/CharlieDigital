angular.module('umbraco.directives').directive('cHintHover', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function ($scope, element, attrs) {

            element.on('mouseover', function () {
                var doc = document.body.getBoundingClientRect();
                var docHeight = doc.height;
                var docWidth = doc.width;

                var element = this.getElementsByClassName('c-hint-content')[0].getBoundingClientRect();
                var elementHeight = element.height;
                var elementWidth = element.width;
                var hintIcon = this.getBoundingClientRect();



                if (docHeight < (elementHeight + hintIcon.top + 70)) {
                    this.classList.add("c-hint-top");
                } else {
                    if (this.classList.contains('c-hint-top')) {
                        this.classList.remove("c-hint-top");
                    }
                }



                if (this.classList.contains('c-hint-left')) {
                    if (doc.width <= (hintIcon.left + element.width)) {
                        this.classList.remove('c-hint-left');
                        this.classList.add('c-hint-right');
                        this.classList.add('c-hint-relative')
                        this.classList.add('c-hint-altered');
                    }

                } else if (this.classList.contains('c-hint-right') && (this.classList.contains('c-hint-altered'))) {
                    if (doc.width >= (hintIcon.left + element.width)) {
                        this.classList.add('c-hint-left');
                        this.classList.remove('c-hint-right');
                        this.classList.remove('c-hint-relative');
                    }
                }

                ///**special case
                if (this.closest('.document-type-table') != null) {
                    this.closest('.document-type-table').classList.add('c-overflow-inherit');
                }
                ///**special case

            });


            element.on('mouseout', function () {
                ///**special case
                if (this.closest('.document-type-table') != null) {
                    this.closest('.document-type-table').classList.remove('c-overflow-inherit');
                }
                ///**special case
            });

        }
    };
}]);

angular.module('umbraco.directives').directive('cDisableStart', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        controller: function ($scope, $element, seoCommonResourceSeo1902, notificationsService) {
            function validateStartUp() {
                seoCommonResourceSeo1902.getStartUpStatus().then(function (response) {
                    if (!response.data.IsEnabled) {
                        $element.attr('disabled', 'disabled');
                    }
                }, function (error) {
                    if (error != undefined) {
                        console.log(error)
                    }
                });
            }
            validateStartUp();
        }
    }
}]);


angular.module('umbraco.directives').directive('cHideStart', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        controller: function ($scope, $element, seoCommonResourceSeo1902, notificationsService) {
            if ($scope.model.alias == "title1902Seo") {
                seoCommonResourceSeo1902.getHideStart().then(function (response) {
                    if (!response.data.Data) {
                        if ($element.closest('.umb-property').length > 0) {
                            $element.closest('.umb-property')[0].setAttribute('style', 'display:none')
                        }
                    }
                });
            }
        }
    }
}]);