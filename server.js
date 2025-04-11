const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Configuración del tablero inicial
const inicializarTablero = () => ([
    ['L-', 'N-', 'S-', 'G-', 'K-', 'G-', 'S-', 'N-', 'L-'],
    [' ', 'R-', ' ', ' ', ' ', ' ', ' ', 'B-', ' '],
    ['p-', 'p-', 'p-', 'p-', 'p-', 'p-', 'p-', 'p-', 'p-'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', 'B', ' ', ' ', ' ', ' ', ' ', 'R', ' '],
    ['L', 'N', 'S', 'G', 'K', 'G', 'S', 'N', 'L']
]);

let partidas = new Map();

io.on('connection', (socket) => {
    socket.on('nueva-partida', (idPartida) => {
        partidas.set(idPartida, {
            jugadores: [socket.id],
            tablero: inicializarTablero()
        });
        socket.join(idPartida);
    });

    socket.on('unirse-partida', (idPartida) => {
        const partida = partidas.get(idPartida);
        if (partida && partida.jugadores.length < 2) { // Verifica que haya espacio para otro jugador
            partida.jugadores.push(socket.id);
            socket.join(idPartida); // Une al jugador a la sala correspondiente
            io.to(idPartida).emit('inicio-juego', partida.tablero); // Envía el tablero inicial a ambos jugadores
        }
    });
    

    socket.on('movimiento', ({idPartida, desde, hacia}) => {
        socket.to(idPartida).emit('actualizar-tablero', {desde, hacia});
    });
});

app.use(express.static(path.join(__dirname, 'public')));

server.listen(3000, '0.0.0.0', () => {
    console.log('Servidor activo en puerto 3000');
});
