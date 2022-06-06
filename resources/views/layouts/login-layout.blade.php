<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="shortcut icon" href="{{ asset('assets/img/icon.png') }}" />
        <title>@yield('pagina') | Toma Pedidos - Distribuciones AXA</title>

        <!-- Scripts -->
        <script src="{{ asset('vendor/jquery/jquery-3.5.1.min.js') }}" ></script>
        <script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
        <script src="{{ asset('js/app.js') }}" defer></script>

        <!-- Fonts -->
        <link rel="dns-prefetch" href="//fonts.gstatic.com">
        <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
        <link href="{{ asset('css/login.css') }}" rel="stylesheet">

        <script src="{{ asset('js/login.js') }}" defer></script>
    </head>
    <body>
        @routes
        <section class="fondo">
            <div class="container" id="container_login">
                <div class="row vh-100 justify-content-center align-items-center">
                    {{ $slot }}
                </div>
            </div>
        </section>
    </body>
</html>
