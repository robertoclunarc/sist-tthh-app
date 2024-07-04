import { json, Request, Response } from "express";
import db from '../../database';
import { Imenus, IArbol, INavData } from "../../interfaces/sibes/menu.interface";
import {generarMenu} from '../../middlewares/menu.middleware'

class MenusController{ 

    public async menusAll (req: Request, res: Response): Promise<void> {
        
        try {
            const result: Imenus[] = await db.querySelect("SELECT * FROM sibes_menus order by orden, idmenu, idpadre");
            
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                   
                const tree: IArbol[]= await generarMenu(result);
                res.status(201).json(tree);
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

    public async menusUsuario (req: Request, res: Response): Promise<void> {
        
        try {
            const result: Imenus[] = await db.querySelect("SELECT a.* FROM sibes_menus a INNER JOIN sibes_menus_usuarios b ON a.idmenu=b.idmenu WHERE b.login=$1 ORDER BY a.orden, a.idmenu, a.idpadre",[req.params.user]);
            
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{
                   
                const tree: IArbol[]= await generarMenu(result);
                res.status(201).json(tree);
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }

}

export const menuController = new MenusController();