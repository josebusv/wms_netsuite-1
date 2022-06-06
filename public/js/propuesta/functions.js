let clickInputCantidad = [];
let datos_select_productos = [];

$(".btn_guardar").prop("disabled", true);

const options2 = {
    style: "currency",
    currency: "USD",
};
const numberFormat2 = new Intl.NumberFormat("en-US", options2);

$("#axlp_zona").prop("disabled", true);
//funcion que monitorea la escritura en elcampo axlp_cliente, y retorna la busqueda apartir del 4 caracter
$("#axlp_cliente").typeahead({
    minLength: 4,
    source: function (query, process) {
        return $.get(
            route("propuesta.getClientes"),
            {
                query: query,
            },
            function (data) {
                return process(data);
            }
        );
    },
    updater: function (selection) {
        //console.log($("ul #typeahead")[0]);

        $("#btn_eliminar_cliente").prop("disabled", false);
        btnSelectCliente(selection);
        return selection.nombre_sucursal;
    },
});

function btnSelectCliente(array) {
    limpiarcamopos();

    var direccion_id = array.id;
    var url_consulta = route("propuesta.infoCliente", direccion_id);

    $.ajax({
        headers: {
            "X-CSRF-TOKEN": "{{ csrf_token() }}",
        },
        type: "GET",
        encoding: "UTF-8",
        url: url_consulta,
        dataType: "json",
        success: function (response) {
            //pintar informacion
            $("#axlp_cliente").val(response.nombre_sucursal);
            $("#envio_direccion").val(response.direccion_envio);
            $("#direccion_facturacion").val(response.dirrecion_factura);
            //$("#tipo_orden").val("3 - FERIA");
            $("#nombre_cliente").val(response.nombre_cliente);
            $("#numero_identificacion").val(response.documento);
            $("#catgoria_cliente").val(response.categoria);
            $("#telfono_cliente").val(response.telefono);
            $("#correo_cliente").val(response.correo);
            $("#id_direccion").val(response.id_direccion);
            $("#id_cliente").val(response.id_cliente);

            //desabilitar
            $("#direccion_facturacion").prop("disabled", true);

            //consultar zonas
            console.log(response.zonas);
            consultarZonasCliente(response.zonas);

            $("#axlp_zona").prop("disabled", false);
        },
        error: function (xhr, status, error) {
            let err = eval("(" + xhr.responseText + ")");
        },
    });
}

function consultarZonasCliente(zonas) {
    //console.log(zonas);
    $("#axlp_zona option").remove();
    $("#axlp_zona").append('<option value="">- SELECCIONAR -</option>');
    var agregar = "";
    zonas.forEach((element) => {
        agregar += `<option value="${element.id}">${element.nombre} :: ${element.responsable}</option>`;
    });
    $("#axlp_zona").append(agregar);
}

$("#btn_eliminar_cliente").on("click", function (params) {
    //$('#axlp_cliente').typeahead('destroy');
    $("#btn_eliminar_cliente").prop("disabled", true);
    //limpiamos campos
    limpiarcamopos();
});

function limpiarcamopos() {
    $("#axlp_zona option").remove();
    $("#axlp_zona").append('<option value="">SELECCIONE ZONA</option>');
    $("#axlp_cliente").val("");
    $("#envio_direccion").val("");
    $("#direccion_facturacion").val("");
    $("#envio_a").val("");
    $("#tipo_orden").val("");
    $("#nombre_cliente").val("");
    $("#numero_identificacion").val("");
    $("#catgoria_cliente").val("");
    $("#telfono_cliente").val("");
    $("#correo_cliente").val("");

    $("#id_direccion").val("");
    $("#id_cliente").val("");
    $("#tipo_cliente").val("");
}

