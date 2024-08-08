import {Router} from 'express';
import { facturaController } from '../../controllers/sibes/facturas.controller';
class ConsultasRoutes {

    public router: Router = Router();

    constructor(){
        this.config()
    }    

    config(): void{
        
        this.router.get('/consultar/detalle/:iddetfactura/:fkfactura', facturaController.detFacturaFilter);
        this.router.get('/filtrar/:idfactura/:nroFactura/:fechaFacturaIni/:fechaFacturaFin/:idColegio/:nombreColegio/:trabajador/:nombreTrabajador/:fechaEntregaIni/:fechaEntregaFin/:estatus/:periodo/:condlogica', facturaController.facturafilter);
        this.router.put('/update/:IdReg', facturaController.updateRecordFactura); 
        this.router.put('/update/detalle/:IdReg', facturaController.updateRecordDetFactura);
        this.router.delete('/delete/:IdReg', facturaController.deleteRecordFactura);
        this.router.delete('/delete/detalle/:IdReg', facturaController.deleteRecordDetFactura);
        this.router.delete('/delete/detalles/all/:IdReg', facturaController.deleteDetIDFactura);
        this.router.post('/insert', facturaController.createRecordFactura);
        this.router.post('/insert/detalle', facturaController.createRecordDetFactura);
        this.router.post('/insert/beneficiario', facturaController.createRecordFacturaBeneficiario);
    }
}

const consultaRoutes=new ConsultasRoutes();
export default consultaRoutes.router;