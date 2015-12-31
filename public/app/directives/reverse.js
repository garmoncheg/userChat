angular.module('reverseDirective', [])

.filter('reverse', function() {

	return function(items) {
		if (items!== undefined){
			items = items.slice().reverse();
		}
		return items;
	}

});