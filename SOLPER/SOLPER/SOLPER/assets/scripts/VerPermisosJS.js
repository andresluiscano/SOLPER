/*******************************INIT*******************************/
$('#tabla').dataTable({
    "language": { url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Spanish.json' },
    buttons: [],
    columns: [
        { name: "Nombre", data: 'NombreEmpleado', className: "dt-center", orderable: true, render: function (s) { return '<strong>' + s + '</strong>'; } },
        { name: "Apellido", data: 'ApellidosEmpleado', className: "dt-center", orderable: true, render: function (s) { return '<strong>' + s + '</strong>'; } },
        { name: "Tipo", data: 'Descripcion', className: "dt-center", orderable: true, render: function (s) { return '<strong>' + s + '</strong>'; } },
        { name: "Fecha", data: 'FechaPermiso', className: "dt-center", orderable: true, render: function (s) { return '<strong>' + moment(s).format('DD/MM/YYYY') + '</strong>'; } },
        {
            name: "Id",
            data: 'Id',
            className: "dt-center",
            orderable: false,
            render: function (id) {
                return '<button class="btn btn-circle green btn-outline btn-sm btnVer"><i class="fa fa-edit"></i> Ver</button>' +
                       '<a class="btn btn-outline btn-circle red btn-sm blue btnDelete" onclick="prepararEliminar(' + id + ')"><i class="fa fa-trash-o"></i> Eliminar</a>';
            }
        }
    ],
    paging: true,
    lengthMenu: [[20, 50, 100, -1], [20, 50, 100, "Todos"]],
    pageLength: 20,
    drawCallback: function () { },
    info: true,
    serverSide: true,
    ordering: true,
    order: [[0, "asc"]],
    searching: true,
    searchDelay: 400,
    ajax: function (data, callback) {
        $.get("/Permiso/PermisoTableHandler", data).done(function (rta) { callback(rta.Data); });
    }
});

$.oysgroup.disableElementsDiv('#panelDatosPermiso');

$('#tabla tbody').on('click', 'tr button', function () {
    var tr = $(this).closest('tr');
    var row = $('#tabla').dataTable().api().row(tr);

    if ($(this).is('.btnVer')) editarP(row.data().Id);
})

$('#btnAceptarEliminar').click(function () {
    eliminarP(IdPermiso);
    IdPermiso = 0;
    $('#modalDelete').modal('hide');
});

$('#btnCancelarEliminar').click(function () {
    $('#modalDelete').modal('hide');
    clearForm();
});
/*******************************FUNC*******************************/
function editarP(idP) {
    $.oysgroup.showLoading("Cargando", "#panelDatosPermiso");
    $.get("/Permiso/GetPermiso", { id: idP }).done(function (data) {
        if (data.Code !== 1) return;
        clearForm();
        var u = data.Permiso;
        $("#tit").text(u.NombreEmpleado + ' ' + u.ApellidosEmpleado);
        idTipoPermiso = u.Id;
        $('[name="NombreEmpleado"]').val(u.NombreEmpleado).addClass(u.NombreEmpleado == null ? "" : "edited");
        $('[name="ApellidosEmpleado"]').val(u.ApellidosEmpleado).addClass(u.ApellidosEmpleado == null ? "" : "edited");
        $('[name="TipoPermiso"]').val(u.TipoPermiso);
        $('[name="FechaPermiso"]').val(moment(u.FechaPermiso).format('DD/MM/YYYY')).addClass(u.FechaPermiso == null ? "" : "edited");
    }).always(function () {
        $.oysgroup.hideLoading("#panelDatosPermiso");
    });
}

function prepararEliminar(idP) {
    $('#modalDelete').modal('show');
    IdPermiso = idP;
}

function eliminarP(idP) {
    $.oysgroup.showLoading("Cargando", "#panelDatosPermiso");
    $.post("/Permiso/DeletePermiso", { id: idP })
        .done(function (rta) {
            if (rta.Code === 1) {
                $.oysgroup.showMessageOk(rta.Mensaje);
                $('#tabla').dataTable()._fnReDraw();
                clearForm();
            } else {
                $.oysgroup.showMessageError(rta.Mensaje);
            }
        })
        .always(function () {
            $.oysgroup.hideLoading("#panelDatosPermiso");
            clearForm();
        });
}