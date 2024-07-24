# Script en nodejs, typescript para los insert, update, delete y consultas de registros de la BD bdmatrrhh.

## Rutas: 
### /sist_tthh/api/sibes/login
- post('/login/', loginController.logear);        
- get('/usuarios/filtrados/:trabajador/:nivel', loginController.usuariosFiltrados);

### /sist_tthh/api/sibes/menus
- get('/consultar', menuController.menusAll);
- get('/consultar/:user', menuController.menusUsuario);
- get('/permisos/:user/:idmenu', menuController.permisosUsuario);

### /sist_tthh/api/sibes/correo
- post('/send/memory',envioCorreo.sendFromMemory);
- post('/send/path',envioCorreo.sendFromPath);
- get('/remitentes/:actividad',envioCorreo.remitentes);

### /sist_tthh/api/varios
- get('/prueba/', varController.prueba);       
- get('/generar/serie/:inicio/:fin/:interval/:formato', varController.generateSeries);
- get('/niveleseducacion/all', varController.nivelesEducacionAll);
- get('/gradosescolarizacion/all', varController.gradosEscolarizacionAll);

### /sist_tthh/api/trabajadores
- get('/consultar', trabajadoresController.trabajadoresAll); 
- get('/consultar/cedula/:ci', trabajadoresController.trabajadorCedula);
- get('/subordinados/supervisor/:login', trabajadoresController.trabajadoresPorSigladoSupervisor);

