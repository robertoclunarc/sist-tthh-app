import { Request,  Response  } from 'express';
import db from '../database';
import { IPrecios_dolar, IMonitor } from '../interfaces/sibes/dolar.interface';
import axios from "axios";

class preciosDolarController{

    public async preciosDolarfilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM precios_dolar ";
        const valueIsNull = [undefined, 'null', 'NULL', '', 'undefined'];
        
        const regex = /^[0-9]*$/;        
        let filtro = {
            id: valueIsNull.indexOf(req.params.id)  != -1  ? null : req.params.id,
            fecha: valueIsNull.indexOf(req.params.fecha)  != -1 ? null : decodeURIComponent(req.params.fecha) ,                        
        }

        let where: string[] = [];
        let orderBy: string[] = [];
    
        if (filtro.id !=null || filtro.fecha!=null ){        
            if (filtro.id !=null){
                where.push( " idpreciodolar  = " + filtro.id + " ");                
            }

            if (filtro.fecha !=null){
                where.push( " last_update Ilike '%" + filtro.fecha + "%' ");
                orderBy.push('last_update')
            }            

            where.forEach(function(where, index) {
                if (index==0){
                    consulta += ` WHERE ${where}`; 
                }else{
                    consulta += ` or ${where}`;
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
            consulta += " ORDER BY idpreciodolar desc";
        } 
        //console.log(consulta)
        try {            
            
            const precios_dolar: IPrecios_dolar[] = await db.querySelect(consulta);            
            
            res.status(200).json(precios_dolar);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        let query : string = "INSERT INTO precios_dolar (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'idprecios_dolar')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES (";

            for (const prop in newPost) {
                if (prop != 'idpreciodolar')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            
            const result/*: IPaciente[]*/ = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('precios_dolar no registrado');
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
        let query : string = "UPDATE precios_dolar SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'idpreciodolar')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE idpreciodolar = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('precios_dolar actualizado');            
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from precios_dolar WHERE idpreciodolar = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('precios_dolar eliminado');
            
        } catch (e) {
            console.error(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async dolarToDay(req: Request, res: Response): Promise<void> {
        var options = {
            method: 'GET',
            url: 'https://pydolarvenezuela-api.vercel.app/api/v1/dollar',
            headers: {'Content-Type': 'application/json'}
          };
          
          axios.request(options).then(function (response) {
            const divisas = response.data;
            const toDay: IMonitor=divisas.monitors.bcv;
            res.status(200).json(toDay);
          }).catch(function (error) {
            console.error(error);
          });         
    }
}

export const precioDolarController = new preciosDolarController();