import { Request,  Response  } from 'express';
import db from '../../database';
//import {QueryResult} from 'pg';
import { Ifactura, IdetallesFactura, IFacturaDetallada, IFacturaBebeficiario } from '../../interfaces/sibes/facturas';

class FacturasController{   

    public async facturafilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT f.*, c.*, t.* \
        FROM sibes_facturas f \
        INNER JOIN sibes_colegios c ON f.fkcolegio=c.idcolegio \
        INNER JOIN trabajadores t ON f.trabajador=t.trabajador ";
        const valueIsNull = [undefined, 'null', 'NULL', '', , 'undefined'];
        const regex = /^[0-9]*$/;
        const estatus = ["PENDIENTE", "PAGADA", "ANULADA"];
        let filtro = {
            idfactura: valueIsNull.indexOf(req.params.idfactura)  != -1  ? null : req.params.idfactura,
            nroFactura: valueIsNull.indexOf(req.params.nroFactura)  != -1 ? null : req.params.nroFactura,
            fechaFacturaIni: valueIsNull.indexOf(req.params.fechaFacturaIni)  != -1 ? null : req.params.fechaFacturaIni,
            fechaFacturaFin: valueIsNull.indexOf(req.params.fechaFacturaFin)  != -1 ? null : req.params.fechaFacturaFin,
            idColegio: valueIsNull.indexOf(req.params.idColegio)  != -1 ? null : req.params.idColegio,
            trabajador: valueIsNull.indexOf(req.params.trabajador)  != -1 ? null : req.params.trabajador,            
            fechaEntregaIni: valueIsNull.indexOf(req.params.fechaEntregaIni)  != -1 ? null : req.params.fechaEntregaIni,
            fechaEntregaFin: valueIsNull.indexOf(req.params.fechaEntregaFin)  != -1 ? null : req.params.fechaEntregaFin,
            estatus: valueIsNull.indexOf(req.params.estatus)  != -1 ? null : req.params.estatus.toUpperCase(),
            periodo: valueIsNull.indexOf(req.params.periodo)  != -1 ? null : req.params.periodo,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,
        }        

        let where: string[] = [];
        let orderBy: string[] = [];
        if (filtro.idfactura !==null || filtro.nroFactura!==null || filtro.fechaFacturaIni!==null || filtro.fechaFacturaFin!==null || filtro.idColegio!==null || filtro.trabajador!==null || filtro.fechaEntregaIni!==null || filtro.fechaEntregaFin!==null || filtro.estatus != null  || filtro.periodo != null){
            if (filtro.idfactura !==null){
                where.push( ` f.idfactura=${filtro.idfactura}`);
                orderBy.push('f.idfactura');
            }

            if (filtro.nroFactura !==null){
                where.push( ` f.nro_factura like '%${filtro.nroFactura}%' `);
                orderBy.push('f.nro_factura');
            }

            if (filtro.trabajador !==null &&  regex.test(filtro.trabajador)){
                where.push( ` f.trabajador like '%${filtro.trabajador}%' `);
                orderBy.push('f.trabajador');
            }            

            if (filtro.idColegio !==null){
                where.push( ` f.fkcolegio=${filtro.idColegio}`);
                orderBy.push('f.fkcolegio');
            }            

            if (filtro.fechaFacturaIni !==null && filtro.fechaFacturaFin!=null){
                where.push( ` (to_char(f.fecha_factura,'YYYY-MM-DD') BETWEEN '${filtro.fechaFacturaIni}' AND '${filtro.fechaFacturaFin}') `);
                orderBy.push('f.fecha_factura desc');
            }            

            if (filtro.fechaEntregaIni !==null && filtro.fechaEntregaFin!=null){
                where.push( ` (to_char(f.fecha_entrega_rrhh,'YYYY-MM-DD') BETWEEN '${filtro.fechaEntregaIni}' AND '${filtro.fechaEntregaFin}') `);
                orderBy.push('f.fecha_entrega_rrhh desc');
            }

            if (filtro.estatus !=null && estatus.indexOf(filtro.estatus)!= -1 ){
                where.push( ` f.estatus = '${filtro.estatus}' `);
                orderBy.push('f.estatus');
                orderBy.push('f.fecha_entrega_rrhh');
            }

            if (filtro.periodo !==null && regex.test(filtro.periodo) && filtro.periodo.length===4){
                if(Number(filtro.periodo) >= 2023 && Number(filtro.periodo) <= 2100)
                    where.push( ` f.periodopago = ${filtro.periodo}`);                
            }
            
            where.forEach(function(w, index) {
                if (index==0){
                     consulta += ` WHERE ${w}`;
                }else{                    
                    consulta += ` ${filtro.condlogica} ${w}`;
                }    
            }); 
        }

