/*******************************VARS*******************************/
var idTipoPermiso = 0;
var errorTipoPermiso = $('.alert-danger', form);
/*******************************INIT*******************************/
$(".form-group.form-md-line-input").css('margin-bottom', '10px');
$('#errorTipoPermiso').hide();
$.fn.select2.defaults.set("theme", "bootstrap");
$(".select2").select2({
    placeholder: function () {
        $(this).data('placeholder');
    },
    allowClear: true,
    language: {
        "noResults": function () {
            return "No se encontraron resultados.";
        }
    }
});

$('#tabla').dataTable({
    "language": { url: '//cdn.datatables.net/plug-ins/3cfcc339e89/i18n/Spanish.json' },
    buttons: [],
    ajax: {
        url: '/Permiso/TiposPermisoTableHandler',
        method: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            console.log(JSON.stringify(data.Data.data));
            return JSON.stringify(data.Data.data)
        }
    },
    columns: [
        { name: "Descripcion", data: 'Descripcion', className: "dt-center", orderable: true, render: function (s) { return '<strong>' + s + '</strong>'; } },
        {
            name: "Id",
            data: 'Id',
            className: "dt-center",
            orderable: false,
            render: function (id) {
                return '<button class="btn btn-circle green btn-outline btn-sm" onclick="editarOSP(' + id + ');"><i class="fa fa-edit"></i> Editar</button>';
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
        $.get("/Permiso/TiposPermisoTableHandler", data).done(function (rta) { callback(rta.Data); });
    }
});

$("#form").validate({
    invalidHandler: function () {
        errorTipoPermiso.html("Verifique los datos ingresados.");
        errorTipoPermiso.show();
        App.scrollTo(errorTipoPermiso, -200);
    },
    rules: {
        Descripcion: {
            required: true,
            maxlength: 100
        }
    },
    messages: {
        Descripcion: ""
    },
    errorElement: "em",
    highlight: function (element) {
        var elem = $(element);
        elem.parent().addClass('has-error');
        elem.parent().removeClass('has-success');
    },
    unhighlight: function (element) {
        var elem = $(element);
        elem.parent().removeClass('has-error').addClass('has-success');
    }
});
/*******************************FUNC*******************************/       
var editarOSP = function (idUser) {
    $.oysgroup.showLoading("Cargando", "#panelDatosTipoPermiso");
    $.get("/Permiso/GetTipoPermiso", { id: idUser }).done(function (data) {
        if (data.Code !== 1) return;
        clearForm();
        var u = data.TipoPermiso;

        $("#tit").text(u.Descripcion);
        idTipoPermiso = u.Id;
        $('[name="Id"]').val(u.Id);
        $('[name="Descripcion"]').val(u.Descripcion).addClass(u.Descripcion == null ? "" : "edited");
    }).always(function () {
        $.oysgroup.hideLoading("#panelDatosTipoPermiso");
    });
}

var clearForm = function() {
    $("#form").validate().resetForm();
    errorTipoPermiso.hide();
    $("#tit").text("");
    idTipoPermiso = 0;
    $('[name="Descripcion"]').val("").removeClass("edited");
    window.scrollTo(0, 0);
}

var objectifyForm = function(formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}

var enviarForm = function() {
    if ($("#form").validate().form()) {

            $.oysgroup.showLoading("Espere", "#panelDatosTipoPermiso");

            var param = objectifyForm($("#form").serializeArray());
            param.Id = idTipoPermiso;

        $.post("/Permiso/EditTipoPedido",
                {
                    param: param
                }).done(function (rta) {
                    if (rta.Code === 1) {
                        $.oysgroup.showMessageOk(rta.Mensaje);
                        clearForm();
                        $('#tabla').dataTable()._fnReDraw();
                    } else {
                        $.oysgroup.showMessageError(rta.Mensaje);
                    }
                })
                .always(function () {
                    $.oysgroup.hideLoading("#panelDatosTipoPermiso");
                });
        }
}



