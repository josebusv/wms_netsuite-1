<x-app-layout>

  @section('pagina')Ordendenes de Venta @endsection

  <div class="container-fluid">

      <div class="row justify-content-center align-items-center mt-5">
        <table class="table" id="tabla_informacion">
          <thead >
            <th>ID</th>
            <th>Punto</th>
            <th>Cliente</th>
            <th>Identificacion</th>
            <th>Documento</th>
            <th>Salida</th>
            <th>error</th>
            <th>estado</th>
            <th>Acciones</th>
          </thead>
          <tbody>
            @foreach ($transacciones as $item)
            <tr>
              <td>{{ $item->internal_id }}</td>
              <td>{{ $item->punto }}</td>
              <td>{{ $item->nombre }}</td>
              <td>{{ $item->identificacion }}</td>
              <td>{{ $item->documento_referencia }}</td>
              <td>{{ $item->salida_wms }}</td>
              <td>{{ $item->error_wms }}</td>
              <td>
                @if ($item->estado == 1)
                    Pendiente de envio a WMS                   
                @elseif($item->estado == 2)
                    Pendiente envio Netsuite
                @elseif($item->estado == 5)
                  Error
                @endif
              </td>
              <td>
                <a href="{{ route('transacciones.show', $item->documento_referencia) }}" class="btn btn-success">Ver</a>
              </td>
            </tr>
           @endforeach
          </tbody>
        </table>   
      </div>

  </div>

  <x-slot name="js">
    <script>
      $(document).ready(function() {
          $('.select_search').select2();
          $('#div_tabla').hide();

          var tabla_informacion = $('#tabla_informacion').DataTable({
              "language": {
                  "url": "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json"
              },
              "order": [[ 0, "asc" ]],
          });
         
      });
  </script>
  </x-slot>

</x-app-layout>