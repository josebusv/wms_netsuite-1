
//proceso de login
$('#formulario_login').on('submit', function(e) {
    event.preventDefault();
    if ($('#formulario_login')[0].checkValidity() === false) {
        event.stopPropagation();
    } else {

        // agregar data
        var $thisForm = $('#formulario_login');
        var formData = new FormData(this);

        //ruta
        var url = route('validar_login');

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
                swal("Validando datos, espere porfavor...", {
                    button: false,
                    timer: 3000
                });
            }
        }).done(function(respuesta){
            //console.log(respuesta);
            if (!respuesta.error) {

                swal('Inicio de Sesión Exitoso, redireccionando...', {
                    icon: "success",
                    button: false,
                    timer: 10000
                });
                location.reload();

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
    $('#formulario_login').addClass('was-validated');

});
