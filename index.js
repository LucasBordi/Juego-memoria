let selecciones = [];
let chances = 20;
let intento = [0];
let aciertos = [0];
let puntajes = [0];
let mayorPuntos = [300];
let nivel = 1;
let min = 4;
let seg = 59;

generarTablero();


function cargarIconos() {
    if ((nivel === 5) || (nivel === 10) || (nivel === 15)
        || (nivel === 20) || (nivel === 25) || (nivel === 30)) {
        iconos = [
            '<i class="icon-IcoMoon"></i>',
            '<i class="icon-spinner3"></i>',
            '<i class="icon-qrcode"></i>',
            '<i class="icon-coin-dollar"></i>',
            '<i class="icon-reddit"></i>',
            '<i class="icon-tux"></i>',
            '<i class="icon-android"></i>',
            '<i class="icon-svg"></i>',
            '<i class="icon-power"></i>',
            '<i class="icon-leaf"></i>',
            '<i class="icon-meter"></i>',
            '<i class="icon-meter2"></i>'
        ]
    } else {
        if ((nivel % 2) == 1) {
            iconos = [
                '<i class="icon-map2"></i>',
                '<i class="icon-map"></i>',
                '<i class="icon-mobile2"></i>',
                '<i class="icon-mobile"></i>',
                '<i class="icon-heart-broken"></i>',
                '<i class="icon-heart"></i>',
                '<i class="icon-flickr"></i>',
                '<i class="icon-flickr2"></i>',
                '<i class="icon-evil2"></i>',
                '<i class="icon-evil"></i>',
                '<i class="icon-star-half"></i>',
                '<i class="icon-star-full"></i>'
            ]
        }
        if ((nivel % 2) == 0) {
            iconos = [
                '<i class="icon-reply"></i>',
                '<i class="icon-forward"></i>',
                '<i class="icon-enlarge2"></i>',
                '<i class="icon-image"></i>',
                '<i class="icon-images"></i>',
                '<i class="icon-pacman"></i>',
                '<i class="icon-clubs"></i>',
                '<i class="icon-quotes-left"></i>',
                '<i class="icon-quotes-right"></i>',
                '<i class="icon-hammer"></i>',
                '<i class="icon-shrink2"></i>',
                '<i class="icon-volume-mute"></i>',
            ]
        }
    }
}

function generarTablero() {
    obtenerStorage();
    cargarIconos();
    let tablero = document.getElementById("tablero");
    let tarjetas = [];
    for (let i = 0; i < 24; i++) {
        tarjetas.push(`
                <div class="area-tarjeta" onClick="seleccionarTarjeta(${i})">
                    <div class="tarjeta" id="tarjeta${i}">
                    <div class="cara trasera" id="trasera${i}">
                    ${iconos[0]}
                    </div>
                        <div class="cara superior">
                        <i class="icon-fire"></i>
                        </div>
                    </div>
                    </div>
            `)
        /*cambia el array iconos*/
        if (i % 2 == 1) {
            iconos.splice(0, 1);
        }
    }
    mostrarInfo()
    /*desordena los iconos*/
    tarjetas.sort(() => Math.random() - 0.5);
    /*muestra en pantalla las cartas*/
    tablero.innerHTML = tarjetas.join(" ");
}

function mostrarInfo() {
    let control = []
    let info = document.getElementById("info")
    juegoPerdido()
    if (aciertos == 12) {
        juegoGanado();
        puntuacion();
    }
    control.push(`
    <div id="area-datos">
    <div>Intentos:${intento}/${chances}</div>
    <div>Aciertos:${aciertos}</div> 
    <div>Puntaje:${puntajes}</div>
    <div>Nivel:${nivel}</div>
    <div>Max.puntos:${mayorPuntos}</div>
    </div>
    `)
    info.innerHTML = control.join(" ");
}

