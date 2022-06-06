// cargo aqui direcciones de los clientes y control de cambio en el select
$('#direciones').on('change', function(){
    var direccion_id = $(this).find(':selected').val();
    if(direccion_id != ''){

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
                $('#envio_direccion').val(response.direccion_envio);
                $('#direccion_facturacion').val(response.dirrecion_factura);
                $('#envio_a').val(response.envio_a);
                $('#nombre_cliente').val(response.nombre_cliente);
                $('#numero_identificacion').val(response.documento);
                $('#catgoria_cliente').val(response.categoria);
                $('#telfono_cliente').val(response.telefono);
                $('#correo_cliente').val(response.correo);
                $('#id_direccion').val(response.id_direccion);
                $('#id_cliente').val(response.id_cliente);

            },
            error: function(xhr, status, error){
                var err = eval("(" + xhr.responseText + ")");
            }
        });

    } else {
        limpiarcamopos();
    }
});

//funciona para limpiar campos
function limpiarcamopos(){
    $('#envio_direccion').val('');
    $('#direccion_facturacion').val('');
    $('#envio_a').val('');
    $('#nombre_cliente').val('');
    $('#numero_identificacion').val('');
    $('#catgoria_cliente').val('');
    $('#telfono_cliente').val('');
    $('#correo_cliente').val('');
    $('#id_direccion').val('');
    $('#id_cliente').val('');
}

//datos principales
var lista_id = $('#lista_precio').find(":selected").val();
var ubicacion_id = $('#ubicacion').find(":selected").val();
var metodo_pago = $('#select_metodo_pago').find(":selected").val();
var id_pedido = $('#pedido_id').val();
let clickInputCantidad = [];
let datos_select_productos = [];

const options2 = {
    style: 'currency',
    currency: 'USD'
};
const numberFormat2 = new Intl.NumberFormat('en-US', options2);

//definiendo la primera tabla de productos
var tabla_detalle_seleccion = $('#tabla_detalle_seleccion').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "paging": false,
    "order": [[ 2, "asc" ]],
    "columns": [
        {
            "data": "button"
        },
        {
            "data": "boton_ver"
        },
        { "data": "id"},
        { "data": "nombre_item", "width": "30%" },
        { "data": "input" },
        { "data": "sin_teleferia" },
        { "data": "con_teleferia" },
        { "data": "iva" },
        { "data": "total_sin_iva" },
        { "data": "total_con_iva" },
        { "data": "generico", "visible": false },
        { "data": "linea", "visible": false },

    ],
});

//definiendo la segunda tabla, la del modal
var tabla_articulo = $('#tabla_articulo').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "processing": true,
    "paging": true,
    "pageLength" : 150,
    "order": [[ 4, "asc" ]],
    "columns": [
        {
            "className":      'dt-control',
            "orderable":      false,
            "data":           null,
            "defaultContent": ''
        },
        { "data": "ean", "orderData": 1 },
        { "data": "nombre_item" },
        { "data": "linea" },
        { "data": "disponible" },
        { "data": "input" },
        { "data": "sin_teleferia" },
        { "data": "porciento_teleferia" },
        { "data": "con_teleferia" },
        { "data": "iva" },
        { "data": "con_iva" },
        { "data": "precio_max_venta" },
        { "data": "linea", visible: false },
        { "data": "generico", visible: false }
    ],
    "rowCallback": function( row, data ) {
        if ( $.inArray(data.DT_RowId, datos_select_productos) !== -1 ) {
            $(row).addClass('selected');
        }
    }
});

// cargar la informacion de la primera tabla
var url_ajax_tabla_detalle = route('pedido.editarListadoProductos', id_pedido);
$(document).ready(function() {

    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
        },
        type: "GET",
        encoding:"UTF-8",
        url: url_ajax_tabla_detalle,
        dataType:'json',
        beforeSend:function(){
            swal("Cargando información...", {
                button: false
            });
        }
    }).done(function(respuesta){

        //console.log(respuesta);

        if (respuesta.data.length > 0) {
            respuesta.data.forEach(element => {

                tabla_detalle_seleccion.row.add({

                    "button": element["boton"],
                    "boton_ver": element["boton_ver"],
                    "nombre_item": element["nombre_item"],
                    "input": element["input"],
                    "sin_teleferia": element["sin_teleferia"],
                    "con_teleferia": element["con_teleferia"],
                    "iva": element["iva"]+"%",
                    "total_sin_iva": element["total_sin_iva"],
                    "total_con_iva": element["total_con_iva"],
                    "id": element["id"],
                    "generico": element["generico"],
                    "linea": element["linea"],
                    "embalaje": element["embalaje"],
                    "ean": element["ean"],

                }).node().id = element['DT_RowId'];
                tabla_detalle_seleccion.draw(false);

                //primer array de datos
                clickInputCantidad.push({
                    "id": element['DT_RowId'],
                    "cantidad": element['cantidad'],
                    "transferencia_id": element["transferencia_id"],
                    "transferencista_id": element["transferencista_id"]
                });

                //segundo array de datos
                datos_select_productos.push(element['DT_RowId']);
            });
        }

        swal("Productos Cargados", {
            icon: "success",
            button: false,
            timer: 2000
        });

        console.log(clickInputCantidad);
        console.log(datos_select_productos);

        $('#select_metodo_pago').prop('disabled', false);
        $('#btn_buscar_articulos').prop('disabled', false);

        cargarLosProductosModal();

    }).fail(function(resp){
        console.log(resp);
    });

});

