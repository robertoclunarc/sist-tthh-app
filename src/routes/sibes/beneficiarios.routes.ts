import {Router} from 'express';
import { beneficiariosController } from '../../controllers/sibes/beneficiarios.controller';
class BeneficiariosRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/:id/:nombre/:nombrebeneficiario/:cedula/:trabajador/:sexo/:grado/:nivelEduc/:edadIni/:edadFin/:condlogica', beneficiariosController.beneficiariofilter);
        this.router.put('/update/:IdReg', beneficiariosController.updateRecord);
        this.router.delete('/delete/:IdReg', beneficiariosController.deleteRecord);
        this.router.post('/insert', beneficiariosController.createRecord);
    }
}

const beneficiosRoutes=new BeneficiariosRoutes();
export default beneficiosRoutes.router;
