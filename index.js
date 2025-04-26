//DEPENDENCIAS GENERALES
import express from "express";
import * as fs from "fs";
import cors from "cors";
import dataStore from "nedb";
import { handler } from './src/front/build/handler.js';

//DEPENDENCIAS ESPECIFICAS
import {readConcursoChinos, checkFileAndMergeContent} from "./src/back/lectura_datos.js"

import { loadBackend } from "./src/back/back.js";


//CONSTANTES DE DESPLIEGUE 
const app= express();
const PORT= process.env.PORT || 3000;
const PROYECTNAME= `ChinosSalteras`;

//VARIABLES ESPECÍFICAS
let rutaFichero= "./data/DatosEjemploConcursoChinosSalteras.csv";
let ficheroExists= rutaFichero?true:false;

objData =  await readConcursoChinos(rutaFichero);
database.insert(objData);

loadBackend(app);
app.use(handler);

app.use(express.json());

// Readme
app.use("/about", express.static("./about/"));


// Inicializar el servidor
app.listen(PORT, async ()=>{
    console.log(`Proyect ${PROYECTNAME} correctly deployed and running at port ${PORT}`);
    checkFileAndMergeContent(rutaFichero);
    
    console.log(objData);
    console.log(database.getAllData());
});

export {database};

