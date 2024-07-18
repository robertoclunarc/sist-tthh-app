import { Request,  Response  } from 'express';
import db from '../../database';
//import {QueryResult} from 'pg';
import { Ifactura, IdetallesFactura, IFacturaDetallada } from '../../interfaces/sibes/facturas';

class FacturasController{   

    public async facturafilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT f.*, array_agg( \
        json_build_object( \
            'iddetfactura:', d.iddetfactura, \
            'fkmensualidad:', d.fkmensualidad, \
            'mes:', d.mes, \
            'monto:', d.monto, \
            'corresponde:', d.corresponde, \
            'fecha_modificacion:', d.fecha_modificacion, \
            'login_modificacion:', d.login_modificacion, \
            'tasa_cambio:', d.tasa_cambio, \
            'fkbeneficiario:', d.fkbeneficiario \
        ) \
        ) AS detalles FROM sibes_facturas f LEFT JOIN sibes_detfacturas d on f.idfactura = d.fkfactura ";
        const valueIsNull = [undefined, 'null', 'NULL', '', , 'undefined'];
        const regex = /^[0-9]*$/;
        const IdReg: string = req.params.IdReg
        let filtro = {
            idfactura: valueIsNull.indexOf(req.params.idfactura)  != -1  ? null : req.params.idfactura,
            nroFactura: valueIsNull.indexOf(req.params.nroFactura)  != -1 ? null : req.params.nroFactura,
            fechaFacturaIni: valueIsNull.indexOf(req.params.fechaFacturaIni)  != -1 ? null : req.params.fechaFacturaIni,
            fechaFacturaFin: valueIsNull.indexOf(req.params.fechaFacturaFin)  != -1 ? null : req.params.fechaFacturaFin,
            idColegio: valueIsNull.indexOf(req.params.idColegio)  != -1 ? null : req.params.idColegio,
            trabajador: valueIsNull.indexOf(req.params.trabajador)  != -1 ? null : req.params.trabajador,            
            fechaEntregaIni: valueIsNull.indexOf(req.params.fechaEntregaIni)  != -1 ? null : req.params.fechaEntregaIni,
            fechaEntregaFin: valueIsNull.indexOf(req.params.fechaEntregaFin)  != -1 ? null : req.params.fechaEntregaFin,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,
        }
        

        let where: string[] = [];
        let orderBy: string[] = [];
        if (filtro.idfactura !==null || filtro.nroFactura!==null || filtro.fechaFacturaIni!==null || filtro.fechaFacturaFin!==null || filtro.idColegio!==null || filtro.trabajador!==null || filtro.fechaEntregaIni!==null || filtro.fechaEntregaFin!==null){
            if (filtro.trabajador !==null &&  regex.test(filtro.trabajador)){
                where.push( ` f.trabajador like '%${filtro.trabajador}%' `);
                orderBy.push('f.trabajador');
            }

            if (filtro.idColegio !==null &&  regex.test(filtro.idColegio)){
                where.push( ` CAST(f.fkcolegio AS TEXT) LIKE '%${filtro.idColegio}%' `);
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
            
            where.forEach(function(w, index) {
                if (index==0){
                     consulta += ` WHERE (${w}`;
                }else{                    
                    consulta += ` ${filtro.condlogica} ${w}`;
                }    
            }); 
        }

        consulta += " GROUP BY \
            f.idfactura, \
            f.nro_factura, \
            f.fecha_factura, \
            f.monto_total, \
            f.subtotal, \
            f.iva, \
            f.fkcolegio, \
            f.login_registro, \
            f.fecha_registro, \
            f.fecha_modificacion, \
            f.login_modificacion, \
            f.tasa_cambio, \
            f.fecha_entrega_rrhh, \
            f.trabajador ";

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
            const result = await db.querySelect(consulta);
            const facturasDetalladas: IFacturaDetallada[] = result.map((res: any) => {
                return {
                    factura: {
                        idfactura: res.idfactura,
                        nro_factura: res.nro_factura,
                        fecha_factura: res.fecha_factura,
                        monto_total: res.monto_total,
                        subtotal: res.subtotal,
                        iva: res.iva,
                        fkcolegio: res.fkcolegio,
                        login_registro: res.login_registro,
                        fecha_registro: res.fecha_registro,
                        fecha_modificacion: res.fecha_modificacion,
                        login_modificacion: res.login_modificacion,
                        tasa_cambio: res.tasa_cambio,
                        fecha_entrega_rrhh: res.fecha_entrega_rrhh,
                        trabajador: res.trabajador
                    },
                    detalles: res.detalles.map((detalle: any) => {
                        return {
                            iddetfactura: detalle.iddetfactura,
                            fkfactura: res.idfactura,
                            fkbeneficiario: detalle.fkbeneficiario,
                            fkmensualidad: detalle.fkmensualidad,
                            mes: detalle.mes,
                            monto: detalle.monto,
                            corresponde: detalle.corresponde,
                            fecha_modificacion: detalle.fecha_modificacion,
                            login_modificacion: detalle.login_modificacion,
                            tasa_cambio: detalle.tasa_cambio
                        };
                    })
                };
            });
            
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
            
            const result: Ifactura[] = await db.querySelect(query);
            //console.log(query);
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
            
            const result: Ifactura[] = await db.querySelect(query);
            //console.log(query);
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
        let query : string = "UPDATE sibes_facturas SET ";
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
            
            const result: Ifactura[] = await db.querySelect(query);
            //console.log(query);
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
            res.status(200).json('Factura actualizada');            
            
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