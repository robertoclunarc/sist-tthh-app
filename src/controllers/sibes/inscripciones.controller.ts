import { Request,  Response  } from 'express';
import db from '../../database';
import { Iinscripcion, ITrabajadoresConBenefInscritos } from '../../interfaces/sibes/inscripciones';

class inscripcionController{ 

    public async inscripcionfilter (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT * FROM sibes_inscripciones ";
        const valueIsNull = [undefined, 'null', 'NULL', '', 'undefined'];
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
        console.log(consulta);
        try {            
            
            const inscripciones: Iinscripcion[] = await db.querySelect(consulta);            
            
            res.status(200).json(inscripciones);
            
        } catch (e) {
            console.error(e);
            res.status(500).json({msj: 'Internal Server error', error: e, sql: consulta});
        }        
    }

    public async trabajadoresConBeneficiariosInsc (req: Request, res: Response): Promise<void> {
        let consulta = "SELECT t.*, b.*, EXTRACT(YEAR FROM age(TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-12-31', 'YYYY-MM-DD'), fecha_nac)) AS edad FROM trabajadores t INNER JOIN sibes_beneficiarios b ON t.trabajador=b.trabajador INNER JOIN sibes_inscripciones i ON i.fkbeneficiario=b.idbeneficiario";
        const valueIsNull = [undefined, 'null', 'NULL', '', 'undefined'];
        const regex = /^[0-9]*$/;
        const estatus = ["ACTIVA", "INACTIVA"];
        let filtro = {
            trabajador: valueIsNull.indexOf(req.params.trabajador)  != -1  ? null : req.params.trabajador,
            nombreTrabajador: valueIsNull.indexOf(req.params.nombreTrabajador)  != -1 ? null : req.params.nombreTrabajador,
            cedula: valueIsNull.indexOf(req.params.cedula)  != -1 ? null : req.params.cedula,
            nombreBeneficiario: valueIsNull.indexOf(req.params.nombreBeneficiario)  != -1 ? null : req.params.nombreBeneficiario,
            estatus: valueIsNull.indexOf(req.params.estatus)  != -1 ? null : req.params.estatus.toUpperCase(),
            anioEscolar: valueIsNull.indexOf(req.params.anioEscolar)  != -1 ? null : req.params.anioEscolar,
            condlogica: valueIsNull.indexOf(req.params.condlogica)  >= 0 ? 'OR' : req.params.condlogica,
        }

        let where: string[] = [];
        let orderBy: string[] = [];
        if (filtro.trabajador !==null || filtro.nombreTrabajador!==null || filtro.cedula!==null || filtro.nombreBeneficiario!==null || filtro.estatus!==null || filtro.anioEscolar!==null){            

            if (filtro.trabajador !==null && regex.test(filtro.trabajador)){
                where.push( ` t.trabajador like '%${filtro.trabajador}%' `);
                orderBy.push('t.trabajador');
            }
            
            if (filtro.cedula !==null && regex.test(filtro.cedula)){
                where.push( ` b.cedula like '%${filtro.cedula}%' `);
                orderBy.push('b.cedula');
            }            

            if (filtro.nombreTrabajador !==null){
                where.push( ` t.nombres ilike '%${filtro.nombreTrabajador}%' `);
                orderBy.push('t.nombres');
            }

            if (filtro.nombreBeneficiario !==null){
                where.push( ` b.nombre_beneficiario ilike '%${filtro.nombreBeneficiario}%' `);
                orderBy.push('b.nombre_beneficiario');
            }

            if (filtro.estatus !=null && estatus.indexOf(filtro.estatus)!= -1 ){
                where.push(` i.estatus_inscripcioin = '${filtro.estatus}'`);
            }

            if (filtro.anioEscolar !==null && regex.test(filtro.anioEscolar) && filtro.anioEscolar.length===4){
                if(Number(filtro.anioEscolar) >= 2023 && Number(filtro.anioEscolar) <= 2100)
                    where.push( ` i.anio_escolar = ${filtro.anioEscolar}`);                
            }
            
            where.forEach(function(w, index) {
                if (index==0){
                     consulta += ` WHERE ${w} `;
                }else{                    
                    consulta += ` ${filtro.condlogica} ${w} `;
                }    
            });
        }

        consulta += " GROUP BY \
            t.trabajador, t.registro_fiscal, t.nombre, t.sexo, t.fecha_nacimiento, t.domicilio, t.domicilio2, t.poblacion, t.estado_provincia, \
            t.pais, t.codigo_postal, t.calles_aledanas, t.telefono_particular, t.reg_seguro_social, t.domicilio3, t.e_mail, t.fkunidad, \
            t.tipo_documento, t.nombres, t.apellidos, t.edo_civil, \
            b.idbeneficiario, b.trabajador, b.fecha_nac, b.sexo_beneficiario, b.pago_colegio, b.estatus_beneficio, b.nombre_beneficiario, \
            b.cedula, b.grado_escolarizacion, b.nivel_educativo, \
            EXTRACT(YEAR FROM age(TO_DATE(EXTRACT(YEAR FROM CURRENT_DATE) || '-12-31', 'YYYY-MM-DD'), fecha_nac))";

        if (orderBy.length>0){
            orderBy.forEach(function(order, index) {
                if (index==0){
                    consulta += ` ORDER BY ${order} `; 
                }else{
                    consulta += ` , ${order} `;
                }                
            });
        }else{
            consulta += " ORDER BY t.trabajador";
        }
        
        try {
            const trabajadoresResult = await db.querySelect(consulta);
            const idbeneficiarios = trabajadoresResult.map((benef: any) => benef.idbeneficiario);
            let trabajadoresBenefInscritos: ITrabajadoresConBenefInscritos[] = [];
            if (idbeneficiarios.length > 0) {
                let _inscripciones = `
                select i.*, c.* from sibes_inscripciones i inner join sibes_colegios c on i.fkcolegio=c.idcolegio
                WHERE i.fkbeneficiario IN (${idbeneficiarios.join(', ')})`;
                
                if (filtro.estatus !=null && estatus.indexOf(filtro.estatus)!= -1 ){
                    _inscripciones += ` and  i.estatus_inscripcioin = '${filtro.estatus}'`;                    
                }
                if (filtro.anioEscolar !==null && regex.test(filtro.anioEscolar) && filtro.anioEscolar.length===4){
                    if(Number(filtro.anioEscolar) >= 2022 && Number(filtro.anioEscolar) <= 2100)
                        _inscripciones += ` and i.anio_escolar = ${filtro.anioEscolar}`;                
                }
                
                _inscripciones += ` order by i.fecha_inscripcion desc `;
                
                const inscripcionesResult = await db.querySelect(_inscripciones);

                const incripcionesMap: { [key: number]: any[] } = {};
                inscripcionesResult.forEach((inscrip: any) => {
                    if (!incripcionesMap[inscrip.fkbeneficiario]) {
                        incripcionesMap[inscrip.fkbeneficiario] = [];
                    }
                    incripcionesMap[inscrip.fkbeneficiario].push({
                        inscripcion: {
                            idinscripcion : inscrip.idinscripcion,
                            fkbeneficiario : inscrip.fkbeneficiario,
                            fkcolegio : inscrip.fkcolegio,
                            fecha_inscripcion : inscrip.fecha_inscripcion,
                            anio_escolar : inscrip.anio_escolar,
                            monto_inscripcion : inscrip.monto_inscripcion,
                            monto_mensual : inscrip.monto_mensual,
                            login_registro : inscrip.login_registro,
                            fecha_registro : inscrip.fecha_registro,
                            estatus_inscripcioin : inscrip.estatus_inscripcioin,
                            mes_inicio : inscrip.mes_inicio,
                            fecha_modificacion : inscrip.fecha_modificacion,
                            login_modificacion : inscrip.login_modificacion,
                            tasa_cambio : inscrip.tasa_cambio,
                            grado_escolarizacion : inscrip.grado_escolarizacion,
                            nivel_educativo : inscrip.nivel_educativo,
                        },
                        colegio: {
                            idcolegio : inscrip.idcolegio,
                            rif_colegio : inscrip.rif_colegio,
                            nombre_colegio : inscrip.nombre_colegio,
                            estatus_colegio : inscrip.estatus_colegio,
                            direccion_colegio : inscrip.direccion_colegio,
                            localidad_colegio : inscrip.localidad_colegio,
                            provincia : inscrip.provincia,
                            tipo_administracion : inscrip.tipo_administracion, 
                        },
                    });
                });

                trabajadoresBenefInscritos = trabajadoresResult.map((res: any) => {
                    return {
                        trabajador: {
                            trabajador: res.trabajador,
                            registro_fiscal: res.registro_fiscal,
                            nombre: res.nombre,
                            sexo: res.sexo,
                            fecha_nacimiento: res.fecha_nacimiento,
                            domicilio: res.domicilio,
                            domicilio2: res.domicilio2,
                            poblacion: res.poblacion,
                            estado_provincia: res.estado_provincia,
                            pais: res.pais,
                            codigo_postal: res.codigo_postal,
                            calles_aledanas: res.calles_aledanas,
                            telefono_particular: res.telefono_particular,
                            reg_seguro_social: res.reg_seguro_social,
                            domicilio3: res.domicilio3,
                            e_mail: res.e_mail,
                            fkunidad: res.fkunidad,
                            tipo_documento: res.tipo_documento,
                            nombres: res.nombres,
                            apellidos: res.apellidos,
                            edo_civil: res.edo_civil,                            
                        },
                        beneficiario:{
                            idbeneficiario : res.idbeneficiario,
                            cedula : res.cedula,
                            trabajador : res.trabajador,
                            fecha_nac : res.fecha_nac,
                            sexo_beneficiario : res.sexo_beneficiario,    
                            pago_colegio : res.pago_colegio,
                            estatus_beneficio : res.estatus_beneficio,
                            nombre_beneficiario : res.nombre_beneficiario,                            
                            grado_escolarizacion : res.grado_escolarizacion,
                            nivel_educativo : res.nivel_educativo,
                            edad: res.edad,
                        },
                        inscripciones: incripcionesMap[res.idbeneficiario] || []
                    };
                });
            }
            
            res.status(200).json(trabajadoresBenefInscritos);
            
        } catch (e) {
            console.error(e);
            res.status(500).json('Internal Server error');
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
        let query : string = "UPDATE sibes_inscripciones SET fecha_modificacion=NOW(),";
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