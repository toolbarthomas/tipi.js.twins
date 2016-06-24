function setTwins() {
	var twinsDataAttributes = {
		target 		: 'twins-target',
		viewport 	: 'twins-viewport',
		property 	: 'twins-property',
		interval 	: 'twins-interval'
	};

	var twins = $('.twins');
	if(twins.length > 0) {
		twins.each(function() {
			var twins = $(this);

			var targetName = twins.data(twinsDataAttributes.target);
			if(typeof targetName == 'string') {
				if (typeof targetName != 'string') {
					targetName = targetName.toString();
				}

				targetName = targetName.replace(', ',',');
				targetCollection = targetName.split(',');

				var viewport = twins.data(twinsDataAttributes.viewport);
				var viewportCollection = [];

				if(typeof viewport != 'undefined') {
					//Convert the viewport value to a string so we can replace and split the value
					if (typeof viewport != 'string') {
						viewport = viewport.toString();
					}

					viewport = viewport.replace(', ',',');
					viewportCollection = viewport.split(',');
				}

				var interval = twins.data(twinsDataAttributes.interval) ;
				if(typeof interval != 'number') {
					interval = 0;
				}

				if(typeof targetCollection[0] != 'undefined') {
					//Create a custom trigger so we can update a specific twin target.
					twins.on({
						'tipi.twins.update' : function() {
							var duplicateEvent;
							clearTimeout(duplicateEvent);

							for (var i = 0; i <= targetCollection.length - 1; i++) {
								var target = twins.find(targetCollection[i]);
								if(target.length > 0) {

									if(typeof viewportCollection[i] == 'undefined') {
										viewportCollection[i] = 0;
									}

									var timeout = interval * i;
									duplicateTwinsTarget(twins, target, viewportCollection[i], timeout, duplicateEvent, twinsDataAttributes);
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

function duplicateTwinsTarget(twins, target, viewport, timeout, duplicateEvent, twinsDataAttributes) {
	duplicateEvent = setTimeout(function() {
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

					if($(window).width() >= viewport && propertyValues[0] > 0) {
						target.css(properties);
					} else {
						resetTwinsTarget(target);
					}
				}
			});
		}
	}, timeout);
}

function resetTwinsTarget(currentTarget) {
	currentTarget.css({
		'width'			: '',
		'min-width' 	: '',
		'height'		: '',
		'min-height'	:  ''
	});
}