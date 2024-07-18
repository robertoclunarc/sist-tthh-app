import express, { Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import db from './database';
import indexRoutes from './routes/index.routes';
import variosRoutes from './routes/sibes/varios.routes';
import logInRoutes from './routes/sibes/login.routes';
import facturasRoutes from './routes/sibes/facturas.routes';
import colegiosRoutes from './routes/sibes/colegios.routes';
import beneficiariosRoutes from "./routes/sibes/beneficiarios.routes";
import inscripcionesRoutes from 'routes/sibes/inscripciones.routes';
import menusRoutes from './routes/sibes/menus.routes';
import correosRoutes  from "./routes/sibes/correos.routes";
import trabajadoresRoutes from './routes/trabajadores.routes';

class Server {
    public app: Application;
    constructor(){
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port',process.env.PORTTTHH || 3250);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
    }

    routes(): void{
        this.app.use(indexRoutes);
        this.app.use('/sist_tthh/api/sibes/varios',variosRoutes);
        this.app.use('/sist_tthh/api/sibes/login', logInRoutes);
        this.app.use('/sist_tthh/api/sibes/menus',menusRoutes);
        this.app.use('/sist_tthh/api/sibes/correo',correosRoutes);
        this.app.use('/sist_tthh/api/facturas',facturasRoutes);
        this.app.use('/sist_tthh/api/colegios',colegiosRoutes);
        this.app.use('/sist_tthh/api/beneficiarios',beneficiariosRoutes);
        this.app.use('/sist_tthh/api/inscripciones',inscripcionesRoutes);
        this.app.use('/sist_tthh/api/trabajadores',trabajadoresRoutes);
    }

    start(): void{
        this.app.listen(this.app.get('port'), () => {
            console.log('server on port: ', this.app.get('port'));
            db.conectarBD();            
        })
    }
}

const server = new Server();
server.start();