$("#axlp_zona").on("change", function () {
    var dato = $(this).find(":selected").val();
    //alert("entro");
    if (dato == "") {
        $("#select_metodo_pago").prop("disabled", true);
    } else {
        $("#select_metodo_pago").prop("disabled", false);
        var url = route("tomar_pedido.obtenerZonasCliente", dato);

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
            },
            type: "GET",
            encoding: "UTF-8",
            url: url,
            dataType: "json",
            success: function (response) {
                //console.log(response);
                cargarInformacionZonas(response.zonas);

                //cargar productos
                //cargarDatosSelectProductos();
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            },
        });
    }
});

function cargarInformacionZonas(informacion) {
    $("#lista_precio option").remove();
    $("#lista_precio").append(
        $("<option>", {
            value: informacion.lista_precio_id,
            text: informacion.lista_precio_nombre,
        })
    );

    //ejecutar funcion carga metodo pago
    var id_cliente = $("#id_cliente").val();
    funcionCargarMetodoPagos(informacion.lista_precio_id, id_cliente);
}

function funcionCargarMetodoPagos(lista_precio_id, id_cliente) {
    $("#select_metodo_pago option").remove();
    $("#select_metodo_pago").append(
        $("<option>", { value: "", text: "- Seleccione -" })
    );

    if ($("#tipo_cliente").val() == "temp") {
        $("#select_metodo_pago").append(
            $("<option>", { value: "1", text: "CONTADO" })
        );
        $("#select_metodo_pago").append(
            $("<option>", { value: "2", text: "CREDITO" })
        );
    } else {
        var url = route("propuesta.getMetodosPago", [
            lista_precio_id,
            id_cliente,
        ]);

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
            },
            type: "GET",
            encoding: "UTF-8",
            url: url,
            dataType: "json",
            success: function (response) {
                //console.log(response);
                $("#select_metodo_pago").append(response.data);
                //cargarInformacionZonas(response.zonas);
            },
            error: function (xhr, status, error) {
                var err = eval("(" + xhr.responseText + ")");
                alert(err.Message);
            },
        });
    }
}

$("#select_metodo_pago").on("change", function () {
    var dato = $(this).find(":selected").val();
    if (dato != "") {
        $("#btn_buscar_productos").prop("disabled", false);
        cargarDatosSelectProductos();
        if (datos_select_productos.length > 0) {
            obtenerDatosTableProductos();
        }
    } else {
        $("#btn_buscar_productos").prop("disabled", true);
    }
});

//buscar articulo

var tabla_articulo = $("#tabla_articulo").DataTable({
    language: {
        url: "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json",
    },
    paging: false,
    order: [[1, "asc"]],
    columns: [
        {
            className: "dt-control",
            orderable: false,
            data: null,
            defaultContent: "",
        },
        { data: "ean", orderData: 1 },
        { data: "nombre_item" },
        { data: "ubicacion" },
        { data: "disponible" },
        { data: "input" },
        { data: "sin_teleferia" },
        { data: "porciento_teleferia" },
        { data: "con_teleferia" },
        { data: "iva" },
    ],
    rowCallback: function (row, data) {
        if ($.inArray(data.DT_RowId, datos_select_productos) !== -1) {
            $(row).addClass("selected");
        }
    },
});

var tabla_detalle_seleccion = $("#tabla_detalle_seleccion").DataTable({
    language: {
        url: "//cdn.datatables.net/plug-ins/1.11.4/i18n/es_es.json",
    },
    paging: false,
    order: [[2, "asc"]],
    columns: [
        {
            data: "button",
        },
        {
            data: "boton_ver",
        },
        { data: "id" },
        { data: "nombre_item", width: "30%" },
        { data: "ubicacion" },
        { data: "input" },
        { data: "sin_teleferia" },
        { data: "con_teleferia" },
        { data: "iva" },
        { data: "total_sin_iva" },
        { data: "total_con_iva" },
        { data: "generico", visible: false },
        { data: "linea", visible: false },
    ],
});