### /sist_tthh/api/facturas
- get('/consultar/detalle/:iddetfactura/:fkfactura', facturaController.detFacturaFilter);         
- get('/filtrar/:idfactura/:nroFactura/:fechaFacturaIni/:fechaFacturaFin/:idColegio/:trabajador/:fechaEntregaIni/:fechaEntregaFin/:estatus/:periodo/:condlogica', facturaController.facturafilter);        
- put('/update/:IdReg', facturaController.updateRecordFactura); 
- put('/update/detalle/:IdReg', facturaController.updateRecordDetFactura);        
- delete('/delete/:IdReg', facturaController.deleteRecordFactura);
- delete('/delete/detalle/:IdReg', facturaController.deleteRecordDetFactura);
- post('/insert', facturaController.createRecordFactura)
```
{
    "idfactura" : number,
    "nro_factura" : "string",
    "trabajador" : "string",
    "fecha_factura" : "string",
    "monto_total" : "string",
    "subtotal" : "string",
    "iva" : "string",
    "fkcolegio" : number,
    "login_registro" : "string",
    "fecha_registro" : "string",
    "fecha_modificacio"n : "string",
    "login_modificacion" : "string",
    "tasa_cambio" : "string",
    "fecha_entrega_rrhh" : "string",
    "estatus" : "string", 
    "periodopago" : "string"
}
```
- post('/insert/detalle', facturaController.createRecordDetFactura)
```
{
    "iddetfactura"  : number,
    "fkfactura"  : number,
    "fkbeneficiario" : number,
    "fkmensualidad"  : number,
    "mes" : number,
    "monto" : "string",
    "corresponde" : "string",
    "fecha_modificacion" : "string",
    "login_modificacion" : "string",
    "tasa_cambio" : "string",    
}
```
- post('/insert/beneficiario', facturaController.createRecordFacturaBeneficiario)
```
{
    "idfacturabenf": number,
    "fkfactura": number,
    "fkbeneficiario":number,
}
```
### /sist_tthh/api/colegios
- get('/consultar/:id/:nombre/:rif/:localidad/:tipo/:condlogica', colegioController.colegiofilter);
- put('/update/:IdReg', colegioController.updateRecord);
- delete('/delete/:IdReg', colegioController.deleteRecord);
- post('/insert', colegioController.createRecord)
```
{
    "idcolegio" : number,
    "rif_colegio" : "string",
    "nombre_colegio" : "string",
    "estatus_colegio" : "string",
    "direccion_colegio" : "string",
    "localidada_colegio" : "string",
    "provincia" : "string",
    "tipo_administracion" : "string"
} 
```
### /sist_tthh/api/beneficiarios
- get('/consultar/:id/:nombre/:cedula/:trabajador/:sexo/:grado/:nivelEduc/:edadIni/:edadFin/:condlogica', beneficiariosController.beneficiariofilter);
- put('/update/:IdReg', beneficiariosController.updateRecord);
- delete('/delete/:IdReg', beneficiariosController.deleteRecord);
- post('/insert', beneficiariosController.createRecord)
```
{
    "idbeneficiario" : number,
    "cedula" : "string",
    "trabajador" : "string",
    "fecha_nac" : "string",
    "sexo_beneficiario" : "string",    
    "pago_colegio" : boolean,
    "estatus_beneficio" : "string",
    "nombre_beneficiario" : "string",
    "grado_escolarizacion" : "string",
    "nivel_educativo" : "string"
} 
```
### /sist_tthh/api/inscripciones
- get('/consultar/:id/:fkbeneficiario/:fkcolegio/:anio_escolar', inscripcionsController.inscripcionfilter);
- get('/consultar/totalinscripciones', inscripcionsController.totalInscripciones);
- put('/update/:IdReg', inscripcionsController.updateRecord);
- delete('/delete/:IdReg', inscripcionsController.deleteRecord);
- post('/insert', inscripcionsController.createRecord)
```
{
    "idinscripcion": number,
    "fkbeneficiario": number,
    "fkcolegio": number,
    "fecha_inscripcion": "string",
    "anio_escolar": "string",
    "monto_inscripcion": "string",
    "monto_mensual": "string",
    "login_registro": "string",
    "fecha_registro": "string",
    "estatus_inscripcioin": "string",
    "mes_inicio": number,
    "fecha_modificacion": "string",
    "login_modificacion": "string",
    "tasa_cambio": "string",
    "grado_escolarizacion": "string",
    "nivel_educativo": "string",
}
```
### /sist_tthh/api/mensualidades
- get('/consultar/:id/:fkinscripcion', mensualidadsController.mensualidadfilter);
- put('/update/:IdReg', mensualidadsController.updateRecord);
- delete('/delete/:IdReg', mensualidadsController.deleteRecord);
- post('/insert', mensualidadsController.createRecord);
```
{
    "idmensualidad" : number,
    "fkinscripcion" : number,
    "monto_inscripcion" : "string",    
    "mes_01" : "string",
    "mes_02" : "string",
    "mes_03" : "string",
    "mes_04" : "string",
    "mes_05" : "string",
    "mes_06" : "string",
    "mes_07" : "string",
    "mes_08" : "string",
    "mes_09" : "string",
    "mes_10" : "string",
    "mes_11" : "string",
    "mes_12" : "string",
    "deuda" : "string",
    "pagado" : "string",
    "ultimo_mes_pagado" : number,
    "monto_ultimo_mes" : "string",
    "fecha_ult_pago" : "string",
    "pago_prox" : "string",
    "estatus" : "string",
    "fecha_modificacion" : "string",
    "login_modificacion" : "string",
    "tasa_cambio" : "string",
}
```

### Informe de implementación de aplicación web en Docker

Introducción

Este informe describe el proceso de implementación de una aplicación web desarrollada en Node.js v16, TypeScript. La aplicación fue implementada en una máquina virtual Proxmox 141 con sistema operativo Linux Mint 20.3. El servidor tiene la configuración local "America/Caracas".

Requisitos

Para implementar la aplicación web, se necesitan los siguientes requisitos:

Máquina virtual Proxmox 141 con sistema operativo Linux Mint 20.3
Docker instalado en la máquina virtual
Configuración local "America/Caracas" en el servidor
Apache instalado en el servidor
Instalación de Docker

Para instalar Docker en la máquina virtual, siga los siguientes pasos:

Abra una terminal en la máquina virtual.
Ejecute el siguiente comando para actualizar los paquetes del sistema:
```sudo apt update```
Ejecute el siguiente comando para instalar Docker:
```sudo apt install docker.io```
Una vez que Docker esté instalado, inicie el servicio con el siguiente comando:
```sudo systemctl start docker```
Configuración de la zona horaria

Para configurar la zona horaria "America/Caracas" en el servidor, siga los siguientes pasos:

Abra un editor de texto en la máquina virtual.
Abra el archivo /etc/timezone con el editor.
Cambie la línea que contiene la zona horaria actual a la siguiente:
America/Caracas
Guarde los cambios y cierre el editor.
Reinicie el servidor para que los cambios surtan efecto.
Instalación de Apache

Para instalar Apache en la máquina virtual, siga los siguientes pasos:

Abra una terminal en la máquina virtual.
Ejecute el siguiente comando para actualizar los paquetes del sistema:
```sudo apt update```
Ejecute el siguiente comando para instalar Apache:
```sudo apt install apache2```
Una vez que Apache esté instalado, inicie el servicio con el siguiente comando:
```sudo systemctl start apache2```
Comandos para ejecutar la aplicación web

Para ejecutar la aplicación web, siga los siguientes pasos:

En la máquina virtual, vaya a la carpeta donde se encuentra la aplicación web (en la raiz de la carpeta del proyecto donde esta ubicado el archivo dockerfile).
Ejecute el siguiente comando para crear una imagen Docker de la aplicación:
```docker build -t sist-tthh-app .```
Una vez que la imagen esté creada, ejecute el siguiente comando para iniciar la aplicación:
```docker run  -d -t -p 3000:3000 sist-tthh-app```
El comando docker build crea una imagen Docker de la aplicación web. El comando docker run inicia la aplicación en un contenedor Docker.

Explicación de los comandos

docker build
El comando docker build crea una imagen Docker a partir de un archivo Dockerfile. El archivo Dockerfile contiene las instrucciones para construir la imagen. En este caso, el archivo Dockerfile contiene las instrucciones para instalar Node.js, Angular y Bootstrap.

docker run
El comando docker run inicia un contenedor Docker a partir de una imagen Docker. En este caso, la imagen Docker es la que se creó con el comando docker build. El comando docker run tiene los siguientes parámetros:

* `-d` : Especifica que el contenedor se debe iniciar en modo demonio.
* `-t` : Especifica que el contenedor debe tener un terminal.
* `-p 3000:3000` : Especifica que el puerto 80 del contenedor se debe mapear al puerto 4200 del host.
* `sist-tthh-app` : Es el nombre de la imagen Docker que se va a ejecutar.
¿Qué es Docker?

Docker es una plataforma de software que permite crear, ejecutar y administrar aplicaciones en contenedores. Los contenedores son unidades de software que empaquetan código, dependencias y archivos de configuración en un entorno aislado.

Docker ofrece una serie de ventajas, entre las que se incluyen:

Portabilidad: Las aplicaciones empaquetadas en contenedores pueden ejecutarse en cualquier máquina que tenga Docker instalado.
Seguridad: Los contenedores están aislados entre sí, lo que ayuda a proteger las aplicaciones.
Eficiencia: Los contenedores utilizan menos recursos que las máquinas virtuales tradicionales.
Una vez que se hayan completado estos pasos, la aplicación web estará disponible en la dirección http://[dirección IP de la máquina virtual]:3000.

•	VARIABLES DE ENTORNO:
Se debe agregar al sistema operativo las siguientes variables de entorno:

HOSTEMAILTTHH=10.0.3.20
PORTEMAILTTHH=587
PASSWEMAILTTHH=brismd.123
FROMEMAILTTHH='matesi.6'
DBUSERTTHH=roberto
DBHOSTTTHH=10.50.188.48
DBPASSWTTHH=roberto
DBTTHH=bdmarrhh
DBPORTTTHH=5432
