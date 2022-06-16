export interface IAppConfig {
  apiUrl: string;
  mapBackgrounds: IAppConfigMapBackgrounds[];
  keycloak: IAppConfigKeycloak;
  mapView: IAppConfigMapView;
  filterConfig: IAppFilterConfig[];
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
  regionSelectionFillColor: string;
  regionSelectionStrokeColor: string;
  selectionFillColor: string;
  selectionStrokeColor: string;
  highlightFillColor: string;
  highlightStrokeColor: string;
}

export interface IAppFilterConfig {
  attributeName: string;
  valueType: IAppFilterConfigValueType;
}

export type IAppFilterConfigValueType =
  | 'string'
  | 'date'
  | 'double'
  | 'long'
  | 'boolean';
