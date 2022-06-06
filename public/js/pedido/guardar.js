var buttonpressed;
$('.btn_guardar').click(function() {
    buttonpressed = $(this).attr('name');
});


//proceso de guardar solamente
$('#form_guardar_pedido').on('submit', function(e) {
    event.preventDefault();
    $('.btn_guardar').prop('disabled', true);
    if ($('#form_guardar_pedido')[0].checkValidity() === false) {
        event.stopPropagation();
        $('.btn_guardar').prop('disabled', false);
    } else {

        $('.btn_guardar').prop('disabled', true);

        if(buttonpressed === '0'){
            var url = route('pedido.guardar');
        } else {
            var url = route('pedido.guardarEnviar');
        }

        //agregar data
        var $thisForm = $('#form_guardar_pedido');
        var formData = new FormData(this);

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
                swal("Guardando Pedido, espera porfavor...", {
                    button: false
                });
            }
        }).done(function(respuesta){
            //console.log(respuesta);
            if (!respuesta.error) {

                swal('Pedido Guardada Correctamente', {
                    icon: "success",
                    button: false,
                    timer: 2000
                });
                window.location.href = route('pedido.verPedidos');

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
    $('#form_guardar_pedido').addClass('was-validated');

});

