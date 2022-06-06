let clickInputCantidad = [];
let datos_select_productos = [];
var local_productos = localStorage.getItem("ids_productos");
let cant_cargada_contado = 0;
let cant_cargada_credito = 0;

//alert(params);
const options2 = {
    style: 'currency',
    currency: 'USD'
};
const numberFormat2 = new Intl.NumberFormat('en-US', options2);

var tabla_articulo = $('#tabla_articulo').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "order": [[ 0, "asc" ]],
    "paging": false,
});

var tabla_detalle_seleccion = $('#tabla_detalle_seleccion').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "paging": false,
    "order": [[ 0, "asc" ]],
});

$('#select_metodo_pago').on('change', function() {
    var dato =  $(this).find(":selected").val();
    if(dato == ''){
        $('#btn_buscar_articulos').prop('disabled', true);
        cant_cargada_contado = 0;
        clickInputCantidad = [];
        tabla_detalle_seleccion.clear().draw();
    } else if(dato == '1'){
        $('#btn_buscar_articulos').prop('disabled', false);
        cargarDatosTablaProductos();
        clickInputCantidad = [];
        tabla_detalle_seleccion.clear().draw();
    } else if(dato == '2') {
        $('#btn_buscar_articulos').prop('disabled', false);
        cargarDatosTablaProductos();
        clickInputCantidad = [];
        tabla_detalle_seleccion.clear().draw();
    }
});

function cargarDatosTablaProductos(){
    tabla_articulo.clear();
    //recrea la tabla ener
    //$('#tabla_articulo').dataTable()
    var lista_id = $('#lista_precio').find(":selected").val();
    var ubicacion_id = $('#ubicacion').find(":selected").val();
    var metodo_pago = $('#select_metodo_pago').find(":selected").val();
    var url = route('tomar_pedido.obtenerListadoProductos', [lista_id, ubicacion_id, metodo_pago]);
    tabla_articulo.ajax.url(url).load();
    tabla_articulo.columns.adjust().draw();

}

function mortardetalletable(){

    //cant_cargada++;

    swal("Cargando datos, espere porfavor...", {
        button: false,
        timer: 4000
    });

    setTimeout(function(){
        var validar = clickInputCantidad.length;
        //console.log(validar);
        if(validar > 0){

            for ( index = 0; index < clickInputCantidad.length; index++) {

                //console.log(clickInputCantidad[index] + "/"+ datos_select_productos[index].sin_iva);
                $('#input_calcular_cant_' + clickInputCantidad[index] + '').val(datos_select_productos[index].cantidad);
                $('#num_sin_iva_' + clickInputCantidad[index] + '').val(datos_select_productos[index].sin_iva);
                $('#txt_sin_iva_' + clickInputCantidad[index] + '').val(numberFormat2.format(datos_select_productos[index].sin_iva));
                $('#txt_con_iva_' + clickInputCantidad[index] + '').val(numberFormat2.format(datos_select_productos[index].con_iva));
                $('#num_con_iva_' + clickInputCantidad[index] + '').val(datos_select_productos[index].con_iva);

            }
        }
    }, 2000);


}

function funcionCalcularTotales(params){

    $('#input_calcular_cant_' + params + '').on('keyup', function (evt) {

        let cantidad = $('#input_calcular_cant_' + params + '').val();

        if (evt.key === 'Tab') {
            if(cantidad > 0){
                console.log('es tab');
                if (! clickInputCantidad.includes(params)){
                    clickInputCantidad.push(params)
                }
            }
        } else{
            if(cantidad > 0){
                console.log('es click');
                if (! clickInputCantidad.includes(params)){
                    clickInputCantidad.push(params)
                }
            }
        }

        console.log("agregando: " + clickInputCantidad);

        //localStorage.setItem("ids_productos", JSON.stringify(clickInputCantidad));

        let precio_sin_iva = 0;
        let precio_con_iva = 0;


        let iva = $('#txt_iva_' + params + '').val();
        let precio_unitario = $('#txt_precio_unitario_' + params + '').val();
        let precio_teleferia = $('#txt_precio_teleferia_' + params + '').val();

        if(precio_teleferia == '0'){

            precio_sin_iva = parseFloat(precio_unitario);
            let valor_iva = (parseFloat(precio_unitario) * iva) / 100;
            precio_con_iva = parseFloat(precio_unitario) + valor_iva;

            precio_sin_iva = precio_sin_iva * cantidad;
            precio_con_iva = precio_con_iva * cantidad;

        } else {

            precio_sin_iva = parseFloat(precio_teleferia);
            let valor_iva = (parseFloat(precio_teleferia) * iva) / 100;
            precio_con_iva = parseFloat(precio_teleferia) + valor_iva;

            precio_sin_iva = precio_sin_iva * cantidad;
            precio_con_iva = precio_con_iva * cantidad;
        }

        $('#num_sin_iva_' + params + '').val(precio_sin_iva);
        $('#num_con_iva_' + params + '').val(precio_con_iva);

        $('#txt_sin_iva_' + params + '').val(numberFormat2.format(precio_sin_iva));
        $('#txt_con_iva_' + params + '').val(numberFormat2.format(precio_con_iva));

    });
}

