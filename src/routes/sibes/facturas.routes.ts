import {Router} from 'express';
import { facturaController } from '../../controllers/sibes/facturas.controller';
class ConsultasRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/detalle/:iddetfactura/:fkfactura', facturaController.detFacturaFilter);         
        this.router.get('/filtrar/:idfactura/:nroFactura/:fechaFacturaIni/:fechaFacturaFin/:idColegio/:trabajador/:fechaEntregaIni/:fechaEntregaFin/:condlogica', facturaController.facturafilter);        
        this.router.put('/update/:IdReg', facturaController.updateRecordFactura); 
        this.router.put('/update/detalle/:IdReg', facturaController.updateRecordDetFactura);        
        this.router.delete('/delete/:IdReg', facturaController.deleteRecordFactura);
        this.router.delete('/delete/detalle/:IdReg', facturaController.deleteRecordDetFactura);
        this.router.post('/insert', facturaController.createRecordFactura);
        this.router.post('/insert/detalle', facturaController.createRecordDetFactura);
        this.router.post('/insert/beneficiario', facturaController.createRecordFacturaBeneficiario);
    }
}

const consultaRoutes=new ConsultasRoutes();
export default consultaRoutes.router;