$("#select_metodo_pago").on("change", function () {
    var dato = $(this).find(":selected").val();
    if (dato != "") {
        $("#btn_buscar_productos").prop("disabled", false);
        cargarDatosSelectProductos();
        if (datos_select_productos.length > 0) {
            obtenerDatosTableProductos();
        }
    } else {
        $("#btn_buscar_productos").prop("disabled", true);
    }
});

function cargarDatosSelectProductos() {
    var lista_id = $("#lista_precio").find(":selected").val();
    var zona = $("#axlp_zona").find(":selected").val();
    var cliente = $("#id_cliente").val();
    var propuesta_id = $("#propuesta_id").val();
    var tipo_pago = $("#select_metodo_pago").find(":selected").val();
    var url = route("propuesta.getProducts", [
        lista_id,
        zona,
        cliente,
        tipo_pago,
        propuesta_id,
    ]);
    //console.log(url);
    tabla_articulo.ajax.url(url).load();
    tabla_articulo.columns.adjust().draw();

    setTimeout(function () {
        if (clickInputCantidad.length > 0) {
            clickInputCantidad.forEach((element) => {
                //console.log($('#tbody_tabla_articulos #'+element).closest('tr'));
                $("#tbody_tabla_articulos #" + element.id)
                    .closest("tr")
                    .addClass("selected");
                $("#input_cantidad_" + element.id + "").val(element.cantidad);
            });
        }
    }, 3000);
}

//para ver mas informacion del producto
function format(d) {
    // `d` is the original data object for the row
    return (
        '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">' +
        "<tr>" +
        "<td>ID:</td>" +
        "<td>" +
        d.id +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Generico:</td>" +
        "<td>" +
        d.generico +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Linea:</td>" +
        "<td>" +
        d.linea +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Embalaje:</td>" +
        "<td>" +
        d.embalaje +
        "</td>" +
        "</tr>" +
        "<tr>" +
        "<td>Cantidad Maxima:</td>" +
        "<td>" +
        d.cantidad_maxima +
        "</td>" +
        "</tr>" +
        "</table>"
    );
}

// Add event listener for opening and closing details
$("#tabla_articulo tbody").on("click", "td.dt-control", function () {
    var tr = $(this).closest("tr");
    var row = tabla_articulo.row(tr);

    if (row.child.isShown()) {
        // This row is already open - close it
        row.child.hide();
        tr.removeClass("shown");
    } else {
        // Open this row
        row.child(format(row.data())).show();
        tr.addClass("shown");
    }
});

$("#tabla_articulo tbody").on("click", "tr", function () {
    var id = this.id;
    //console.log(id);
    var index = $.inArray(id, datos_select_productos);
    $("#input_cantidad_" + id + "").val(1);

    if (index === -1) {
        datos_select_productos.push(id);

        let cantidad = $("#input_cantidad_" + id + "").val();
        clickInputCantidad.push({
            id: id,
            cantidad: parseInt(cantidad),
        });

        //habilitar input
        $("#input_cantidad_" + id + "").prop("disabled", false);
        $("#input_cantidad_" + id + "").focus();
    } else {
        var nuevo = [];
        clickInputCantidad.forEach((element) => {
            if (element.id != id) {
                nuevo.push({
                    id: element.id,
                    cantidad: element.cantidad,
                });
            }
        });
        clickInputCantidad.pop();
        clickInputCantidad = nuevo;

        //desabilitar input
        $("#input_cantidad_" + id + "").prop("disabled", true);
        $("#input_cantidad_" + id + "").val(0);

        datos_select_productos.splice(index, 1);
    }

    $(this).toggleClass("selected");
    $("#ids_selectds").val(datos_select_productos);
    //console.log(datos_select_productos);
    //console.log(clickInputCantidad);
});