function obtenerDatosTableProductos(){

    var guardado = [];
    var imprimir = '';
    datos_select_productos = [];

    //$('#tabla_detalle_seleccion tr').remove();
    tabla_articulo.search('').draw();
    tabla_detalle_seleccion.clear().draw();

    console.log("btn agregando: " + clickInputCantidad);

    swal("Guardando, espere porfavor...", {
        button: false,
        timer: 1000
    });

    setTimeout(function(){

        //console.log(plainArray);
        //limpiartabla de articulos ener
        //$('#tabla_articulo').dataTable().fnDestroy()
        for ( index = 0; index < clickInputCantidad.length; index++) {

            //console.log(clickInputCantidad[index]);
            let cantidad = $('#input_calcular_cant_' + clickInputCantidad[index] + '').val();
            if(cantidad !== ''){

                let sin_iva = $('#txt_sin_iva_' + clickInputCantidad[index] + '').val();
                let con_iva = $('#txt_con_iva_' + clickInputCantidad[index] + '').val();
                let v_uniario = $('#txt_precio_unitario_' + clickInputCantidad[index] + '').val();
                let v_teleferia = $('#txt_precio_teleferia_' + clickInputCantidad[index] + '').val();
                let iva = $('#txt_iva_' + clickInputCantidad[index] + '').val();
                let ean = $('#txt_ean_' + clickInputCantidad[index] + '').val();
                let nombre = $('#txt_nombre_item_' + clickInputCantidad[index] + '').val();
                let linea = $('#txt_linea_' + clickInputCantidad[index] + '').val();

                let convert_sin_iva = $('#num_sin_iva_' + clickInputCantidad[index] + '').val();
                let convert_con_iva = $('#num_con_iva_' + clickInputCantidad[index] + '').val();

                let embalaje = $('#text_embalaje_' + clickInputCantidad[index] + '').val();

                tabla_detalle_seleccion.row.add([
                    "<input name='items_id[]' type='hidden' value='" + clickInputCantidad[index] + "'>" + clickInputCantidad[index],
                    "<input name='eans[]' type='hidden' value='" + ean + "'>" + ean,
                    "<input name='nombres[]' type='hidden' value='" + nombre + "'>" + nombre,
                    "<input name='lineas[]' type='hidden' value='" + linea+ "'>" + linea,
                    "<input name='cantidades[]' type='hidden' value='" + cantidad+ "'>" + cantidad,
                    "<input name='v_unitarios[]' type='hidden' value='" + v_uniario+ "'>" + v_uniario,
                    "<input name='v_teleferias[]' type='hidden' value='" + v_teleferia + "'>" + v_teleferia,
                    "<input name='ivas[]' type='hidden' value='" + iva + "'>" + iva,
                    "<input name='sin_ivas[]' type='hidden' value='" + sin_iva + "'>" + sin_iva,
                    "<input name='con_ivas[]' type='hidden' value='" + con_iva + "'>" + con_iva,
                    "<input name='embalajes[]' type='hidden' value='" + embalaje + "'>" + embalaje
                ]).draw(false);

                $('#btn_guardar').prop('disabled', false);

                var data = {
                    id: clickInputCantidad[index],
                    cantidad: cantidad,
                    sin_iva: convert_sin_iva,
                    con_iva: convert_con_iva
                }

                guardado.push(data);
                datos_select_productos.push(data);
            }

        }

        //ejecutar funcion totales
        functionCalcularTotales(guardado);

    }, 1000);

}

