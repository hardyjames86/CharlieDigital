angular.module('umbraco.directives').directive('colorStatus', function ($timeout, localizationService) {
	return {
		restrict: 'A',
		priority: -1,
		link: function (scope, elem, attrs, ctrl) {
            
			switch (attrs.colorStatus) {
				case '1':
					elem.addClass('good');
					break
				case '2':
					elem.addClass('improvement');
					break
				case '3':
					elem.addClass('bad');
					break
				default:
					break;

			}
		}
	};

});
