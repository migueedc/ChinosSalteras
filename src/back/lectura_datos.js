import * as fs from "fs";
import * as XLSX from "xlsx";
import * as path from "path";
let ficheroExists= true;

//funciones de conversion de datos a csv y lectura de csv
async function mezclarContenidoExcel(rutaEntr, rutaSal) {
    try {
        let data = await fs.promises.readFile(rutaEntr);
        //console.log(`Archivo ${rutaEntr} leído con éxito`);

        const workbook = XLSX.read(data, { type: 'buffer' });
        //console.log('Workbook (librería xlsx) leído con éxito');

        let datosCombinados = [];

        workbook.SheetNames.forEach(sheetName => {
            let worksheet = workbook.Sheets[sheetName];
            let datos = XLSX.utils.sheet_to_json(worksheet);

            datosCombinados = datosCombinados.concat(datos);
        });
        const csvContent = XLSX.utils.sheet_to_csv(XLSX.utils.json_to_sheet(datosCombinados), {FS: ";"});

        await fs.promises.writeFile(rutaSal, csvContent);
        console.log('Archivo Excel creado exitosamente en:', rutaSal);

    } catch (err) {
        console.error('Error:', err);
    }
}

let objData = [];

function checkFileAndMergeContent(rutaFichero){
    fs.access(rutaFichero, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`El fichero en la ruta ${rutaFichero} no existe.`);
            ficheroExists= false;
        }
    });

    if(ficheroExists===true){
        if((rutaFichero.includes(".ods") || rutaFichero.includes(".xls") || rutaFichero.includes(".xlsx"))){
            let rutaFicheroSal= `./data/${rutaFichero.substring(rutaFichero.lastIndexOf("/"), rutaFichero.lastIndexOf("."))}.csv`;
            mezclarContenidoExcel(rutaFichero, rutaFicheroSal);
            rutaFichero=rutaFicheroSal;
        }
    }
}

async function readConcursoChinos(ruta) {
    const strConcursos = "########--DATOS CONCURSOS--########";
    const strConcursantes = "########--DATOS CONCURSANTES--########";
    let data = await fs.promises.readFile(ruta, 'utf8');
    let dataConcursos = "";
    let dataConcursantes = "";
    
    const CAMPOS_CONCURSANTE = {
        "Nombre": "string",
        "Edad": "integer",
        "Localidad": "string",
        "Foto": "string",
        "Socio": "boolean"
    };

    // Separar los datos de concursos y concursantes
    if (data.includes(strConcursos) && data.includes(strConcursantes)) {
        // Extraer la parte entre los marcadores de concursos
        const parteConcursos = data.split(strConcursos)[1].split(strConcursantes)[0].trim();
        dataConcursos = parteConcursos;
        
        // Extraer la parte después del marcador de concursantes
        const parteConcursantes = data.split(strConcursantes)[1].trim();
        dataConcursantes = parteConcursantes;
    }

    // Procesar datos del concurso
    let concursoInfo = {};
    const concursoLines = dataConcursos.split('\n').filter(line => line.includes(';'));
    concursoLines.forEach(line => {
        const [key, value] = line.split(';');
        if (key && value) {
            concursoInfo[key.trim()] = value.trim();
        }
    });
   
    // Procesar datos de concursantes
    let concursantes = [];
    const concursanteLines = dataConcursantes.split('\n').filter(line => line.includes(';'));
    concursantes = concursanteLines.map(line => {
        line = line.split(';');
        let obj = {};
        Object.keys(CAMPOS_CONCURSANTE).forEach((key, i) => {
            let elem = line[i] ? line[i].trim() : null;
            if (elem !== null) {
                if (CAMPOS_CONCURSANTE[key] === "integer") {
                    elem = parseInt(elem);
                } else if (CAMPOS_CONCURSANTE[key] === "boolean") {
                    elem = (elem.toLowerCase() === 'sí' || elem.toLowerCase() === 'si');
                }
            }
            obj[key] = (elem === '' || elem === null) ? null : elem;
        });
        return obj;
    }).filter(concursante => concursante.Nombre !== null);
   
    // Estructurar los datos de salida
    const result = {
        concursos: concursoInfo,
        concursantes: concursantes
    };
   
    return result;
}

readConcursoChinos("./data/DatosEjemploConcursoChinosSalteras.csv");
//console.log(dataConcursantes);

export {readConcursoChinos, checkFileAndMergeContent}