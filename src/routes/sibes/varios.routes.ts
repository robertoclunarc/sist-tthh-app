import {Router} from 'express';
import {varController} from '../../controllers/sibes/varios.controller';
class variosRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }

    config(): void{        
        this.router.get('/prueba/', varController.prueba);       
        this.router.get('/generar/serie/:inicio/:fin/:interval/:formato', varController.generateSeries);        
    }
}

const varRoutes=new variosRoutes();
export default varRoutes.router;