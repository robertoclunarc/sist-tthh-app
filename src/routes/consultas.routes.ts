import {Router} from 'express';
import { consultaController } from '../controllers/consultas.controller';
class ConsultasRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        this.router.get('/consultar', consultaController.consultasAll); 
        this.router.get('/consultar/:IdReg', consultaController.consultasOne); 
        this.router.get('/consultar/atenciones/:login', consultaController.consultasCount);
        this.router.get('/motivos', consultaController.contadorAtencionPorMotivos); 
        this.router.get('/motivos/delanio', consultaController.contadorAtencionPorMotivosDelAnio);
        this.router.get('/motivos/medicos/:login/:idPersonal', consultaController.countAtencionPorMotivosMedicos);
        this.router.get('/afecciones', consultaController.contadorAfecciones); 
        this.router.get('/afecciones/all/:interval', consultaController.contadorAfeccionesAll); 
        this.router.get('/afecciones/meses', consultaController.contadorAfeccionesMeses);
        this.router.get('/afecciones/anios', consultaController.contadorAfeccionesAnios);          
        this.router.get('/resultadoevaluacion/paramedicos/:login', consultaController.countResultadoEvalParamedicos); 
        this.router.get('/resultadoevaluacion/medicos/:login', consultaController.countResultadoEvalMedicos); 
        this.router.get('/filtrar/:ciPaciente/:uidConsulta/:fechaIni/:fechaFin/:Medico/:Paramedico/:Motivo/:uidMotivo/:nombrePaciente/:cargo/:fecha/:condlogica/:patologia', consultaController.consultafilter); 
        this.router.get('/morbilidad/:ciPaciente/:uidConsulta/:fechaIni/:fechaFin/:Medico/:Paramedico/:Motivo/:uidMotivo/:nombrePaciente/:cargo/:fecha/:condlogica/:patologia', consultaController.morbilidadFilter); 
        this.router.get('/notaexamen/:uidConsulta', consultaController.notaExamen); 
        this.router.put('/update/:IdReg', consultaController.updateRecord);        
        this.router.delete('/delete/:IdReg', consultaController.deleteRecord);
        this.router.post('/insert',consultaController.createRecord);
    }
}

const consultaRoutes=new ConsultasRoutes();
export default consultaRoutes.router;