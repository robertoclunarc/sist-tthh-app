import {Router} from 'express';
import { mensualidadsController } from '../../controllers/sibes/mensualidades.controller';
class MensualidadesRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/:id/:fkinscripcion', mensualidadsController.mensualidadfilter);
        this.router.put('/update/:IdReg', mensualidadsController.updateRecord);
        this.router.delete('/delete/:IdReg', mensualidadsController.deleteRecord);
        this.router.post('/insert', mensualidadsController.createRecord);
    }
}

const mensualidadRoutes=new MensualidadesRoutes();
export default mensualidadRoutes.router;