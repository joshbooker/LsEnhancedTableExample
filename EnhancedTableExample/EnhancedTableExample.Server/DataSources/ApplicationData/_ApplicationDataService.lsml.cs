using System;
using System.Collections.Generic;
using System.Data.Common.EntitySql;
using System.Linq;
using System.Linq.Dynamic;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.LightSwitch;
using Microsoft.LightSwitch.Security.Server;
namespace LightSwitchApplication
{
	public partial class ApplicationDataService
	{
		partial void FilteredCities_PreprocessQuery(string SortField, bool? SortAscending, string Name, string State, ref System.Linq.IQueryable<City> query)
		{

			// Don't process if the sort field is empty
			if (!String.IsNullOrEmpty(SortField))
			{
				// =================================================================
				// Thanks to Josh Booker for sending me down the Dynamic Linq path
				// joshuabooker.com
				// Really simplifies the code and gives enormous flexibility
				// =================================================================
				SortField += SortAscending == null || SortAscending == false ? " DESC" : " ASC";
				query = query.OrderBy(SortField);

			}

		}
	}
}