/* ******************************* FUNCIONES DEL JUEGO ******************************* */
function reiniciarJuego() {
    swal({
        title: "Estas seguro de reiniciar el juego?",
        text: "Perderas todo el progreso!",
        icon: "warning",
        buttons: {
            cancel: "cancelar",
            confirm: "adelante!",
        },
        closeOnClickOutside: false,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal({
                    text: "Juego Reiniciado!",
                    icon: "success",
                    timer: 1000,
                    button: false,
                });
                document.location.reload();
            } else {
                swal({
                    text: "Volvamos al juego!",
                    icon: "success",
                    timer: 1000,
                    button: false,
                }
                );
            }
        });
}

function actualizarIntento() {
    intento = (intento - (intento--));
    actualizarAciertos();
    generarTablero();
}

function actualizarAciertos() {
    aciertos = (aciertos - (aciertos--));
    console.log(aciertos + "aciertos actualizado");
}

function juegoPerdido(min, seg) {
    let loseAudio = new Audio("./sonidos/lose.wav");
    if ((intento === chances) || (min == 0 && seg == 0)) {
        swal({
            title: "Que Mala Suerte!",
            text: "Perdiste, vuelve a intentarlo!",
            icon: "error",
            className: "ventana-error",
            confirmButtonColor: "#8CD4F5",
            button: "Volver a intentar!",
            allowOutsideClick: false,
            allowEscapeKey: false,
        })
            .then(() => {
                puntajes = 0;
                $(document).ready(function () {
                    $('#cronometro').hide("slow");
                    $(".ocultar").show("fast");
                    document.location.reload()
                });
            });
        if (puntajes > mayorPuntos) {
            guardarPuntaje()
            setTimeout(() => {
                document.location.reload();
            }, 10000);
        }
        nivel = 1;
        loseAudio.play();
    }
}
/* *******************FUNCION STORAGE***********
https://sweetalert.js.org/docs/#content******** */
async function guardarPuntaje() {
    let jugador = swal({
        title: "Tu nombre",
        content: {
            element: "input",
            attributes: {
                placeholder: "Ingrese Su Nombre",
            },
        },
        button: "Guardar",
        closeOnClickOutside: false,
    })
    let data = await jugador;
    let persona = {
        data: data,
        aciertos: aciertos,
        intento: intento,
        nivel: nivel,
        puntajes: puntajes,
    }
    persona = await recorrerStorage();
    const dataStorage = persona.puntajes;
    console.log("dataStorage" + dataStorage);
    if (dataStorage > mayorPuntos) {
        mayorPuntos = dataStorage;
        console.log("mayorpuntaje" + mayorPuntos);
    }
    if (persona != null) {
        let ver = localStorage.setItem("jugador", JSON.stringify(persona)).find();
        let datosPersonaNull = persona;
        console.log("ver" + ver);
        datosPersonaNull.push(persona);
        localStorage.setItem("jugador", JSON.stringify(persona));
    }
    listaPersona = localStorage.setItem("jugador", JSON.stringify(persona));
    async function recorrerStorage() {
        let listaPersona = JSON.parse(localStorage.getItem("jugador"))
        if (listaPersona == null) {
            listaPersona = persona;
        }
        else {
            listaPersona = persona;
            let verDatos = JSON.stringify(persona);
            console.log("verdato" + verDatos);
        }
        return listaPersona;
    }
    mostrarInfo()
};

function obtenerStorage() {
    let datos = JSON.parse(localStorage.getItem("jugador"))
    console.log("obteniedo datos" + datos);
    if (localStorage.getItem("jugador") != null) {
        if (mayorPuntos < datos.puntajes) {
            mayorPuntos = datos.puntajes;
        }
    }
}
/* ************************************** */
function juegoGanado() {
    let victoryAudio = new Audio("./sonidos/victory.mp3");
    victoryAudio.play()
    swal({
        title: "Felicidades!",
        text: "Ganaste!",
        icon: "success",
        className: "ventana-correcto",
        button: "Siguiente Nivel =>",
        closeOnClickOutside: false,
    })
        .then((nuevoJuego) => {
            if (nuevoJuego) {
                actualizarAciertos();
                actualizarIntento();
            }
        });
    min = (min + 1);
    nivel = (nivel + 1);
}