// Funcion para cargar los productos en el modal
function cargarLosProductosModal(){

    var nuevo_metodo_pago = $('#select_metodo_pago').find(":selected").val();
    var url_ajax = route('pedido.obtenerListadoProductosEditar', [lista_id, ubicacion_id, nuevo_metodo_pago]);
    tabla_articulo.ajax.url(url_ajax).load();
    tabla_articulo.columns.adjust().draw();

    setTimeout(function(){
        if(clickInputCantidad.length > 0){
            clickInputCantidad.forEach(element => {
                //console.log($('#tbody_tabla_articulos #'+element).closest('tr'));
                $('#tabla_articulo #'+element.id).closest('tr').addClass('selected');
                $('#input_cantidad_' + element.id + '').val(element.cantidad);
            });
        }
    }, 3000);

}

//funcion para cargar nuevos cambios en la tabla productos modal
$('#btn_buscar_articulos').on('click', function(){
    if(clickInputCantidad.length > 0){
        $('#tabla_articulo tr').closest('tr').removeClass('selected');
        clickInputCantidad.forEach(element => {
            //console.log($('#tbody_tabla_articulos #'+element).closest('tr'));
            $('#tabla_articulo #'+element.id).closest('tr').addClass('selected');
            $('#input_cantidad_' + element.id + '').val(element.cantidad);
        });
    }
});

// ahora funcion para poder eliminar un producto de la primera tabla de productos
$('#tabla_detalle_seleccion').on("click", "#btn_eliminar_del_detalle", function(){

    var id_tr = $(this).closest('tr')[0].id;
    //console.log(id_tr);

    swal({
        title: "Eliminar",
        text: "Seguro en eliminar este producto?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
            $('#tbody_tabla_articulos #'+id_tr).closest('tr').removeClass('selected');
            $('#input_cantidad_' + id_tr + '').val(0);
            $('#input_cantidad_' + id_tr + '').prop( "disabled", true );

            if(clickInputCantidad.length === 1){

                datos_select_productos.pop();
                $('#ids_selectds').val(datos_select_productos);
                clickInputCantidad.pop();
                tabla_detalle_seleccion.row($(this).parents('tr')).remove().draw(false);

                $('#cantidadcard').text(0);
                $('#cantidadSolicitado').text(0);
                $('#subtotal').text(numberFormat2.format(0));
                $('#totalimpuestos').text(numberFormat2.format(0));
                $('#total').text(numberFormat2.format(0));

                $('#cantidad_items').val(0);
                $('#cantidad_solicitado').val(0);
                $('#sub_total').val(0);
                $('#total_impuestos').val(0);
                $('#total_final').val(0);

                $('.btn_guardar').prop('disabled', true);

            } else {

                datos_select_productos = arrayRemove(datos_select_productos, id_tr);
                $('#ids_selectds').val(datos_select_productos);

                var nuevo = [];
                clickInputCantidad.forEach(element => {
                    if(element.id != id_tr){
                        nuevo.push({
                            "id": element.id,
                            "cantidad": element.cantidad,
                            "transferencia_id": element.transferencia_id,
                            "transferencista_id": element.transferencista_id
                        })
                    }
                });
                clickInputCantidad.pop();
                clickInputCantidad = nuevo;

                //console.log(clickInputCantidad);

                tabla_detalle_seleccion.row($(this).parents('tr')).remove().draw(false);

                //actualizar
                obtenerDatosTableProductos();

            }
        }
      });

});

//funcion para eliminar un dato del array
function arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
};

