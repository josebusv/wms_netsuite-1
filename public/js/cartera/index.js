var tabla_detalle = $('#tabla_detalle').DataTable({
    "language": {
        "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
    },
    "order": [[ 0, "asc" ]],
});


$('#zona').on('change', function() {
    var dato =  $(this).find(":selected").val();
    if(dato == ''){
        tabla_detalle.clear().draw();
        $("#btn_buscar_cartera").prop('disabled', true);
    } else {

        /*
            $('#cliente').prop('disabled', false);

            //cargar clientes
            var url = route('cartera.getClientes', dato);
            let option = '';

            $.ajax({
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}'
                },
                type: "GET",
                encoding:"UTF-8",
                url: url,
                dataType:'json',
            }).done(function(respuesta){

                //console.log(respuesta);
                $('#cliente').append('<option value="">SELECCIONE</option>');
                respuesta.forEach(element => {
                    option = option + "<option value= " + element.id + " >" + element.nombre + "</option>";
                });
                $('#cliente').append(option);

            }).fail(function(resp){
                console.log(resp);
            });
        */

        $("#btn_buscar_cartera").prop('disabled', false);

    }
});

//proceso de datos
$('#form_cartera').on('submit', function(e) {
    event.preventDefault();
    if ($('#form_cartera')[0].checkValidity() === false) {
        event.stopPropagation();
        swal("Advertencia", "Los 3 campos son obligatorios!", "error");
    } else {

        $('#div_lista_detalle').show();

        swal("Cargando datos, espere porfavor...", {
            button: false,
            timer: 2000
        });

        // agregar data
        var zona = $("#zona").find(":selected").val();

        //ruta
        var url = route('cartera.obtenerCarteras', zona);
        console.log(url);

        tabla_detalle.ajax.url(url).load();
        tabla_detalle.columns.adjust().draw();

    }
    $('#form_cartera').addClass('was-validated');

});
