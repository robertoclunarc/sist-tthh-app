import {Router} from 'express';
import { trabajadoresController } from '../controllers/trabajadores.controller';
class TrabajadoresRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/consultar', trabajadoresController.trabajadoresAll); 
        this.router.get('/consultar/cedula/:ci', trabajadoresController.trabajadorCedula);
        this.router.get('/subordinados/supervisor/:login', trabajadoresController.trabajadoresPorSigladoSupervisor);
    }
}

const trabajadoresRoutes=new TrabajadoresRoutes();
export default trabajadoresRoutes.router;