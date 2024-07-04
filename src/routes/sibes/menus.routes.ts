import {Router} from 'express';
import { menuController } from '../../controllers/sibes/menu.controller';
class MenusRoutes {

    public router: Router = Router();
    
    constructor(){
        this.config()
    }

    config(): void{
        this.router.get('/consultar', menuController.menusAll);
        this.router.get('/consultar/:user', menuController.menusUsuario);
    }
}

const menuRoutes=new MenusRoutes();
export default menuRoutes.router;