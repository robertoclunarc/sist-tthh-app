export interface Imenus
{
    idmenu?: number;
	idpadre?: number;
    name?: string;
    url?: string;
    href?: string;
    icon?: string;
    badge_text?: string;
	badge_variant?: string;
	badge_class?: string;
    title?: boolean;
    variant?: string;
    attributes?: string;
	attributes_element?: string;
    divider?: boolean,
    class?: string;
    label_class?: string;
	label_variant?: string;
    wrapper_attributes?: string;
	wrapper_element?: string;
    linkprops?: string;
    estatus?: boolean;
    orden?: number
}

export interface IArbol {
    data?: Imenus;
    children?: IArbol[];
}
/////////////////////////////////////////////////////////////////////////////////////////////
 interface INavAttributes {
    [propName: string]: any;
}
interface INavWrapper {
    attributes?: INavAttributes;
    element?: string;
}
 interface INavBadge {
    text?: string;
    variant?: string;
    class?: string;
}
 interface INavLabel {
    class?: string;
    variant?: string;
}
 interface INavLinkProps {
    queryParams?: {
        [k: string]: any;
    };
    fragment?: string;
    queryParamsHandling?: 'merge' | 'preserve' | '';
    preserveFragment?: boolean;
    skipLocationChange?: boolean;
    replaceUrl?: boolean;
    state?: {
        [k: string]: any;
    };
    routerLinkActiveOptions?: {
        exact: boolean;
    };
    routerLinkActive?: string | string[];
}
export interface INavData {
    name?: string;
    url?: string | any[];
    href?: string;
    icon?: string;
    badge?: INavBadge;
    title?: boolean;
    children?: INavData[];
    variant?: string;
    attributes?: INavAttributes;
    divider?: boolean;
    class?: string;
    label?: INavLabel;
    wrapper?: INavWrapper;
    linkProps?: INavLinkProps;
}