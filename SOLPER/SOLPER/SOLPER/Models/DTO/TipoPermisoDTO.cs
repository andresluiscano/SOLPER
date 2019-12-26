using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using SOLPER.Models.DTO;

namespace SOLPER.Models.DTO
{
    public class TipoPermisoDTO
    {
        private readonly TIPO_PERMISO _tp = new TIPO_PERMISO();

        public TipoPermisoDTO() {

        }

        public TipoPermisoDTO(TIPO_PERMISO tp)
        {
            _tp = tp;
        }

        public TIPO_PERMISO GetTipoPermiso() => _tp;

        public bool EsNuevo() => Id == 0;

        public int? Id
        {
            get { return _tp.Id; }
            set { _tp.Id = value ?? 0; }
        }

        public string Descripcion
        {
            get { return _tp.Descripcion; }
            set { _tp.Descripcion = value; }
        }
    }
}