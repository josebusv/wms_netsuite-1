<x-app-layout>

    @section('pagina')Error 404 @endsection

    <div class="container-fluid">

        <div class="row justify-content-center align-items-center mt-5">
            <!-- 404 Error Text -->
            <div class="text-center mt-5">
                <div class="error mx-auto" data-text="404">404</div>
                <p class="lead text-gray-800 mb-5">Pagina no encontrada</p>
                <p class="text-gray-500 mb-0">
                    Parece que encontraste una pagina no existente o desactivada...
                </p>
                <a href="{{ route('home') }}">&larr; Ir al inicio</a>
            </div>
        </div>

    </div>

    <x-slot name="js">
    </x-slot>

</x-app-layout>
