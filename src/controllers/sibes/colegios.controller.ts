import { Request,  Response  } from 'express';
import db from '../../database';
import { Icolegio } from '../../interfaces/sibes/colegios';

class ColegiosController{ 

    public async colegiofilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM sibes_colegios ";
        const valueIsNull = [undefined, 'null', 'NULL', ''];
        const regex = /^[0-9]*$/;        
        let filtro = {
            id: valueIsNull.indexOf(req.params.id)  != -1  ? null : req.params.id,
            nombre: valueIsNull.indexOf(req.params.nombre)  != -1 ? null : req.params.nombre,
            rif: valueIsNull.indexOf(req.params.rif)  != -1 ? null : req.params.rif,
            localidad: valueIsNull.indexOf(req.params.localidad)  != -1 ? null : req.params.localidad,            
            tipo: valueIsNull.indexOf(req.params.tipo)  != -1 ? null : req.params.tipo,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,                        
        }

        let where: string[] = [];
        let orderBy: string[] = [];
    
        if (filtro.id !=null || filtro.nombre!=null || filtro.rif!=null || filtro.localidad !=null || filtro.tipo){        
            if (filtro.id !=null){
                where.push( " idcolegio  = " + filtro.id + " ");                
            }

            if (filtro.nombre !=null){
                where.push( " nombre_colegio Ilike '%" + filtro.nombre + "%' ");
                orderBy.push('nombre_colegio')
            }

            if (filtro.rif !=null){
                where.push( " rif_colegio Ilike '%" + filtro.rif + "%' ");
                orderBy.push('rif_colegio')
            }

            if (filtro.localidad !=null){
                where.push( " localidad_colegio ILIKE '%" + filtro.localidad + "%' ");
                orderBy.push('localidad_colegio')
            }

            if (filtro.tipo !=null){
                where.push( " tipo_administracion ILIKE '%" + filtro.tipo + "%' ");
                orderBy.push('tipo_administracion')
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
            consulta += " ORDER BY idcolegio desc";
        } 
        
        try {            
            
            const colegios: Icolegio[] = await db.querySelect(consulta);            
            
            res.status(200).json(colegios);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        let query : string = "INSERT INTO sibes_colegios (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idcolegio')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES (";

            for (const prop in newPost) {
                if (prop != 'idcolegio')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            
            const result/*: IPaciente[]*/ = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('colegio no registrado');
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
        let query : string = "UPDATE sibes_colegios SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'idcolegio')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idcolegio = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('colegio actualizado');            
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from sibes_colegios WHERE idcolegio = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('colegio eliminado');
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const colegioController = new ColegiosController();