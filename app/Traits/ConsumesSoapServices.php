<?php

namespace App\Traits;

use nusoap_client;

trait ConsumesSoapServices
{
  /**
   * Envia una peticion a cualquier servicio soap compatible
   * @return array
   */

   public function performRequest($url, $user, $password, $parametros, $method)
   {
     $client = new nusoap_client( $this->baseUri . $url . '?wsdl' , 'wsdl');
     //$client = new nusoap_client( 'http://192.168.1.25/suite/webservices/salidas.php?wsdl' , 'wsdl');
     $client->setEndpoint($this->baseUri . $url);
     $client->setCredentials($user, $password);

     //$response = $client->call($method,$parametros);
     $response = $client->call("validarSalidas",$parametros);

     if($client->getError()){
       $error = "Error:" . $client->getError();
      return $error;
     }else{
      return $response;
     }
   }

}