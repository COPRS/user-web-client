export interface IAppConfig {
  apiUrl: string;
  mapBackgrounds: IAppConfigMapBackgrounds[];
  keycloak: IAppConfigKeycloak;
  mapView: IAppConfigMapView;
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

export interface IAppConfigMapView {
  selectionFillColor: string;
  selectionStrokeColor: string;
}
