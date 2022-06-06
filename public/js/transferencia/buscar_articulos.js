let clickInputCantidad = [];
let datos_select_productos = [];

const options2 = {
    style: 'currency',
    currency: 'USD'
};
const numberFormat2 = new Intl.NumberFormat('en-US', options2);

var tabla_articulo = $('#tabla_articulo').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "paging": false,
    "order": [[ 1, "asc" ]],
    "columns": [
        {
            "className":      'dt-control',
            "orderable":      false,
            "data":           null,
            "defaultContent": ''
        },
        { "data": "ean", "orderData": 1 },
        { "data": "nombre_item" },
        { "data": "disponible" },
        { "data": "input" },
        { "data": "sin_teleferia" },
        { "data": "porciento_teleferia" },
        { "data": "con_teleferia" },
        { "data": "iva" },
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

$('#select_metodo_pago').on('change', function() {
    var dato =  $(this).find(":selected").val();
    if(dato != ''){
        $('#btn_buscar_productos').prop('disabled', false);
        cargarDatosSelectProductos();
        if(datos_select_productos.length > 0){
            obtenerDatosTableProductos();
        }

    } else {
        $('#btn_buscar_productos').prop('disabled', true);
    }
});

function cargarDatosSelectProductos(){
    var lista_id = $('#lista_precio').find(":selected").val();
    var ubicacion_id = $('#ubicacion').find(":selected").val();
    var metodo_pago = $('#select_metodo_pago').find(":selected").val();
    var url = route('transferencia.obtenerListadoProductos', [lista_id, ubicacion_id, metodo_pago]);
    console.log(url);
    tabla_articulo.ajax.url(url).load();
    tabla_articulo.columns.adjust().draw();

    setTimeout(function(){
        if(clickInputCantidad.length > 0){
            clickInputCantidad.forEach(element => {
                //console.log($('#tbody_tabla_articulos #'+element).closest('tr'));
                $('#tbody_tabla_articulos #'+element.id).closest('tr').addClass('selected');
                $('#input_cantidad_' + element.id + '').val(element.cantidad);
            });
        }
    }, 3000);

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

// Add event listener for opening and closing details
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

$('#tabla_articulo tbody').on('click', 'tr', function () {
    var id = this.id;
    var index = $.inArray(id, datos_select_productos);
    $('#input_cantidad_' + id + '').val(1);

    if ( index === -1 ) {
        datos_select_productos.push( id );

        let cantidad = $('#input_cantidad_' + id + '').val();
        clickInputCantidad.push({
            "id": id,
            "cantidad": cantidad,
        });

        //habilitar input
        $('#input_cantidad_' + id + '').prop( "disabled", false );
        $('#input_cantidad_' + id + '').focus();
    } else {

        var nuevo = [];
        clickInputCantidad.forEach(element => {
            if(element.id != id){
                nuevo.push({
                    "id": element.id,
                    "cantidad": element.cantidad,
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

function obtenerDatosTableProductos(){

    if(clickInputCantidad.length > 0){

        //limpia la tabla
        tabla_detalle_seleccion.clear().draw();

        var data = clickInputCantidad;
        var metodo_pago = $('#select_metodo_pago').find(":selected").val();
        var url = route('transferencia.obtenerInformacionProducto');
        var lista_id = $('#lista_precio').find(":selected").val();

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

function arrayRemove(arr, value) {
    return arr.filter(function(ele){
        return ele != value;
    });
}

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

$('#btn_buscar_productos').on('click', function(){
    tabla_articulo.search('').draw();
    setTimeout(function(){
        if(clickInputCantidad.length > 0){
            clickInputCantidad.forEach(element => {
                //console.log($('#tbody_tabla_articulos #'+element).closest('tr'));
                $('#tbody_tabla_articulos #'+element.id).closest('tr').addClass('selected');
                $('#input_cantidad_' + element.id + '').val(element.cantidad);
            });
        }
    }, 1000);
});

$('.btn_guardar').click(function() {
    tabla_detalle_seleccion.search('').draw();
});
