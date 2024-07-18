import { Request,  Response  } from 'express';
import db from '../../database';
import { Ibeneficiario } from '../../interfaces/sibes/beneficiarios';

class BeneficiarioController{ 

    public async beneficiariofilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT b.*, EXTRACT(YEAR FROM age(TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-12-31', 'YYYY-MM-DD'), fecha_nac)) AS edad FROM sibes_beneficiarios b";
        const valueIsNull = [undefined, 'null', 'NULL', ''];
        const regex = /^[0-9]*$/;        
        let filtro = {
            id: valueIsNull.indexOf(req.params.id)  != -1  ? null : req.params.id,
            nombre: valueIsNull.indexOf(req.params.nombre)  != -1 ? null : req.params.nombre,
            cedula: valueIsNull.indexOf(req.params.cedula)  != -1 ? null : req.params.cedula,
            trabajador: valueIsNull.indexOf(req.params.trabajador)  != -1 ? null : req.params.trabajador,
            sexo: valueIsNull.indexOf(req.params.sexo)  != -1 ? null : req.params.sexo,            
            grado: valueIsNull.indexOf(req.params.grado)  != -1 ? null : req.params.grado,
            nivelEduc: valueIsNull.indexOf(req.params.nivelEduc)  != -1 ? null : req.params.nivelEduc,
            edadIni: valueIsNull.indexOf(req.params.edadIni)  != -1 ? null : req.params.edadIni,
            edadFin: valueIsNull.indexOf(req.params.edadFin)  != -1 ? null : req.params.edadFin,            
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,                        
        }

        let where: string[] = [];
        let orderBy: string[] = [];
    
        if (filtro.id !=null || filtro.nombre!=null || filtro.cedula!=null || filtro.trabajador !=null || filtro.sexo || filtro.grado  || filtro.nivelEduc || filtro.edadIni || filtro.edadFin){        
            if (filtro.id !=null){
                where.push( " idbeneficiario  = " + filtro.id + " ");                
            }

            if (filtro.nombre !=null){
                where.push( " nombre_beneficiario Ilike '%" + filtro.nombre + "%' ");
                orderBy.push('nombre_beneficiario')
            }

            if (filtro.cedula !=null){
                where.push( " cedula like '%" + filtro.cedula + "%' ");
                orderBy.push('cedula')
            }

            if (filtro.trabajador !=null){
                where.push( " trabajador LIKE '%" + filtro.trabajador + "%' ");
                orderBy.push('trabajador')
            }

            if (filtro.sexo !=null){
                where.push( " sexo_beneficiario = '" + filtro.sexo + "' ");
                orderBy.push('sexo_beneficiario')
            }

            if (filtro.nivelEduc !=null){
                where.push( " nivel_educativo Ilike '%" + filtro.nivelEduc + "%' ");
                orderBy.push('nivel_educativo')
            }

            if (filtro.edadIni !=null && filtro.edadFin !=null){
                where.push( " EXTRACT(YEAR FROM age(TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-12-31', 'YYYY-MM-DD'), fecha_nac)) BETWEEN " + filtro.edadIni + " AND " + filtro.edadFin);
                orderBy.push('nivel_educativo')
            }

            where.forEach(function(where, index) {
                if (index==0){
                    consulta += ` WHERE ${where}`; 
                }else{
                    consulta += ` ${filtro.condlogica} ${where}`;
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
            consulta += " ORDER BY idbeneficiario desc";
        } 
        
        try {            
            
            const beneficiarios: Ibeneficiario[] = await db.querySelect(consulta);            
            
            res.status(200).json(beneficiarios);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        let query : string = "INSERT INTO sibes_beneficiarios (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idbeneficiario')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES (";

            for (const prop in newPost) {
                if (prop != 'idbeneficiario')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            
            const result/*: IPaciente[]*/ = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('beneficiario no registrado');
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

    public async updateRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body; 
        let IdReg: string = req.params.IdReg;
        let query : string = "UPDATE sibes_beneficiarios SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'idbeneficiario')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idbeneficiario = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('beneficiario actualizado');            
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from sibes_beneficiarios WHERE idbeneficiario = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('beneficiario eliminado');
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const beneficiariosController = new BeneficiarioController();