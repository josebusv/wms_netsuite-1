$('#axlp_zona').on('change', function() {
    var dato =  $(this).find(":selected").val();

    if(dato == ''){
        $('#select_metodo_pago').prop('disabled', true);
    } else {

        $('#select_metodo_pago').prop('disabled', false);
        var url = route('tomar_pedido.obtenerZonasCliente', dato);

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            type: "GET",
            encoding: "UTF-8",
            url: url,
            dataType: 'json',
            success: function(response) {

                //console.log(response);
                cargarInformacionZonas(response.zonas);

            },
            error: function(xhr, status, error){
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            }
        });
    }
});

function cargarInformacionZonas(informacion){

    $('#quien_cae_venta option').remove();
    $('#quien_cae_venta').append($('<option>', {value: informacion.responsable_id, text: informacion.responsable_nombre}));

    $('#clase option').remove();
    $('#clase').append($('<option>', {value: informacion.clase_id, text: informacion.clase_nombre}));

    $('#ubicacion option').remove();
    $('#ubicacion').append($('<option>', {value: informacion.ubicacion_id, text: informacion.ubicacion_nombre}));

    $('#lista_precio option').remove();
    $('#lista_precio').append($('<option>', {value: informacion.lista_precio_id, text: informacion.lista_precio_nombre}));

    //ejecutar funcion carga metodo pago
    var id_cliente = $('#id_cliente').val();
    funcionCargarMetodoPagos(informacion.lista_precio_id, id_cliente);

}

function funcionCargarMetodoPagos(lista_precio_id, id_cliente){

    $('#select_metodo_pago option').remove();
    $('#select_metodo_pago').append($('<option>', {value: '', text: '- Seleccione -'}));
    var url = route('tomar_pedido.obtenerMetodosPagos', [lista_precio_id, id_cliente]);

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
        success: function(response) {

            //console.log(response);
            $('#select_metodo_pago').append(response.data);
            //cargarInformacionZonas(response.zonas);

        },
        error: function(xhr, status, error){
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });

}
