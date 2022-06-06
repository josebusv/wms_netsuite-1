<?php

namespace App\Services;

use App\Traits\ConsumesSoapServices;

class WmsService
{
  use ConsumesSoapServices;

  /**
   * URI base de los servicios soap
   * @var string
   */
  public $baseUri;

  public function __construct()
  {
    $this->baseUri = config('services.wms.base_uri');
  }

  /**
   * A function that is used to create a new salida in wms.
   * 
   * @param parametros array of parameters to be sent to the service web
   * 
   * @return The return is a JSON object with the following structure:
   * <code>{
   *   "status": "success",
   *   "message": "",
   *   "data": {
   *     "id": "1",
   *     "nombre": "Juan",
   *     "apellido": "Perez",
   *     "email": "juan@gmail.com
   */
  public function crearSalidas($parametros){
    return $this->performRequest('salidas.php', 'DARAQUE', '123456', $parametros, "validarSalidas");
  }
}