CREATE TABLE IF NOT EXISTS public.sibes_beneficiarios
(
    idbeneficiario serial NOT NULL,
    trabajador character varying(10) COLLATE pg_catalog."default" NOT NULL,
    fecha_nac date NOT NULL,
    sexo_beneficiario character(1) COLLATE pg_catalog."default" NOT NULL,
    pago_colegio boolean,
    estatus_beneficio character varying(10) COLLATE pg_catalog."default" NOT NULL,
    nombre_beneficiario character varying(80) COLLATE pg_catalog."default" NOT NULL,
    cedula character varying(10) COLLATE pg_catalog."default",
    grado_escolarizacion character varying(25) COLLATE pg_catalog."default",
    nivel_educativo character varying(25) COLLATE pg_catalog."default",
    CONSTRAINT sibes_beneficiarios_pkey PRIMARY KEY (idbeneficiario),
    CONSTRAINT sibes_beneficiarios_trabajador_fkey FOREIGN KEY (trabajador)
        REFERENCES public.trabajadores (trabajador) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.trabajadores
(
    trabajador character varying(10) COLLATE pg_catalog."default" NOT NULL,
    registro_fiscal character varying(20) COLLATE pg_catalog."default",
    nombre character varying(100) COLLATE pg_catalog."default",
    sexo character(1) COLLATE pg_catalog."default",
    fecha_nacimiento date,
    domicilio character varying(40) COLLATE pg_catalog."default",
    domicilio2 character varying(40) COLLATE pg_catalog."default",
    poblacion character varying(50) COLLATE pg_catalog."default",
    estado_provincia character varying(30) COLLATE pg_catalog."default",
    pais character varying(30) COLLATE pg_catalog."default",
    codigo_postal character varying(10) COLLATE pg_catalog."default",
    calles_aledanas character varying(80) COLLATE pg_catalog."default",
    telefono_particular character varying(20) COLLATE pg_catalog."default",
    reg_seguro_social character varying(15) COLLATE pg_catalog."default",
    domicilio3 character varying(40) COLLATE pg_catalog."default",
    e_mail character varying(100) COLLATE pg_catalog."default",
    fkunidad integer,
    tipo_documento character(1) COLLATE pg_catalog."default",
    nombres character varying(50) COLLATE pg_catalog."default",
    apellidos character varying(50) COLLATE pg_catalog."default",
    edo_civil character(1) COLLATE pg_catalog."default",
    CONSTRAINT llave_principal_trabajador PRIMARY KEY (trabajador)
)

CREATE TABLE IF NOT EXISTS public.usuarios
(
    login_username character varying(6) COLLATE pg_catalog."default" NOT NULL,
    trabajador character varying(10) COLLATE pg_catalog."default" NOT NULL,
    estatus character varying(10) COLLATE pg_catalog."default" NOT NULL,
    nivel integer NOT NULL,
    fecha_ultima_sesion timestamp without time zone,
    login_userpass character varying(32) COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default",
    CONSTRAINT user_key PRIMARY KEY (login_username),
    CONSTRAINT email_unico UNIQUE (email),
    CONSTRAINT llave_foranea_usuarios FOREIGN KEY (trabajador)
        REFERENCES public.trabajadores (trabajador) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.sibes_colegios
(
    idcolegio serial NOT NULL,
    rif_colegio character varying(12) COLLATE pg_catalog."default",
    nombre_colegio character varying(100) COLLATE pg_catalog."default",
    estatus_colegio character varying(10) COLLATE pg_catalog."default",
    direccion_colegio character varying(1000) COLLATE pg_catalog."default",
    localidad_colegio character varying(50) COLLATE pg_catalog."default",
    tipo_administracion character varying(25) COLLATE pg_catalog."default",
    provincia character varying(25) COLLATE pg_catalog."default",
    CONSTRAINT sibes_colegios_pkey PRIMARY KEY (idcolegio)
)

CREATE TABLE IF NOT EXISTS public.sibes_menus
(
    idmenu serial NOT NULL,
    idpadre integer,
    name character varying(100) COLLATE pg_catalog."default",
    url character varying(200) COLLATE pg_catalog."default",
    href character varying(200) COLLATE pg_catalog."default",
    icon character varying(200) COLLATE pg_catalog."default",
    badge_text character varying(100) COLLATE pg_catalog."default",
    badge_variant character varying(100) COLLATE pg_catalog."default",
    badge_class character varying(100) COLLATE pg_catalog."default",
    variant character varying(100) COLLATE pg_catalog."default",
    attributes character varying(100) COLLATE pg_catalog."default",
    attributes_element character varying(100) COLLATE pg_catalog."default",
    divider boolean,
    class character varying(100) COLLATE pg_catalog."default",
    label_class character varying(100) COLLATE pg_catalog."default",
    label_variant character varying(100) COLLATE pg_catalog."default",
    wrapper_attributes character varying(100) COLLATE pg_catalog."default",
    wrapper_element character varying(100) COLLATE pg_catalog."default",
    linkprops character varying(300) COLLATE pg_catalog."default",
    title boolean,
    estatus boolean,
    orden integer,
    CONSTRAINT tbl_menus_pkey PRIMARY KEY (idmenu)
)

CREATE TABLE IF NOT EXISTS public.sibes_menus_usuarios
(
    idmenu integer NOT NULL,
    login character varying(6) COLLATE pg_catalog."default" NOT NULL,
    pupdate boolean NOT NULL,
    pinsert boolean NOT NULL,
    pdelete boolean,
    pselect boolean
)

CREATE TABLE IF NOT EXISTS public.sibes_inscripciones
(
    idinscripcion serial NOT NULL,
    fkbeneficiario integer NOT NULL,
    fkcolegio integer NOT NULL,
    fecha_inscripcion date NOT NULL,
    anio_escolar integer NOT NULL,
    monto_inscripcion character varying(15) COLLATE pg_catalog."default" NOT NULL,
    monto_mensual character varying(15) COLLATE pg_catalog."default" NOT NULL,
    login_registro character varying(6) COLLATE pg_catalog."default",
    fecha_registro timestamp without time zone,
    estatus_inscripcioin character varying(10) COLLATE pg_catalog."default",
    mes_inicio integer NOT NULL,
    fecha_modificacion timestamp without time zone,
    login_modificacion character varying(6) COLLATE pg_catalog."default",
    tasa_cambio character varying(6) COLLATE pg_catalog."default",
    grado_escolarizacion character varying(25) COLLATE pg_catalog."default",
    nivel_educativo character varying(25) COLLATE pg_catalog."default",
    CONSTRAINT sibes_inscripciones_pkey PRIMARY KEY (idinscripcion),
    CONSTRAINT sibes_inscripciones_fkbeneficiario_fkey FOREIGN KEY (fkbeneficiario)
        REFERENCES public.sibes_beneficiarios (idbeneficiario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT sibes_inscripciones_fkcolegio_fkey FOREIGN KEY (fkcolegio)
        REFERENCES public.sibes_colegios (idcolegio) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.sibes_mensualidades
(
    idmensualidad serial NOT NULL,
    fkinscripcion integer NOT NULL,
    monto_inscripcion character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_09 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_10 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_11 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_12 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_01 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_02 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_03 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_04 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_05 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_06 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_07 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    mes_08 character varying(15) COLLATE pg_catalog."default" NOT NULL,
    deuda character varying(15) COLLATE pg_catalog."default" NOT NULL,
    pagado character varying(15) COLLATE pg_catalog."default" NOT NULL,
    ultimo_mes_pagado integer DEFAULT 0,
    monto_ultimo_mes character varying(15) COLLATE pg_catalog."default" NOT NULL,
    fecha_ult_pago date,
    pago_prox character varying(15) COLLATE pg_catalog."default" NOT NULL,
    estatus character varying(10) COLLATE pg_catalog."default",
    fecha_modificacion timestamp without time zone,
    login_modificacion character varying(6) COLLATE pg_catalog."default",
    tasa_cambio character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes01 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes02 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes03 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes04 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes05 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes06 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes07 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes08 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes09 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes10 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes11 character varying(6) COLLATE pg_catalog."default",
    tasacambio_mes12 character varying(6) COLLATE pg_catalog."default",
    CONSTRAINT sibes_mensualidades_pkey PRIMARY KEY (idmensualidad),
    CONSTRAINT sibes_mensualidades_fkinscripcion_fkey FOREIGN KEY (fkinscripcion)
        REFERENCES public.sibes_inscripciones (idinscripcion) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.sibes_facturas
(
    idfactura serial NOT NULL,
    nro_factura character varying(10) COLLATE pg_catalog."default" NOT NULL,
    fecha_factura date NOT NULL,
    monto_total character varying(15) COLLATE pg_catalog."default" NOT NULL,
    subtotal character varying(15) COLLATE pg_catalog."default" NOT NULL,
    iva character varying(6) COLLATE pg_catalog."default" NOT NULL,
    fkcolegio integer NOT NULL,
    login_registro character varying(6) COLLATE pg_catalog."default" NOT NULL,
    fecha_registro timestamp without time zone NOT NULL,
    fecha_modificacion timestamp without time zone,
    login_modificacion character varying(6) COLLATE pg_catalog."default",
    tasa_cambio character varying(6) COLLATE pg_catalog."default",
    fecha_entrega_rrhh timestamp without time zone NOT NULL,
    trabajador character varying(10) COLLATE pg_catalog."default",
    estatus character varying(15) COLLATE pg_catalog."default",
    periodopago character varying(25) COLLATE pg_catalog."default",
    CONSTRAINT sibes_facturas_pkey PRIMARY KEY (idfactura),
    CONSTRAINT sibes_facturas_fkcolegio_fkey FOREIGN KEY (fkcolegio)
        REFERENCES public.sibes_colegios (idcolegio) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.sibes_detfacturas
(
    iddetfactura serial NOT NULL,
    fkfactura integer NOT NULL,
    fkmensualidad integer NOT NULL,
    mes integer,
    monto character varying(15) COLLATE pg_catalog."default" NOT NULL,
    corresponde character varying(15) COLLATE pg_catalog."default",
    fecha_modificacion timestamp without time zone,
    login_modificacion character varying(6) COLLATE pg_catalog."default",
    tasa_cambio character varying(6) COLLATE pg_catalog."default",
    fkbeneficiario integer,
    CONSTRAINT sibes_detfacturas_pkey PRIMARY KEY (iddetfactura),
    CONSTRAINT sibes_detfacturas_fkfactura_fkey FOREIGN KEY (fkfactura)
        REFERENCES public.sibes_facturas (idfactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT sibes_detfacturas_fkmensualidad_fkey FOREIGN KEY (fkmensualidad)
        REFERENCES public.sibes_mensualidades (idmensualidad) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE IF NOT EXISTS public.sibes_facturas_beneficiarios
(
    idfacturabenf integer NOT NULL DEFAULT nextval('sibes_facturas_beneficiarios_idfacturabenf_seq'::regclass),
    fkfactura integer NOT NULL,
    fkbeneficiario integer NOT NULL,
    CONSTRAINT sibes_facturasbeneficiarios_pkey PRIMARY KEY (idfacturabenf),
    CONSTRAINT sibes_facturas_fkey FOREIGN KEY (fkfactura)
        REFERENCES public.sibes_facturas (idfactura) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT sibes_facturasbenef_fkey FOREIGN KEY (fkbeneficiario)
        REFERENCES public.sibes_beneficiarios (idbeneficiario) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

CREATE TABLE public.sibes_niveles_educacion
(
    idnivel serial NOT NULL,
    descripcion character varying(25),
    estatus character varying(10),    
    CONSTRAINT sibes_niveles_educacion_pkey PRIMARY KEY (idnivel)
)

CREATE TABLE public.sibes_grados_escolarizacion
(
    idgrado serial NOT NULL,
    descripcion character varying(25),
    estatus character varying(10),    
    CONSTRAINT sibes_grados_escolarizacion_pkey PRIMARY KEY (idgrado)
)

insert into sibes_niveles_educacion (descripcion,estatus) values
('PRE-ESCOLAR','ACTIVO'),
('PRIMARIA','ACTIVO'),
('SECUNDARIA','ACTIVO'),
('DIVERSIFICADO','ACTIVO')

insert into sibes_grados_escolarizacion (descripcion,estatus) values
('1er Nivel','ACTIVO'),
('2do Nivel','ACTIVO'),
('3er Nivel','ACTIVO'),
('1er Grado','ACTIVO'),
('2do Grado','ACTIVO'),
('3er Grado','ACTIVO'),
('4to Grado','ACTIVO'),
('5to Grado','ACTIVO'),
('6to Grado','ACTIVO'),
('7mo Grado','ACTIVO'),
('8vo Grado','ACTIVO'),
('9no Grado','ACTIVO'),
('4to Año','ACTIVO'),
('5to Año','ACTIVO'),
('6to Año','ACTIVO');

ALTER TABLE sibes_menus_usuarios
ADD export boolean;
update sibes_menus_usuarios set export=true;

alter table sibes_menus_usuarios add column estatus varchar(10);
update public.sibes_menus_usuarios set estatus='ACTIVO';

ALTER TABLE public.sibes_inscripciones
ALTER COLUMN fecha_registro SET DEFAULT CURRENT_TIMESTAMP;

create table precios_dolar (
	idpreciodolar serial not null,
	price varchar (15),
	last_update varchar (25),
	estatus varchar (25),
	title varchar (25),
	CONSTRAINT sibes_idpreciodolar_pkey PRIMARY KEY (idpreciodolar)
)
	ALTER TABLE precios_dolar
ALTER COLUMN estatus SET DEFAULT 'ACTIVO';

CREATE OR REPLACE FUNCTION validate_last_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Verificar si ya existe un registro con el mismo valor de last_update
  IF EXISTS (SELECT 1 FROM precios_dolar WHERE last_update = NEW.last_update) THEN
    -- Si existe, no hacer nada (evitar la inserción)
    RETURN NULL;
  ELSE
    -- Si no existe, proceder con la inserción
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_precios_dolar
BEFORE INSERT ON precios_dolar
FOR EACH ROW
EXECUTE FUNCTION validate_last_update();

CREATE TABLE public.provincias
(
    idprovincia serial NOT NULL,
    provincia character varying(25)
)

insert into provincias (provincia) values 
	('Bolivar'),
('Amazonas'),
	('Anzoategui'),
	('Apure'),
	('Aragua'),
	('Barinas'),	
	('Carabobo'),
	('Cojedes'),
	('Delta Amacuro'),
	('Distrito Capital'),
	('Falcon'),
	('Guarico'),
	('Lara'),
	('Merida'),
	('Miranda'),
	('Monagas'),
	('Nueva Esparta'),
	('Portuguesa'),
	('Sucre'),
	('Tachira'),
	('Trujillo'),
	('Vargas'),
	('Yaracuy'),
	('Zulia')

CREATE OR REPLACE FUNCTION public.crear_pagos_mensuales()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
enero character varying(15);
febrero character varying(15);
marzo character varying(15);
abril character varying(15);
mayo character varying(15);
junio character varying(15);
julio character varying(15);
agosto character varying(15);
septiembre character varying(15);
octubre character varying(15);
noviembre character varying(15);
diciembre character varying(15);
--fecha_pres_aux date;
vdeuda double precision;
diaadd int;
BEGIN

	 
if new.mes_inicio=9 then
	enero =NEW.monto_mensual;
	febrero =NEW.monto_mensual;
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  =NEW.monto_mensual;
	octubre  =NEW.monto_mensual;
	noviembre  =NEW.monto_mensual;
	diciembre  =NEW.monto_mensual;
	vdeuda=12*NEW.monto_mensual::numeric;

elsif new.mes_inicio=10 then
	enero =NEW.monto_mensual;
	febrero =NEW.monto_mensual;
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre  =NEW.monto_mensual;
	noviembre  =NEW.monto_mensual;
	diciembre  =NEW.monto_mensual;
	vdeuda=11*NEW.monto_mensual::numeric;

elsif new.mes_inicio=11 then
	enero =NEW.monto_mensual;
	febrero =NEW.monto_mensual;
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  =NEW.monto_mensual;
	diciembre  =NEW.monto_mensual;
	vdeuda=10*NEW.monto_mensual::numeric;

elsif new.mes_inicio=12 then
	enero =NEW.monto_mensual;
	febrero =NEW.monto_mensual;
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  =NEW.monto_mensual;
	vdeuda=9*NEW.monto_mensual::numeric;

elsif new.mes_inicio=1 then
	enero =NEW.monto_mensual;
	febrero =NEW.monto_mensual;
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=8*NEW.monto_mensual::numeric;
elsif new.mes_inicio=2 then
	enero ='0.0';
	febrero =NEW.monto_mensual;
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=7*NEW.monto_mensual::numeric;
elsif new.mes_inicio=3 then
	enero ='0.0';
	febrero  ='0.0';
	marzo =NEW.monto_mensual;
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=6*NEW.monto_mensual::numeric;
elsif new.mes_inicio=4 then
	enero ='0.0';
	febrero  ='0.0';
	marzo ='0.0';
	abril  =NEW.monto_mensual;
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=5*NEW.monto_mensual::numeric;
elsif new.mes_inicio=5 then
	enero ='0.0';
	febrero  ='0.0';
	marzo ='0.0';
	abril  ='0.0';
	mayo =NEW.monto_mensual;
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=4*NEW.monto_mensual::numeric;
elsif new.mes_inicio=6 then
	enero ='0.0';
	febrero  ='0.0';
	marzo ='0.0';
	abril  ='0.0';
	mayo ='0.0';
	junio  =NEW.monto_mensual;
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=3*NEW.monto_mensual::numeric;
elsif new.mes_inicio=7 then
	enero ='0.0';
	febrero  ='0.0';
	marzo ='0.0';
	abril  ='0.0';
	mayo ='0.0';
	junio  ='0.0';
	julio  =NEW.monto_mensual;
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';		
	vdeuda=2*NEW.monto_mensual::numeric;
else 
	enero ='0.0';
	febrero  ='0.0';
	marzo ='0.0';
	abril  ='0.0';
	mayo ='0.0';
	junio  ='0.0';
	julio   ='0.0';
	agosto  =NEW.monto_mensual;
	septiembre  ='0.0';
	octubre   ='0.0';
	noviembre  ='0.0';
	diciembre  ='0.0';
	vdeuda=NEW.monto_mensual::numeric;
end if;

if new.mes_inicio=9 then
    vdeuda = vdeuda + NEW.monto_inscripcion::numeric;
end if;

INSERT INTO sibes_mensualidades(
             fkinscripcion, monto_inscripcion, mes_09, mes_10, 
            mes_11, mes_12, mes_01, mes_02, mes_03, mes_04, mes_05, mes_06, 
            mes_07, mes_08, deuda, pagado, ultimo_mes_pagado, monto_ultimo_mes, 
            pago_prox, estatus, tasa_cambio)
	    VALUES (NEW.idinscripcion, NEW.monto_inscripcion, septiembre, octubre, 
		    noviembre, diciembre, enero, febrero, marzo, abril, mayo, junio, 
		    julio, agosto, vdeuda, '0', 0, '0.0', 
		    'INSCRIPCION', 'ACTIVO', NEW.tasa_cambio);	

 RETURN NEW;
END;
$BODY$;

CREATE TRIGGER sibes_inscripciones_trigger
    AFTER INSERT
    ON public.sibes_inscripciones
    FOR EACH ROW
    EXECUTE PROCEDURE public.crear_pagos_mensuales();

CREATE TRIGGER sibes_detfacturas_trigger
    AFTER INSERT
    ON public.sibes_detfacturas
    FOR EACH ROW
    EXECUTE PROCEDURE public.actualizar_pagos_mensuales();

	insert into public.sibes_menus_usuarios values 
(1, 'matlux', true, true,true,true),
(2, 'matlux', true, true,true,true),
(3, 'matlux', true, true,true,true),
(44, 'matlux', true, true,true,true),
(46, 'matlux', true, true,true,true),
(45, 'matlux', true, true,true,true),
(4, 'matlux', true, true,true,true),
(37, 'matlux', true, true,true,true),
(43, 'matlux', true, true,true,true),
(9, 'matlux', true, true,true,true),
(6, 'matlux', true, true,true,true),
(11, 'matlux', true, true,true,true),
(8, 'matlux', true, true,true,true),
(10, 'matlux', true, true,true,true),
(14, 'matlux', true, true,true,true),
(15, 'matlux', true, true,true,true),
(16, 'matlux', true, true,true,true),
(17, 'matlux', true, true,true,true),
(18, 'matlux', true, true,true,true),
(20, 'matlux', true, true,true,true),
(21, 'matlux', true, true,true,true),
(19, 'matlux', true, true,true,true),
(12, 'matlux', true, true,true,true),
(13, 'matlux', true, true,true,true),
(23, 'matlux', true, true,true,true),
(24, 'matlux', true, true,true,true),
(29, 'matlux', true, true,true,true),
(31, 'matlux', true, true,true,true),
(30, 'matlux', true, true,true,true),
(28, 'matlux', true, true,true,true),
(27, 'matlux', true, true,true,true),
(26, 'matlux', true, true,true,true),
(22, 'matlux', true, true,true,true),
(25, 'matlux', true, true,true,true),
(40, 'matlux', true, true,true,true),
(42, 'matlux', true, true,true,true),
(41, 'matlux', true, true,true,true),
(32, 'matlux', true, true,true,true),
(39, 'matlux', true, true,true,true),
(36, 'matlux', true, true,true,true),
(35, 'matlux', true, true,true,true)


alter table public.sibes_niveles_educacion
add column orden integer;

alter table public.sibes_grados_escolarizacion
add column orden integer;

alter table sibes_detfacturas
	add column descripcion_detfactura varchar(500),
	add column cantidad integer,
	add column precio_unitario character varying(15);

	ALTER TABLE public.sibes_inscripciones
ALTER COLUMN fecha_registro SET DEFAULT CURRENT_TIMESTAMP;


CREATE OR REPLACE FUNCTION public.actualizar_pagos_mensuales()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$

DECLARE
vdeuda double precision;
BEGIN
     
if NEW.corresponde='MENSUALIDAD' then
     
     if new.mes=9 then
        vdeuda=(new.monto*12)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET pagado_mes09=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes09=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=10 then
        vdeuda=(new.monto*11)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET  
           pagado_mes10=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes10=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=11 then
        vdeuda=(new.monto*10)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET  
           pagado_mes11=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes11=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=12 then
        vdeuda=(new.monto*9)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET  
           pagado_mes12=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes12=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=1 then
        vdeuda=(new.monto*8)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET  
           pagado_mes01=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes,
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes01=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=2 then
    vdeuda=(new.monto*7)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET  
           pagado_mes02=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes02=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=3 then
    vdeuda=(new.monto*6)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET  
           pagado_mes03=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes03=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=4 then
    vdeuda=(new.monto*5)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET          
           pagado_mes04=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes04=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=5 then
    vdeuda=(new.monto*4)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET          
           pagado_mes05=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes05=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=6 then
    vdeuda=(new.monto*3)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET          
           pagado_mes06=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes06=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     elsif new.mes=7 then
    vdeuda=(new.monto*2)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET          
           pagado_mes07=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes07=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     else
    vdeuda=(new.monto*1)-new.monto;--la deuda es igual a la cantidad de meses del año a pagar menos el mes que esta pagando
    UPDATE sibes_mensualidades
       SET          
           pagado_mes08=new.monto, deuda=vdeuda, pagado=(pagado::numeric+new.monto::numeric), ultimo_mes_pagado=new.mes, 
           monto_ultimo_mes=new.monto, fecha_ult_pago=now(), pago_prox='MENSUALIDAD', tasacambio_mes08=new.tasa_cambio
     WHERE idmensualidad=new.fkmensualidad;
     end if;
     
else
    UPDATE sibes_mensualidades SET 
    monto_inscripcion= new.monto, 
    pago_prox ='MENSUALIDAD',
    fecha_ult_pago=NOW(), 
    ultimo_mes_pagado=0, 
    deuda = (deuda::numeric - new.monto::numeric),
    pagado = (pagado::numeric + new.monto::numeric),
    tasa_cambio=new.tasa_cambio
    WHERE idmensualidad= new.fkmensualidad;
end if;

 RETURN NEW;
END;
$BODY$;


alter table sibes_mensualidades
    add column pagado_mes09 character varying(15) DEFAULT '0.0',
    add column pagado_mes10 character varying(15) DEFAULT '0.0',
    add column pagado_mes11 character varying(15) DEFAULT '0.0',
    add column pagado_mes12 character varying(15) DEFAULT '0.0',
	add column pagado_mes01 character varying(15) DEFAULT '0.0',
    add column pagado_mes02 character varying(15) DEFAULT '0.0',
    add column pagado_mes03 character varying(15) DEFAULT '0.0',
    add column pagado_mes04 character varying(15) DEFAULT '0.0',
    add column pagado_mes05 character varying(15) DEFAULT '0.0',
    add column pagado_mes06 character varying(15) DEFAULT '0.0',
    add column pagado_mes07 character varying(15) DEFAULT '0.0',
    add column pagado_mes08 character varying(15) DEFAULT '0.0';