function obtenerDatosTableProductos() {
    if (clickInputCantidad.length > 0) {
        //limpia la tabla
        tabla_detalle_seleccion.clear().draw();

        var data = clickInputCantidad;
        var metodo_pago = $("#select_metodo_pago").find(":selected").val();
        var lista_id = $("#lista_precio").find(":selected").val();
        var url = route("propuesta.obtenerInformacionProducto");

        // agrego la data del form a formData
        var formData = new FormData();
        formData.append("data", JSON.stringify(data));
        formData.append("metodo_pago", metodo_pago);
        formData.append("cantidades", null);
        formData.append("lista", lista_id);

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": $('meta[name="csrf_token"]').attr("content"),
            },
            type: "POST",
            encoding: "UTF-8",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function () {
                swal("Cargando información...", {
                    button: false,
                });
            },
        })
            .done(function (respuesta) {
                //console.log(respuesta);

                if (respuesta.data.length > 0) {
                    respuesta.data.forEach((element) => {
                        tabla_detalle_seleccion.row
                            .add({
                                button: element["boton"],
                                boton_ver: element["boton_ver"],
                                nombre_item: element["nombre_item"],
                                ubicacion: element["ubicacion"],
                                input: element["input"],
                                sin_teleferia: element["sin_teleferia"],
                                con_teleferia: element["con_teleferia"],
                                iva: element["iva"] + "%",
                                total_sin_iva: element["total_sin_iva"],
                                total_con_iva: element["total_con_iva"],
                                id: element["id"],
                                generico: element["generico"],
                                linea: element["linea"],
                                embalaje: element["embalaje"],
                                ean: element["ean"],
                            })
                            .node().id = element["DT_RowId"];
                        tabla_detalle_seleccion.draw(false);
                    });
                }

                $("#cantidadcard").text(
                    respuesta.informacion_global.items_cant
                );
                $("#cantidadSolicitado").text(
                    respuesta.informacion_global.items_solicitado
                );
                $("#subtotal").text(
                    numberFormat2.format(respuesta.informacion_global.subtotal)
                );
                $("#totalimpuestos").text(
                    numberFormat2.format(respuesta.informacion_global.impuesto)
                );
                $("#total").text(
                    numberFormat2.format(respuesta.informacion_global.total)
                );

                $("#cantidad_items").val(
                    respuesta.informacion_global.items_cant
                );
                $("#cantidad_solicitado").val(
                    respuesta.informacion_global.items_solicitado
                );
                $("#sub_total").val(respuesta.informacion_global.subtotal);
                $("#total_impuestos").val(
                    respuesta.informacion_global.impuesto
                );
                $("#total_final").val(respuesta.informacion_global.total);

                swal("Productos Cargados", {
                    icon: "success",
                    button: false,
                    timer: 2000,
                });

                $(".btn_guardar").prop("disabled", false);
            })
            .fail(function (resp) {
                console.log(resp);
            });
    } else {
        swal("No seleccionaste ningun producto!", {
            icon: "error",
            button: false,
            timer: 2000,
        });
    }
}

$("#tabla_detalle_seleccion").on(
    "click",
    "#btn_eliminar_del_detalle",
    function () {
        var id_tr = $(this).closest("tr")[0].id;
        console.log(id_tr);

        swal({
            title: "Eliminar",
            text: "Seguro en eliminar este producto?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                $("#tbody_tabla_articulos #" + id_tr)
                    .closest("tr")
                    .removeClass("selected");

                datos_select_productos = arrayRemove(
                    datos_select_productos,
                    id_tr
                );
                $("#ids_selectds").val(datos_select_productos);

                var nuevo = [];
                clickInputCantidad.forEach((element) => {
                    if (element.id != id_tr) {
                        nuevo.push({
                            id: element.id,
                            cantidad: element.cantidad,
                        });
                    }
                });
                clickInputCantidad.pop();
                clickInputCantidad = nuevo;

                //console.log(clickInputCantidad);

                tabla_detalle_seleccion
                    .row($(this).parents("tr"))
                    .remove()
                    .draw(false);

                //actualizar
                obtenerDatosTableProductos();
            }
        });
    }
);

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value;
    });
}

