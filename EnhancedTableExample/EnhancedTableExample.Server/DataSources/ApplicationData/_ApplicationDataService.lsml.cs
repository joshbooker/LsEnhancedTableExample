using System;
using System.Collections.Generic;
using System.Data.Common.EntitySql;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using Microsoft.LightSwitch;
using Microsoft.LightSwitch.Security.Server;
namespace LightSwitchApplication
{
	public partial class ApplicationDataService
	{
		partial void FilteredCities_PreprocessQuery(string SortField, bool? SortAscending, string Name, string State, ref IQueryable<City> query)
		{
			// Don't process if the sort field is empty
			if (!String.IsNullOrEmpty(SortField))
			{

				// Since we can't dynamically sort via a navigational property, we have to hard code those
				// Switch is used if you are sorting with properties that are based on other navigation properties
				switch (SortField)
				{
					case "State":
						query = SortAscending != null && SortAscending == true
							? query.OrderBy(x => x.State.Name)
							: query.OrderByDescending(x => x.State.Name);
						break;

					// Default is used for local table properties, non navigational (property.naviationProperty)
					default:
						query = SortAscending != null && SortAscending == true
							? query.OrderByPropertyName(SortField)
							: query.OrderByPropertyNameDescending(SortField);
						break;
				}
			}

		}
	}
}
