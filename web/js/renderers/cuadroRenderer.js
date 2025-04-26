"use strict";

import { parseHTML } from "/web/js/utils/parseHTML.js";

const cuadroRenderer = {
    rendCuadro: function (num) {
        let html = `<div class="col grupo mb-4" id="grupo${num}">
                        <h3 class="h5 text-center mb-3">Grupo ${num}</h3>
                        <div class="participantes" ondrop="drop(event)" ondragover="allowDrop(event)">
                        </div>
                    </div>`;
        let cuadro = parseHTML(html);
        return cuadro;
    }

    ,rendParticipante: function(participante){

        let html= `<div class="participante" draggable="true" ondragstart="drag(event)" data-participante-id="${participante.concursanteId}">
                        <span>${participante.nombre}</span>
                        <div class="dropdown">
                        <span class="menu-dots" data-bs-toggle="dropdown">⋮</span>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><a class="dropdown-item" href="#" onclick="mostrarModalResultado(this)">Editar</a></li>
                                <li><a class="dropdown-item" href="#" onclick="confirmarEliminacion(this)">Eliminar</a></li>
                            </ul>
                        </div>
                    </div>`;
        participante= parseHTML(html);
        return participante;
    }
        
};

export { cuadroRenderer };