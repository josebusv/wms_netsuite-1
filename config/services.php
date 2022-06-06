<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'wms' => [
        'base_uri'  => env('WMS_BASE_URI'),
    ],
    'netsuite' => [
        'base_uri'  => env('NETSUIT_BASE_URI'),
        'account'  => env('NETSUITE_ACCOUNT'),
        'consumer_key'  => env('NETSUITE_CONSUMER_KEY'),
        'consumer_secret'  => env('NETSUITE_CONSUMER_SECRET'),
        'token_id'  => env('NETSUITE_TOKEN_ID'),
        'token_secret'  => env('NETSUITE_TOKEN_SECRET'),
    ]

];