function funcionCalcularTotales(params) {
    $("#input_cantidad_" + params + "").on("keyup mouseup", function (evt) {
        //solo aceptar numeros
        this.value = this.value.replace(/[^0-9]/g, "");

        //cantidad maxima
        let cantidad_maxima = $("#input_maxima_" + params + "").val();

        //obtener cantidades
        let cantidad = $("#input_cantidad_" + params + "").val();
        console.log(cantidad);

        if (cantidad > 0) {
            //agregar
            var elementIndex = clickInputCantidad.findIndex(
                (obj) => obj.id == params
            );
            clickInputCantidad[elementIndex].cantidad = parseInt(cantidad);
            var nuevo_cantidad = clickInputCantidad[elementIndex].cantidad;

            if (cantidad_maxima > 0) {
                if (nuevo_cantidad > cantidad_maxima) {
                    swal({
                        title: "Advertencia!",
                        text:
                            "No puedes agregar una cantidad mayor a '" +
                            cantidad_maxima +
                            "'",
                        icon: "warning",
                        dangerMode: true,
                    }).then((willDelete) => {
                        if (willDelete) {
                            clickInputCantidad[elementIndex].cantidad =
                                parseInt(cantidad_maxima);
                            $("#input_cantidad_" + params + "").val(
                                cantidad_maxima
                            );
                            $("#input_cantidad_" + params + "").focus();
                        }
                    });
                } else {
                    if (clickInputCantidad[elementIndex].cantidad > 0) {
                        //agregar
                        clickInputCantidad[elementIndex].cantidad =
                            parseInt(nuevo_cantidad);

                        //console.log(clickInputCantidad[elementIndex].cantidad);
                        $("#cant_selectds").val(
                            JSON.stringify(clickInputCantidad)
                        );
                    }
                }
            }
        } else {
            var elementIndex = clickInputCantidad.findIndex(
                (obj) => obj.id == params
            );
            clickInputCantidad[elementIndex].cantidad = parseInt(1);
        }

        //console.log(clickInputCantidad[elementIndex].cantidad);
        $("#cant_selectds").val(JSON.stringify(clickInputCantidad));

        console.log(clickInputCantidad);
    });
}

$("#btn_buscar_productos").on("click", function () {
    setTimeout(function () {
        if (clickInputCantidad.length > 0) {
            clickInputCantidad.forEach((element) => {
                //console.log($('#tbody_tabla_articulos #'+element).closest('tr'));
                $("#tbody_tabla_articulos #" + element.id)
                    .closest("tr")
                    .addClass("selected");
                $("#input_cantidad_" + element.id + "").val(element.cantidad);
            });
        }
    }, 1000);
});

/**
 * Guardar cotizacion
 */
$("#form_cotizacion").on("submit", function (e) {
    event.preventDefault();
    if ($("#form_cotizacion")[0].checkValidity() === false) {
        event.stopPropagation();
    } else {
        // agregar data
        var $thisForm = $("#form_cotizacion");
        var formData = new FormData(this);

        //ruta
        var url = route("propuestas.store");

        $.ajax({
            headers: {
                "X-CSRF-TOKEN": "{{ csrf_token() }}",
            },
            type: "POST",
            encoding: "UTF-8",
            url: url,
            data: formData,
            processData: false,
            contentType: false,
            dataType: "json",
            beforeSend: function () {
                swal("Guardando Cotización, espera porfavor...", {
                    button: false,
                    timer: 3000,
                });
            },
        })
            .done(function (respuesta) {
                console.log(respuesta);
                if (!respuesta.error) {
                    swal("Cotización Guardada Correctamente", {
                        icon: "success",
                        button: false,
                        timer: 3000,
                    });
                    window.location.href = route("propuestas.propias");
                } else {
                    setTimeout(function () {
                        swal(respuesta.mensaje, {
                            icon: "error",
                            button: false,
                            timer: 4000,
                        });
                    }, 2000);
                }
            })
            .fail(function (resp) {
                console.log(resp);
            });
    }
    $("#form_cotizacion").addClass("was-validated");
});
