$('.btn_guardar').click(function() {
    $(this).attr('name');
});

//proceso de login
$('#form_guardar_transferencia').on('submit', function(e) {
    event.preventDefault();
    $('.btn_guardar').prop('disabled', true);
    if ($('#form_guardar_transferencia')[0].checkValidity() === false) {
        event.stopPropagation();
        $('.btn_guardar').prop('disabled', false);
    } else {

        $('.btn_guardar').prop('disabled', true);

        // agregar data
        var $thisForm = $('#form_guardar_transferencia');
        var formData = new FormData(this);

        //ruta
        var url = route('transferencia.guardar');

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
                swal("Guardando transferencia, espera porfavor...", {
                    button: false
                });
            }
        }).done(function(respuesta){
            //console.log(respuesta);
            if (!respuesta.error) {

                swal('Transferencia Guardada Correctamente', {
                    icon: "success",
                    button: false,
                    timer: 3000
                });
                window.location.href = route('transferencia.verTransferencias');

            } else {
                $('.btn_guardar').prop('disabled', false);
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
    $('#form_guardar_transferencia').addClass('was-validated');

});
