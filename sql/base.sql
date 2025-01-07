DROP TABLE IF EXISTS Metadatos;
DROP TABLE IF EXISTS Concursantes;
DROP TABLE IF EXISTS Concursos;
DROP TABLE IF EXISTS Premios;

CREATE TABLE Premios(
		premioId INT AUTO_INCREMENT,
		nombreConcurso VARCHAR(128),
		primerPremio VARCHAR (64),
		primerPremioCuantia DOUBLE,
		segundoPremio VARCHAR (64),
		segundoPremioCuantia DOUBLE,
		tercerPremio VARCHAR (64),
		tercerPremioCuantia DOUBLE,
		cuartoPremio VARCHAR (64),
		cuartoPremioCuantia DOUBLE,
		quintoPremio VARCHAR (64),
		quintoPremioCuantia DOUBLE,
		sextoPremio VARCHAR (64),
		sextoPremioCuantia DOUBLE,
		septimoPremio VARCHAR (64),
		septimoPremioCuantia DOUBLE,
		PRIMARY KEY(premioId)
);

CREATE TABLE Concursos(
		concursoId INT AUTO_INCREMENT,
		premioId INT,
		nombre VARCHAR(128),
		localidad VARCHAR(64),
		PRIMARY KEY(concursoId),
		FOREIGN KEY(premioId) REFERENCES Premios (premioId)
);		
		
CREATE TABLE Concursantes(
		concursanteId INT AUTO_INCREMENT,
		concursoId INT,
		nombre VARCHAR(128),
		edad INT,
		localidad VARCHAR(64),
		foto VARCHAR(128),
		socio VARCHAR(8),
		PRIMARY KEY (concursanteId),
		FOREIGN KEY (concursoId) REFERENCES Concursos (concursoId)
);

CREATE TABLE Metadatos(
		metadatoId INT AUTO_INCREMENT,
		nombre VARCHAR(64),
		metadato VARCHAR(512),
		PRIMARY KEY (metadatoId)
);

#SELECT premios.premioId, concursos.premioId
#FROM Premios
#LEFT JOIN concursos ON concursos.premioId= premios.premioId;

DELIMITER //
CREATE OR REPLACE PROCEDURE completarConcursosFK() #HAY QUE EDITAR ESTE PROCEDURE
BEGIN
   DECLARE done INT DEFAULT FALSE;
   DECLARE concurso_nombre VARCHAR(64);
   DECLARE premio_id INT;
   
   -- Cursor para recorrer los concursos
   DECLARE cur CURSOR FOR SELECT nombre FROM concursos;
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   
   OPEN cur;
   
   read_loop: LOOP
       FETCH cur INTO concurso_nombre;
       IF done THEN
           LEAVE read_loop;
       END IF;
       
       -- Obtener premioId correspondiente
       SELECT premios.premioId INTO premio_id 
       FROM Premios
       LEFT JOIN concursos ON concursos.premioId = premios.premioId
       WHERE concursos.nombre = concurso_nombre
       LIMIT 1;
       
       -- Actualizar el concurso
       UPDATE concursos
       SET premioId = premio_id
       WHERE nombre = concurso_nombre;
       
   END LOOP;
   
   CLOSE cur;
END //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE completarConcursantesFK() #HAY QUE EDITAR ESTE PROCEDURE
BEGIN
   DECLARE done INT DEFAULT FALSE;
   DECLARE concurso_nombre VARCHAR(64);
   DECLARE premio_id INT;
   
   -- Cursor para recorrer los concursos
   DECLARE cur CURSOR FOR SELECT nombre FROM concursos;
   DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
   
   OPEN cur;
   
   read_loop: LOOP
       FETCH cur INTO concurso_nombre;
       IF done THEN
           LEAVE read_loop;
       END IF;
       
       -- Obtener premioId correspondiente
       SELECT premios.premioId INTO premio_id 
       FROM Premios
       LEFT JOIN concursos ON concursos.premioId = premios.premioId
       WHERE concursos.nombre = concurso_nombre
       LIMIT 1;
       
       -- Actualizar el concurso
       UPDATE concursos
       SET premioId = premio_id
       WHERE nombre = concurso_nombre;
       
   END LOOP;
   
   CLOSE cur;
END //
DELIMITER ;

CALL completarConcursosFK();
		
		
