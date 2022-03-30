export interface IAppConfig {
  apiUrl: string;
  mapBackgrounds: IAppConfigMapBackgrounds[];
  keycloak: IAppConfigKeycloak;
}

export interface IAppConfigMapBackgrounds {
  name: string;
  layers: { url: string; layerName: string }[];
}

export interface IAppConfigKeycloak {
  url: string;
  realm: string;
  clientId: string;
}
