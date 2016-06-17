function setTwins() {
	var twinsDataAttributes = {
		target 		: 'twins-target',
		viewport 	: 'twins-viewport',
		property 	: 'twins-property'
	};

	var twins = $('.twins');
	if(twins.length > 0) {
		twins.each(function() {
			var twins = $(this);

			var targetName = twins.data(twinsDataAttributes.target);
			if(typeof targetName == 'string') {
				targetName = targetName.replace(', ',',');
				targetCollection = targetName.split(',');
				if(typeof targetCollection[0] != 'undefined') {
					//Create a custom trigger so we can update a specific twin target.
					twins.on({
						'tipi.twins.update' : function() {
							for (var i = targetCollection.length - 1; i >= 0; i--) {
								var target = twins.find(targetCollection[i]);
								if(target.length > 0) {
									duplicateTwinsTarget(twins, target, twinsDataAttributes);
								}
							}
						}
					});

					twins.trigger('tipi.twins.update');

					var twinUpdate;
					$(window).on({
						resize : function() {
							clearTimeout(twinUpdate);
							twinUpdate = setTimeout(function() {
								twins.trigger('tipi.twins.update');
							}, 500);
						}
					});
				}
			}
		});
	}
}

function duplicateTwinsTarget(twins, target, twinsDataAttributes) {
	//Set the default value for the viewport width to 0
	var viewportWidth = 0;

	//Get the viewportWidth from the data attribute
	if(typeof twins.data(twinsDataAttributes.viewport) == 'number') {
		viewportWidth = twins.data(twinsDataAttributes.viewport);
	}

	//Set the default property to 'min-height'.
	var property = 'min-height';
	if(typeof twins.data(twinsDataAttributes.property) == 'string') {
		property = twins.data(twinsDataAttributes.property);
	}

	var propertyValues = [];

	if(target.length > 0) {
		target.each(function(index) {
			var currentTarget = $(this);
			resetTwinsTarget(currentTarget);

			if(property === 'min-width' || property === 'width') {
				propertyValues.push(currentTarget.outerWidth());
			} else {
				propertyValues.push(currentTarget.outerHeight());
			}

			if(index >= target.length - 1) {
				//Sort all the heights on a descending order.
				propertyValues.sort(function(a, b) {
					return b - a;
				});

				var properties = {};
				properties[property] = propertyValues[0];

				if($(window).width() >= viewportWidth && propertyValues[0] > 0) {
					target.css(properties);
				} else {
					resetTwinsTarget(target);
				}
			}
		});
	}
}

function resetTwinsTarget(currentTarget) {
	currentTarget.css({
		'width'			: '',
		'min-width' 	: '',
		'height'		: '',
		'min-height'	:  ''
	});
}