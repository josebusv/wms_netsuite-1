let clickInputCantidad = [];
const options2 = {
    style: 'currency',
    currency: 'USD'
};
const numberFormat2 = new Intl.NumberFormat('en-US', options2);

$('#div_lista_cotizaciones').hide();
var selectedCotizaciones = [];

var form_lista_cotizaciones = $('#form_lista_cotizaciones').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "paginate": false,
    "rowCallback": function( row, data ) {
        if ( $.inArray(data.DT_RowId, selectedCotizaciones) !== -1 ) {
            $(row).addClass('selected');
        }
    }
});

$('#axlp_zona').on('change', function () {
    let dato = this.value;
    if(dato != ''){

        borrarDatos();

        //cargar clientes
        let url_cliente = route('consolidacion.clientes', dato);
        //console.log(url_cliente);
        cargarClientes(url_cliente);

        let url2 = route('consolidacion.ubicacion', dato);
        cargarubicacion(url2);

    } else {
        borrarDatos();
    }

});

function borrarDatos(){

    $('#div_lista_cotizaciones').hide();

    $('#cliente option').remove();
    $('#direciones option').remove();
    $('#forma_de_pago option').remove();
    $('#nombre_ubicacion').val('');

    $('#consolidacion_cupo_feria').text('$ 0');
    $('#consolidacion_cantidad_item').text('$ 0');
    $('#consolidacion_subtotal').text('$ 0');
    $('#consolidacion_impuesto').text('$ 0');
    $('#cantidadcard').text('$ 0');
    $('#consolidacion_total').text('$ 0');

    form_lista_cotizaciones.clear().draw();

}

$('#cliente').on('change', function () {

    let dato = this.value;
    if(dato != ''){

        var id_cliente = dato;

        cargarDireccionesClientes(id_cliente);

        let lista_id = $('#axlp_zona').children(":selected").attr("id");
        cargarFormasDePago(id_cliente, lista_id);

    }

});

function cargarFormasDePago(id_cliente, lista_id){

    $('#forma_de_pago option').remove();
    $('#forma_de_pago').append('<option value="">SELECCIONE</option>');

    $('#cambiar_forma_pago option').remove();
    $('#cambiar_forma_pago').append('<option value="">SELECCIONE</option>');

    var url = route('consolidacion.obtenerMetodosPagos', [lista_id, id_cliente]);
    //console.log(url);

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
        success: function(response) {

            $('#forma_de_pago').append(response.data);
            $('#cambiar_forma_pago').append(response.data);
            //cargarInformacionZonas(response.zonas);

        },
        error: function(xhr, status, error){
            var err = eval("(" + xhr.responseText + ")");
            alert(err.Message);
        }
    });

}

function cargarubicacion(url) {

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
         beforeSend: function () {}
    }).done(function (respuesta) {

        //console.log(respuesta);
        $('#nombre_ubicacion').val(respuesta.nombre);
        $('#id_ubicacion').val(respuesta.id);

    }).fail(function (resp) {
        console.log(resp);
    });

}

$('#form_busqueda_consolidacion').on('submit', function(e) {
    event.preventDefault();
    if ($('#form_busqueda_consolidacion')[0].checkValidity() === false) {
        event.stopPropagation();
    } else {

        $('#consolidacion_cupo_feria').text('$ 0');
        $('#consolidacion_cantidad_item').text('$ 0');
        $('#consolidacion_subtotal').text('$ 0');
        $('#consolidacion_impuesto').text('$ 0');
        $('#cantidadcard').text('$ 0');
        $('#consolidacion_total').text('$ 0');
        form_lista_cotizaciones.clear().draw();

        // agregar data
        var $thisForm = $('#form_busqueda_consolidacion');
        var formData = new FormData(this);

        //ruta
        var url = route('consolidacion.obtenerCotizaciones');
        //console.log(url);

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            type: "POST",
            encoding:"UTF-8",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType:'json',
            beforeSend:function(){
                swal("Obteniendo datos, espere porfavor...", {
                    button: false,
                    timer: 2000
                });
            }
        }).done(function(respuesta){
            //console.log(respuesta);
            if (!respuesta.error) {

                $('#div_lista_cotizaciones').show();

                swal('Datos obtenidos, pintando...', {
                    icon: "success",
                    button: false,
                    timer: 2000
                });

                $('#consolidacion_cantidad_item').text(respuesta.cantidad_items);
                $('#consolidacion_subtotal').text(numberFormat2.format(respuesta.sum_subtotal));
                $('#consolidacion_impuesto').text(numberFormat2.format(respuesta.sum_impuesto));
                $('#consolidacion_total').text(numberFormat2.format(respuesta.sum_total));
                $('#consolidacion_cupo_feria').text(numberFormat2.format(respuesta.cupo_feria));

                //pintando otros datos
                $('#n_total_items').val(respuesta.cantidad_items);

                mostrarInformacionTabla(respuesta.data);

            } else {
                $('#div_lista_cotizaciones').hide();
                form_lista_cotizaciones.clear().draw();
                $("#tbodyProducto").html('');
                setTimeout(function(){
                    swal(respuesta.mensaje, {
                        icon: "error",
                        button: false,
                        timer: 3000
                    });
                },2000);
            }
        }).fail(function(resp){
            console.log(resp);
        });

    }
    $('#form_busqueda_consolidacion').addClass('was-validated');

});

