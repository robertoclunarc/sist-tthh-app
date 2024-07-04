import { Imenus, IArbol, INavData  } from '../interfaces/sibes/menu.interface';

    let SQLseg_menus: Imenus[];
    
    export const generarMenu = async (datosSQL: Imenus[])=>{
        
        SQLseg_menus = datosSQL;
        
        let arbol: INavData[] = [];
        let nodo: INavData= {};
        let data: INavData;        
        let padres: Imenus[] = obtenerPadres();
        
        padres.forEach(function(value , index) {
            data={};               
            data=restructuraObjeto(value);
            nodo=data;            
            nodo.children = generarMenuItems(value.idmenu) || undefined;
            arbol.push(nodo);
            nodo={};
        });       
        
        return arbol;
    }

    const generarMenuItems = (item?: number) => {        
        let data: INavData;
        
        let NewArbol: INavData = {}
        let nodos: INavData[] = []; 
        
        const  hijos: Imenus[]= obtenerHijos(item);
        
        if (hijos.length == 0) {
            return null;
        }

        hijos.forEach(function(men , index) { 
            data={};            
            data=restructuraObjeto(men);
            NewArbol =  data;            
            NewArbol.children = <INavData[]>generarMenuItems(men.idmenu)  || undefined;
            nodos.push(NewArbol);
            NewArbol = {};
        });
        return nodos;    
    }

    const validaObjeto = (value: any) =>  {
        let data=value;     
        if ((value === null) || (typeof value=== "undefined") || (value === undefined) || (value === "") || (value===false)){ 
            data=undefined;
        }    
        return data;
    }

    const restructuraObjeto = (men: Imenus) =>  {
        let data: INavData={};
        let atributos: any;
        let cleanedAttributeString: any;
        if (validaObjeto(men.attributes)){            
            atributos= `${men.attributes}`;
            cleanedAttributeString = atributos.replace(/'/g, '"');
            
        }
        else{
            atributos=undefined;
            cleanedAttributeString = undefined;
        }

        data={                
            name: validaObjeto(men.name),
            url: validaObjeto(men.url),
            href: validaObjeto(men.href),
            icon: validaObjeto(men.icon),
            badge: { text: validaObjeto(men.badge_text), class: validaObjeto(men.badge_class), variant: validaObjeto(men.badge_variant)  }, //INavBadge;
            title: validaObjeto(men.title),
            //children: men.children, //INavData[];
            variant: validaObjeto(men.variant),
            attributes: atributos !== undefined ? JSON.parse(`{${cleanedAttributeString}}`) : atributos,
            //attributes: [{ propName: validaObjeto(men.attributes) }, { propName: validaObjeto(men.attributes_element) }], //INavAttributes;
            divider: validaObjeto(men.divider),
            class: validaObjeto(men.class),
            label: { class: validaObjeto(men.label_class), variant: validaObjeto(men.label_variant) }, //INavLabel;
            wrapper: { attributes: [{propName: validaObjeto(men.wrapper_attributes)}], element: validaObjeto(men.wrapper_element) }, //INavWrapper;
            linkProps: undefined //INavLinkProps;
        }

        if (validaObjeto(men.badge_text)===undefined && validaObjeto(men.badge_class)===undefined && validaObjeto(men.badge_variant)==undefined){
            data.badge=undefined;
        }

        if (validaObjeto(men.attributes===undefined) && validaObjeto(men.attributes_element)===undefined){
            data.attributes=undefined;
        }

        if (validaObjeto(men.label_class)===undefined && validaObjeto(men.label_variant)===undefined){
            data.label=undefined;
        }

        if (validaObjeto(men.wrapper_attributes)==undefined && validaObjeto(men.wrapper_element)==undefined){
            data.wrapper=undefined;
        }
        return data;
    }

    const obtenerHijos = (padre?: number)=>{
        
        const hijos: Imenus[] = SQLseg_menus.filter((m) => m.idpadre == padre);  
        return hijos;
    }

    const obtenerPadres = () => {       
        const padres: Imenus[] = SQLseg_menus.filter((m) => m.idpadre == 0);        
        return padres;
    }