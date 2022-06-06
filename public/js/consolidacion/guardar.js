
//proceso de login
$('#form_guardar_consolidacion').on('submit', function(e) {
    event.preventDefault();
    if ($('#form_guardar_consolidacion')[0].checkValidity() === false) {
        event.stopPropagation();
    } else {

        // agregar data
        var $thisForm = $('#form_guardar_consolidacion');
        var formData = new FormData(this);

        //ruta
        var url = route('consolidacion.guardar');

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
                swal("Guardando Consolidación, espera porfavor...", {
                    button: false
                });
            }
        }).done(function(respuesta){
            console.log(respuesta);
            if (!respuesta.error) {

                swal('Consolidación Guardada Correctamente', {
                    icon: "success",
                    button: false,
                    timer: 3000
                });
                window.location.href = route('consolidacion.verMisConsolidaciones');

            } else {
                setTimeout(function(){
                    swal(respuesta.mensaje, {
                        icon: "error",
                        button: false,
                        timer: 5000
                    });
                },2000);
            }
        }).fail(function(resp){
            console.log(resp);
        });

    }
    $('#form_guardar_consolidacion').addClass('was-validated');

});