function mostrarInformacionTabla(data){

    //obteniendo varia informacion zona
    let id_zona = $('#axlp_zona').find('option:selected').val();
    obtenerInformacionZonas(id_zona);

    //obteniendo datos
    let id_cliente = $('#cliente').find('option:selected').val();
    let id_direccion = $('#direciones').find('option:selected').val();
    let metodo_pago = $('#forma_de_pago').find('option:selected').val();

    //imprimiendo
    $('#cliente_id').val(id_cliente);
    $('#direccion_id').val(id_direccion);
    $('#metodo_pago_enviar').val(metodo_pago);

    if (data.length > 0) {
        data.forEach(element => {

            var metodo_pago = '';
            if(element['metodo_pago'] == '2'){
                metodo_pago = 'CREDITO';
            } else {
                metodo_pago = 'CONTADO';
            }

            form_lista_cotizaciones.row.add([
                element['id'],
                element['total_items']+
                `<input type="hidden" id="total_items_${element["id"]}" value="${element['total_items']}" style="width: 5px;">`,
                numberFormat2.format(element['subtotal'])+
                `<input type="hidden" id="subtotal_listado_${element["id"]}" value="${element['subtotal']}" style="width: 5px;">`,
                numberFormat2.format(element['impuestos'])+
                `<input type="hidden" id="impuestos_listado_${element["id"]}" value="${element['impuestos']}" style="width: 5px;">`,
                numberFormat2.format(element['total'])+
                `<input type="hidden" id="total_listado_${element["id"]}" value="${element['total']}" style="width: 5px;">`,
                metodo_pago,
                element['centro_costo']+
                `<input type="hidden" name="ids_transferencistas[]" value="${element['user_id']}">`,
            ]).node().id = element['id'];

            form_lista_cotizaciones.draw(false);

        });
    }

}

function cargarClientes(url){

    $('#cliente option').remove();
    let option = '';
    //console.log(url);

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
        beforeSend: function () {}
    }).done(function (respuesta) {

        //console.log(respuesta);
        $('#cliente').append('<option value="">SELECCIONE</option>');
        respuesta.data.forEach(element => {
            option = option + "<option value= " + element.id + " >" + element.documento + " - " + element.nombre + "</option>";
        });
        $('#cliente').append(option);

    }).fail(function (resp) {
        console.log(resp);
    });

}

function cargarDireccionesClientes(id){

    var url = route('consolidacion.direccionCliente', id);
    $('#direciones option').remove();
    let option = '';

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
        beforeSend: function () {}
    }).done(function (respuesta) {

        //console.log(respuesta);
        $('#direciones').append('<option value="">SELECCIONE</option>');
        respuesta.data.forEach(element => {
            option = option + "<option value= " + element.id + " >" + element.nombre_sucursal + " - " + element.direccion_corta + "</option>";
        });
        $('#direciones').append(option);

    }).fail(function (resp) {
        console.log(resp);
    });

}

function obtenerInformacionZonas(id){

    var url = route('consolidacion.obtenerInformacionZonas', id);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
        beforeSend: function () {}
    }).done(function (respuesta) {

        //console.log(respuesta);

        $('#quiencae_venta').val(respuesta.data.responsable_id);
        $('#lista_id').val(respuesta.data.lista_id);
        $('#zona_id').val(respuesta.data.id);
        $('#ubicacion_id').val(respuesta.data.ubicacion_id);
        $('#ubicacion_id').val(respuesta.data.ubicacion_id);
        $('#clase_id').val(respuesta.data.clase_id);

    }).fail(function (resp) {
        console.log(resp);
    });

}

$('#form_lista_cotizaciones tbody').on('click', 'tr', function () {
    var id = this.id;
    var index = $.inArray(id, selectedCotizaciones);

    if ( index === -1 ) {
        selectedCotizaciones.push( id );

        var total_items = $('#total_items_'+id+'').val();
        var subtotal = $('#subtotal_listado_'+id+'').val();
        var impuestos = $('#impuestos_listado_'+id+'').val();
        var total = $('#total_listado_'+id+'').val();

        clickInputCantidad.push({
            "id": id,
            "total_items": total_items,
            "subtotal": subtotal,
            "impuestos": impuestos,
            "total": total,
        });

    } else {

        var nuevo = [];
        clickInputCantidad.forEach(element => {
            if(element.id != id){
                nuevo.push({
                    "id": element.id,
                    "total_items": element.total_items,
                    "subtotal": element.subtotal,
                    "impuestos": element.impuestos,
                    "total": element.total,
                })
            }
        });
        clickInputCantidad.pop();
        clickInputCantidad = nuevo;

        selectedCotizaciones.splice( index, 1 );
    }

    $(this).toggleClass('selected');

    $('#ids_cotizaciones').val(selectedCotizaciones);
    console.log(clickInputCantidad);

    //ejecutar funion calcular seleccionados
    calcularNuevoTotalSeleccionados();
} );

function calcularNuevoTotalSeleccionados(){

    var nueva_cantidad = 0;
    var nuevo_subtotal = 0;
    var nuevos_impuestos = 0;
    var nuevo_total = 0;

    if(clickInputCantidad.length > 0){
        clickInputCantidad.forEach(element => {

            nueva_cantidad += parseInt(element.total_items);
            nuevo_subtotal += parseInt(element.subtotal);
            nuevos_impuestos += parseInt(element.impuestos);
            nuevo_total += parseInt(element.total);

        });
    }

    $('#consolidacion_cantidad_item_listado').text(nueva_cantidad);
    $('#consolidacion_subtotal_listado').text(numberFormat2.format(nuevo_subtotal));
    $('#consolidacion_impuesto_listado').text(numberFormat2.format(nuevos_impuestos));
    $('#consolidacion_total_listado').text(numberFormat2.format(nuevo_total));

}
