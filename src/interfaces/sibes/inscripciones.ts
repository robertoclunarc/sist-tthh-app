import { ITrabajadores } from "interfaces/trabajadores.interface";
import { IvBeneficiario } from "./beneficiarios";
import { Icolegio } from "./colegios";

export interface Iinscripcion
{
    idinscripcion ?: number,
    fkbeneficiario ?: number,
    fkcolegio ?: number,
    fecha_inscripcion ?: string,
    anio_escolar ?: string,
    monto_inscripcion ?: string,
    monto_mensual ?: string,
    login_registro ?: string,
    fecha_registro ?: string,
    estatus_inscripcioin ?: string,
    mes_inicio ?: number,
    fecha_modificacion ?: string,
    login_modificacion ?: string,
    tasa_cambio ?: string,
    grado_escolarizacion ?: string,
    nivel_educativo ?: string,
}

export interface ITrabajadoresConBenefInscritos{
    trabajador?: ITrabajadores,
    beneficiario?: IvBeneficiario,
    inscripciones?: { inscripcion?: Iinscripcion, colegio?: Icolegio}[],
}