$.oysgroup = {};
$.oysgroup.hostname = $("#baseUrl").val();


$.oysgroup.showMessageError = function (msg) {
    toastr.error(msg);
};
$.oysgroup.showMessageWarning = function (msg) {
    toastr.warning(msg);
};
$.oysgroup.showMessageInfo = function (msg) {
    toastr.info(msg);
};
$.oysgroup.showMessageOk = function (msg) {
    toastr.success(msg);
};
$.oysgroup.showBasicAlert = function(msg) {
    bootbox.alert(msg);
}

$.oysgroup.parseDt = dt => new Date(parseInt(/-?\d+/.exec(dt)[0]));


$.oysgroup.showLoading = function(msg, element) {
    if (element === undefined || element === null) {
        App.blockUI({
            boxed: true,
            message: msg
        });
    } else {
        App.blockUI({
            boxed: true,
            message: msg,
            target: element
        });
    }
};
$.oysgroup.hideLoading = function (element) {
    if (element === undefined || element === null) {
        App.unblockUI();
    } else {
        App.unblockUI(element);
    }
};


$.oysgroup.Humanizar = function () {
    $(".humanizable").each(function (i, o) {
        var $o = $(o);
        $o.text(moment.duration(moment(new Date()) - moment(new Date(parseFloat($o.attr("val"))))).humanize());
    });
}


$.oysgroup.llenarCombos = function (combo, ruta, base, idToSelect, sinPreSelect, loading ) {
    
    return $.get($.oysgroup.hostname + ruta).done(function (data) {
        if (loading != "" && loading != undefined) {
            $.oysgroup.showLoading("Espere", "#" + loading);
        }   
        if (data == null || data.data == null) console.log("Combo sin datos: [" + ruta + "] ; [" + data + "]");
        $("#" + combo + " > option").remove();

        var html = "";
        if (base !== "" && base != undefined) {
            html = base;
        }
        if (sinPreSelect !== true) $("#" + combo).append($("<option></option>").val("").html(html));
        for (var i = 0; i < data.data.length; i++) {
            $("#" + combo).append($("<option></option>").val(data.data[i].id).html(data.data[i].text));
        }
        if (idToSelect != "" && idToSelect != undefined) {
            $('#' + combo).val(idToSelect);
            $('#' + combo).val(idToSelect).addClass(idToSelect == null ? "" : "edited").trigger('change');
        } else {
            $('#' + combo).val("");
            $('#' + combo).val("").removeClass("edited").trigger('change');
        }
        $('#' + combo).trigger('chosen:updated');
    }).always(function () {
        if (loading != "" && loading != undefined) {
            $.oysgroup.hideLoading("#" + loading);
        }
    });
};


$.oysgroup.logout = function () {

    $.oysgroup.showMessageOk("Sesión Finalizada Exitosamente");

    $.post($.hostname + "Sistema/Logout")
        .done(function (data) {
            setTimeout(function () { window.location.replace($.hostname + "/Login"); }, 500);
    });
}


$.oysgroup.disableElementsDiv = function (elem) {
    $(elem).find(':input').prop('disabled', true);
    $('#' + $(elem).attr('id') + ' a').click(function (e) {
        e.preventDefault();
    });
}

$.oysgroup.enableElementsDiv = function (elem) {
    $(elem).find(':input').prop('disabled', false);
    $('#' + $(elem).attr('id') + ' a').unbind("click");
}

$.oysgroup.encode64 = function (input) {
    input = escape(input);
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
            enc4 = 64;
        }

        output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
    } while (i < input.length);

    return output;
};
$.oysgroup.decode64 = function (input) {
    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
    var base64test = /[^A-Za-z0-9\+\/\=]/g;
    if (base64test.exec(input)) {
        alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }
    } while (i < input.length);

    return unescape(output);
};