
using Microsoft.Ajax.Utilities;
using SOLPER.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using SOLPER.Controllers;
using SOLPER.Models.DTO;
using DataTables.Mvc;
using SOLPER.Utils;
using System.Data.Entity;
using System.Globalization;

namespace SOLPER.Controllers
{
    public class PermisoController : Controller
    {
        #region TIPO PERMISO
        [Route("Permiso/TipoPermiso")]
        public ActionResult TipoPermisoView()
        {
            return View();
        }

        [HttpGet]
        public ActionResult TiposPermisoTableHandler([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest param)
        {
            try
            {
                //-----------------------------------------------------------------------------------------------
                var ordenPor = param.Columns.FirstOrDefault(c => c.IsOrdered);
                var seBusca = !param.Search.Value.IsNullOrWhiteSpace();
                var b = seBusca ? param.Search.Value.ToLower() : "";

                var ctx = new SOLPEREntities();
                //-----------------------------------------------------------------------------------------------
                var query = ctx.TIPO_PERMISO
                                .Where(c => (!seBusca || c.Descripcion.ToLower().Contains(b)))
                                .Select(c => new
                                {
                                    c.Id,
                                    c.Descripcion
                                });
                //-----------------------------------------------------------------------------------------------
                var count = query.Count();
                //-----------------------------------------------------------------------------------------------
                var list = query
                    .SelectPage(o => o.ValorProp(ordenPor?.Name ?? nameof(o.Descripcion)),
                        ordenPor?.SortDirection == Column.OrderDirection.Descendant,
                        param.Start,
                        param.Length.IfMenorCero(999))
                    .ToList();
                //-----------------------------------------------------------------------------------------------
                var data = new DataTablesResponse(param.Draw, list, count, count);
                return Json(new { Code = 1, Data = data }, JsonRequestBehavior.AllowGet);
                //-----------------------------------------------------------------------------------------------
            }
            catch (Exception e)
            {
                return Json(new { Code = 2, Data = new DataTablesResponse(param.Draw, new object[] { }, 0, 0), Mensaje = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetTipoPermiso(long id)
        {
            try
            {
                var ctx = new SOLPEREntities();
                var tp = ctx.TIPO_PERMISO.FirstOrDefault(u => u.Id == id);
                var tipoPermiso = new TipoPermisoDTO(tp);

                return Json(new { Code = 1, TipoPermiso = tipoPermiso }, "txt/json", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Code = 3, Mensaje = ex.Message }, "txt/json", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult EditTipoPermiso(TipoPermisoDTO param)
        {
            try
            {
                //-----------------------------------------------------------------------------------------------
                var ctx = new SOLPEREntities();
                var tp = param.GetTipoPermiso();
                string msg;
                //-----------------------------------------------------------------------------------------------
                if (param.EsNuevo())
                {
                    ctx.TIPO_PERMISO.Add(tp);
                    msg = "Tipo de permiso añadido exitosamente.";
                }
                else
                {
                    ctx.TIPO_PERMISO.Attach(tp);
                    ctx.Entry(tp).State = EntityState.Modified;
                    msg = "Tipo de permiso actualizado exitosamente.";
                }
                //-----------------------------------------------------------------------------------------------
                ctx.SaveChanges();
                //-----------------------------------------------------------------------------------------------

                return Json(new { Code = 1, Mensaje = msg }, "txt/json", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Code = 3, Mensaje = ex.Message }, "txt/json", JsonRequestBehavior.AllowGet);
            }

        }

        [HttpGet]
        public ActionResult GetTiposPermiso()
        {
            try
            {
                var ctx = new SOLPEREntities();
                var data = ctx.TIPO_PERMISO.ToList();

                return Json(new { Code = 1, data }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception e)
            {
                return Json(new { Code = 3, Mensaje = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        #endregion

        #region SOLICITAR PERMISO
        [Route("SolicitarPermiso")]
        public ActionResult SolicitarPermisoView()
        {
            return View();
        }
        [HttpPost]
        public ActionResult EditPermiso(PermisoDTO param)
        {
            try
            {
                //-----------------------------------------------------------------------------------------------
                var ctx = new SOLPEREntities();
                var p = param.GetPermiso();
                string msg;
                //-----------------------------------------------------------------------------------------------
                if (param.EsNuevo())
                {
                    ctx.PERMISOS.Add(p);
                    msg = "Solicitud de permiso añadido exitosamente.";
                }
                else
                {
                    ctx.PERMISOS.Attach(p);
                    ctx.Entry(p).State = EntityState.Modified;
                    msg = "Solicitud de permiso actualizada exitosamente.";
                }
                //-----------------------------------------------------------------------------------------------
                ctx.SaveChanges();
                //-----------------------------------------------------------------------------------------------

                return Json(new { Code = 1, Mensaje = msg }, "txt/json", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Code = 3, Mensaje = ex.Message }, "txt/json", JsonRequestBehavior.AllowGet);
            }

        }
        #endregion

        #region VER PERMISO
        [Route("VerPermisos")]
        public ActionResult VerPermisosView()
        {
            return View();
        }

        [HttpGet]
        public ActionResult PermisoTableHandler([ModelBinder(typeof(DataTablesBinder))] IDataTablesRequest param)
        {
            try
            {
                //-----------------------------------------------------------------------------------------------
                var ordenPor = param.Columns.FirstOrDefault(c => c.IsOrdered);
                var seBusca = !param.Search.Value.IsNullOrWhiteSpace();
                var b = seBusca ? param.Search.Value.ToLower() : "";
                var ctx = new SOLPEREntities();
                //-----------------------------------------------------------------------------------------------               
                var query = (from p in ctx.PERMISOS
                             join tp in ctx.TIPO_PERMISO on p.TipoPermiso equals tp.Id
                             select new
                             {
                                 Id = p.Id,
                                 NombreEmpleado = p.NombreEmpleado,
                                 ApellidosEmpleado = p.ApellidosEmpleado,
                                 Descripcion = tp.Descripcion,
                                 FechaPermiso = p.FechaPermiso.ToString()
                             })
                             .Where(c => (!seBusca || c.NombreEmpleado.ToLower().Contains(b)
                                                   || c.ApellidosEmpleado.ToLower().Contains(b)
                                                   || c.Descripcion.ToLower().Contains(b)));
                //-----------------------------------------------------------------------------------------------
                var count = query.Count();
                //-----------------------------------------------------------------------------------------------
                var list = query
                    .SelectPage(o => o.ValorProp(ordenPor?.Name ?? nameof(o.NombreEmpleado)),
                        ordenPor?.SortDirection == Column.OrderDirection.Descendant,
                        param.Start,
                        param.Length.IfMenorCero(999))
                    .ToList();
                //-----------------------------------------------------------------------------------------------
                var data = new DataTablesResponse(param.Draw, list, count, count);
                return Json(new { Code = 1, Data = data }, JsonRequestBehavior.AllowGet);
                //-----------------------------------------------------------------------------------------------
            }
            catch (Exception e)
            {
                return Json(new { Code = 2, Data = new DataTablesResponse(param.Draw, new object[] { }, 0, 0), Mensaje = e.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public ActionResult GetPermiso(long id)
        {
            try
            {
                var ctx = new SOLPEREntities();
                var p = ctx.PERMISOS.FirstOrDefault(u => u.Id == id);
                var permiso = new PermisoDTO(p);

                return Json(new { Code = 1, Permiso = permiso }, "txt/json", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Code = 3, Mensaje = ex.Message }, "txt/json", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult DeletePermiso(long id)
        {
            using (SOLPEREntities ctx = new SOLPEREntities()) {
                try
                {
                    var p = ctx.PERMISOS.FirstOrDefault(u => u.Id == id);
                    ctx.PERMISOS.Remove(p);
                    ctx.SaveChanges();

                    return Json(new { Code = 1, Mensaje = "El pedido ha sido eliminado exitosamente." }, "txt/json", JsonRequestBehavior.AllowGet);
                }
                catch (Exception ex)
                {
                    return Json(new { Code = 3, Mensaje = ex.Message }, "txt/json", JsonRequestBehavior.AllowGet);
                }
            }
        }
        #endregion
    }
}