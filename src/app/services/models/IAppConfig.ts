export interface IAppConfig {
  apiUrl: string;
  mapBackgrounds: IAppConfig_MapBackgrounds[];
}

export interface IAppConfig_MapBackgrounds {
  name: string;
  layers: { url: string; layerName: string }[];
}
