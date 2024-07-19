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
}

export interface IFacturaDetallada
{
    factura ?: Ifactura,
    detalles ?: IdetallesFactura[],
}

export interface IFacturaBebeficiario{
    idfacturabenf?: number,
    fkfactura?: number,
    fkbeneficiario?:number,
}