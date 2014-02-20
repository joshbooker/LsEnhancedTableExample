using System;
using System.Linq;
using System.Linq.Dynamic;

namespace LightSwitchApplication
{
	public partial class ApplicationDataService
	{
		partial void FilteredCities_PreprocessQuery(string Name, string State, string SortString, string FilterString, ref IQueryable<City> query)
		{

			// =================================================================
			// Thanks to Josh Booker for sending me down the Dynamic Linq path
			// joshuabooker.com
			// Really simplifies the code and gives enormous flexibility
			// =================================================================

			// Don't process if the sort field is empty, used in our batch process
			if (!String.IsNullOrEmpty(SortString))
			{
				// SortField += SortAscending == null || SortAscending == false ? " DESC" : " ASC";
				query = query.OrderBy(SortString);

			}

			// Don't process if the sort field is empty, used in our batch process
			if (!String.IsNullOrEmpty(FilterString))
			{
				query = query.Where(FilterString);

			}

		}
	}
}
