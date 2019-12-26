using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;


namespace SOLPER.Utils
{
    public static class ExtensionMethods
    {
        #region INT

        public static int IfMenorCero(this int i, int siMenorCero) => i < 0 ? siMenorCero : i;

        public static int? ToInt(this string str)
        {
            int i;
            return int.TryParse(str, out i) ? i : (int?)null;
        }

        public static int Edad(this DateTime fechaNacimiento)
        {
            var now = DateTime.Today;
            var edad = now.Year - fechaNacimiento.Year;
            if (now < fechaNacimiento.AddYears(edad)) edad--;

            return edad;
        }

        #endregion

        #region DOUBLE

        public static double ToJsDate(this DateTime dt, int timez = -3) => dt.AddHours(-timez).Subtract(new DateTime(1970, 1, 1)).TotalMilliseconds;

        #endregion

        #region SHORT

        public static short? ToShort(this string str)
        {
            short i;
            return short.TryParse(str, out i) ? i : (short?)null;
        }

        #endregion

        #region LONG

        public static long? ToLong(this string str)
        {
            long i;
            return long.TryParse(str, out i) ? i : (long?)null;
        }

        #endregion

        #region DATETIME

        public static DateTime ToJsDate(this double d) => new DateTime(1970, 1, 1).AddMilliseconds(d);

        public static DateTime? ToDt(this string str)
        {
            DateTime dt;
            return DateTime.TryParse(str, out dt) ? dt : (DateTime?)null;
        }

        #endregion

        #region IENUMERABLE

        public static void AddIfNew<T>(this List<T> list, T obj)
        {
            if (!list.Contains(obj)) list.Add(obj);
        }

        public static IEnumerable<T> SelectPage<T, T2>(this IEnumerable<T> list, Func<T, T2> sortFunc, bool isDesc, int ini, int cant) => isDesc
                ? list.OrderByDescending(sortFunc).Skip(ini).Take(cant).ToList()
                : list.OrderBy(sortFunc).Skip(ini).Take(cant).ToList();

        #endregion

        #region OBJECT

        public static object ValorProp(this object src, string propName) => src.GetType().GetProperty(propName)?.GetValue(src, null);

        #endregion
    }

    public static class LeftJoinExtension
    {
        public static IQueryable<TResult> LeftJoin<TOuter, TInner, TKey, TResult>(
            this IQueryable<TOuter> outer,
            IQueryable<TInner> inner,
            Expression<Func<TOuter, TKey>> outerKeySelector,
            Expression<Func<TInner, TKey>> innerKeySelector,
            Expression<Func<TOuter, TInner, TResult>> resultSelector)
        {
            var groupJoin = typeof(Queryable).GetMethods()
                                                     .Single(m => m.ToString() == "System.Linq.IQueryable`1[TResult] GroupJoin[TOuter,TInner,TKey,TResult](System.Linq.IQueryable`1[TOuter], System.Collections.Generic.IEnumerable`1[TInner], System.Linq.Expressions.Expression`1[System.Func`2[TOuter,TKey]], System.Linq.Expressions.Expression`1[System.Func`2[TInner,TKey]], System.Linq.Expressions.Expression`1[System.Func`3[TOuter,System.Collections.Generic.IEnumerable`1[TInner],TResult]])")
                                                     .MakeGenericMethod(typeof(TOuter), typeof(TInner), typeof(TKey), typeof(LeftJoinIntermediate<TOuter, TInner>));
            var selectMany = typeof(Queryable).GetMethods()
                                                      .Single(m => m.ToString() == "System.Linq.IQueryable`1[TResult] SelectMany[TSource,TCollection,TResult](System.Linq.IQueryable`1[TSource], System.Linq.Expressions.Expression`1[System.Func`2[TSource,System.Collections.Generic.IEnumerable`1[TCollection]]], System.Linq.Expressions.Expression`1[System.Func`3[TSource,TCollection,TResult]])")
                                                      .MakeGenericMethod(typeof(LeftJoinIntermediate<TOuter, TInner>), typeof(TInner), typeof(TResult));

            var groupJoinResultSelector = (Expression<Func<TOuter, IEnumerable<TInner>, LeftJoinIntermediate<TOuter, TInner>>>)
                                          ((oneOuter, manyInners) => new LeftJoinIntermediate<TOuter, TInner> { OneOuter = oneOuter, ManyInners = manyInners });

            var exprGroupJoin = Expression.Call(groupJoin, outer.Expression, inner.Expression, outerKeySelector, innerKeySelector, groupJoinResultSelector);

            var selectManyCollectionSelector = (Expression<Func<LeftJoinIntermediate<TOuter, TInner>, IEnumerable<TInner>>>)
                                               (t => t.ManyInners.DefaultIfEmpty());

            var paramUser = resultSelector.Parameters.First();

            var paramNew = Expression.Parameter(typeof(LeftJoinIntermediate<TOuter, TInner>), "t");
            var propExpr = Expression.Property(paramNew, "OneOuter");

            var selectManyResultSelector = Expression.Lambda(new Replacer(paramUser, propExpr).Visit(resultSelector.Body), paramNew, resultSelector.Parameters.Skip(1).First());

            var exprSelectMany = Expression.Call(selectMany, exprGroupJoin, selectManyCollectionSelector, selectManyResultSelector);

            return outer.Provider.CreateQuery<TResult>(exprSelectMany);
        }

        private class LeftJoinIntermediate<TOuter, TInner>
        {
            // ReSharper disable once UnusedAutoPropertyAccessor.Local
            public TOuter OneOuter { get; set; }
            public IEnumerable<TInner> ManyInners { get; set; }
        }

        private class Replacer : ExpressionVisitor
        {
            private readonly ParameterExpression _oldParam;
            private readonly Expression _replacement;

            public Replacer(ParameterExpression oldParam, Expression replacement)
            {
                _oldParam = oldParam;
                _replacement = replacement;
            }

            public override Expression Visit(Expression exp)
            {
                if (exp == _oldParam)
                {
                    return _replacement;
                }

                return base.Visit(exp);
            }
        }
    }
}