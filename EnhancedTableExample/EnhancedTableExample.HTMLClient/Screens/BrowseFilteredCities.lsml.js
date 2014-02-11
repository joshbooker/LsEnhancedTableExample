/// <reference path="../GeneratedArtifacts/viewModel.js" />
/// <reference path="../Scripts/itgLsEnhancedTable.js" />

myapp.BrowseFilteredCities.City_postRender = function (element, contentItem) {

	contentItem.screen.enhancedTable1 = new itgLs.EnhancedTable({
		element: element,
		contentItem: contentItem,
		filterButtonName: "FilterButton",
		clearFilterButtonName: "ClearFilterButton",
		filterFieldLayoutName: "FilterFieldLayout",
		filterTextPropertyName: "FilterText",
		sortPropertyName: "CitySortField",
		sortAscendingPropertyName: "CitySortAscending"

	});

};
myapp.BrowseFilteredCities.FilteredCities1_postRender = function (element, contentItem) {

	contentItem.screen.enhancedTable2 = new itgLs.EnhancedTable({
		element: element,
		contentItem: contentItem,
		filterButtonName: "FilterButton2",
		clearFilterButtonName: "ClearFilterButton2",
		filterFieldLayoutName: "FilterFieldLayout2",
		filterTextPropertyName: "FilterText2",
		sortPropertyName: "SortField",
		sortAscendingPropertyName: "SortAscending"

	});

};

// Should move this into classes and then into the reusable code file
myapp.BrowseFilteredCities.FilterText_postRender = function (element, contentItem) {

	$(element).css('margin-top', '10px');

};
myapp.BrowseFilteredCities.FilterText2_postRender = function (element, contentItem) {

	$(element).css('margin-top', '10px');

};