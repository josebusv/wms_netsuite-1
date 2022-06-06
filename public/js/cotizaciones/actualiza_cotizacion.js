$(function () {
    $("#select_metodo_pago option[value='0']").prop('selected', true);
    let sub = $("#subtotal-hd").val();
    let total = $("#total-hd").val();
    let impuesto = $("#impuesto-hd").val();
    let cantidad = $("#cantidad").val();
    $("#subtotal").text("$ " + sub);
    $("#cantidadcard").text(cantidad);
    $("#totalimpuestos").text("$ " + impuesto);
    $("#total").text("$ " + total);
    metodopago()
    cargarDatosTablaProductos();
    $('#btn_buscar_articulos').prop('disabled', false);
    cant_cargada_contado = 0;
    let metodopago2 = $('#idmetodopagoinput').val()
    setTimeout(() => {
        $("#select_metodo_pago option[value='" + metodopago2 + "']").prop('selected', true);
    }, 1000);
    //$('#select_metodo_pago select').val(metodopago2);
    //$('#select_metodo_pago option:contains("' + metodopago2 + '")').attr('selected', true);
});



function metodopago() {
    $("#select_metodo_pago").prop("disabled", false)
    let cliente = $("#id_cliente").val();
    let lista = $("#lista_precio option:selected").val();
    let url = route('tomar_pedido.obtenerMetodosPagos', [lista, cliente]);
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': '{{ csrf_token() }}'
        },
        type: "GET",
        encoding: "UTF-8",
        url: url,
        dataType: 'json',
        success: function (response) {
            console.log(response);
            $('#select_metodo_pago').append(response.data);
        },
        error: function (xhr, status, error) {
            console.log(error)
        }
    });
}

function editdetalletable() {
    //let datostabldeatalle = [];
    //let idpedido = $("#cantidad").val();
    swal("Cargando datos, espere porfavor...", {
        button: false,
        timer: 5000
    });

}
