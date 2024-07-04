import { Request,  Response  } from 'express';
import db from '../database';
//import { IPaciente, IvPaciente, IPacienteConSupervisores } from '../interfaces/paciente.interface';

class PacientesController{ 

    public async pacienteAll (req: Request, res: Response): Promise<void> {
        
        try {
            const result/*: IvPaciente[]*/ = await db.querySelect('SELECT * FROM v_pacientes ORDER BY ci ');
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                //const paciente: IPaciente = result;    
                res.status(200).json(result);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async pacienteCedula (req: Request, res: Response): Promise<void> {
        const IdReg: string = req.params.IdReg
        try {
            const result/*: IvPaciente[]*/ = await db.querySelect('SELECT * FROM v_pacientes WHERE ci=$1', [IdReg]);
            //console.log(result);
            if (!result){
                res.status(200).json('paciente no encontrado');
            }
            else{                 
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async pacienteUid (req: Request, res: Response): Promise<void> {
        const IdReg: string = req.params.IdReg
        try {
            const result/*: IvPaciente[]*/ = await db.querySelect('SELECT * FROM v_pacientes WHERE uid_paciente=$1', [IdReg]);
            //console.log(result);
            if (!result){
                res.status(200).json('paciente no encontrado');
            }
            else{                 
                res.status(200).json(result[0]);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async pacientefilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT p.*, s.supervisor, s.nombres_jefe FROM v_pacientes p left join v_trabajadores_supervisores s on s.trabajador=p.ci";
        const valueIsNull = [undefined, 'null', 'NULL', ''];
        const regex = /^[0-9]*$/;        
        let filtro = {
            ciPaciente: valueIsNull.indexOf(req.params.ciPaciente)  != -1  ? null : req.params.ciPaciente,
            nombre: valueIsNull.indexOf(req.params.nombre)  != -1 ? null : req.params.nombre,
            supervisor: valueIsNull.indexOf(req.params.supervisor)  != -1 ? null : req.params.supervisor,
            cargo: valueIsNull.indexOf(req.params.cargo)  != -1 ? null : req.params.cargo,            
            depto: valueIsNull.indexOf(req.params.dpto)  != -1 ? null : req.params.dpto,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,                        
        }        

        let where: string[] = [];
        let orderBy: string[] = [];
    
        if (filtro.ciPaciente !=null || filtro.nombre!=null || filtro.supervisor!=null || filtro.cargo !=null || filtro.depto){        
            if (filtro.ciPaciente !=null &&  regex.test(filtro.ciPaciente)){
                where.push( " ci like '%" + filtro.ciPaciente + "%' ");
                orderBy.push('ci');
            }

            if (filtro.nombre !=null){
                where.push( " nombre_completo Ilike '%" + filtro.nombre + "%' ");
                orderBy.push('nombre_completo')
            }

            if (filtro.supervisor !=null){
                where.push( " nombres_jefe Ilike '%" + filtro.supervisor + "%' ");
                orderBy.push('nombres_jefe')
            }

            if (filtro.cargo !=null){
                where.push( " cargo ILIKE '%" + filtro.cargo + "%' ");
                orderBy.push('cargo')
            }

            if (filtro.depto !=null){
                where.push( " departamento ILIKE '%" + filtro.depto + "%' ");
                orderBy.push('departamento')
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
            consulta += " ORDER BY fechanac desc";
        } 
        
        try {            
            let pacientesConSupervisores/*: IPacienteConSupervisores[]=[];*/
            pacientesConSupervisores = await db.querySelect(consulta);            
            
            res.status(200).json(pacientesConSupervisores);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        let query : string = "INSERT INTO tbl_pacientes (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'uid_paciente')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES (";

            for (const prop in newPost) {
                if (prop != 'uid_paciente')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            
            const result/*: IPaciente[]*/ = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('paciente no registrado');
                //res.status(200).json(query);
            }
            else{
                    
                res.status(200).json(result[0]);                    
                //res.status(200).json(query);  
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async updateRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body; 
        let IdReg: string = req.params.IdReg;
        let query : string = "UPDATE tbl_pacientes SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'uid_paciente')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE uid_paciente = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('paciente actualizado');            
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from tbl_pacientes WHERE uid_paciente = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('paciente eliminado');
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const pacientesController = new PacientesController();