<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('internal_id');
            $table->string('tipo')->comment('salesorder, transferorder, purcharseorder');
            $table->string('punto');
            $table->string('identificacion');
            $table->string('nombre');
            $table->string('pais');
            $table->string('departamento');
            $table->string('ciudad');
            $table->string('direccion');
            $table->string('zona');
            $table->string('tipo_documento_referencia');
            $table->string('documento_referencia');
            $table->date('fecha_envio');
            $table->string('hora_envio')->default('0');
            $table->string('bodega_alistamiento')->nullable();
            $table->string('sector_alistamiento')->nullable();
            $table->string('area_alistamiento')->nullable();
            $table->string('clasificador1');
            $table->string('clasificador2')->nullable();
            $table->string('observaciones');
            $table->string('articulo');
            $table->string('serie')->nullable();
            $table->string('lote')->nullable();
            $table->string('documento1')->nullable();
            $table->string('documento2')->nullable();
            $table->string('estado_articulo');
            $table->string('sscc')->nullable();
            $table->string('sscc_completo');
            $table->integer('cantidad');
            $table->integer('campo1');
            $table->integer('campo2')->nullable();
            $table->integer('campo3')->nullable();
            $table->integer('campo4')->nullable();
            $table->integer('valor')->default(0);
            $table->string('descripcion')->nullable();
            $table->string('nombre_pais')->nullable();
            $table->string('nombre_departamento')->nullable();
            $table->string('nombre_ciudad')->nullable();
            $table->string('nombre_zona');
            $table->string('cantidad_por_presentacion')->nullable();
            $table->string('cantidad_presentaciones')->nullable();
            $table->string('presentacion')->nullable();
            $table->string('estado')->default('1')->comment('1=pendiente envio wms, 2 enviado a wms, 3 ya existe en wms');
            $table->string('salida_wms')->nullable();
            $table->string('error_wms')->nullable();
            $table->date('fecha_salida_wms')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
