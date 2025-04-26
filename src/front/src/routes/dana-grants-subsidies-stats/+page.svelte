<script>
    // @ts-nocheck
    import { dev } from "$app/environment";
    import { onMount } from "svelte";
    import { 
        Button, 
        Table, 
        Container,
        Row,
        Col,
        Modal,
        ModalBody,
        ModalHeader,
        ModalFooter,
        Form,
        FormGroup,
        Input,
        Label,
        Card,
        CardBody,
        CardHeader,
        Collapse,
        Alert, 
    
    } from '@sveltestrap/sveltestrap';
    import { fade, slide } from "svelte/transition";
    import { goto, replaceState } from '$app/navigation';
	import query from "express/lib/middleware/query";
    import dataBase from "../../../../../src/back/back.js";

const data= dataBase;

// Estado para alertas
let alertVisible = false;
let alertMessage = '';
let alertType = 'success';

// Estado para modales
let deleteModalOpen = false;
let resultadoModalOpen = false;
let currentParticipante = null;

// Estado para grupos y participantes
let grupos = [];
let participantes = [];
let numGrupos = 4;
let actualGrid = 1;

// Funciones de arrastre
function drag(event, participanteId) {
    event.dataTransfer.setData("text", participanteId);
    event.target.classList.add('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.classList.add('over');
}

function dragLeave(event) {
    event.currentTarget.classList.remove('over');
}

function drop(event, grupoId) {
    event.preventDefault();
    const participanteId = event.dataTransfer.getData("text");
    const participante = participantes.find(p => p.concursanteId === participanteId);
    
    if (participante) {
        // Actualizar el grupo del participante
        participante.grupoId = grupoId;
        participantes = [...participantes]; // Forzar actualización
    }
    
    document.querySelectorAll('.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.over').forEach(el => el.classList.remove('over'));
}

// Funciones para administrar participantes
function confirmarEliminacion(participante) {
    currentParticipante = participante;
    deleteModalOpen = true;
}

function eliminarParticipante() {
    if (currentParticipante) {
        participantes = participantes.filter(p => p.concursanteId !== currentParticipante.concursanteId);
        deleteModalOpen = false;
        currentParticipante = null;
        
        mostrarAlerta('Participante eliminado correctamente', 'success');
    }
}

function mostrarModalResultado(participante) {
    currentParticipante = participante;
    resultadoModalOpen = true;
}

function marcarResultado(resultado) {
    if (currentParticipante) {
        // Encontrar y actualizar el estado del participante
        const index = participantes.findIndex(p => p.concursanteId === currentParticipante.concursanteId);
        if (index !== -1) {
            participantes[index].resultado = resultado;
            participantes = [...participantes]; // Forzar actualización
        }
        
        resultadoModalOpen = false;
        mostrarAlerta(`Resultado actualizado: ${resultado === 'ganador' ? '¡Ha Ganado! 🏆' : 'Ha Perdido 😢'}`, 'info');
    }
}

function sortearCuadro() {
    // Mezclar participantes aleatoriamente
    const mezclados = [...participantes].sort(() => Math.random() - 0.5);
    
    // Distribuir en grupos equitativamente
    const participantesPorGrupo = Math.ceil(mezclados.length / numGrupos);
    
    mezclados.forEach((participante, index) => {
        const grupoId = `grupo${Math.floor(index / participantesPorGrupo) + 1}`;
        participante.grupoId = grupoId;
    });
    
    participantes = mezclados;
    mostrarAlerta('¡Sorteo realizado correctamente!', 'success');
}

function mostrarAlerta(mensaje, tipo) {
    alertMessage = mensaje;
    alertType = tipo;
    alertVisible = true;
    
    setTimeout(() => {
        alertVisible = false;
    }, 3000);
}

function cambiarGrid(direccion) {
    // Implementación para cambiar entre diferentes fases del torneo
    if (direccion === 'siguiente' && actualGrid < 3) {
        actualGrid++;
    } else if (direccion === 'anterior' && actualGrid > 1) {
        actualGrid--;
    }
}

</script>
  
<style>
    :global(body) {
        background-image: url('/images/smoke-1172477.jpg');
        background-size: cover;
        background-attachment: fixed;
        min-height: 100vh;
        padding: 2rem;
    }
    
    h1 {
        color: black;
    }
    
    .container-brackets {
        border-radius: 1rem;
        padding: 0 13.3333dvw;
    }
    
    .brackets-grid {
        display: none;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        margin: 0;
        opacity: 0;
        visibility: hidden;
        position: absolute;
        transition: opacity 0.5s ease, visibility 0.5s ease;
    }
    
    .brackets-grid.activo {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 2rem;
        margin: 0;
        opacity: 1;
        visibility: visible;
        position: relative;
    }
    
    .grupo {
        background: linear-gradient(45deg, #003ba8, rgb(55, 85, 168));
        border-radius: 0.5rem;
        padding: 1rem;
        color: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .participantes {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        min-height: 50px; /* Para cuando esté vacío */
    }
    
    .participante {
        background-color: rgba(255, 255, 255, 0.1);
        padding: 0.5rem;
        border-radius: 0.25rem;
        transition: all 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: grab;
    }
    
    .participante:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .participante.dragging {
        opacity: 0.5;
        cursor: grabbing;
    }
    
    .participante.ganador {
        background-color: #198754;
        border-color: #198754;
        transition: all 0.3s ease;
    }
    
    .participante.perdedor {
        background-color: #dc3545;
        border-color: #dc3545;
        transition: all 0.3s ease;
    }
    
    .fase {
        text-align: center;
        margin-bottom: 1rem;
        color: black;
        font-size: 1.5rem;
        font-weight: bold;
        text-transform: uppercase;
        border-bottom: 2px solid #3498db;
        padding-bottom: 0.5rem;
    }
    
    .menu-dots {
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        transition: background-color 0.3s;
    }
    
    .menu-dots:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
    
    .eliminado {
        animation: fadeOut 0.5s ease forwards;
    }
    
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
    
    .over {
        border: 2px dashed #fff;
    }
    
    .botones {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        align-items: center;
        position: relative;
        margin-bottom: 1rem;
        padding: 0 13.3333dvw;
    }
    
    .boton-sorteo {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(45deg, #003ba8, rgb(55, 85, 168));
        border-radius: 0.5rem;
        border-style: none;
        padding: 1rem;
        color: white;
    }
    
    .boton-sorteo:hover {
        background: rgb(55, 85, 168);
    }
    
    .flecha {
        width: 5vw;
        height: auto;
        cursor: pointer;
        transition: transform 0.3s ease;
    }
    
    .flecha:hover {
        transform: scale(1.1);
    }
    
    .alert-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
    }
    
    .accion-btn {
        cursor: pointer;
        color: white;
        text-decoration: none;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        margin-left: 0.5rem;
        transition: background-color 0.3s;
    }
    
    .accion-btn:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
</style>
  
  <svelte:head>
    <title>Torneo Internacional de Chinos</title>
</svelte:head>

<Container fluid>
    <!-- Alerta para mensajes -->
    {#if alertVisible}
        <div class="alert-container" transition:fade>
            <Alert color={alertType} isOpen={alertVisible} toggle={() => alertVisible = false}>
                {alertMessage}
            </Alert>
        </div>
    {/if}
</Container>

<h1 class="text-center mb-4">🏆 Torneo Internacional de Chinos</h1>

<div class="fase">PRIMERA FASE</div>

<div class="botones">
    <Button class="boton-sorteo" on:click={sortearCuadro}>
        SORTEAR CUADRO DE GRUPOS
    </Button>
    <Button id="boton-atras" on:click={() => cambiarGrid('anterior')}>
        <img class="flecha" src="../images/angle-arrow-down_icon-icons.com_73683-blanco-left.png" alt="ATRÁS">
    </Button>
    <Button id="boton-adelante" on:click={() => cambiarGrid('siguiente')}>
        <img class="flecha" src="../images/angle-arrow-down_icon-icons.com_73683-blanco-right.png" alt="ADELANTE">
    </Button>
</div>

<div class="container-brackets">
    <div class="brackets-grid activo" id="{actualGrid}">
        {#each grupos as grupo}
            <div class="grupo" id={grupo.id}>
                <h3 class="h5 text-center mb-3">{grupo.nombre}</h3>
                <div class="participantes" 
                     on:dragover={allowDrop} 
                     on:dragleave={dragLeave}
                     on:drop={(e) => drop(e, grupo.id)}>
                    {#each participantes.filter(p => p.grupoId === grupo.id) as participante (participante.concursanteId)}
                        <div class="participante" 
                             draggable="true" 
                             on:dragstart={(e) => drag(e, participante.concursanteId)}
                             class:ganador={participante.resultado === 'ganador'}
                             class:perdedor={participante.resultado === 'perdedor'}>
                            <span>{participante.nombre}</span>
                            <div class="acciones">
                                <span class="menu-dots">⋮</span>
                                <div class="dropdown-content">
                                    <Button class="accion-btn" on:click={() => mostrarModalResultado(participante)}>Editar</Button>
                                    <Button class="accion-btn" on:click={() => confirmarEliminacion(participante)}>Eliminar</Button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>
</div>

<!-- Modal para confirmar eliminación -->
<Modal isOpen={deleteModalOpen} toggle={() => deleteModalOpen = !deleteModalOpen}>
    <ModalHeader toggle={() => deleteModalOpen = !deleteModalOpen}>
        Confirmar eliminación
    </ModalHeader>
    <ModalBody>
        {#if currentParticipante}
            <div class="alert alert-danger" id="eliminacion-especifica">
                <p>¿Está seguro de que desea eliminar al participante <strong>{currentParticipante.nombre}</strong>?</p>
                <p>Esta acción no se puede deshacer.</p>
            </div>
        {/if}
    </ModalBody>
    <ModalFooter>
        <Button color="secondary" on:click={() => deleteModalOpen = false}>Cancelar</Button>
        <Button color="danger" id="confirmar-eliminacion" on:click={eliminarParticipante}>Eliminar</Button>
    </ModalFooter>
</Modal>

<!-- Modal para editar resultado -->
<Modal isOpen={resultadoModalOpen} toggle={() => resultadoModalOpen = !resultadoModalOpen}>
    <ModalHeader toggle={() => resultadoModalOpen = !resultadoModalOpen}>
        Resultado de la Partida
    </ModalHeader>
    <ModalBody>
        {#if currentParticipante}
            <p>¿Cuál ha sido el resultado para <strong>{currentParticipante.nombre}</strong>?</p>
        {/if}
    </ModalBody>
    <ModalFooter>
        <Button color="success" on:click={() => marcarResultado('ganador')}>¡Ha Ganado! 🏆</Button>
        <Button color="danger" on:click={() => marcarResultado('perdedor')}>Ha Perdido 😢</Button>
    </ModalFooter>
</Modal>

  