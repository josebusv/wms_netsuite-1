$("#form_add_cliente").on("submit", function () {
    event.preventDefault();
    if ($("#form_add_cliente")[0].checkValidity() === false) {
        event.stopPropagation();
    } else {
        var $thisForm = $("#form_add_cliente");
        var formData = new FormData(this);
        var url = route("cliente_temporal.store");

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
            },
            type: "POST",
            encoding: "UTF-8",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function () {
                swal("Guardando cliente temporal, espera porfavor...", {
                    button: false,
                    timer: 3000,
                });
            },
        })
            .done(function (respuesta) {
                //console.log(respuesta);
                if (!respuesta.error) {
                    swal("Cliente Guardado Correctamente", {
                        icon: "success",
                        button: false,
                        timer: 3000,
                    });
                    selectionClienteTemp(respuesta);
                    $("#modal_add_cliente").modal("toggle");
                } else {
                    setTimeout(function () {
                        swal(respuesta.error, {
                            icon: "error",
                            button: false,
                            timer: 4000,
                        });
                    }, 2000);
                }
            })
            .fail(function (resp) {
                console.log(resp);
            });
    }
});

function selectionClienteTemp(response) {
    limpiarcamopos();
    $("#form_add_cliente").trigger("reset");
    $("#axlp_cliente").val(response.nombre_cliente);
    $("#envio_direccion").val(response.direccion_envio);
    $("#direccion_facturacion").val(response.dirrecion_factura);
    //$("#tipo_orden").val("3 - FERIA");
    $("#nombre_cliente").val(response.nombre_cliente);
    $("#numero_identificacion").val(response.documento);
    $("#catgoria_cliente").val(response.categoria);
    $("#telfono_cliente").val(response.telefono);
    $("#correo_cliente").val(response.correo);
    $("#id_direccion").val(response.id_direccion);
    $("#id_cliente").val(response.id_cliente);
    $("#tipo_cliente").val(response.tipo_cliente);
    consultarZonasCliente(response.zonas);
    $("#axlp_zona").prop("disabled", false);
}
