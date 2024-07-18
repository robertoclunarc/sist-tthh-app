# Script en nodejs, typescript para los insert, update, delete y consultas de registros de la BD bdmatrrhh.

## Rutas

- post('/sist_tthh/api/sibes/login/', loginController.logear);        
- get('/sist_tthh/api/sibes/login/usuarios/filtrados/:trabajador', loginController.usuariosFiltrados);

- get('/sist_tthh/api/sibes/menus/consultar', menuController.menusAll);
- get('/sist_tthh/api/sibes/menus/consultar/:user', menuController.menusUsuario);

- post('/sist_tthh/api/sibes/correo/send/memory',envioCorreo.sendFromMemory);
- post('/sist_tthh/api/sibes/correo/send/path',envioCorreo.sendFromPath);
- get('/sist_tthh/api/sibes/correo/remitentes/:actividad',envioCorreo.remitentes);

- get('/sist_tthh/api/sibes/varios/prueba/', varController.prueba);       
- get('/sist_tthh/api/sibes/varios/generar/serie/:inicio/:fin/:interval/:formato', varController.generateSeries);

- get('/sist_tthh/api/trabajadores/consultar', trabajadoresController.trabajadoresAll); 
- get('/sist_tthh/api/trabajadores/consultar/cedula/:IdReg', trabajadoresController.trabajadorCedula);
- get('/sist_tthh/api/trabajadores/subordinados/supervisor/:login', trabajadoresController.trabajadoresPorSigladoSupervisor);

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
