//---------------------------------
$.hostname = $("#baseUrl").val();
var img;
//---------------------------------
//#region FUNCIONES
//---------------------------------
reducePhotoSize = function (img, width, height) {

    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
};

uploadPhoto = function () {
    var src = $("#file_preview").find('img').attr('src');
    if (src === "" || src === undefined) {
        $.oysgroup.showMessageWarning("Seleccione una foto!");
        return;
    }
    //----------------------------
    function processPhoto() {
        var newPhoto = reducePhotoSize(img, 30, 30);
        //----------------------------
        var formData = new FormData();
        //----------------------------
        formData.append("foto", newPhoto);
        //----------------------------
        $.ajax({
            url: $.hostname + "Sistema/CambiarFoto",
            type: "POST",
            contentType: false,
            processData: false,
            cache: false,
            data: formData,
            success: function (data) {
                if (data.Code === 1) {
                    $.oysgroup.showMessageOk(data.Mensaje);
                    $("#profilePicture").attr('src', data.Foto).animate({ opacity: 1 }, 'slow');
                    $("#ModalCambiarFotoPerfil").modal('hide');
                    img = null;
                }
                else {
                    $.oysgroup.showMessageError(data.Mensaje);
                }
            }
        });
    }
    //----------------------------
    img = new Image;
    img.onload = processPhoto;
    img.src = src;
    //----------------------------
}
//---------------------------------
//#endregion
//---------------------------------
//#region EVENTOS
//---------------------------------
$("#file").change(function (e) {
    var input = document.getElementById("file");
    var file = input.files[0];
    if (file === null || file === undefined) return;

    if (file.size > 2 * 1024 * 1024) {
        $("#file_preview").find("img").attr("src", "");
        $("#file").val("");
        $("#file").trigger("change");
        $.oysgroup.showMessageWarning("El archivo no puede superar los 2MB");
    }
});

$("#changeProfilePicture").unbind("click");
$("#changeProfilePicture").bind("click", function (event) {
    $("#ModalCambiarFotoPerfil").modal('show');
});

$("#btnRemoveProfilePic").unbind("click");
$("#btnRemoveProfilePic").bind("click", function (event) {
    $("#file_preview").find('img').attr('src', '').animate({ opacity: 1 }, 'slow');
    $("#file").val("");
    $("#file").trigger("change");
});

$('#ModalCambiarFotoPerfil').on('hide', function () {
    $("#file_preview").find('img').attr('src', '').animate({ opacity: 1 }, 'slow');
    $("#file").val("");
    $("#file").trigger("change");
});

$("#btnChangeProfilePic").unbind("click");
$("#btnChangeProfilePic").bind("click", function (event) {
    uploadPhoto();
});
//---------------------------------
//#endregion
//---------------------------------
