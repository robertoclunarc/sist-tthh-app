import {Router} from 'express';
import { envioCorreo } from '../../controllers/sibes/envioCorreo.controller';
class CorreosRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{        
        this.router.post('/send/memory',envioCorreo.sendFromMemory);
        this.router.post('/send/path',envioCorreo.sendFromPath);
        this.router.get('/remitentes/:actividad',envioCorreo.remitentes);
    }
}

const correosRoutes=new CorreosRoutes();
export default correosRoutes.router;