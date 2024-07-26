import {Router} from 'express';
import { inscripcionsController } from '../../controllers/sibes/inscripciones.controller';
class InscripcionesRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/:id/:fkbeneficiario/:fkcolegio/:anio_escolar', inscripcionsController.inscripcionfilter);
        this.router.get('/consultar/beneficiarios/trabajadores/:trabajador/:nombreTrabajador/:cedula/:nombreBeneficiario/:estatus/:anioEscolar/:condlogica', inscripcionsController.trabajadoresConBeneficiariosInsc);
        this.router.get('/consultar/totalinscripciones', inscripcionsController.totalInscripciones);
        this.router.put('/update/:IdReg', inscripcionsController.updateRecord);
        this.router.delete('/delete/:IdReg', inscripcionsController.deleteRecord);
        this.router.post('/insert', inscripcionsController.createRecord);
    }
}

const inscripcionRoutes=new InscripcionesRoutes();
export default inscripcionRoutes.router;
