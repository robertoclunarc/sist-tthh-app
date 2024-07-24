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
        this.router.get('/permisos/:user/:urlmenu', menuController.permisosUsuario);
    }
}

const menuRoutes=new MenusRoutes();
export default menuRoutes.router;