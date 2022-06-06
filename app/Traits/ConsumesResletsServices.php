<?php

namespace App\Traits;


trait ConsumesResletsServices
{
    /**
     * Envia peticion post a cualquier reslet de netsuite
     * @return array
     */

     /**
      * It takes a script id, data, and method and returns a response
      *
      * @param script_id The script ID of the script you want to run.
      * @param data The data you want to send to NetSuite.
      * @param method The HTTP method to use.
      *
      * @return The response is a JSON string.
      */
     public function postRequest($script_id, $data)
     {
        $NETSUITE_URL = $this->baseUri;
        $NETSUITE_SCRIPT_ID = $script_id;
        $NETSUITE_DEPLOY_ID ='1';
        $NETSUITE_ACCOUNT = $this->account;
        $NETSUITE_CONSUMER_KEY = $this->consumer_key;
        $NETSUITE_CONSUMER_SECRET = $this->consumer_secret;
        $NETSUITE_TOKEN_ID = $this->token_id;
        $NETSUITE_TOKEN_SECRET = $this->token_secret;

        $data_string = $data;

        $oauth_nonce = md5(mt_rand());
        $oauth_timestamp = time();
        $oauth_signature_method = 'HMAC-SHA256';
        $oauth_version = "1.0";


        $base_string =
            "POST&" . urlencode($NETSUITE_URL) . "&" .
            urlencode(
                "deploy=" . $NETSUITE_DEPLOY_ID
              . "&oauth_consumer_key=" . $NETSUITE_CONSUMER_KEY
              . "&oauth_nonce=" . $oauth_nonce
              . "&oauth_signature_method=" . $oauth_signature_method
              . "&oauth_timestamp=" . $oauth_timestamp
              . "&oauth_token=" . $NETSUITE_TOKEN_ID
              . "&oauth_version=" . $oauth_version
              . "&realm=" . $NETSUITE_ACCOUNT
              . "&script=" . $NETSUITE_SCRIPT_ID
            );
        $sig_string = urlencode($NETSUITE_CONSUMER_SECRET) . '&' . urlencode($NETSUITE_TOKEN_SECRET);
        $signature = base64_encode(hash_hmac("sha256", $base_string, $sig_string, true));

        $auth_header = "OAuth "
            . 'oauth_signature="' . rawurlencode($signature) . '", '
            . 'oauth_version="' . rawurlencode($oauth_version) . '", '
            . 'oauth_nonce="' . rawurlencode($oauth_nonce) . '", '
            . 'oauth_signature_method="' . rawurlencode($oauth_signature_method) . '", '
            . 'oauth_consumer_key="' . rawurlencode($NETSUITE_CONSUMER_KEY) . '", '
            . 'oauth_token="' . rawurlencode($NETSUITE_TOKEN_ID) . '", '
            . 'oauth_timestamp="' . rawurlencode($oauth_timestamp) . '", '
            . 'realm="' . rawurlencode($NETSUITE_ACCOUNT) .'"';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $NETSUITE_URL . '?&script=' . $NETSUITE_SCRIPT_ID . '&deploy=' . $NETSUITE_DEPLOY_ID . '&realm=' . $NETSUITE_ACCOUNT);
        curl_setopt($ch, CURLOPT_POST, "POST");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: ' . $auth_header,
            'Content-Type: application/json',
            'Content-Length: ' . strlen($data_string)
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return $response;

     }

     public function getRequest($script_id, $start=0, $end=1000)
     {
        $NETSUITE_URL = $this->baseUri;
        $NETSUITE_SCRIPT_ID = $script_id;
        $NETSUITE_DEPLOY_ID ='1';
        $NETSUITE_ACCOUNT = $this->account;
        $NETSUITE_CONSUMER_KEY = $this->consumer_key;
        $NETSUITE_CONSUMER_SECRET = $this->consumer_secret;
        $NETSUITE_TOKEN_ID = $this->token_id;
        $NETSUITE_TOKEN_SECRET = $this->token_secret;

        $oauth_nonce = md5(mt_rand());
        $oauth_timestamp = time();
        $oauth_signature_method = 'HMAC-SHA256';
        $oauth_version = "1.0";


        $base_string =
            "GET&" . urlencode($NETSUITE_URL) . "&" .
            urlencode(
                "deploy=" . $NETSUITE_DEPLOY_ID
              . "&oauth_consumer_key=" . $NETSUITE_CONSUMER_KEY
              . "&oauth_nonce=" . $oauth_nonce
              . "&oauth_signature_method=" . $oauth_signature_method
              . "&oauth_timestamp=" . $oauth_timestamp
              . "&oauth_token=" . $NETSUITE_TOKEN_ID
              . "&oauth_version=" . $oauth_version
              . "&realm=" . $NETSUITE_ACCOUNT
              . "&script=" . $NETSUITE_SCRIPT_ID
            );
        $sig_string = urlencode($NETSUITE_CONSUMER_SECRET) . '&' . urlencode($NETSUITE_TOKEN_SECRET);
        $signature = base64_encode(hash_hmac("sha256", $base_string, $sig_string, true));

        $auth_header = "OAuth "
            . 'oauth_signature="' . rawurlencode($signature) . '", '
            . 'oauth_version="' . rawurlencode($oauth_version) . '", '
            . 'oauth_nonce="' . rawurlencode($oauth_nonce) . '", '
            . 'oauth_signature_method="' . rawurlencode($oauth_signature_method) . '", '
            . 'oauth_consumer_key="' . rawurlencode($NETSUITE_CONSUMER_KEY) . '", '
            . 'oauth_token="' . rawurlencode($NETSUITE_TOKEN_ID) . '", '
            . 'oauth_timestamp="' . rawurlencode($oauth_timestamp) . '", '
            . 'realm="' . rawurlencode($NETSUITE_ACCOUNT) .'"';

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $NETSUITE_URL . '?&script=' . $NETSUITE_SCRIPT_ID . '&deploy=' . $NETSUITE_DEPLOY_ID . '&start=' . $start . '&end=' . $end . '&realm=' . $NETSUITE_ACCOUNT);
        curl_setopt($ch, CURLOPT_POST, "GET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: ' . $auth_header,
            'Content-Type: application/json',
            'Accept-Language: en',
            'Accept-Language: es'
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        return $response;
     }


}
