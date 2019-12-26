
/*******************************VARS*******************************/
var IdPermiso = 0;
var errorSolicitarPermiso = $('.alert-danger', form);
/*******************************INIT*******************************/
CargarTiposPermisos();
$("#form").validate({
    invalidHandler: function () {
        errorSolicitarPermiso.html("Verifique los datos ingresados.");
        errorSolicitarPermiso.show();
        App.scrollTo(errorSolicitarPermiso, -200);
    },
    rules: {
        NombreEmpleado: {
            required: true,
            maxlength: 100
        },
        ApellidosEmpleado: {
            required: true,
            maxlength: 100
        },
        TipoPermiso: {
            required: true
        },
        FechaPermiso: {
            required: true
        }
    },
    messages: {
        NombreEmpleado: "",
        ApellidosEmpleado: "",
        TipoPermiso: "",
        FechaPermiso: ""
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
$('#FechaPermiso').datepicker({dateFormat: 'dd/mm/yyyy', format: 'dd/mm/yyyy', dateonly: true, autoclose: true, });
//$('#FechaPermiso').datepicker('setDate', new Date());
$('[name="TipoPermiso"]').val("");
/*******************************FUNC*******************************/
function CargarTiposPermisos() {
    $.oysgroup.showLoading("Cargando", "#panelDatosSolicitarPermiso");
    $.get("/Permiso/GetTiposPermiso").done(function (data) {
        if (data.Code !== 1) return;
        var tps = data.data;

        for (var i = 0; i < tps.length; ++i) {
            $('#cboTipoPermiso').append('<option value="' + tps[i].Id + '">' + tps[i].Descripcion + '</option>');
        }

    }).always(function () {
        $.oysgroup.hideLoading("#panelDatosSolicitarPermiso");
    });
}

var clearForm = function () {
    $("#form").validate().resetForm();
    errorSolicitarPermiso.hide();
    $("#tit").text("");
    IdPermiso = 0;
    $('[name="NombreEmpleado"]').val("").removeClass("edited");
    $('[name="ApellidosEmpleado"]').val("").removeClass("edited");
    $('[name="TipoPermiso"]').val("").removeClass("edited");
    $('[name="FechaPermiso"]').val("").removeClass("edited");
    window.scrollTo(0, 0);
}

var enviarForm = function () {
    if ($("#form").validate().form()) {

        $.oysgroup.showLoading("Espere", "#panelDatosSolicitarPermiso");

        var param = objectifyForm($("#form").serializeArray());
        param.Id = IdPermiso;

        $.post("/Permiso/EditPermiso",
                {
                    param: param
                }).done(function (rta) {
                    if (rta.Code === 1) {
                        $.oysgroup.showMessageOk(rta.Mensaje);
                        clearForm();
                       
                    } else {
                        $.oysgroup.showMessageError(rta.Mensaje);
                    }
                })
                .always(function () {
                    clearForm();
                    $.oysgroup.hideLoading("#panelDatosSolicitarPermiso");
                });
    }
}

var objectifyForm = function (formArray) {
    var returnArray = {};
    for (var i = 0; i < formArray.length; i++) {
        returnArray[formArray[i]['name']] = formArray[i]['value'];
    }
    return returnArray;
}