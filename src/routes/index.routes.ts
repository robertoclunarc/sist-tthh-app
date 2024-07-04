import {Router} from 'express';
import {indexController} from '../controllers/index.controller';


class indexRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/', indexController.index );
        
    }
}

const indxRoutes=new indexRoutes();
export default indxRoutes.router;