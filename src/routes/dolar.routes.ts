import {Router} from 'express';
import { precioDolarController } from '../controllers/dolar.controller';
class PreciosRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/:id/:fecha', precioDolarController.preciosDolarfilter);
        this.router.get('/bcv', precioDolarController.dolarToDay);
        this.router.put('/update/:IdReg', precioDolarController.updateRecord);
        this.router.delete('/delete/:IdReg', precioDolarController.deleteRecord);
        this.router.post('/insert', precioDolarController.createRecord);
    }
}

const precioRoutes=new PreciosRoutes();
export default precioRoutes.router;