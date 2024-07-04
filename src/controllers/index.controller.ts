import { Request,  Response  } from 'express';

class IndexController{
    public index (req: Request, res: Response) {
        res.json({text: 'los APIs estan en /sist_tthh/api'})
    }
}

export const indexController = new IndexController();