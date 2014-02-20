/// <reference path="lodash.js" />

// =================================================================================================
// Based on the work of Kevin Mehlhaff of the LightSwitch Teamp
// http://blogs.msdn.com/b/lightswitch/archive/2013/11/26/customizing-the-table-control-sortable-by-column-kevin-mehlhaff.aspx
// =================================================================================================

// Check to see if the Itg namespace exists
var itgLs = itgLs || {};

(function () {

	// Our constructor
	var EnhancedTable = function (properties) {

		this.initialize(properties);

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
	EnhancedTable.increment = function () {
		return EnhancedTable.counter++;
	};



	// ///////////////////////////////////////////////////////////////////////////////////////////
	// ==========================================================================================
	// ==========================================================================================
	// Prototype/Instance based variables/methods
	// ==========================================================================================
	// ==========================================================================================
	// ///////////////////////////////////////////////////////////////////////////////////////////
	var p = EnhancedTable.prototype;


	// Big ol initialize this Enhanced Table, instance based
	// ==========================================================================================
	p.initialize = function (properties) {

		// Me is the particular instance of this enhanced table control
		var me = this;

		// Obvious... 
		me.screen = properties.contentItem.screen;

		// Element is the HTML element that contains the table control
		me.element = $(properties.element);

		// Are we going to be in batch mode or not
		me.batchMode = properties.batchMode == undefined || properties.batchMode == null ? false : properties.batchMode;


		// //////////////////////////////////////////////////////////////////////////////////
		// ==================================================================================
		// This part is all for filtering
		// ==================================================================================
		// //////////////////////////////////////////////////////////////////////////////////

		// The screen group that contains the fields for filtering
		me.filterFieldLayout = me.screen.findContentItem(properties.filterFieldLayoutName);

		// Array of all the input controls used for filtering
		me.filterFields = me.filterFieldLayout.children;

		// The name of the screen property that will be used to hold our filter
		me.filterStringPropertyName = properties.filterStringPropertyName;


		// //////////////////////////////////////////////////////////////////////////////////
		// ==================================================================================
		// This next part is all for column sorting
		// ==================================================================================
		// //////////////////////////////////////////////////////////////////////////////////

		// The name of the screen property that will be used to hold our sort
		me.sortStringPropertyName = properties.sortStringPropertyName;

		// List of table headers available for sorting
		me.tableHeaders = [];

		// Hold our sort string, allows for setting multiple columns and then sort
		me.sortString = "";

		// Find and loop over each TH (header) element
		$("th", me.element).each(function (i) {

			// Get the column header contentItem based on the index
			var headerContentItem = properties.contentItem.children[0].children[i];

			// We only skip command (button) types, all others get passed for processing
			if (headerContentItem.kind === "Command") {
				return;
			}

			// //////////////////////////////////////////////////////////////////////////////
			// Initialize our internal object for a table column
			// //////////////////////////////////////////////////////////////////////////////

			var tableHeader = {};

			// Parse the data binding path to get our id for the header... also known as the data field
			tableHeader.id = headerContentItem.bindingPath.slice(5);

			// This property will hold which direction we are sorting, ASC, DESC, NULL
			tableHeader.sortDirection = null;

			// Store the html element for ease of accessibility
			tableHeader.headerElement = this;

			// Store the original header text, used for adding sort arrows
			tableHeader.originalHeaderText = $(this).text();

			// Initialize the sort direction
			tableHeader.sortDirection = null;

			// Initialize the sort position
			tableHeader.sortPosition = null;

			// Add this item/header to the list of sortable fields
			me.tableHeaders.push(tableHeader);

			// Add the pointer style to the header element
			$(tableHeader.headerElement).css('cursor', 'pointer');

			// Add a click handler for each table header
			$(tableHeader.headerElement).on("click", function () {

				// Adjust the direction based on the previous direction
				// Ordering flow is Ascending -> Descending -> no sort
				switch (tableHeader.sortDirection) {
					case "ASC":
						// We were ascending... so change to Descending
						tableHeader.sortDirection = "DESC";
						break;

					case "DESC":
						// We were descending... so change to NULL, no sort
						tableHeader.sortDirection = null;
						tableHeader.sortPosition = null;

						// Since we removed a sort item, re-sort the headers based on their sort position
						me.tableHeaders = _.sortBy(me.tableHeaders, function (item) {
							return item.sortPosition == null ? 10000 : item.sortPosition;
						});
						break;

					default:
						// We were null or undefined, so we go to ascending now
						tableHeader.sortDirection = "ASC";
						tableHeader.sortPosition = 1000;

						// Since we added a sort item, re-sort the fields based on their sort position
						me.tableHeaders = _.sortBy(me.tableHeaders, function (item) {
							return item.sortPosition == null ? 10000 : item.sortPosition;
						});
						break;
				}

				// Recalculate the sortPosition property, for use in the header display
				_.each(me.tableHeaders, function (item, index) {
					if (item.sortPosition != null) {
						item.sortPosition = index;
					}
				});

				// If batchMode was sent as true, then don't set the sort, user will do this
				if (me.batchMode == false) {
					me.executeSort();
				}

				// Update the headers with the sort information (graphic, position)
				me.updateTableHeaders();

			});

		});
	};


	// Execute the filter that was defined, used when batchMode is set to true
	// ==========================================================================================
	p.executeFilter = function () {
		var me = this;
		var result = "";

		// Loop over all the fields in our field container
		_.each(me.filterFields, function (item) {

			// Remove the first character, which will make our name unique
			var dataFieldName = item.name.slice(1);

			// Replace all the underscores with dots
			dataFieldName = dataFieldName.replace('_', '.');

			// What is the value of the field
			var dataValue = item.value;

			if (dataValue != null && dataValue != "") {

				// Create our predicate
				result = result + " " + dataFieldName + ".Contains(\"" + dataValue + "\")" + " and";

			}

		});

		// Remove the last character, which is the last comma
		result = result.slice(0, -4);

		// Add the sort string to the property, which will fire off a query request
		me.screen[me.filterStringPropertyName] = result;
	};


	// Clear all the input fields, in essence clearing the filter also
	// ==========================================================================================
	p.clearFilter = function () {
		var me = this;
		var result = "";

		// Loop over all the fields in our field container
		_.each(me.filterFields, function (item) {

			// Set the value to null
			item.value = null;

		});

		// If we are in batch mode
		if (me.batchMode == true) {
			// Add the sort string to the property, which will fire off a query request
			me.screen[me.filterStringPropertyName] = result;
		}
	};


	// Toggle the visibility of the layout holding the input fields 
	// ==========================================================================================
	p.toggleFilterVisibility = function () {
		var me = this;

		me.filterFieldLayout.isVisible = !me.filterFieldLayout.isVisible;

	};


	// Set the sort property with the sort string, allows for a batch or single
	// ==========================================================================================
	p.executeSort = function () {

		// Who are we... 
		var me = this;

		// Create our a string that will be used for our sort
		var sortString = "";
		_.each(me.tableHeaders, function (item) {
			if (item.sortPosition != undefined && item.sortPosition != null) {
				sortString += item.id + " " + item.sortDirection + ", ";
			}
		});

		// Remove the last character, which is the last comma
		sortString = sortString.slice(0, -2);

		// Add the sort string to the property, which will fire off a query request
		me.screen[me.sortStringPropertyName] = sortString;

	};


	// Clear the sort fields, if in batchMode also execute the sort
	// ==========================================================================================
	p.clearSort = function () {

		var me = this;

		_.each(me.tableHeaders, function (item) {
			item.sortPosition = null;
			item.sortDirection = null;
		});

		me.executeSort();

		// Update the headers with the sort information (graphic, position)
		me.updateTableHeaders(me.tableHeaders);

	};


	// Update table column headers based on sort properties
	// ==========================================================================================
	p.updateTableHeaders = function () {
		var me = this;

		// loop over our headers
		_.each(me.tableHeaders, function (item) {

			// If sort position is set, update the header
			if (item.sortPosition != null) {
				var graphic = item.sortDirection == "ASC" ? "&#9650" : "&#9660";
				$(item.headerElement).html(item.originalHeaderText + " - " + (item.sortPosition + 1) + graphic);
			} else {

				// No sort position, so just show the default text
				$(item.headerElement).html(item.originalHeaderText);
			}


		});
	};



}());


// ==========================================================================================
// Quick little function to convert a standard button to Iconic button
// Added here for this targeted example, is typically part of the itgLs library
// ==========================================================================================
function convertToIconicButton(element, contentItem, icon) {

	// The following icon names are standard with LightSwitch:
	// ok, cancel, discard, decline, save, logout, back, search, camera, trash, add, remove,
	// video, tag, gear, contacts, edit, question, refreesh, list, folder, move, text, attachment,
	// warning, star, addfavorite, filter, sort, addpicture, document, download, calendar, dropdown

	// Create our html items for our button
	// var $div = $('<div tabindex="-1" class="id-element msls-large-icon ui-btn ui-shadow ui-mini ui-btn-icon-top ui-btn-up-a" data-role="button" data-theme="a" data-iconpos="top" data-mini="true" data-iconshadow="true" data-shadow="true" data-corners="false" data-wrapperEls="span" style="box-shadow: none;"></div>');
	var $div = $('<div class="id-element msls-large-icon ui-btn ui-shadow ui-mini ui-btn-icon-top ui-btn-up-a" data-theme="a" style="box-shadow: none;"></div>');
	var $innerButton = $('<span class="ui-btn-inner"></span>');
	var $textSpan = $('<span class="ui-btn-text">' + contentItem.displayName + '</span>');
	var $iconSpan = $('<span class="ui-icon ui-icon-msls-' + icon + ' ui-icon-shadow">&nbsp;</span>');

	// Add all of our items under the big div
	$div.append($innerButton.append($textSpan).append($iconSpan));

	// Add our new button to the element
	$(element).html($div);

	// Removing the msls-leaf will drop the big padding typically used
	$(element).closest('.msls-leaf').removeClass('msls-leaf');

	// Bind to the displayName so the text can be dynamically changed
	contentItem.dataBind('displayName', function (newValue) {
		$textSpan.text(newValue);
	});

};

