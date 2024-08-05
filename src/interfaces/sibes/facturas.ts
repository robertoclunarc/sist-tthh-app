import { ITrabajadores } from "interfaces/trabajadores.interface";
import { Icolegio } from "./colegios";
import { Ibeneficiario } from "./beneficiarios";

export interface Ifactura
{
    idfactura ?: number,
    nro_factura ?: string,
    trabajador ?: string,
    fecha_factura ?: string,
    monto_total ?: string,
    subtotal ?: string,
    iva ?: string,
    fkcolegio ?: number,
    login_registro ?: string,
    fecha_registro ?: string,
    fecha_modificacion ?: string,
    login_modificacion ?: string,
    tasa_cambio ?: string,
    fecha_entrega_rrhh ?: string,
    estatus ?: string, 
    periodopago ?: string,
}

export interface IdetallesFactura
{
    iddetfactura  ?: number,
    fkfactura  ?: number,
    fkbeneficiario ?: number,
    fkmensualidad  ?: number,
    mes ?: number,
    monto ?: string,
    corresponde ?: string,
    fecha_modificacion ?: string,
    login_modificacion ?: string,
    tasa_cambio ?: string,
    descripcion_detfactura ?: string,
	cantidad ?: string,
	precio_unitario ?: string,
}

export interface IFacturaDetallada
{
    factura ?: Ifactura,
    colegio?: Icolegio,
    trabajador?: ITrabajadores,
    detalles ?: { item?: IdetallesFactura, beneficiario?: Ibeneficiario }[],
}

export interface IFacturaBebeficiario{
    idfacturabenf?: number,
    fkfactura?: number,
    fkbeneficiario?:number,
}