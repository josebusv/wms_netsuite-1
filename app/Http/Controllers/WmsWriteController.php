<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Services\WmsService;
use Illuminate\Support\Facades\DB;

class WmsWriteController extends Controller
{

    public $wmsservice;

    public function __construct(WmsService $wmsService)
    {
        $this->wmsservice = $wmsService;
    }

    public function wmswrite()
    {
        $ids = Transaction::select('documento_referencia')->distinct()->where('estado', 1)->pluck('documento_referencia');

        foreach($ids as $id){
            $transacciones = Transaction::where('documento_referencia', '733532')->where('estado', 1)->get();
            //dd($transacciones);
            $parametros = NULL;
            foreach($transacciones as $transaccion)
            {
                $parametros[] = [
                                'arreglo_salidas' => [
                                [
                                    'punto' => $transaccion->punto,
                                    'identificacion' => $transaccion->identificacion,
                                    'nombre' => $transaccion->nombre,
                                    'pais'=> 57,
                                    'nombre_pais' => $transaccion->nombre_pais,
                                    'departamento' => $transaccion->departamento,
                                    'ciudad' => $transaccion->ciudad,
                                    'zona' =>  $transaccion->zona,
                                    'tipo_salida' => 'C',
                                    'direccion' => $transaccion->direccion,
                                    'fecha' => $transaccion->fecha, 
                                    'clasificador1' => $transaccion->clasificador1,
                                    'tipo_documento_referencia' => $transaccion->tipo_documento_referencia,
                                    'documento_referencia' => $transaccion->documento_referencia,
                                    'prioridad' => 1,
                                    'fecha_envio>' => $transaccion->fecha_envio,
                                    'hora_envio>' => $transaccion->hora_envio,
                                    'observacion' => $transaccion->observacion,
                                    'campo1' => $transaccion->campo1,
                                    'detalles' => [
                                        'secuencia' => $transaccion->campo1,
                                        'articulo' => $transaccion->articulo,
                                        'estado_articulo' => $transaccion->estado_articulo,
                                        'sscc_completo' => 'N',
                                        'cantidad' => $transaccion->cantidad
                                    ]
                                ]
                            ]
                        ];
            }
            dd($parametros);
            $response = $this->wmsservice->crearSalidas($parametros);
            dd($response);
            $estado = $response['arreglo_respuestas']['estado'];
            if($estado == "OK"){
               foreach($transacciones as $transaccion){
                    $transaccion->salida_wms = $response['arreglo_respuestas']['salida'];
                    $transaccion->fecha_salida_wms = now();
                    $transaccion->estado = 2;
                    $transaccion->save();
               }
            }else{
                foreach($transacciones as $transaccion){
                    $transaccion->error_wms = '"'. $response['arreglo_respuestas']['mensaje'] .'"' ;
                    $transaccion->fecha_salida_wms = now();
                    $transaccion->estado = 5;
                    $transaccion->save();
               }
            }


        }
        dd($response);
    }

    public function index()
    {
        $transacciones = DB::select("SELECT distinct  internal_id, punto, nombre, identificacion, documento_referencia, estado, salida_wms, error_wms FROM public.transactions");

        return view('pages.index', compact('transacciones'));
    }

    public function show($documento_referencia)
    {
        $transaccion = Transaction::where('documento_referencia', $documento_referencia)->get();



    }
}
