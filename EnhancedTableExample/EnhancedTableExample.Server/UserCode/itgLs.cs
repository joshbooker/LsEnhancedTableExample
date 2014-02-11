using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace LightSwitchApplication
{

	// ======================================================================================
	// Add the following new class into your ApplicationDataService.lsml.cs
	// Allows for passing a string holding a field name for sorting
	// Only works for table level properties, not for relational properties
	// Based on the work of Kevin Mehlhaff of the LightSwitch Teamp
	// http://blogs.msdn.com/b/lightswitch/archive/2013/11/26/customizing-the-table-control-sortable-by-column-kevin-mehlhaff.aspx
	// ======================================================================================
	public static class OrderByExtensions
	{
		private static readonly MethodInfo OrderByMethod =
			typeof(Queryable).GetMethods()
				.Where(method => method.Name == "OrderBy").Single(method => method.GetParameters().Length == 2);

		private static readonly MethodInfo OrderByDescendingMethod =
			typeof(Queryable).GetMethods()
				.Where(method => method.Name == "OrderByDescending").Single(method => method.GetParameters().Length == 2);

		private static IQueryable<TSource> GetOrderByMethodForProperty<TSource>
			(IQueryable<TSource> source, string propertyName, MethodInfo orderByMethod)
		{
			// Create a parameter "x", where x is of TSource type
			ParameterExpression parameter = Expression.Parameter(typeof(TSource), "x");
			// Access a property on the parameter: "x.<propertyName>"
			Expression parameterProperty = Expression.Property(parameter, propertyName);
			// Create a lambda of the form "x => x.<propertyName>"
			LambdaExpression lambda = Expression.Lambda(parameterProperty, new[] { parameter });
			MethodInfo orderByMethodTyped = orderByMethod.MakeGenericMethod
				(new[] { typeof(TSource), parameterProperty.Type });
			object retVal = orderByMethodTyped.Invoke(null, new object[] { source, lambda });
			return (IQueryable<TSource>)retVal;
		}
		public static IQueryable<TSource> OrderByPropertyName<TSource>
			(this IQueryable<TSource> source, string propertyName)
		{
			return GetOrderByMethodForProperty<TSource>(source, propertyName, OrderByMethod);
		}

		public static IQueryable<TSource> OrderByPropertyNameDescending<TSource>
		  (this IQueryable<TSource> source, string propertyName)
		{
			return GetOrderByMethodForProperty<TSource>(source,
														propertyName,
														OrderByDescendingMethod);
		}
	}


}