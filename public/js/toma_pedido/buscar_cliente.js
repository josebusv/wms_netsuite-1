//desactivar select zona
$('#axlp_zona').prop('disabled', true);

let contador = 0;

let table_busqueda_clientes = $('#table_id').DataTable({
    "ordering": true,
    "responsive": true,
    "iDisplayLength": 6,
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    }
});

$('#axlp_cliente').on('keyup', function () {
    controltoast = true;
    contador++;
    if ($(this).val().length > 3)  {

        table_busqueda_clientes.search(this.value).draw();
        var valor_busqueda = this.value.toUpperCase();

        //ruta
        var url = route('tomar_pedido.buscarCliente', valor_busqueda);
        console.log(url);

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            type: "GET",
            encoding:"UTF-8",
            url: url,
            dataType:'json',
            beforeSend:function(){
                swal("Cargando datos, espere porfavor...", {
                    button: false,
                    timer: 5000
                });
            }
        }).done(function(respuesta){

            //console.log(respuesta);
            $('#modal_buscar_cliente').modal('show');
            table_busqueda_clientes.ajax.url(url).load();

        }).fail(function(resp){
            console.log(resp);
        });

    }
});

function exittoast() {
    contador = 0;
    $('#axlp_cliente').val('');
}


function btnSelectCliente(array){
    limpiarcamopos();
    //console.log(array);

    //pintar informacion
    $('#axlp_cliente').val(array.nombre_sucursal);
    $('#envio_direccion').val(array.direccion_envio);
    $('#direccion_facturacion').val(array.dirrecion_factura);
    $('#envio_a').val(array.envio_a);
    $('#tipo_orden').val('3 - FERIA');
    $('#nombre_cliente').val(array.nombre_cliente);
    $('#numero_identificacion').val(array.documento);
    $('#catgoria_cliente').val(array.categoria);
    $('#telfono_cliente').val(array.telefono);
    $('#correo_cliente').val(array.correo);
    $('#id_direccion').val(array.id_direccion);
    $('#id_cliente').val(array.id_cliente);

    //desabilitar
    $('#envio_direccion').prop('disabled', true);
    $('#direccion_facturacion').prop('disabled', true);

    //consultar zonas
    consultarZonasCliente(array.zonas);

    /*agregar meotodo de pago
    var metodo_pago = array.metodo_pago;
    $('#select_metodo_pago option').remove();
    $('#select_metodo_pago').append($('<option>', {value: '', text: '- Seleccione -'}));
    if(metodo_pago === '1'){
        $('#select_metodo_pago').append($('<option>', {value: metodo_pago, text: 'CONTADO'}));
    } else {
        $('#select_metodo_pago').append($('<option>', {value: 1, text: 'CONTADO'}));
        $('#select_metodo_pago').append($('<option>', {value: 2, text: 'CREDITO'}));
    }
    */

    $('#axlp_zona').prop('disabled', false);

    $('#modal_buscar_cliente').modal('hide');

}

function consultarZonasCliente(zonas){
    //console.log(zonas);
    var id_zonas = [];
    var select = $('#axlp_zona');
    var agregar = "";
    zonas.forEach(element => {
        agregar += `<option value="${element.id}">${element.nombre}</option>`;
    });
    $('#axlp_zona').append(agregar);
}

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
}