//funcion para saber un cambio en el metodo de pago
$('#select_metodo_pago').on('change', function() {
    var dato =  $(this).find(":selected").val();
    if(dato != ''){
        $('#btn_buscar_productos').prop('disabled', false);
        cargarLosProductosModal();
        if(datos_select_productos.length > 0){
            obtenerDatosTableProductos();
        }

    } else {
        $('#btn_buscar_productos').prop('disabled', true);
    }
});

//funcion para cuando exista uncambio en el metodo de pago o nuevos productos o cancelacion actualizar
function obtenerDatosTableProductos(){

    if(clickInputCantidad.length > 0){

        //limpia la tabla
        tabla_detalle_seleccion.clear().draw();

        var data = clickInputCantidad;
        var metodo_pago = $('#select_metodo_pago').find(":selected").val();
        var lista_id = $('#lista_precio').find(":selected").val();
        var url = route('pedido.editarBbtenerInformacionProducto');

        // agrego la data del form a formData
        var formData = new FormData();
        formData.append('data', JSON.stringify(data));
        formData.append('metodo_pago', metodo_pago);
        formData.append('cantidades', null);
        formData.append('lista', lista_id);

        $.ajax({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf_token"]').attr('content')
            },
            type: "POST",
            encoding:"UTF-8",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType:'json',
            beforeSend:function(){
                swal("Cargando información...", {
                    button: false
                });
            }
        }).done(function(respuesta){

            //console.log(respuesta);

            if (respuesta.data.length > 0) {
                respuesta.data.forEach(element => {

                    tabla_detalle_seleccion.row.add({

                        "button": element["boton"],
                        "boton_ver": element["boton_ver"],
                        "nombre_item": element["nombre_item"],
                        "input": element["input"],
                        "sin_teleferia": element["sin_teleferia"],
                        "con_teleferia": element["con_teleferia"],
                        "iva": element["iva"]+"%",
                        "total_sin_iva": element["total_sin_iva"],
                        "total_con_iva": element["total_con_iva"],
                        "id": element["id"],
                        "generico": element["generico"],
                        "linea": element["linea"],
                        "embalaje": element["embalaje"],
                        "ean": element["ean"],

                    }).node().id = element['DT_RowId'];
                    tabla_detalle_seleccion.draw(false);

                });
            }

            $('#cantidadcard').text(respuesta.informacion_global.items_cant);
            $('#cantidadSolicitado').text(respuesta.informacion_global.items_solicitado);
            $('#subtotal').text(numberFormat2.format(respuesta.informacion_global.subtotal));
            $('#totalimpuestos').text(numberFormat2.format(respuesta.informacion_global.impuesto));
            $('#total').text(numberFormat2.format(respuesta.informacion_global.total));

            $('#cantidad_items').val(respuesta.informacion_global.items_cant);
            $('#cantidad_solicitado').val(respuesta.informacion_global.items_solicitado);
            $('#sub_total').val(respuesta.informacion_global.subtotal);
            $('#total_impuestos').val(respuesta.informacion_global.impuesto);
            $('#total_final').val(respuesta.informacion_global.total);

            swal("Productos Cargados", {
                icon: "success",
                button: false,
                timer: 2000
            });

            $('.btn_guardar').prop('disabled', false);

        }).fail(function(resp){
            console.log(resp);
        });

    } else {

        swal('No seleccionaste ningun producto!', {
            icon: "error",
            button: false,
            timer: 2000
        });

    }

}

//para ver mas informacion del producto
function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>ID:</td>'+
            '<td>'+d.id+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Generico:</td>'+
            '<td>'+d.generico+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Linea:</td>'+
            '<td>'+d.linea+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Embalaje:</td>'+
            '<td>'+d.embalaje+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Cantidad Maxima:</td>'+
            '<td>'+d.cantidad_maxima+'</td>'+
        '</tr>'+
    '</table>';
}

//funcion para mosrar mayor informacion en el modal productos
$('#tabla_articulo tbody').on('click', 'td.dt-control', function () {
    var tr = $(this).closest('tr');
    var row = tabla_articulo.row( tr );

    if ( row.child.isShown() ) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass('shown');
    }
    else {
        // Open this row
        row.child( format(row.data()) ).show();
        tr.addClass('shown');
    }
} );

