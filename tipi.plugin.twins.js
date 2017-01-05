(function(win, doc, $) {
	var data = {
		attributes : {
			target 						: 'twins-target',
			viewport 					: 'twins-viewport',
			property 					: 'twins-property',
			timeout 					: 'twins-timeout',
			cached_target_collection 	: 'twins-cached-target-collection',
			cached_viewport_collection 	: 'twins-cached-viewport-collection',
			cached_property_collection	: 'twins-cached-property',
			cached_timeout 				: 'twins-cached-timeout'
		}
	}

	window.setTwins = function()
	{
		var twins = $('.twins');

		if(twins.length === 0)
		{
			return;
		}

		doc.on({
			'tipi.twins.update' : function(event, twins)
			{
				duplicateTwinsTarget(twins);
			}
		});

		var update;
		var document_width = doc.width();
		win.on({
			resize : function()
			{
				clearTimeout(update);
				update = setTimeout(function() {
					if(document_width != doc.width()) {
						twins.each(function() {
							doc.trigger('tipi.twins.update', [$(this)]);
						});
					}

					document_width = doc.width();
				}, 500);
			}
		});

		twins.each(function() {
			var twins = $(this);

			var target_names = twins.data(data.attributes.target);

			if(typeof target_names != 'string')
			{
				return;
			}

			//Convert target_names value to the string type and remove any whitespace.
			target_names = String(target_names).replace(' ' , '');

			//Convert all targets to an array so we can target them seperatly
			var target_names_collection = target_names.split(',');

			//Check if we have actual values by checking the first target
			if(typeof target_names_collection[0] === 'undefined')
			{
				return;
			}

			//Define the viewport so we can trigger twins for a specific viewport width
			var viewports = twins.data(data.attributes.viewport);
			var viewports_collection = [];

			//Convert all viewports to an array if we have any viewport values
			if(typeof viewports != 'undefined')
			{
				viewports = String(viewports).replace(' ', '');
				viewports_collection = viewports.split(',');
			}

			var timeout = twins.data(data.attributes.interval);
			if(isNaN(parseFloat(timeout)))
			{
				timeout = 0;
			}

			var property = twins.data(data.attributes.property);
			var property_collection = [];

			//Convert all viewports to an array if we have any viewport values
			if(typeof property != 'undefined')
			{
				property = String(property).replace(' ', '');
				property_collection = property.split(',');
			}

			//Cache the targets for the twins element
			twins.data(data.attributes.cached_target_collection, target_names_collection);

			//Cache the viewports for the twins element
			twins.data(data.attributes.cached_viewport_collection, viewports_collection);

			//Cache the timeout for the twins element
			twins.data(data.attributes.cached_timeout, timeout); /* @TODO Add timeout for each twins target*/

			//Cache the css properties we want to duplicate
			twins.data(data.attributes.cached_property_collection, property_collection);

			//Init the Twins
			doc.trigger('tipi.twins.update', [twins]);
		});
	}

	function duplicateTwinsTarget(twins)
	{
		//Fetch the viewports we have cached earlier.
		var target_names_collection = twins.data(data.attributes.cached_target_collection);

		//Fetch the properties we have cached earlier.
		var property_collection = twins.data(data.attributes.cached_property_collection);

		//Fetch the viewports we have cached earlier.
		var viewports_collection = twins.data(data.attributes.cached_viewport_collection);

		//Fetch the timeout we have cached earlier.
		var timeout = twins.data(data.attributes.cached_timeout);

		for (var i = 0; i <= target_names_collection.length - 1; i++)
		{
			var target = twins.find(target_names_collection[i]);
			if(target.length === 0)
			{
				break;
			}

			//Loop trough all target so we can compare the properties
			var property_values = [];
			target.each(function() {
				var target = $(this);

				var value = getTwinsTargetPropertyValue(property_collection[i]);

				if(value == 'min-width' || value == 'width')
				{
					property_values.push(target.outerWidth());
				}
				else
				{
					property_values.push(target.outerHeight());
				}
			});

			//Sort al the fetched values
			property_values.sort(function(a, b) {
				return b - a;
			});

			var properties = {};
			properties[getTwinsTargetPropertyValue(property_collection[i])] = property_values[0];

			var viewport = viewports_collection[i];
			if(isNaN(parseFloat(viewport)))
			{
				viewport = 0;
			}

			if(win.width() >= viewport) {
				target.css(properties);
			} else {
				resetTwinsTarget(target);
			}
		}
	}

	function getTwinsTargetPropertyValue(property)
	{
		if(typeof property === 'undefined') {
			return 'min-height';
		}
		else {
			return property;
		}
	}

	function resetTwinsTarget(target)
	{
		target.css({
			'width' : '',
			'min-width' : '',
			'height' : '',
			'min-height' : ''
		});
	}

})( window.jQuery(window), window.jQuery(document), window.jQuery);