function functionCalcularTotales(datos)
{

    var cantidad_items = 0;
    var subtotal = 0;
    var total = 0;
    var impuestos = 0;

    datos.forEach(element => {

        cantidad_items++;

        subtotal = subtotal + parseFloat(element.sin_iva);
        total = total + parseFloat(element.con_iva);

    });

    impuestos = total - subtotal;

    $('#cantidadcard').text(cantidad_items);
    $('#subtotal').text(numberFormat2.format(subtotal));
    $('#totalimpuestos').text(numberFormat2.format(impuestos));
    $('#total').text(numberFormat2.format(total));

    $('#cantidad_items').val(cantidad_items);
    $('#sub_total').val(subtotal);
    $('#total_impuestos').val(impuestos);
    $('#total_final').val(total);

}

/*
function obtenerDatosTableProductos_copia(){

    var guardado = [];
    var imprimir = '';

    //console.log(plainArray);



    for ( index = 0; index < clickInputCantidad.length; index++) {

        //console.log(clickInputCantidad[index]);
        let cantidad = $('#input_calcular_cant_' + clickInputCantidad[index] + '').val();
        if(cantidad !== ''){

            let sin_iva = $('#txt_sin_iva_' + clickInputCantidad[index] + '').val();
            let con_iva = $('#txt_con_iva_' + clickInputCantidad[index] + '').val();
            let v_uniario = $('#txt_precio_unitario_' + clickInputCantidad[index] + '').val();
            let v_teleferia = $('#txt_precio_teleferia_' + clickInputCantidad[index] + '').val();
            let iva = $('#txt_iva_' + clickInputCantidad[index] + '').val();
            let ean = $('#txt_ean_' + clickInputCantidad[index] + '').val();
            let nombre = $('#txt_nombre_item_' + clickInputCantidad[index] + '').val();
            let linea = $('#txt_linea_' + clickInputCantidad[index] + '').val();

            let convert_sin_iva = $('#num_sin_iva_' + clickInputCantidad[index] + '').val();
            let convert_con_iva = $('#num_con_iva_' + clickInputCantidad[index] + '').val();

            let embalaje = $('#text_embalaje_' + clickInputCantidad[index] + '').val();

            imprimir = `
                <li class="list-group-item">
                    <div class="row">
                        <div class="col-2">
                            <strong>Item ID:</strong> <br>
                            <input type="text" name="items_id[]" value="${clickInputCantidad[index]}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Ean:</strong> <br>
                            <input type="text" name="eans[]" value="${ean}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Nombre:</strong> <br>
                            <input type="text" name="nombres[]" value="${nombre}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Linea:</strong> <br>
                            <input type="text" name="lineas[]" value="${linea}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Cantidad:</strong> <br>
                            <input type="text" name="cantidades[]" value="${cantidad}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>V unitario:</strong> <br>
                            <input type="text" name="v_unitarios[]" value="${v_uniario}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>V teleferia:</strong> <br>
                            <input type="text" name="v_teleferias[]" value="${v_teleferia}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>IVA:</strong> <br>
                            <input type="text" name="ivas[]" value="${iva}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Sin iva:</strong> <br>
                            <input type="text" name="sin_ivas[]" value="${sin_iva}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Con iva:</strong> <br>
                            <input type="text" name="con_ivas[]" value="${con_iva}" class="form-control border-0 bg-transparent">
                        </div>
                        <div class="col-2">
                            <strong>Embalaje:</strong> <br>
                            <input type="text" name="embalajes[]" value="${embalaje}" class="form-control border-0 bg-transparent">
                        </div>
                    </div>
                </li>
            `;

            $('#lista_productos_seleccionados').append(imprimir);

            $('#btn_guardar').prop('disabled', false);

            var data = {
                id: clickInputCantidad[index],
                sin_iva: convert_sin_iva,
                con_iva: convert_con_iva
            }

            guardado.push(data);
        }

    }

    //ejecutar funcion totales
    functionCalcularTotales(guardado);

}
*/
