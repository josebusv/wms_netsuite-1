
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

                //cargar productos
                //cargarDatosSelectProductos();

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

function cargarDatosSelectProductos(){

    var lista_id = $('#lista_precio').find(":selected").val();
    var ubicacion_id = $('#ubicacion').find(":selected").val();
    var metodo_pago = 1;
    var url = route('transferencia.obtenerListadoProductos', [lista_id, ubicacion_id, metodo_pago]);
    console.log(url);

    var data = [];

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
            response.forEach(element => {


                data.push({
                    id: element.id,
                    text: `PRODUCTO: ${element.nombre_item}`,
                    html: `
                        <div style="color:black">${element.nombre_item}</div>
                        <div><stronng>EAN: </stronng>${element.ean} - <stronng>GENERICO: </stronng>${element.generico}</div>
                        <div><stronng>SALDO: </stronng> -  <stronng>PRECIO UNIT: </stronng>${element.generico}</div>
                    `,
                });


                /*
                var newOption = new Option(element.ean + ' - ' + element.nombre_item, element.id, false, false);
                $('#select_producto').append(newOption).trigger('change');
                */

            });


            $("#select_producto").select2({
                data: data,
                //minimumInputLength: 4,
                escapeMarkup: function(markup) {
                  return markup;
                },
                templateResult: function(data) {
                  return data.html;
                },
                templateSelection: function(data) {
                  return data.text;
                }
            })


        },
        error: function(xhr, status, error){
            var err = eval("(" + xhr.responseText + ")");
        }
    });

/*
    var data = [{
      id: 0,
      text: '<div style="color:green">enhancement</div>',
      html: '<div style="color:green">enhancement</div><div><b>Select2</b> supports custom themes using the theme option so you can style Select2 to match the rest of your application.</div>',
      title: 'enchancement'
    }, {
      id: 1,
      text: '<div style="color:red">bug</div>',
      html: '<div style="color:red">bug</div><div><small>This is some small text on a new line</small></div>',
      title: 'bug'
    }];

    $("select_producto").select2({
      data: data,
      escapeMarkup: function(markup) {
        return markup;
      },
      templateResult: function(data) {
        return data.html;
      },
      templateSelection: function(data) {
        return data.text;
      }
    })
    */

}
