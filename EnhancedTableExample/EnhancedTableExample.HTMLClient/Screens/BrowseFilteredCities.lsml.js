/// <reference path="../GeneratedArtifacts/viewModel.js" />
/// <reference path="../Scripts/itgLsEnhancedTable4.js" />

// ==================================================================================
// ==================================================================================
// First version - batch execution of sort and filter
// ==================================================================================
// ==================================================================================
myapp.BrowseFilteredCities.FilteredCities1_postRender = function (element, contentItem) {

	// Store our enhanced table as part of our contentItem
	contentItem.enhancedTable= new itgLs.EnhancedTable({
		element: element,
		contentItem: contentItem,
		filterFieldLayoutName: "FilterFieldLayout1",
		filterStringPropertyName: "FilterString1",
		sortStringPropertyName: "SortString1",
		batchMode: true

	});

};


// ==================================================================================
// Following two methods are for the Execute button, render and then execute
// ==================================================================================
myapp.BrowseFilteredCities.ExecuteButton1_postRender = function (element, contentItem) {

	// Convert our button to a nice pretty iconic button
	convertToIconicButton(element, contentItem, 'accept');

};

myapp.BrowseFilteredCities.ExecuteButton1_Tap_execute = function (screen) {

	// When execute is pressed, execute both sort and filters
	var firstTable = screen.findContentItem("FilteredCities1");
	firstTable.enhancedTable.executeSort();
	firstTable.enhancedTable.executeFilter();

};


// ==================================================================================
// Following two methods are for the show filter button, render and then execute
// ==================================================================================
myapp.BrowseFilteredCities.ShowFilterButton1_postRender = function (element, contentItem) {

	// Convert our button to a nice pretty iconic button
	convertToIconicButton(element, contentItem, 'filter');

};
myapp.BrowseFilteredCities.ShowFilterButton1_Tap_execute = function (screen) {

	// Toggle the show/hide of our filter fields
	var firstTable = screen.findContentItem("FilteredCities1");
	firstTable.enhancedTable.toggleFilterVisibility();

	// Can we find our button?
	var button = screen.findContentItem("ShowFilterButton1");

	var newButtonText = button.displayName == "Show" ? "Hide" : "Show";
	button.displayName = newButtonText;

};


// ==================================================================================
// Following two methods are for the clear sort and filter button, then the execute
// ==================================================================================
myapp.BrowseFilteredCities.ClearSortAndFilterButton1_postRender = function (element, contentItem) {

	// Convert our button to a nice pretty iconic button
	convertToIconicButton(element, contentItem, 'remove');

};
myapp.BrowseFilteredCities.ClearSortAndFilterButton1_Tap_execute = function (screen) {

	// Clear both sort and filter items
	var firstTable = screen.findContentItem("FilteredCities1");
	firstTable.enhancedTable.clearSort();
	firstTable.enhancedTable.clearFilter();

};


// ==================================================================================
// ==================================================================================
// Second version - immediate execution of sort and filter
// ==================================================================================
// ==================================================================================
myapp.BrowseFilteredCities.FilteredCities2_postRender = function (element, contentItem) {

	// Store our enhanced table as part of our contentItem
	contentItem.enhancedTable = new itgLs.EnhancedTable({
		element: element,
		contentItem: contentItem,
		filterFieldLayoutName: "FilterFieldLayout2",
		sortStringPropertyName: "SortString2",
		batchMode: false

	});

};


// ==================================================================================
// Following two methods are for the show filter button, then the execute
// ==================================================================================
myapp.BrowseFilteredCities.ShowFilterButton2_postRender = function (element, contentItem) {

	// Convert our button to a nice pretty iconic button
	convertToIconicButton(element, contentItem, 'filter');

};
myapp.BrowseFilteredCities.ShowFilterButton2_Tap_execute = function (screen) {

	// Toggle the show/hide of our filter fields
	var secondTable = screen.findContentItem("FilteredCities2");
	secondTable.enhancedTable.toggleFilterVisibility();

	// Can we find our button?
	var button = screen.findContentItem("ShowFilterButton2");

	var newButtonText = button.displayName == "Show" ? "Hide" : "Show";
	button.displayName = newButtonText;


};


// ==================================================================================
// Following two methods are for the clear sort and filter button, then the execute
// ==================================================================================
myapp.BrowseFilteredCities.ClearSortAndFilterButton2_postRender = function (element, contentItem) {

	// Convert our button to a nice pretty iconic button
	convertToIconicButton(element, contentItem, 'remove');

};
myapp.BrowseFilteredCities.ClearSortAndFilterButton2_Tap_execute = function (screen) {

	// Clear both sort and filter items
	var secondTable = screen.findContentItem("FilteredCities2");
	secondTable.enhancedTable.clearSort();
	secondTable.enhancedTable.clearFilter();


};