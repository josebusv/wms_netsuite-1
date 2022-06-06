$( document ).ready(function() {

    //console.log(route('transferencia.getClientes'));

    $('#axlp_cliente').typeahead({
        minLength: 4,
        source: function (query, process) {
            return $.get(route('transferencia.getClientes'), {
                query: query
            }, function (data) {
                return process(data);
            });
        },
        updater: function(selection){
            console.log($('ul #typeahead')[0]);

            $('#btn_eliminar_cliente').prop('disabled', false);
            btnSelectCliente(selection);
            return selection.nombre_sucursal;
        }
    });

});

function btnSelectCliente(array){
    limpiarcamopos();

    var direccion_id = array.id;
    var url_consulta = route('transferencia.informacionCliente', direccion_id);

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url_consulta,
        dataType: 'json',
        success: function(response) {

            //console.log(response);
            //pintar informacion
            $('#axlp_cliente').val(response.nombre_sucursal);
            $('#envio_direccion').val(response.direccion_envio);
            $('#direccion_facturacion').val(response.dirrecion_factura);
            $('#envio_a').val(response.envio_a);
            $('#tipo_orden').val('3 - FERIA');
            $('#nombre_cliente').val(response.nombre_cliente);
            $('#numero_identificacion').val(response.documento);
            $('#catgoria_cliente').val(response.categoria);
            $('#telfono_cliente').val(response.telefono);
            $('#correo_cliente').val(response.correo);
            $('#id_direccion').val(response.id_direccion);
            $('#id_cliente').val(response.id_cliente);

            //desabilitar
            $('#envio_direccion').prop('disabled', true);
            $('#direccion_facturacion').prop('disabled', true);

            //consultar zonas
            consultarZonasCliente(response.zonas);

            $('#axlp_zona').prop('disabled', false);

        },
        error: function(xhr, status, error){
            var err = eval("(" + xhr.responseText + ")");
        }
    });

}

function consultarZonasCliente(zonas){
    $('#axlp_zona option').remove();
    $('#axlp_zona').append('<option value="">- SELECCIONAR -</option>');
    var agregar = "";
    zonas.forEach(element => {
        agregar += `<option value="${element.id}">${element.nombre} :: ${element.responsable}</option>`;
    });
    $('#axlp_zona').append(agregar);
}

$('#btn_eliminar_cliente').on('click', function(params) {
    //$('#axlp_cliente').typeahead('destroy');
    $('#btn_eliminar_cliente').prop('disabled', true);
    //limpiamos campos
    limpiarcamopos();
});

function limpiarcamopos(){
    $('#axlp_zona option').remove();
    $('#axlp_zona').append('<option value="">SELECCIONE ZONA</option>');
    $('#axlp_cliente').val('');
    $('#envio_direccion').val('');
    $('#direccion_facturacion').val('');
    $('#envio_a').val('');
    $('#tipo_orden').val('');
    $('#nombre_cliente').val('');
    $('#numero_identificacion').val('');
    $('#catgoria_cliente').val('');
    $('#telfono_cliente').val('');
    $('#correo_cliente').val('');

    $('#id_direccion').val('');
    $('#id_cliente').val('');
}
