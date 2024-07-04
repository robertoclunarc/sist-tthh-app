import {Router} from 'express';
import { loginController } from '../../controllers/sibes/login.controller';
class variosRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }

    config(): void{
        this.router.post('/', loginController.logear);        
        this.router.get('/usuarios/filtrados/:trabajador', loginController.usuariosFiltrados);
    }
}

const varRoutes=new variosRoutes();
export default varRoutes.router;