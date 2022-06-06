<script src="{{ asset('vendor/jquery/jquery-3.5.1.min.js') }}"></script>
<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>

<script src="{{ asset('js/app.js') }}" defer></script>


<script src="{{ asset('js/sb-admin-2.js') }}"></script>
<script src="{{ asset('js/scripts.js') }}" defer></script>


<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js" crossorigin="anonymous"></script>

<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.11.5/b-2.2.2/b-html5-2.2.2/b-print-2.2.2/date-1.1.2/fh-3.2.2/r-2.2.9/rg-1.1.4/sc-2.0.5/sp-2.0.0/sl-1.3.4/datatables.min.css"/>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/pdfmake.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/vfs_fonts.js"></script>
<script type="text/javascript" src="https://cdn.datatables.net/v/dt/jszip-2.5.0/dt-1.11.5/b-2.2.2/b-html5-2.2.2/b-print-2.2.2/date-1.1.2/fh-3.2.2/r-2.2.9/rg-1.1.4/sc-2.0.5/sp-2.0.0/sl-1.3.4/datatables.min.js"></script>


<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.0/js/i18n/es.js"></script>

<!-- jquery-typeahead -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-3-typeahead/4.0.2/bootstrap3-typeahead.min.js" ></script>

<!-- CSS -->
<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>

<script>
    $('#boton_cerrar_sesion').on('click', function() {
        swal({
            title: "Cerrar Sesión",
            text: "¿Estas seguro de cerrar la sesión actual?",
            icon: "warning",
            buttons: ["Cancelar", "Si, salir"],
            dangerMode: true,
            })
            .then((willDelete) => {
            if (willDelete) {
                $('#form_cerrar_sesion').submit();
            }
        });
    });
 </script>

{{ $slot }}
