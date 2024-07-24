import { Request,  Response  } from 'express';
import db from '../database';
import { ITrabajadores } from '../interfaces/trabajadores.interface';

class TrabajadoresController{ 

    public async trabajadoresAll (req: Request, res: Response): Promise<void> {
        
        try {            
            const result: ITrabajadores[] = await db.querySelect(`SELECT * FROM trabajadores`);
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                //const paciente: IPaciente = result;    
                res.status(200).json(result);                    
                
            }
            
        } catch (e) {
           console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async trabajadorCedula (req: Request, res: Response): Promise<void> {
        const ci: string = req.params.ci
        try {            
            const result: ITrabajadores[] = await db.querySelect(`SELECT * FROM trabajadores WHERE trabajador=$1`, [ci]);
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                res.status(200).json(result[0]);
            }
        } catch (e) {
           console.error(e);
           res.status(500).json('Internal Server error');
        }
    }

    public async trabajadoresPorSigladoSupervisor (req: Request, res: Response): Promise<void> {
        let login: string = req.params.login;
        let result: ITrabajadores[] = [];
        try {
            if (login=='brismd'){
                result = await db.querySelect(`SELECT trabajador, nombre, email, siglado as correo, trabajador_sup, nombre_sup FROM v_trabajadores where trabajador in (
                    select ci from tbl_paramedicos where activo = true)`);
            }else{
                const rstNivelJerquico = await db.querySelect(`SELECT trabajador, nivel_jerarquico FROM v_trabajadores WHERE siglado=$1`, [login]);
                const nivelJerarquico = rstNivelJerquico[0].nivel_jerarquico;
                const trabajador = rstNivelJerquico[0].trabajador
                console.log(nivelJerarquico, trabajador);
                
                if (nivelJerarquico < 6){
                    result = await db.querySelect(`select trabajador, nombre, email, siglado as correo, trabajador_sup, nombre_sup from fu_lista_trabajadores_del_supervisor($1) where siglado not in ($2) and (nivel_jerarquico >= $3)`, [login, login, nivelJerarquico]);
                }else{
                    result = await db.querySelect(`select trabajador, nombre, email, siglado as correo, trabajador_sup, nombre_sup from fu_lista_trabajadores_del_supervisor($1) where siglado not in ($2) and (nivel_jerarquico >= $3 and trabajador_sup=$4)`, [login, login, nivelJerarquico, trabajador]);
                }
            }
            console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                res.status(200).json(result);
            }
        } catch (e) {
           console.error(e);
           res.status(500).json('Internal Server error');
        }
    }
}

export const trabajadoresController = new TrabajadoresController();