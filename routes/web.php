<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WmsWriteController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'App\Http\Controllers\WmsWriteController@index');
Route::get('/{documento_refrencia}', 'App\Http\Controllers\WmsWriteController@show')->name('transacciones.show');
Route::get('/wmswrite', 'App\Http\Controllers\WmsWriteController@wmswrite');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
