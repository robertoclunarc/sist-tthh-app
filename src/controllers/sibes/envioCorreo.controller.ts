import { Request,  Response  } from 'express';
import * as nodemailer from 'nodemailer';
import multer, { StorageEngine } from 'multer';
import db from '../../database';
import path from "path";

let memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'tmp'); // Carpeta temporal donde se guardará el archivo adjunto
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const fileName = uniqueSuffix + path.extname(file.originalname);
      cb(null, fileName); // Nombre único del archivo adjunto
    },
  });

let uploadMemory = multer({ storage: memoryStorage }).single('attachments');
let uploadDisck = multer({ storage: diskStorage  }).single('attachments');

class EnviarCorreo{    

  public async sendFromMemory (req: Request, res: Response): Promise<void> {
    uploadMemory(req, res, (err: any) => {
      if (err) {
        console.error('Error al cargar el archivo:', err);
        res.status(400).json({ message: 'Error al cargar el archivo', error: err });
        return;
      }
      let newPost: any = req.body;
      const jConfig = {
          host: process.env.HOSTEMAILTTHH,
          port: Number(process.env.PORTEMAILTTHH),
          secure:false, 
          auth:{         
          user: process.env.FROMEMAILTTHH, 
          pass: process.env.PASSWEMAILTTHH, 
          },
          tls: {
          rejectUnauthorized: false,
          },
      };
      
      let mailOptions: any;
      const file = req.file;
      if (newPost.html){
        mailOptions = {
          from: newPost.from,
          name: newPost.name,
          to: newPost.to,
          cc: newPost.cc,
          subject: newPost.subject,
          bcc: newPost.bcc,
          html: newPost.html,          
        };
      }else{
        mailOptions = {
          from: newPost.from,
          name: newPost.name,
          to: newPost.to,
          cc: newPost.cc,
          subject: newPost.subject,
          bcc: newPost.bcc,
          text: newPost.text,          
        };
      }
      
      if(req.file){
        mailOptions.attachments = [
          {
            filename: file?.originalname,
            content: file?.buffer,
          },
        ];
      }
      
      try { 
          let mensaje: any;           
          const transporter = nodemailer.createTransport(jConfig);
          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  mensaje = {message: 'Error al enviar el correo electrónico:', error: error};                    
              } else {
                  mensaje = {message: 'Correo electrónico enviado:', info: info.response};
              }
              //console.log(mensaje);
              res.status(200).json(mensaje);
          });
          transporter.close();
      } catch (e) {
          console.error(e);
          res.status(500).json('Internal Server error');
      }      
    })
  }


    
  public async sendFromPath(req: Request, res: Response): Promise<void> {
    uploadDisck(req, res, (err: any) => {
      if (err) {
        console.error('Error al cargar el archivo:', err);
        res.status(400).json({ message: 'Error al cargar el archivo', error: err });
        return;
      }
      let newPost: any = req.body;
      const jConfig = {
        host: process.env.HOSTEMAILSERVICIOMEDICO,
          port: Number(process.env.PORTEMAILSERVICIOMEDICO),
          secure:false, 
          auth:{         
          user: process.env.FROMEMAIL, 
          pass: process.env.PASSWEMAILSERVICIOMEDICO, 
        },
        tls: {
          rejectUnauthorized: false,
        },
      };
      const file = req.file;
      //console.log(file?.path);
      const mailOptions = {
        from: newPost.from,
        name: newPost.name,
        to: newPost.to,
        cc: newPost.cc,
        subject: newPost.subject,
        bcc: newPost.bcc,
        text: newPost.text,
        attachments: [
          {
            filename: file?.filename,
            path: file?.path,
          },
        ],
      };
      console.log(mailOptions);
      try {
        let mensaje: any;
        const transporter = nodemailer.createTransport(jConfig);
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            mensaje = { message: 'Error al enviar el correo electrónico:', error: error };
          } else {
            mensaje = { message: 'Correo electrónico enviado:', info: info.response };
          }
          res.status(200).json(mensaje);
        });
        transporter.close();
      } catch (e) {
        console.log(e);
        res.status(500).json('Internal Server error');
      }
    });
  }

  public async remitentes (req: Request, res: Response): Promise<void> {    
    const valueIsNull = [undefined, 'null', 'NULL', '', , 'undefined'];
    const actividad =  valueIsNull.indexOf(req.params.actividad)  != -1  ? null : req.params.actividad;
    let consulta = "SELECT email FROM tbl_envio_correo ";
    try {
        if (actividad != null){
          consulta += "WHERE actividad='" + actividad + "'";
        }
        const result: any[] = await db.querySelect(consulta);
        let correos: string[]=[];
        for await (const res of result){
          correos.push(res.email);
        }
        if (!result){
            res.status(200).json('mail no encontrado');
        }
        else{                
            res.status(200).json(correos);            
        }        
    } catch (e) {
        console.log(e);
       res.status(500).json('Internal Server error');
    }    
  }
}

export const envioCorreo = new EnviarCorreo();
