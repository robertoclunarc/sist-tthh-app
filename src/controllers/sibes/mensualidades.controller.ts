import { Request,  Response  } from 'express';
import db from '../../database';
import { Imensualidad } from '../../interfaces/sibes/mensualidades';

class MensualidadController{ 

    public async mensualidadfilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM sibes_mensualidades ";
        const valueIsNull = [undefined, 'null', 'NULL', '', 'undefined'];
        const regex = /^[0-9]*$/;        
        let filtro = {
            id: valueIsNull.indexOf(req.params.id)  != -1  ? null : req.params.id,
            fkinscripcion: valueIsNull.indexOf(req.params.fkinscripcion)  != -1 ? null : req.params.fkinscripcion,
        }

        let where: string[] = [];
        let orderBy: string[] = [];
    
        if (filtro.id !=null || filtro.fkinscripcion!=null){        
            if (filtro.id !=null){
                where.push( " idmensualidad  = " + filtro.id + " ");                
            }

            if (filtro.fkinscripcion !=null){
                where.push( " fkinscripcion = " + filtro.fkinscripcion + " ");
                orderBy.push('fkinscripcion')
            }

            where.forEach(function(where, index) {
                if (index==0){
                    consulta += ` WHERE ${where}`; 
                }else{
                    consulta += ` AND ${where}`;
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
            consulta += " ORDER BY idmensualidad desc";
        } 
        
        try {            
            
            const mensualidades: Imensualidad[] = await db.querySelect(consulta);            
            
            res.status(200).json(mensualidades);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        let query : string = "INSERT INTO sibes_mensualidades (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idmensualidad')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES (";

            for (const prop in newPost) {
                if (prop != 'idmensualidad')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            
            const result/*: IPaciente[]*/ = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('mensualidad no registrada');
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
        let query : string = "UPDATE sibes_mensualidades SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'idmensualidad')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idmensualidad = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('mensualidad actualizada');            
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from sibes_mensualidades WHERE idmensualidad = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('mensualidad eliminada');
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const mensualidadsController = new MensualidadController();