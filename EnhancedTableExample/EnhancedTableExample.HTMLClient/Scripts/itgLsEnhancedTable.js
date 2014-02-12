
// =================================================================================================
// Based on the work of Kevin Mehlhaff of the LightSwitch Teamp
// http://blogs.msdn.com/b/lightswitch/archive/2013/11/26/customizing-the-table-control-sortable-by-column-kevin-mehlhaff.aspx
// =================================================================================================

// Check to see if the Itg namespace exists
var itgLs = itgLs || {};

(function () {

	// Create our EnhancedTable class
	var EnhancedTable = function (params) {
		this.initialize(params);
	};

	// Assign class to the itgLs space
	// ==========================================================================================
	itgLs.EnhancedTable = EnhancedTable;


	// ///////////////////////////////////////////////////////////////////////////////////////////
	// ==========================================================================================
	// ==========================================================================================
	// Class variables/methods (available across all instances), for testing globals
	// ==========================================================================================
	// ==========================================================================================
	// ///////////////////////////////////////////////////////////////////////////////////////////

	// Check it out... this variable and its incremental value will go across all instances
	// ==========================================================================================
	EnhancedTable.counter = 0;
	EnhancedTable.increment = function() {
		return EnhancedTable.counter++;
	};
	

	// Set the up/down arrow graphic for the sorted column
	// ==========================================================================================
	// TODO:  Move to CSS Classes? Parameters?
	EnhancedTable.applySortGraphic = function (element, text, ascending) {

		// Use html entity for up triangle and down triangle respectively
		var graphic = ascending ? "&#9650;" : "&#9660;";

		// Add the triangle to the header text
		$(element).html(text + " " + graphic);

	};



	// ///////////////////////////////////////////////////////////////////////////////////////////
	// ==========================================================================================
	// ==========================================================================================
	// Instance based variables/methods
	// ==========================================================================================
	// ==========================================================================================
	// ///////////////////////////////////////////////////////////////////////////////////////////
	var p = EnhancedTable.prototype;


	// Big ol initialize this Enhanced Table, instance based
	// ==========================================================================================
	p.initialize = function (params) {
		var me = this;
		me.contentItem = params.contentItem;
		me.element = $(params.element);
		me.screen = me.contentItem.screen;
		me.filterFieldLayout = me.screen.findContentItem(params.filterFieldLayoutName);
		me.filterFields = me.filterFieldLayout.children;
		me.filterText = me.screen.findContentItem(params.filterTextPropertyName);
		me.clearFilterButton = me.screen.findContentItem(params.clearFilterButtonName);
		me.filterButton = me.screen.findContentItem(params.filterButtonName);

		me.initialSortFieldName = params.initialSortFieldName;
		me.initialSortAscending = params.initialSortAscending !== undefined ? params.initialSortAscending : true;
		me.sortPropertyName = params.sortPropertyName;
		me.sortAscendingPropertyName = params.sortAscendingPropertyName;
		

		// Get our two buttons and set the onclicks
		var filterButtonElement = $(me.filterButton._view._container).find('[data-role="button"]');
		var clearFilterButtonElement = $(me.clearFilterButton._view._container).find('[data-role="button"]');

		$(filterButtonElement).on('click', function () {
			me.updateFilterText();
			me.toggleFilterVisibility();
		});

		$(clearFilterButtonElement).on('click', function () {
			me.clearFilter();
			me.toggleFilterVisibility();
		});


		// Find and loop over each TH (header) element
		$("th", me.element).each(function (ii) {

			// Get the column header contentItem based on the index
			var headerContentItem = me.contentItem.children[0].children[ii];

			// We only skip command (button) types, all others get passed for processing
			if (headerContentItem.kind === "Command") {
				return;
			}

			// Add the pointer style
			$(this).css('cursor', 'pointer');

			// Get the actual name of the data field of this table column, which will be our sort property
			// Using this method will allow multiple tables on the same screen
			var propertyName = headerContentItem.model.dataSource.member.name;

			// Add a click handler for each table header
			$(this).on("click", function () {

				// Get the text of the header that was clicked for adding the arrow
				var text = $(this).text();

				// The same column has been clicked twice, so reverse the sort order.
				if (me.lastColumnClicked === this) {
					text = $(me.lastColumnClicked).data("originalText");
					me.sortAscending = !me.sortAscending;

				} else {

					// A different table header was clicked than the previous one
					me.sortAscending = me.initialSortAscending;

					// Reset the last table header to remove the sort graphic
					if (me.lastColumnClicked !== undefined) {
						$(me.lastColumnClicked).html(
							$(me.lastColumnClicked).data("originalText"));
					}
				}

				// Set our properties that will fire off the sort 
				me.screen[me.sortAscendingPropertyName] = me.sortAscending;
				me.screen[me.sortPropertyName] = propertyName;

				// Apply the sort graphic to this new header location
				EnhancedTable.applySortGraphic(this, text, me.sortAscending);

				// Store the original text of the table header by using the JQuery data api
				$(this).data("originalText", text);

				// Store this column for comparison with the next click
				me.lastColumnClicked = this;

			});

		});
	};
	

	// Clear all the input fields, in essence clearing the filter also
	// ==========================================================================================
	p.clearFilter = function () {
		var me = this;
		
		// Loop over all the fields in our container
		for (var i = 0; i < me.filterFields.length; i++) {

			// Set the value to undefined to signify blank
			me.filterFields[i].value = undefined;
		}

		// Reset our visual text property
		me.filterText.value = "";

	};


	// Toggle the visibility of the layout holding the input fields 
	// ==========================================================================================
	p.toggleFilterVisibility = function () {
		var me = this;
		
		me.filterFieldLayout.isVisible = !me.filterFieldLayout.isVisible;
		me.clearFilterButton.isVisible = me.filterFieldLayout.isVisible;
		me.filterText.isVisible = !me.filterFieldLayout.isVisible;

	};


	// Update the text in a property field that displays the filter
	// ==========================================================================================
	p.updateFilterText = function () {
		var me = this;
		var result = "";

		// Loop over all the fields in our field container
		for (var i = 0; i < me.filterFields.length; i++) {

			// Create the text string for this name/value pair
			var displayName = me.filterFields[i].displayName;
			var fieldValue = me.filterFields[i].value;

			// Add to create our big string
			result += fieldValue === undefined || fieldValue == null || fieldValue === "" ? "" : " -- " + displayName + ": " + fieldValue;

		}

		// Now set the screen propert with our result
		me.filterText.value = result;

	};


}());

