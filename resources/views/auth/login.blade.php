<x-login-layout>

    <!-- title -->
    @section('pagina')Login @endsection

    <div class="col-xl-4 col-lg-5 col-md-7 col-12">

        <form id="formulario_login" class="needs-validation" method="POST" novalidate>
            @csrf

            <div class="login100-form-avatar text-center">
                <img src="{{ asset('assets/img/logo_blanco.png') }}" alt="AVATAR">
            </div>

            <div class="login100-form-title text-uppercase">
                WMS - Netsuite
            </div>

            <div class="input_class">
                <div class="form-floating mt-4 mb-3">
                    <input type="email" class="form-control rounded-pill" id="email" name="email" placeholder="name@example.com" required>
                    <label for="floatingInput">Correo Electronico</label>
                </div>
            </div>

            <div class="input_class">
                <div class="form-floating mb-3">
                    <input type="password" class="form-control rounded-pill" id="password" name="password" placeholder="contraseña" required>
                    <label for="floatingInput">Contraseña</label>
                </div>
            </div>

            <div class="d-grid gap-2">
                <button class="btn btn-dark rounded-pill" type="submit">Iniciar Sesión</button>
            </div>

            <div class="login100-form-title-2">
                Copyright &copy; - WMS - Netsuite<br>{{ date('Y') }}
            </div>

        </form>

    </div>

</x-login-layout>
