import { Request,  Response  } from 'express';
import db from '../../database';
import {QueryResult} from 'pg';
import { IgradosEscolarizacion, InivelesEducacion } from 'interfaces/sibes/varios.interface';

class VariosController{    

    public async prueba (req: Request, res: Response): Promise<void> {
        console.log('prueba');
        try {
            const result: QueryResult[] = await db.querySelect('SELECT * FROM usuarios ');
            //console.log(result);
            if (!result){
                res.status(400).json('usuarios no encontrado');
            }
            else{                    
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }
    
    public async nivelesEducacionAll (req: Request, res: Response): Promise<void> {        
        try {
            const result: InivelesEducacion[] = await db.querySelect('SELECT * FROM sibes_niveles_educacion ');
            
            if (!result){
                res.status(400).json('Niveles no encontrado');
            }
            else{                    
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }        
    }

    public async gradosEscolarizacionAll (req: Request, res: Response): Promise<void> {        
        try {
            const result: IgradosEscolarizacion[] = await db.querySelect('SELECT * FROM sibes_grados_escolarizacion ');
            
            if (!result){
                res.status(400).json('Grados no encontrado');
            }
            else{                    
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }        
    }

    public async generateSeries (req: Request, res: Response): Promise<void> {
        const inicio: string = req.params.inicio;
        const fin: string = req.params.fin;
        const interval: string = req.params.interval;
        const formato: string = req.params.formato;
        let query: string = ``;
        query = `Select i::date as fecha, to_char(i::date, $1) as dia from generate_series($2, $3, $4::interval) i`;
        if (formato==='MON')
            query = `Select to_char(i::date,'YYYY-mm') as fecha, to_char(i::date, $1) as dia from generate_series($2, $3, $4::interval) i`;
        else
            if (formato==='YYYY')
                query = `Select to_char(i::date,'YYYY') as fecha, to_char(i::date, $1) as dia from generate_series($2, $3, $4::interval) i`;          
        console.log(query)
        try {
            const result: {fecha: string, dia: string}[] = await db.querySelect(query, [formato, inicio, fin, interval]);
            //console.log(result);
            if (!result){
                res.status(200).json('serie no generada');
            }
            else{
                    
                res.status(200).json(result);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const varController = new VariosController();