function puntuacion() {
    puntajes = puntajes++
    if (puntajes < 0) {
        puntajes = 0;
    }
    if (puntajes === 0) {
        puntajes = (12);
    } else if (puntajes != 0) {
        puntajes = (puntajes + 12);
    }
}

function cronometro() {
    let timer = setInterval(() => {
        console.log(min, seg);
        seg--;
        $(document).ready(function () {
            $("button").click(function () {
                $('#cronometro').show("slow");
                document.getElementById("cronometro").innerHTML =
                    `<div id="contenedor-tiempo">
                    <div class="caja-tiempo">${min} : ${seg}</>
                    </div>`
            });
            $("#ocultar").hide();
        });
        if (min < 10) {
            document.getElementById("cronometro").innerHTML =
                `<div id="contenedor-tiempo">
                <div class="caja-tiempo">0${min}:${seg}</div>
                </div>`
        }
        if (seg < 10) {
            document.getElementById("cronometro").innerHTML =
                `<div id="contenedor-tiempo">
                <div class="caja-tiempo">${min}:0${seg}</div>
                </div>`
        }
        if (min == 0 && seg == 0 || intento == chances) {
            juegoPerdido(min, seg);
            clearInterval(timer);
        }
        if (seg == 0) {
            min--;
            seg = 59;
        }
    }, 1000)
}

function seleccionarTarjeta(i) {
    let cardAudio = new Audio("./sonidos/card.wav");
    let errorAudio = new Audio("./sonidos/error.wav");
    let correctaAudio = new Audio("./sonidos/correcta.wav");
    let tarjetas = document.getElementById("tarjeta" + i);
    if (tarjetas.style.transform != "rotateY(180deg)") {
        /*cuando pasa el mouse gira 180°*/
        tarjetas.style.transform = "rotateY(180deg)";
        selecciones.push(i);
        cardAudio.play();
    }
    if (selecciones.length == 2) {
        deseleccionar(selecciones);
        selecciones = [];
    }
    function deseleccionar(selecciones) {
        setTimeout(() => {
            let trasera1 = document.getElementById("trasera" + selecciones[0]);
            let trasera2 = document.getElementById("trasera" + selecciones[1]);
            if (trasera1.innerHTML != trasera2.innerHTML) {
                let tarjetas1 = document.getElementById("tarjeta" + selecciones[0]);
                let tarjetas2 = document.getElementById("tarjeta" + selecciones[1]);
                tarjetas1.style.transform = "rotateY(0deg)";
                tarjetas2.style.transform = "rotateY(0deg)";
                intento++;
                puntajes = (puntajes - 5);
                errorAudio.play();
            }
            else {
                puntuacion();
                mostrarInfo();
                trasera1.style.background = " transparent";
                trasera1.style.borderRadius = "10px";
                trasera1.style.borderColor = " black";
                trasera2.style.background = "transparent";
                trasera2.style.borderRadius = "10px";
                trasera2.style.borderColor = " black";
                aciertos++;
                correctaAudio.play();
            }
            mostrarInfo();
        }, 500);
    }
}

//modo oscuro
//https://www.youtube.com/watch?v=3V8E57ChrKM
const boton = document.getElementById('boton-oscuro');
const configUser = window.matchMedia('(prefers-color-scheme: tema-oscuro)');
const localConfig = localStorage.getItem("tema");
/*
if (localConfig === 'tema-oscuro') {
    document.body.classList.toggle('tema-oscuro');
    boton.textContent = "Modo Claro";
} else{
    document.body.classList.toggle('tema-claro');
    boton.textContent = "Modo Oscuro"
}
*/
boton.addEventListener('click', () => {
    let colorTema;
    if (configUser.matches) {
        //entramos al modo oscuro
        document.body.classList.toggle('tema-claro');
        colorTema = document.body.classList.contains('tema-claro') ? 'tema-claro' : 'tema-oscuro';
        boton.textContent = "Modo Oscuro";

    } else {
        document.body.classList.toggle('tema-oscuro');
        colorTema = document.body.classList.contains('tema-oscuro') ? 'tema-oscuro' : 'tema-claro';
        boton.textContent = "Modo Claro";
    }
    localStorage.setItem("tema", colorTema)
})  