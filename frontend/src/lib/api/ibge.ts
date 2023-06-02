type Region = {
	id: number;
	sigla: string;
	nome: string;
};

type UF = {
	id: number;
	sigla: string;
	nome: string;
	regiao: Region;
};

type Mesoregion = {
	id: number;
	nome: string;
	UF: UF;
};

type Microregion = {
	id: number;
	nome: string;
	mesorregiao: Mesoregion;
};

type IntermediaryRegion = {
	id: number;
	nome: string;
	UF: UF;
};

type ImmediateRegion = {
	id: number;
	nome: string;
	"regiao-intermediaria": IntermediaryRegion;
};

type City = {
	id: number;
	nome: string;
	microrregiao: Microregion;
	"regiao-imediata": ImmediateRegion;
};

export const getUFs = async () => {
	const ufsRes = await fetch(
		"https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
	);

	return ufsRes.json() as Promise<UF[]>;
};

export const getCities = async (uf: string) => {
	const citiesRes = await fetch(
		`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
	);

	return citiesRes.json() as Promise<City[]>;
};
