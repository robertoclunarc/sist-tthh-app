import { Request,  Response  } from 'express';
import db from '../../database';
import { validatePassword} from '../../middlewares/password';
import { Iusuarios } from '../../interfaces/sibes/varios.interface';

class LoginController{
    public async logear (req: Request, res: Response): Promise<void> {
        const user: string = req.body.login;
        const passw: string = req.body.passw;
        console.log(user);
        console.log(passw);
        try {
            const result= await db.querySelect('SELECT * FROM usuarios WHERE login_username=$1', [user]);            
            if (result.length===0){                
                res.status(200).json({error: "Usuario No Encontrado"});
            }
            else{
                const user: Iusuarios = result[0];
                if (user.login_userpass){
                    if (await validatePassword(passw, user.login_userpass))  
                    {
                        if (user.estatus=='ACTIVO'){
                            console.log(user.login_username, 'logeado');
                            res.status(200).json(user);
                        }else{
                            
                            res.status(200).json({error: `Usuario  ${user.estatus}`});
                        }                    
                    }else{
                        res.status(200).json({error: 'Clave Incorrecta'});
                    }
                }
            }
            
        } catch (e) {
           console.error(e);
           res.status(500).json('Internal Server error');
        }
        
    }    

    public async usuariosFiltrados (req: Request, res: Response): Promise<void> {
        const trabajador: string = req.params.trabajador
        
        try {
            const result: Iusuarios[] = await db.querySelect('SELECT * FROM usuarios WHERE trabajador=$1', [trabajador]);
            
            if (!result){
                res.status(200).json('usuario no encontrado');
            }
            else{                
                   res.status(200).json(result);                                      
                }            
            
        } catch (e) {
           console.log(e);
           res.status(500).json('Internal Server error');
        }
        
    }
}

export const loginController = new LoginController();