"use strict";

import { concursantesAPI_auto } from "/js/api/_concursantes.js";
import { concursosAPI_auto } from "/js/api/_concursos.js";
import { premiosAPI_auto } from "/js/api/_premios.js";
import { metadatosAPI_auto } from "/js/api/_metadatos.js";

import { cuadroRenderer } from "/js/renderers/cuadroRenderer.js";
import {messageRenderer} from "/js/renderers/messages.js";

let numConcursantesBase=0;
let numGruposBase=0;
let numConcursantesRepesca=0;
let numGruposRepesca=0;
let eliminadosBase= [];


let botonSorteo= document.querySelector("button#boton-sorteo");
botonSorteo.addEventListener("click", cargarCuadroInicial);    

async function main() {
    cargarMetaDatos();
    configuraNavegacionGrid();
    //configuraNavegacionGrid();
}

//sorteo cuadro torneo

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function cargarCuadroInicial() {
    let container = document.querySelector(`div.brackets-grid[id="1"]`);
    try {
        let concursantes = await concursantesAPI_auto.getAll();
        numConcursantesBase = concursantes.length;
        numGruposBase = Math.floor(numConcursantesBase / 4);
        let resto = numConcursantesBase % 4;
        
        // Mezclamos los concursantes un par de veces pa que quede random
        let num = 0;
        while(num < 10) {
            concursantes = shuffle(concursantes);
            num++;
        }
        
        let concursanteIndex = 0;
        
        // Vamos grupo por grupo
        for(let n = 0; n < numGruposBase; n++) {
            let cuadro = cuadroRenderer.rendCuadro(n + 1);
            container.appendChild(cuadro);
            let participantes = cuadro.querySelector("div.participantes");
            
            // Calculamos cuántos participantes van en este grupo
            let participantesEnGrupo = 4;
            // Si hay resto y estamos en los últimos grupos, metemos uno más
            if (resto > 0 && n >= numGruposBase - resto) {
                participantesEnGrupo = 5;
            }
            
            // Metemos los participantes en el grupo
            for(let i = 0; i < participantesEnGrupo; i++) {
                if (concursanteIndex < numConcursantesBase) {
                    let conc = cuadroRenderer.rendParticipante(concursantes[concursanteIndex]);
                    participantes.appendChild(conc);
                    concursanteIndex++;
                }
            }
        }
    } catch (err) {
        if (!(err instanceof TypeError && err.message.includes("participante"))) {
            messageRenderer.showErrorMessage("Error while loading info", err);
        }
    }
    cargarCuadroRepesca();
}

//habría que tener en cuenta que habra tantos eliminados que iran a la repesca como grupos del cuadro inicial haya,
//  además de que el numero de participantes de la segunda ronda quede bien:
// lo que quede mejor (más pequeño) de [(repescados + clasificados)%4 ó (repescados + clasificados)%3)


function cargarCuadroRepesca() {
    let container = document.querySelector(`div.brackets-grid[id="2"]`);
        numConcursantesRepesca = numGruposBase; 
        let resto3 = numConcursantesRepesca % 3;
        let resto4 = numConcursantesRepesca % 4;
        let resto= (resto3<=resto4)?resto3:resto4;
        numGruposRepesca = Math.floor(numConcursantesRepesca / ((resto==resto3)?3:4));
        console.log(numConcursantesRepesca);
        console.log(resto);
        console.log(numGruposRepesca);

        for(let numero=0; numero<numConcursantesRepesca ; numero++){
            let o= {concursanteId: `${numero}`, nombre: `Repescado ${numero}`}
            eliminadosBase.push(o);
        }
        console.log(eliminadosBase);


        // Mezclamos los concursantes un par de veces pa que quede random
        let num = 0;
        while(num < 10) {
            eliminadosBase = shuffle(eliminadosBase);
            num++;
        }
        
        let concursanteIndex = 0;
        
        // Vamos grupo por grupo
        for(let n = 0; n < numGruposRepesca; n++) {
            let cuadro = cuadroRenderer.rendCuadro(n + 1);
            container.appendChild(cuadro);
            let participantes = cuadro.querySelector("div.participantes");
            
            // Calculamos cuántos participantes van en este grupo
            let participantesEnGrupo = (resto==resto3)?3:4;
            // Si hay resto y estamos en los últimos grupos, metemos uno más
            if (resto > 0 && n >= numGruposRepesca - resto) {
                participantesEnGrupo = participantesEnGrupo + 1;
            }
            
            // Metemos los participantes en el grupo
            for(let i = 0; i < participantesEnGrupo; i++) {
                if (concursanteIndex < numConcursantesRepesca) {
                    let conc = cuadroRenderer.rendParticipante(eliminadosBase[concursanteIndex]);
                    participantes.appendChild(conc);
                    concursanteIndex++;
                }
            }
        }
}

