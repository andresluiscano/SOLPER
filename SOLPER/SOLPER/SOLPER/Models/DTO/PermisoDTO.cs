using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;

namespace SOLPER.Models.DTO
{
    public class PermisoDTO
    {
        private readonly PERMISOS _tp = new PERMISOS();

        public PermisoDTO()
        {

        }
        public PermisoDTO(PERMISOS tp)
        {
            _tp = tp;
        }

        public PERMISOS GetPermiso() => _tp;

        public bool EsNuevo() => Id == 0;
        public int? Id
        {
            get { return _tp.Id; }
            set { _tp.Id = value ?? 0; }
        }

        public string NombreEmpleado
        {
            get { return _tp.NombreEmpleado; }
            set { _tp.NombreEmpleado = value; }
        }

        public string ApellidosEmpleado
        {
            get { return _tp.ApellidosEmpleado; }
            set { _tp.ApellidosEmpleado = value; }
        }

        public int TipoPermiso
        {
            get { return _tp.TipoPermiso; }
            set { _tp.TipoPermiso = value; }
        }
        public DateTime FechaPermiso
        {
            get { return _tp.FechaPermiso; }
            set { _tp.FechaPermiso = value; }
        }
    }
}