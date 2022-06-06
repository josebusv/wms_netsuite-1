//funcion para obtener colores aleatorios
function getRandomColor() {
    var letters = "0123456789ABCDEF".split("");
    var color = "#";
    for (var i = 0; i < 6; i++) {
        if (i == 2) {
            var lastcolor = letters[Math.floor(Math.random() * 16)];
            if (color.search(lastcolor) >= 0) {
                color += letters[Math.floor(Math.random() * 16)];
            } else {
                i--;
            }
        } else {
            color += letters[Math.floor(Math.random() * 16)];
        }
    }
    return color;
}
