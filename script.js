$(function() {
    $()
})

const socket = io();
let idPartidaActual; // ID de la partida actual
let seleccionada = null; // Pista para la pieza seleccionada

// Evento que se ejecuta cuando se inicia una partida
socket.on('inicio-juego', (tablero) => {
    renderizarTablero(tablero); // Renderiza el tablero inicial recibido del servidor
});

// Evento que actualiza el tablero cuando un jugador realiza un movimiento
socket.on('actualizar-tablero', ({ desde, hacia }) => {
    actualizarTablero(desde, hacia); // Actualiza el tablero visualmente
});

// Función para crear una nueva partida
function crearPartida() {
    const idPartida = Date.now().toString(); // Genera un ID único basado en la hora actual
    socket.emit('nueva-partida', idPartida); // Notifica al servidor que se ha creado una nueva partida
    idPartidaActual = idPartida; // Guarda el ID de la partida actual
}

// Función para unirse a una partida existente
function unirsePartida() {
    const id = document.getElementById('id-partida').value; // Obtiene el ID ingresado por el usuario
    socket.emit('unirse-partida', id); // Notifica al servidor que el jugador quiere unirse a esa partida
}

// Función para realizar un movimiento en el tablero
function realizarMovimiento(desde, hacia) {
    if (esMovimientoValido(desde, hacia)) { // Valida si el movimiento es legal según las reglas del Shogi
        socket.emit('movimiento', { idPartida: idPartidaActual, desde, hacia }); // Envía el movimiento al servidor
    } else {
        alert('Movimiento inválido'); // Muestra un mensaje si el movimiento no es válido
    }
}

// Función para validar si un movimiento es válido (puedes personalizarla según las reglas del Shogi)
function esMovimientoValido(desde, hacia) {
    // Aquí puedes implementar las reglas específicas del Shogi.
    // Por ejemplo: validar si la pieza puede moverse en esa dirección.
    return true; // Por ahora, permite todos los movimientos (cámbialo más adelante).
}

// Función para renderizar el tablero en la interfaz gráfica
function renderizarTablero(tablero) {
    const contenedor = document.getElementById('tablero'); // Obtiene el contenedor del tablero
    contenedor.innerHTML = ''; // Limpia cualquier contenido anterior del tablero
    
    tablero.forEach((fila, y) => {
        fila.forEach((pieza, x) => {
            const casilla = document.createElement('div'); // Crea una nueva casilla
            casilla.className = 'casilla'; // Asigna la clase "casilla" para estilos CSS
            casilla.dataset.pos = `${x},${y}`; // Guarda la posición de la casilla como atributo de datos
            casilla.textContent = pieza; // Muestra la pieza en la casilla (si existe)
            casilla.addEventListener('click', manejarClick); // Añade un evento de clic a la casilla
            contenedor.appendChild(casilla); // Añade la casilla al contenedor del tablero
        });
    });
}

// Función para manejar los clics en las casillas del tablero
function manejarClick(e) {
    const posicion = e.target.dataset.pos.split(',').map(Number); // Obtiene la posición de la casilla clicada

    if (!seleccionada) { 
        seleccionada = posicion; // Selecciona la pieza inicial si no hay ninguna seleccionada aún
        e.target.style.backgroundColor = 'yellow'; // Destaca visualmente la casilla seleccionada
    } else {
        realizarMovimiento(seleccionada, posicion); // Realiza el movimiento desde la posición seleccionada a la nueva posición
        seleccionada = null; // Resetea la selección después del movimiento
        document.querySelectorAll('.casilla').forEach(c => c.style.backgroundColor = ''); // Limpia los colores destacados de todas las casillas
    }
}

// Función para actualizar el tablero después de un movimiento
function actualizarTablero(desde, hacia) {
    const desdeCasilla = document.querySelector(`[data-pos="${desde[0]},${desde[1]}"]`); // Encuentra la casilla de origen
    const haciaCasilla = document.querySelector(`[data-pos="${hacia[0]},${hacia[1]}"]`); // Encuentra la casilla de destino

    if (desdeCasilla && haciaCasilla) { 
        haciaCasilla.textContent = desdeCasilla.textContent; // Mueve la pieza a la nueva posición
        desdeCasilla.textContent = ''; // Limpia la posición anterior después del movimiento
    }
}