//metadatos

async function cargarMetaDatos() {
    try {
        let premios = await premiosAPI_auto.getAll();
        let premioSalteras= premios[0];
        //console.log(premios);
        //premios.forEach(p=> {console.log(p.nombreConcurso)});
        console.log(premioSalteras.nombreConcurso);
        document.title= premioSalteras.nombreConcurso;

        let titulo= document.querySelector("h1");
        console.log(titulo);
        titulo.textContent= "🏆 ".concat(premioSalteras.nombreConcurso);

    } catch (err) {
        messageRenderer.showErrorMessage("Error while loading metadata", err);
    }
}

function despliega_grid_siguiente(gridActual, gridSiguiente, flechaAtras) {
    gridActual.classList.remove("activo");
    gridSiguiente.classList.add("activo");
    // Activamos la flecha pa' volver
    flechaAtras.classList.add("activo");
}

function oculta_grid_anterior(gridActual, gridAnterior, flechaAtras) {
    gridActual.classList.remove("activo");
    gridAnterior.classList.add("activo");
    // Ya no necesitamos la flecha de este nivel
    flechaAtras.classList.remove("activo");
}

// Función principal que configura toda la navegación
function configuraNavegacionGrid() {
    // Pillamos todas las flechas y grids que necesitamos
    const grid1 = document.querySelector(`div.brackets-grid[id="1"]`);
    const grid2 = document.querySelector(`div.brackets-grid[id="2"]`);
    const grid3 = document.querySelector(`div.brackets-grid[id="3"]`);
    
    const flechaAdelante1 = document.querySelector("img#flecha-adelante-grid-1");
    const flechaAdelante2 = document.querySelector("img#flecha-adelante-grid-2");
    const flechaAtras2 = document.querySelector("img#flecha-atras-grid-2");
    const flechaAtras3 = document.querySelector("img#flecha-atras-grid-3");

    console.log(flechaAdelante1);
    console.log(flechaAdelante2);
    console.log(flechaAtras2);
    console.log(flechaAtras3);
    
    // Configuramos los eventos pa' las flechas hacia adelante
    if (flechaAdelante1) {
        flechaAdelante1.addEventListener("click", () => {
            despliega_grid_siguiente(grid1, grid2, flechaAtras2);
        });
    }

    if (flechaAdelante2) {
        flechaAdelante2.addEventListener("click", () => {
            despliega_grid_siguiente(grid2, grid3, flechaAtras3);
        });
    }

    // Configuramos los eventos pa' las flechas hacia atrás
    if (flechaAtras2) {
        flechaAtras2.addEventListener("click", () => {
            oculta_grid_anterior(grid2, grid1, flechaAtras2);
        });
    }

    if (flechaAtras3) {
        flechaAtras3.addEventListener("click", () => {
            oculta_grid_anterior(grid3, grid2, flechaAtras3);
        });
    }
}


document.addEventListener("DOMContentLoaded", main);