//funcion para seleccionar una fila en el modal productos
$('#tabla_articulo tbody').on('click', 'tr', function () {
    var id = this.id;
    var index = $.inArray(parseInt(id), datos_select_productos);
    $('#input_cantidad_' + id + '').val(1);

    if ( index === -1 ) {
        datos_select_productos.push( parseInt(id) );

        let cantidad = $('#input_cantidad_' + id + '').val();
        clickInputCantidad.push({
            "id": parseInt(id),
            "cantidad": parseInt(cantidad),
            "transferencia_id": null,
            "transferencista_id": null
        });

        //habilitar input
        $('#input_cantidad_' + id + '').prop( "disabled", false );
        $('#input_cantidad_' + id + '').focus();
    } else {

        var nuevo = [];
        clickInputCantidad.forEach(element => {
            if(element.id != id){
                nuevo.push({
                    "id": parseInt(element.id),
                    "cantidad": parseInt(element.cantidad),
                    "transferencia_id": element.transferencia_id,
                    "transferencista_id": element.transferencista_id
                })
            }
        });
        clickInputCantidad.pop();
        clickInputCantidad = nuevo;

        //desabilitar input
        $('#input_cantidad_' + id + '').prop( "disabled", true );
        $('#input_cantidad_' + id + '').val(0);

        datos_select_productos.splice( index, 1 );
    }

    $(this).toggleClass('selected');
    $('#ids_selectds').val(datos_select_productos);
    //console.log(datos_select_productos);
    console.log(clickInputCantidad);
} );

//funcion para el evento en el input del modal productos
function funcionCalcularTotales(params){

    $('#input_cantidad_' + params + '').on('keyup mouseup', function (evt) {

        //solo aceptar numeros
        this.value = this.value.replace(/[^0-9]/g,'');

        //cantidad maxima
        let cantidad_maxima = $('#input_maxima_' + params + '').val();

        //obtener cantidades
        let cantidad = $('#input_cantidad_' + params + '').val();

        if(cantidad > 0){
            //agregar
            var elementIndex = clickInputCantidad.findIndex((obj => obj.id == params));
            clickInputCantidad[elementIndex].cantidad = parseInt(cantidad);
            var nuevo_cantidad = clickInputCantidad[elementIndex].cantidad;

            if(cantidad_maxima > 0){

                if(nuevo_cantidad > cantidad_maxima){

                    swal({
                        title: "Advertencia!",
                        text: "No puedes agregar una cantidad mayor a '" + cantidad_maxima + "'",
                        icon: "warning",
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {

                            clickInputCantidad[elementIndex].cantidad = parseInt(cantidad_maxima);
                            $('#input_cantidad_' + params + '').val(cantidad_maxima);
                            $('#input_cantidad_' + params + '').focus();

                        }
                    });

                } else {

                    if(clickInputCantidad[elementIndex].cantidad > 0){
                        //agregar
                        clickInputCantidad[elementIndex].cantidad = parseInt(nuevo_cantidad);

                        //console.log(clickInputCantidad[elementIndex].cantidad);
                        $('#cant_selectds').val(JSON.stringify(clickInputCantidad));
                    }

                }

            }

        } else {

            var elementIndex = clickInputCantidad.findIndex((obj => obj.id == params));
            clickInputCantidad[elementIndex].cantidad = parseInt(1);

        }

        //console.log(clickInputCantidad[elementIndex].cantidad);
        $('#cant_selectds').val(JSON.stringify(clickInputCantidad));

        console.log(clickInputCantidad);

    });

}

//actualizar el pedido
$('#form_editar_pedido').on('submit', function(e) {
    event.preventDefault();
    if ($('#form_editar_pedido')[0].checkValidity() === false) {
        event.stopPropagation();
    } else {

        // agregar data
        var $thisForm = $('#form_editar_pedido');
        var formData = new FormData(this);

        //ruta
        var url = route('pedido.actualizarPedido');

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
                swal("Actualizando Pedido, espera porfavor...", {
                    button: false,
                    timer: 3000
                });
            }
        }).done(function(respuesta){
            console.log(respuesta);
            if (!respuesta.error) {

                swal('Pedido Actualizado Correctamente', {
                    icon: "success",
                    button: false,
                    timer: 3000
                });
                window.location.href = route('pedido.verPedidos');

            } else {
                setTimeout(function(){
                    swal(respuesta.mensaje, {
                        icon: "error",
                        button: false,
                        timer: 4000
                    });
                },2000);
            }
        }).fail(function(resp){
            console.log(resp);
        });

    }
    $('#form_editar_pedido').addClass('was-validated');

});

$('#btn_buscar_productos').on('click', function(){
    tabla_articulo.search('').draw();
});

$('.btn_guardar').click(function() {
    tabla_detalle_seleccion.search('').draw();
});
