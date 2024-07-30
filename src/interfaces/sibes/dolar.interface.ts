export interface IMonitor
{
	change?: number,
	color?: string,
	image?: string,
	last_update?: string,
	percent?: number,
	price?: number,
	price_old?: number,
	symbol?: string,
	title?: string,
}

export interface IPrecios_dolar {
	idpreciodolar?: number,
	price?: string,
	last_update?: string,
	estatus?: string,
	title?: string,
}