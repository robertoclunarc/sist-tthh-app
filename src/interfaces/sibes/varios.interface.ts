export interface Iusuarios
{
    login: string;
    passw: string;
    nombres: string;
    nivel: number;
    fkdepartamento?: number;
    email?: string;
    telefono_oficina?: string;
    estatus?: string;
}