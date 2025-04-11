class Shogi {
    constructor() {
        this.piezas = {
            'K': {movimiento: [[-1,1],[0,1],[1,1],/*...*/]},
            'G': {movimiento: [[-1,1],[0,1],[1,1],/*...*/]},
            // ... otras piezas
        };
    }

    validarMovimiento(pieza, desde, hacia) {
        const movimientos = this.piezas[pieza.replace(/[+-]/, '')].movimiento;
        return movimientos.some(([dx, dy]) => 
            (hacia.x === desde.x + dx) && (hacia.y === desde.y + dy)
        );
    }
}
