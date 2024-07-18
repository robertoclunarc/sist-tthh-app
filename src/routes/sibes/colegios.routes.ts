import {Router} from 'express';
import { colegioController } from '../../controllers/sibes/colegios';
class ColegiosRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/:id/:nombre/:rif/:localidad/:tipo/:condlogica', colegioController.colegiofilter);
        this.router.put('/update/:IdReg', colegioController.updateRecord);
        this.router.delete('/delete/:IdReg', colegioController.deleteRecord);
        this.router.post('/insert', colegioController.createRecord);
    }
}

const colegioRoutes=new ColegiosRoutes();
export default colegioRoutes.router;