import { Request,  Response  } from 'express';
import db from '../database';
//import {QueryResult} from 'pg';
import { IConsultas, IConsultasConstraint, INotaExamen, IvConsulta, IvMorbilidad } from '../interfaces/consultas';

class ConsultasController{ 

    public async consultasAll (req: Request, res: Response): Promise<void> {
        
        try {
            const result: IConsultas[] = await db.querySelect("SELECT * FROM tbl_consulta ORDER BY fecha desc ");
            
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                   
                res.status(200).json(result);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async contadorAtencionPorMotivos (req: Request, res: Response): Promise<void> {
        
        try {
            const result = await db.querySelect("select c.id_motivo, m.descripcion, count(*) as totalmotivos from tbl_consulta c inner join tbl_motivos m on m.uid=c.id_motivo  where fecha >= current_date - interval '12 month'  group by c.id_motivo, m.descripcion order by 3 desc");
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async countAtencionPorMotivosMedicos (req: Request, res: Response): Promise<void> {
        const login: string = req.params.login;
        const idPersonal: string = req.params.idPersonal == 'MEDICO' ? 'id_medico' : 'id_paramedico';
        try {
            const result = await db.querySelect(`select c.id_motivo, m.descripcion, count(*) as totalmotivos from tbl_consulta c inner join tbl_motivos m on m.uid=c.id_motivo inner join tbl_medicos_paramedicos on tbl_medicos_paramedicos.uid=${idPersonal}  where fecha >= current_date - interval '12 month' and login = '${login}'  group by c.id_motivo, m.descripcion order by 3 asc`);
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async contadorAfecciones (req: Request, res: Response): Promise<void> {
        
        try {
            const result = await db.querySelect("select e.i as fecha, e.dia, c.fkafeccion, descripcion_afeccion, COALESCE(c.cantafeccion,0) as cantafeccion  from (select i::date, to_char(i::date,'DY') as dia from generate_series((current_date - interval '30 day'), current_date, '1 day'::interval) i) e  left join (select fkafeccion, to_char(fecha,'YYYY-mm-dd')::date as diamesanio, count(*) as cantafeccion  from tbl_consulta	where fecha between (current_date - interval '30 day') and current_date  and   fkafeccion IS NOT NULL           group by fkafeccion, to_char(fecha,'YYYY-mm-dd')) c on c.diamesanio=e.i left join tbl_tipo_afecciones_sistemas on idafecciones=c.fkafeccion  order by 1,3");
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async contadorAfeccionesMeses (req: Request, res: Response): Promise<void> {
        
        try {
            const result = await db.querySelect("select e.mesanio as fecha, e.dia, c.fkafeccion, descripcion_afeccion, COALESCE(c.cantafeccion,0) as cantafeccion  from (select to_char(i::date,'YYYY-mm') as mesanio , to_char(i::date,'MON') as dia from generate_series((current_date - interval '30 month'), current_date, '30 day'::interval) i) e         left join (select fkafeccion, to_char(fecha,'YYYY-mm') as mesanio, count(*) as cantafeccion from tbl_consulta where fecha between (current_date - interval '30 month')      and current_date  and   fkafeccion IS NOT NULL group by fkafeccion, to_char(fecha,'YYYY-mm')) c on c.mesanio=e.mesanio  left join tbl_tipo_afecciones_sistemas on idafecciones=c.fkafeccion order by 1,3");
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async contadorAfeccionesAnios (req: Request, res: Response): Promise<void> {
        
        try {
            const result = await db.querySelect("select e.mesanio as fecha, e.dia, c.fkafeccion, descripcion_afeccion, COALESCE(c.cantafeccion,0) as cantafeccion  from (select to_char(i::date,'YYYY') as mesanio , to_char(i::date,'YYYY') as dia from generate_series((current_date - interval '30 year'), current_date, '12 month'::interval) i) e             left join (select fkafeccion, to_char(fecha,'YYYY') as mesanio, count(*) as cantafeccion  from tbl_consulta where fecha between (current_date - interval '30 month')        and current_date  and   fkafeccion IS NOT NULL group by fkafeccion, to_char(fecha,'YYYY')) c on c.mesanio=e.mesanio left join tbl_tipo_afecciones_sistemas on idafecciones=c.fkafeccion where c.fkafeccion IS NOT NULL order by 1,3");
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async contadorAfeccionesAll (req: Request, res: Response): Promise<void> {
        const interval: string =  req.params.interval; 
        try {
            const result = await db.querySelect(`select  fkafeccion, count(*) as cantafeccion from tbl_consulta  where fecha between (current_date - interval '${interval}') and current_date       and   fkafeccion IS NOT NULL  group by fkafeccion  order by 2 desc`);
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async contadorAtencionPorMotivosDelAnio (req: Request, res: Response): Promise<void> {
        
        try {
            const result = await db.querySelect("select a.id_motivo, b.descripcion, to_char(a.fecha,'MON-YYYY') as diamesanio, count(*) as cantmotivos from tbl_consulta a             inner join tbl_motivos b on a.id_motivo=b.uid where a.fecha  >= (to_char(current_date,'YYYY') || '-01-01')::date group by a.id_motivo, b.descripcion, to_char(a.fecha,'MON-YYYY') order by 1,3 desc");
            //console.log(result);
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                   
                res.status(200).json(result);                
            }            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async consultasOne (req: Request, res: Response): Promise<void> {
        const IdReg: string = req.params.IdReg
        try {
            const result: IConsultas[] = await db.querySelect('SELECT * FROM tbl_consulta WHERE uid=$1', [IdReg]);
            //console.log(result);
            if (!result){
                res.status(200).json('consulta no encontrada');
            }
            else{
                    
                res.status(200).json(result[0]);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }    

    public async consultasCount (req: Request, res: Response): Promise<void> {
        const login: string = req.params.login
        try {
            const result= await db.querySelect("select count(*) as totalAtencion from v_consulta where login_atendio like('%"+login+"%')");
            //console.log(result);
            if (!result){
                res.status(200).json(0);
            }
            else{
                    
                res.status(200).json(result[0].totalatencion);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async countResultadoEvalParamedicos (req: Request, res: Response): Promise<void> {
        const login: string = req.params.login
        try {
            const result= await db.querySelect(`select id_paramedico, nombre, login, tipo_medico, to_char(fecha,'YYYY-mm') as mesanio, upper(trim(resultado_eva)) as result_eva, count(*) as conteval from tbl_consulta inner join tbl_medicos_paramedicos on tbl_medicos_paramedicos.uid=id_paramedico  where resultado_eva IS NOT NULL  and resultado_eva<>''   and resultado_eva not ilike '%APTO%' and fecha >= current_date - interval '12 month' and id_paramedico  IS NOT NULL and login='${login}'  group by id_paramedico, nombre, login, tipo_medico, to_char(fecha,'YYYY-mm'), upper(trim(resultado_eva))  having count(*) > 1  order by  1,2, 4 desc`);
            //console.log(result);
            if (!result){
                res.status(200).json(0);
            }
            else{
                    
                res.status(200).json(result[0].totalatencion);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async countResultadoEvalMedicos (req: Request, res: Response): Promise<void> {
        const login: string = req.params.login
        try {
            const result= await db.querySelect(`select id_medico, nombre, login, tipo_medico, to_char(fecha,'YYYY-mm') as mesanio, upper(trim(resultado_eva)) as result_eva, count(*) as conteval from tbl_consulta inner join tbl_medicos_paramedicos on tbl_medicos_paramedicos.uid=id_medico  where resultado_eva IS NOT NULL  and resultado_eva<>''   and resultado_eva not ilike '%APTO%' and fecha >= current_date - interval '12 month' and id_medico  IS NOT NULL and login='${login}'  group by id_medico, nombre, login, tipo_medico, to_char(fecha,'YYYY-mm'), upper(trim(resultado_eva))  having count(*) > 1  order by  1,2, 4 desc`);
            //console.log(result);
            if (!result){
                res.status(200).json(0);
            }
            else{
                    
                res.status(200).json(result[0].totalatencion);                    
                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async notaExamen (req: Request, res: Response): Promise<void> {
        const idConsulta: string = req.params.uidConsulta;
        try {
            const result= await db.querySelect(`SELECT m.ci, m.fecha, m.motivo, c.idmotivo, m.cargo, m.departamento, m.paramedico, m.medico, m.nombre_completo, m.nombres_jefe, c.condicion, m.sexo, m.reposo, c.resultado_eva, firma_dr FROM v_morbilidad m, v_consulta c WHERE c.uid = m.uid AND m.uid=${idConsulta}`);
            //console.log(result);
            if (!result){
                res.status(200).json({message: "Sin datos"});
            }
            else{
                const notaReposo: INotaExamen = {
                    desc_mot:result[0].motivo,
                    motivo:result[0].idmotivo,
                    nombre_completo:result[0].nombre_completo,
                    mor_sex:result[0].sexo,
                    mor_ci:result[0].ci,
                    nom_paramedico:result[0].paramedico,
                    nom_medico:result[0].medico,
                    mor_cond:result[0].condicion,
                    mor_fecha: result[0].fecha,
                    mor_depar: result[0].departamento,
                    mor_cargo: result[0].cargo,
                    mor_nomjefe: result[0].nombres_jefe,
                    mor_reposo: result[0].reposo,
                    resultado_eva: result[0].resultado_eva,
                    firma_dr:  result[0].firma_dr,
                } 
                  
                res.status(200).json(notaReposo);                
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

    public async consultafilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM v_consulta ";
        const valueIsNull = [undefined, 'null', 'NULL', '', , 'undefined'];
        const regex = /^[0-9]*$/;
        const IdReg: string = req.params.IdReg
        let atencion = {
            ciPaciente: valueIsNull.indexOf(req.params.ciPaciente)  != -1  ? null : req.params.ciPaciente,
            uidConsulta: valueIsNull.indexOf(req.params.uidConsulta)  != -1 ? null : req.params.uidConsulta,
            fechaIni: valueIsNull.indexOf(req.params.fechaIni)  != -1 ? null : req.params.fechaIni,
            fechaFin: valueIsNull.indexOf(req.params.fechaFin)  != -1 ? null : req.params.fechaFin,
            Medico: valueIsNull.indexOf(req.params.Medico)  != -1 ? null : req.params.Medico,
            Paramedico: valueIsNull.indexOf(req.params.Paramedico)  != -1 ? null : req.params.Paramedico,
            Motivo: valueIsNull.indexOf(req.params.Motivo)  != -1 ? null : req.params.Motivo,
            uidMotivo: valueIsNull.indexOf(req.params.uidMotivo)  != -1 ? null : req.params.uidMotivo,
            nombrePaciente: valueIsNull.indexOf(req.params.nombrePaciente)  != -1 ? null : req.params.nombrePaciente,
            cargo: valueIsNull.indexOf(req.params.cargo)  != -1 ? null : req.params.cargo,
            fecha: valueIsNull.indexOf(req.params.fecha)  != -1 ? null : req.params.fecha,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,
            patologia: valueIsNull.indexOf(req.params.patologia)  != -1 ? null : req.params.patologia,
        }
        

        let where: string[] = [];
        let orderBy: string[] = [];
        if (atencion.ciPaciente !==null || atencion.uidConsulta!==null || atencion.fechaIni!==null || atencion.fechaFin!==null || atencion.Paramedico!==null || atencion.Medico!==null || atencion.Motivo!==null || atencion.uidMotivo!==null || atencion.nombrePaciente!==null || atencion.cargo !==null || atencion.fecha !==null || atencion.patologia !==null){
            if (atencion.ciPaciente !==null &&  regex.test(atencion.ciPaciente)){
                where.push( ` ci like '%${atencion.ciPaciente}%' `);
                orderBy.push('ci');
            }

            if (atencion.nombrePaciente !==null){
                where.push( ` nombre_completo Ilike '%${atencion.nombrePaciente}%' `);
                orderBy.push('nombre_completo');
            }

            if (atencion.cargo !==null){
                where.push( ` cargo Ilike '%${atencion.cargo}%' `);
                orderBy.push('cargo');
            }

            if (atencion.uidConsulta !==null &&  regex.test(atencion.uidConsulta)){
                where.push( ` CAST(uid AS TEXT) LIKE '%${atencion.uidConsulta}%' `);
                orderBy.push('uid desc');
            }

            if (atencion.fecha !==null){
                where.push( ` CAST(fecha AS TEXT) LIKE '%${atencion.fecha}%' `);
                orderBy.push('fecha desc');
            }

            if (atencion.uidMotivo !==null &&  regex.test(atencion.uidMotivo)){
                where.push( ` idmotivo =  ${atencion.uidMotivo} `);
                orderBy.push('idmotivo');
            }

            if (atencion.fechaIni !==null && atencion.fechaFin!=null){
                where.push( ` (to_char(fecha,'YYYY-MM-DD') BETWEEN '${atencion.fechaIni}' AND '${atencion.fechaFin}') `);
                orderBy.push('fecha desc');
            }            

            if (atencion.Paramedico !==null){
                where.push( ` paramedico Ilike '%${atencion.Paramedico}%' `);
                orderBy.push('paramedico');
            }

            if(atencion.Motivo!==null){
                where.push( ` motivo  Ilike '%${atencion.Motivo}%'`);
                orderBy.push('motivo');
            }

            if(atencion.patologia!==null){
                where.push( ` patologia  Ilike '%${atencion.patologia}%'`);
                orderBy.push('patologia');
            }

            if (atencion.Medico !==null){
                where.push( ` login_atendio Ilike '%${atencion.Medico}%' `);
                orderBy.push('login_atendio');
            }
            
            where.forEach(function(w, index) {
                if (index==0){
                    if (atencion.Medico === null) {consulta += ` WHERE ${w}`;}
                    else { consulta += ` WHERE (${w}`;}
                }else{
                    if (atencion.Medico !==null && w === ` login_atendio Ilike '%${atencion.Medico}%' `)
                        consulta += `) AND ${w}`;
                    else
                        consulta += ` ${atencion.condlogica} ${w}`;
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
            consulta += " ORDER BY uid desc";
        }         
        
        //console.log(consulta);
        try {
            
            const result: IvConsulta[] = await db.querySelect(consulta);
            
            if (!result){
                res.status(200).json(result);
            }
            else{
                //console.log(result);                   
                res.status(200).json(result);                
            }
            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
        }        
    }
    
    public async morbilidadFilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM v_morbilidad ";
        const valueIsNull = [undefined, 'null', 'NULL', '', 'undefined'];
        
        const regex = /^[0-9]*$/;        
        let atencion = {
            ciPaciente: valueIsNull.indexOf(req.params.ciPaciente)  != -1  ? null : req.params.ciPaciente,
            uidConsulta: valueIsNull.indexOf(req.params.uidConsulta)  != -1 ? null : req.params.uidConsulta,
            fechaIni: valueIsNull.indexOf(req.params.fechaIni)  != -1 ? null : req.params.fechaIni,
            fechaFin: valueIsNull.indexOf(req.params.fechaFin)  != -1 ? null : req.params.fechaFin,
            Medico: valueIsNull.indexOf(req.params.Medico)  != -1 ? null : req.params.Medico,
            Paramedico: valueIsNull.indexOf(req.params.Paramedico)  != -1 ? null : req.params.Paramedico,
            Motivo: valueIsNull.indexOf(req.params.Motivo)  != -1 ? null : req.params.Motivo,
            /*uidMotivo: valueIsNull.indexOf(req.params.uidMotivo)  != -1 ? null : req.params.uidMotivo,*/
            nombrePaciente: valueIsNull.indexOf(req.params.nombrePaciente)  != -1 ? null : req.params.nombrePaciente,
            cargo: valueIsNull.indexOf(req.params.cargo)  != -1 ? null : req.params.cargo,
            fecha: valueIsNull.indexOf(req.params.fecha)  != -1 ? null : req.params.fecha,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,
            patologia: valueIsNull.indexOf(req.params.patologia)  != -1 ? null : req.params.patologia,
        }

        let where: string[] = [];
        let orderBy: string[] = [];
        if (atencion.ciPaciente !=null || atencion.uidConsulta!=null || atencion.fechaIni!=null || atencion.fechaFin!=null || atencion.Paramedico!=null || atencion.Medico!=null || atencion.Motivo!=null || atencion.patologia!=null || atencion.nombrePaciente!=null || atencion.cargo !=null || atencion.fecha !=null){
            if (atencion.ciPaciente !==null &&  regex.test(atencion.ciPaciente)){
                where.push( ` ci like '%${atencion.ciPaciente}%' `);
                orderBy.push('ci');
            }

            if (atencion.nombrePaciente !==null){
                where.push( ` nombre_completo Ilike '%${atencion.nombrePaciente}%' `);
                orderBy.push('nombre_completo');
            }

            if (atencion.cargo !==null){
                where.push( ` cargo Ilike '%${atencion.cargo}%' `);
                orderBy.push('cargo');
            }

            if (atencion.uidConsulta !==null &&  regex.test(atencion.uidConsulta)){
                where.push( ` CAST(uid AS TEXT) LIKE '%${atencion.uidConsulta}%' `);
                orderBy.push('uid desc');
            }

            if (atencion.fecha !==null){
                where.push( ` CAST(fecha AS TEXT) LIKE '%${atencion.fecha}%' `);
                orderBy.push('fecha desc');
            }
            /*
            if (atencion.uidMotivo !==null &&  regex.test(atencion.uidMotivo)){
                where.push( ` idmotivo =  ${atencion.uidMotivo} `);
                orderBy.push('idmotivo');
            }
            */
            if (atencion.fechaIni !==null && atencion.fechaFin!==null){
                where.push( ` (to_char(fecha,'YYYY-MM-DD') BETWEEN '${atencion.fechaIni}' AND '${atencion.fechaFin}') `);
                orderBy.push('fecha desc');
            }            

            if (atencion.Paramedico !==null){
                where.push( ` paramedico Ilike '%${atencion.Paramedico}%' `);
                orderBy.push('paramedico');
            }

            if(atencion.Motivo!==null){
                where.push( ` motivo  Ilike '%${atencion.Motivo}%'`);
                orderBy.push('motivo');
            }

            if(atencion.patologia!==null){
                where.push( ` patologia  Ilike '%${atencion.patologia}%'`);
                orderBy.push('patologia');
            }

            if (atencion.Medico !==null){
                where.push( ` login_atendio Ilike '%${atencion.Medico}%' `);
                orderBy.push('login_atendio');
            }

            where.forEach(function(w, index) {
                if (index==0){
                    if (atencion.Medico === null) {consulta += ` WHERE ${w}`;}
                    else { consulta += ` WHERE (${w}`;}
                }else{
                    if (atencion.Medico !==null && w === ` login_atendio Ilike '%${atencion.Medico}%' `)
                        consulta += `) AND ${w}`;
                    else
                        consulta += ` ${atencion.condlogica} ${w}`;
                }    
            });
        }
        //console.log(consulta);
        if (orderBy.length>0){
            orderBy.forEach(function(order, index) {
                if (index==0){
                    consulta += ` ORDER BY ${order}`; 
                }else{
                    consulta += ` , ${order}`;
                }
                
            });
        }else{
            consulta += " ORDER BY uid desc";
        } 
        //console.log(consulta);
        try {
            
            const result: IvMorbilidad[] = await db.querySelect(consulta);
            
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

    public async createRecord (req: Request, res: Response): Promise<void> {
        let newPost: any = req.body;
        /*let query : string = "INSERT INTO tbl_consulta ( id_paciente, fecha, id_motivo, sintomas, id_medico, observaciones, indicaciones, fecha_prox_cita, observacion_medicamentos, resultado_eva, id_paramedico, id_area, id_patologia, id_remitido, id_reposo, fecha_registro, turno, indicaciones_comp, referencia_medica, condicion, fkafeccion, autorizacion ) VALUES (";*/
        let query : string = "INSERT INTO tbl_consulta (";
        try { 
            
            for (const prop in newPost) {
                if (prop != 'uid')                    
                     query+= `${prop},`;                                   
            }
            query =query.substring(0, query.length - 1);
            query+= " ) VALUES ("; 

            for (const prop in newPost) {
                if (prop != 'uid')
                    if (typeof newPost[prop] === 'string')
                        query+= `'${newPost[prop]}',`;
                    else
                        query+= `${newPost[prop]},`;               
            }

            query =query.substring(0, query.length - 1);
            query += ') RETURNING *';
            
            const result: IConsultas[] = await db.querySelect(query);
            //console.log(query);
            if (!result){
                res.status(200).json('consulta no registrada');
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
        let query : string = "UPDATE tbl_consulta SET ";
        try {
            for (const prop in newPost) {
                if (prop != 'uid')
                    if (typeof newPost[prop] === 'string')
                        query+= `${prop} = '${newPost[prop]}',`;
                    else
                        query+= `${prop} = ${newPost[prop]},`;               
            }
            query =query.substring(0, query.length - 1);
            query += ' WHERE uid = ' + IdReg;
              
            const result = await db.querySelect(query);            
            res.status(200).json('consulta actualizada');            
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async deleteRecord (req: Request, res: Response): Promise<void> {        
        let IdReg: string = req.params.IdReg;
        let query : string = "DELETE from tbl_consulta WHERE uid = $1 ";
        try {                          
                const result = await db.querySelect(query, [IdReg]);
                res.status(200).json('consulta eliminada');
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const consultaController = new ConsultasController();