        if (orderBy.length>0){
            orderBy.forEach(function(order, index) {
                if (index==0){
                    consulta += ` ORDER BY ${order}`; 
                }else{
                    consulta += ` , ${order}`;
                }                
            });
        }else{
            consulta += " ORDER BY f.idfactura desc";
        }
        console.log(consulta);
        try {
            const facturasResult = await db.querySelect(consulta);
            const idfacturas = facturasResult.map((factura: any) => factura.idfactura);
            let facturasDetalladas: IFacturaDetallada[] = [];
            if (idfacturas.length > 0) {
                const detallesConsulta = `SELECT d.*, b.* FROM sibes_detfacturas d 
                INNER JOIN sibes_beneficiarios b ON b.idbeneficiario=d.fkbeneficiario 
                WHERE d.fkfactura IN (${idfacturas.join(', ')}) ORDER BY d.fkfactura, d.iddetfactura`;
                console.log(detallesConsulta)
                const detallesResult = await db.querySelect(detallesConsulta);

                const detallesMap: { [key: number]: any[] } = {};
                detallesResult.forEach((detalle: any) => {
                    if (!detallesMap[detalle.fkfactura]) {
                        detallesMap[detalle.fkfactura] = [];
                    }
                    detallesMap[detalle.fkfactura].push({
                        item: {
                            iddetfactura : detalle.iddetfactura,
                            fkfactura : detalle.fkfactura,
                            fkbeneficiario: detalle.fkbeneficiario,
                            fkmensualidad : detalle.fkmensualidad,
                            mes: detalle.mes,
                            monto: detalle.monto,
                            corresponde: detalle.corresponde,
                            fecha_modificacion: detalle.fecha_modificacion,
                            login_modificacion: detalle.login_registro,
                            tasa_cambio: detalle.tasa_cambio,
                            descripcion_detfactura: detalle.descripcion_detfactura,
                            cantidad: detalle.cantidad,
                            precio_unitario: detalle.precio_unitario,
                        },
                        beneficiario: {
                            idbeneficiario: detalle.idbeneficiario,
                            cedula: detalle.cedula,
                            trabajador: detalle.trabajador,
                            fecha_nac: detalle.fecha_nac,
                            sexo_beneficiario: detalle.sexo_beneficiario,   
                            pago_colegio: detalle.pago_colegio,
                            estatus_beneficio: detalle.estatus_beneficio,
                            nombre_beneficiario: detalle.nombre_beneficiario,
                            grado_escolarizacion: detalle.grado_escolarizacion,
                            nivel_educativo: detalle.nivel_educativo,
                        }
                    });
                });

                facturasDetalladas = facturasResult.map((factura: any) => {
                    return {
                        factura: {
                            idfactura: factura.idfactura,
                            nro_factura: factura.nro_factura,
                            fecha_factura: factura.fecha_factura,
                            monto_total: factura.monto_total,
                            subtotal: factura.subtotal,
                            iva: factura.iva,
                            fkcolegio: factura.fkcolegio,
                            login_registro: factura.login_registro,
                            fecha_registro: factura.fecha_registro,
                            fecha_modificacion: factura.fecha_modificacion,
                            login_modificacion: factura.login_modificacion,
                            tasa_cambio: factura.tasa_cambio,
                            fecha_entrega_rrhh: factura.fecha_entrega_rrhh,
                            trabajador: factura.trabajador,
                            estatus: factura.estatus,
                            periodopago: factura.periodopago,
                        },
                        trabajador: {
                            trabajador: factura.trabajador,
                            registro_fiscal: factura.registro_fiscal,
                            nombre: factura.nombre,
                            sexo: factura.sexo,
                            fecha_nacimiento: factura.fecha_nacimiento,
                            domicilio: factura.domicilio,
                            domicilio2: factura.domicilio2,
                            poblacion: factura.poblacion,
                            estado_provincia: factura.estado_provincia,
                            pais: factura.pais,
                            codigo_postal: factura.codigo_postal,
                            calles_aledanas: factura.calles_aledanas,
                            telefono_particular: factura.telefono_particular,
                            reg_seguro_social: factura.reg_seguro_social,
                            domicilio3: factura.domicilio3,
                            e_mail: factura.e_mail,
                            fkunidad: factura.fkunidad,
                            tipo_documento: factura.tipo_documento,
                            nombres: factura.nombres,
                            apellidos: factura.apellidos,
                            edo_civil: factura.edo_civil,
                        },
                        colegio: {
                            idcolegio: factura.idcolegio,
                            rif_colegio: factura.rif_colegio,
                            nombre_colegio: factura.nombre_colegio,
                            estatus_colegio: factura.estatus_colegio,
                            direccion_colegio: factura.direccion_colegio,
                            localidad_colegio: factura.localidad_colegio,
                            provincia: factura.provincia,
                            tipo_administracion: factura.tipo_administracion,
                        },
                        detalles: detallesMap[factura.idfactura] || []
                    };
                });
            }
            
            res.status(200).json(facturasDetalladas);
            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }
    }
    
    public async detFacturaFilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM sibes_detfacturas ";
        const valueIsNull = [undefined, 'null', 'NULL', '', 'undefined'];        
        const regex = /^[0-9]*$/;        
        let filtro = {
            fkfactura: valueIsNull.indexOf(req.params.fkfactura)  != -1  ? null : req.params.fkfactura,
            iddetfactura: valueIsNull.indexOf(req.params.iddetfactura)  != -1  ? null : req.params.iddetfactura,
        }

        let where: string[] = [];
        let orderBy: string[] = [];
        if (filtro.fkfactura !=null || filtro.iddetfactura !=null){
            
            if (filtro.fkfactura!==null){
                where.push( ` fkfactura = ${filtro.fkfactura} `);
                orderBy.push('fkfactura');
            }
            
            if (filtro.iddetfactura!==null){
                where.push( ` iddetfactura = ${filtro.iddetfactura} `);
                orderBy.push('iddetfactura');
            }

            where.forEach(function(w, index) {
                if (index==0){
                     consulta += ` WHERE (${w}`;
                }else{                    
                    consulta += ` AND ${w}`;
                }    
            });
        }
        console.log(consulta);
        if (orderBy.length>0){
            orderBy.forEach(function(order, index) {
                if (index==0){
                    consulta += ` ORDER BY ${order}`; 
                }else{
                    consulta += ` , ${order}`;
                }
                
            });
        }else{
            consulta += " ORDER BY iddetfactura desc";
        } 
        console.log(consulta);
        try {
            
            const result: IdetallesFactura[] = await db.querySelect(consulta);
            
            if (!result){
                res.status(200).json(result);
            }
            else{                    
                res.status(200).json(result);                
            }
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecordFactura (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        
        let query : string = "INSERT INTO sibes_facturas (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idfactura')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES ("; 

            for (const prop in newPost) {
                if (prop != 'idfactura')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            console.log(query);
            const result: Ifactura[] = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('Factura no registrada');
                //res.status(200).json(query);
            }
            else{
                    
                res.status(200).json(result[0]);                    
                //res.status(200).json(query);  
            }
            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }
        
    }

    public async createRecordFacturaBeneficiario (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        
        let query : string = "INSERT INTO sibes_facturas_beneficiarios (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idfacturabenf')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES ("; 

            for (const prop in newPost) {
                if (prop != 'idfacturabenf')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            //console.log(query);
            const result: IFacturaBebeficiario[] = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('Factura_beneficiario no registrada');
                //res.status(200).json(query);
            }
            else{
                    
                res.status(200).json(result[0]);                    
                //res.status(200).json(query);  
            }
            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }
        
    }

    public async updateRecordFactura (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body; 
        let IdReg: string = req.params.IdReg;
        let query : string = "UPDATE sibes_facturas SET fecha_modificacion=NOW(),";
        try {
            for (const prop in newPost) {
                if (prop != 'idfactura')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idfactura = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('Factura actualizada');            
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecordFactura (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from sibes_facturas WHERE idfactura = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('factura eliminada');
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async createRecordDetFactura (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        
        let query : string = "INSERT INTO sibes_detfacturas (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idfactura')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES ("; 

            for (const prop in newPost) {
                if (prop != 'idfactura')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            console.log(query);
            const result: Ifactura[] = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('Factura no registrada');
                //res.status(200).json(query);
            }
            else{
                    
                res.status(200).json(result[0]);                    
                //res.status(200).json(query);  
            }
            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }
        
    }

    public async updateRecordDetFactura (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body; 
        let IdReg: string = req.params.IdReg;
        let query : string = "UPDATE sibes_detfacturas SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'idfactura')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idfactura = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('Detalle de Factura Actualizada');            
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecordDetFactura (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from sibes_detfacturas WHERE idfactura = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('factura eliminada');
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const facturaController = new FacturasController();