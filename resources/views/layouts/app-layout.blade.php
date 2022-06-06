<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf_token" content="{{ csrf_token() }}">
        <meta http-equiv="Access-Control-Allow-Origin" content="*">

        <link rel="shortcut icon" href="{{ asset('assets/img/icon.png') }}" />
        <title>@yield('pagina') | WMS - NETSUITE - Distribuciones AXA</title>

        <x-css></x-css>

    </head>
    <body id="page-top" class="h-100">

        @routes

        <!-- Page Wrapper -->
        <div id="wrapper">

            <!-- Sidebar -->
            <x-sidebar></x-sidebar>
            <!-- End of Sidebar -->

            <!-- Content Wrapper -->
            <div id="content-wrapper" class="d-flex flex-column">

                <!-- Main Content -->
                <div id="content">

                    <!-- Topbar -->
                    <x-topbar></x-topbar>
                    <!-- End of Topbar -->

                    {{ $slot }}

                </div>

                <!-- Footer -->
                <x-footer></x-footer>
                <!-- End of Footer -->

            </div>

        </div>

        <!-- Scroll to Top Button-->
        <a class="scroll-to-top rounded" href="#page-top">
            <i class="fas fa-angle-up"></i>
        </a>

        <x-js>
            {{$js}}
        </x-js>

    </body>
</html>
