import { json, Request, Response } from "express";
import db from '../../database';
import { Imenus, IArbol, INavData, IpermisoUsuario } from "../../interfaces/sibes/menu.interface";
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
            const result: Imenus[] = await db.querySelect("SELECT a.* FROM sibes_menus a INNER JOIN sibes_menus_usuarios b ON a.idmenu=b.idmenu WHERE b.login=$1 AND b.estatus='ACTIVO' ORDER BY a.orden, a.idmenu, a.idpadre",[req.params.user]);
            
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

    public async permisosUsuario (req: Request, res: Response): Promise<void> { 
        const decodedUrl = decodeURIComponent(req.params.urlmenu); 
        const login = req.params.user;
        console.log(decodedUrl);
        const query: string = `select b.*, a.name, a.url from sibes_menus_usuarios b INNER JOIN sibes_menus a ON b.idmenu=a.idmenu WHERE b.login='${login}' AND url='${decodedUrl}' AND b.estatus='ACTIVO'`;
        console.log(query);
        try {
            const result: IpermisoUsuario[] = await db.querySelect(query);
            
            if (!result){
                res.status(200).json('no encontrado');
            }
            else{                  
                
                res.status(201).json(result[0]);
            }
            
        } catch (e) {
            console.log(e);
           res.status(500).json('Internal Server error');
        }        
    }

}

export const menuController = new MenusController();