import { Request,  Response  } from 'express';
import db from '../../database';
import { Iinscripcion } from '../../interfaces/sibes/inscripciones';

class inscripcionController{ 

    public async inscripcionfilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM sibes_inscripciones ";
        const valueIsNull = [undefined, 'null', 'NULL', ''];
        const regex = /^[0-9]*$/;        
        let filtro = {
            id: valueIsNull.indexOf(req.params.id)  != -1  ? null : req.params.id,
            fkbeneficiario: valueIsNull.indexOf(req.params.fkbeneficiario)  != -1 ? null : req.params.fkbeneficiario,
            fkcolegio: valueIsNull.indexOf(req.params.fkcolegio)  != -1 ? null : req.params.fkcolegio,
            anio_escolar: valueIsNull.indexOf(req.params.anio_escolar)  != -1 ? null : req.params.anio_escolar,                                    
        }

        let where: string[] = [];
        let orderBy: string[] = [];
    
        if (filtro.id !=null || filtro.fkbeneficiario!=null || filtro.fkcolegio!=null || filtro.anio_escolar !=null){        
            if (filtro.id !=null){
                where.push( " idinscripcion  = " + filtro.id + " ");                
            }

            if (filtro.fkbeneficiario !=null){
                where.push( " fkbeneficiario = " + filtro.fkbeneficiario + " ");
                orderBy.push('fkbeneficiario')
            }

            if (filtro.fkcolegio !=null){
                where.push( " fkcolegio like =" + filtro.fkcolegio + " ");
                orderBy.push('fkcolegio')
            }

            if (filtro.anio_escolar !=null){
                where.push( " anio_escolar =" + filtro.anio_escolar + " ");
                orderBy.push('anio_escolar')
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
            consulta += " ORDER BY idinscripcion desc";
        } 
        
        try {            
            
            const inscripciones: Iinscripcion[] = await db.querySelect(consulta);            
            
            res.status(200).json(inscripciones);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async totalInscripciones (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT anio_escolar, COUNT(*) as totalinscritos, SUM(monto_inscripcion::numeric) as montototal FROM sibes_inscripciones \
        GROUP BY anio_escolar \
        ORDER BY anio_escolar DESC";
        
        try {            
            
            const results: any[] = await db.querySelect(consulta);            
            
            res.status(200).json(results);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        let query : string = "INSERT INTO sibes_inscripciones (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idinscripcion')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES (";

            for (const prop in newPost) {
                if (prop != 'idinscripcion')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            console.log(query);

            const result = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('inscripcion no registrada');
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
        let query : string = "UPDATE sibes_inscripciones SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'idinscripcion')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idinscripcion = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('inscripcion actualizada');            
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from sibes_inscripciones WHERE idinscripcion = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('inscripcion eliminada');
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const inscripcionsController = new inscripcionController();