angular.module('storyCtrl', ['storyService'])

.controller('StoryController', function(Story) {
	var vm = this;

	Story.allStory()
		.success(function(data){
			vm.stories = data;
		})

	vm.createStory() = function() {
		vm.message = '';
		Story.create(vm.storyData) 
			.success(function(data){
				vm.stories = '';
				// clear up the form
				vm.message = data;

				vm.stories.push(data);
			});
	};
})