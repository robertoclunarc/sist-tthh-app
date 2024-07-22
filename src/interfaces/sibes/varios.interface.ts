export interface Iusuarios
{
    login_username ?: string, 
    trabajador?: string, 
    estatus?: string, 
    nivel?: number,
    fecha_ultima_sesion?: string, 
    login_userpass?: string, 
    email?: string, 
}

export interface InivelesEducacion
{
    idnivel?: number,
    descripcion?: string,
    estatus?: string,
}

export interface IgradosEscolarizacion
{
    idgrado?: number,
    descripcion?: string,
    estatus?: string,
}