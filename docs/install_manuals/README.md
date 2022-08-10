:arrow_heading_up: Go back to the [User Web Client Documentation](../README.md) :arrow_heading_up:

# COPRS-UWC-IM RS UWC Installation Manual

## Deploy

In order to deploy the User Web Client on your cluster, you can utilize helm to install the chart. This can be done by using the following command:
``helm install rs-helm/rs-user-web-client --version <VERSION>``

For more information about available parameters for the helm chart, see the configuration below.

## Configuration

### Helm configuration

The User Web Client is using the interface to the DDIP in order to provide the user a graphical interface to explore the products stored within the Reference System.


| Name                              | Description                                              | Default |
| ----------------------------------|----------------------------------------------------------|---------|
| `env.apiUrl` | The URL to the endpoint that shall be used as backend to query the products | `http://coprs.werum.de/prip/odata/v1/Products`|
| `env.mapBackground` | Allows to define as JSON the different background layers that shall be used | `"[{\"name\":\"TESTING\",\"layers\":[{\"url\":\"testing_url\",\"layerName\":\"LayerName\"}]}]"` |
| `baseHref` | Defines the HRef used within the baseHref used by the UWC | `/uwc/` |
| `keycloak` | Allows setting the information about the keycloak endpoint, realm and clientid that shall be used by the UWC | `"{\"url\":\"http://localhost:8080/auth\",\"realm\":\"master\",\"clientId\": \"user-web-client\"}` |

### Environment variables

The user-web-client configuration consists of two environment variables:

**NOTE:**
For a JSON configuration object, take care of a proper encoding/escaping of special characters when adding or editing these setting to the configuration.

| Environment Variable Name | Example                                                                                                                                                                                                                                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API_URL                   | http://prip.some.host:4711/odata/v1/Products                                                                                                                                                                                                                                                      | A plain text url containing the URL to the PRIP/DDIP Products Endpoint.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| MAP_BACKGROUNDS           | `[{"name":"Terrain + Overlay","layers":[{"url":"https://tiles.esa.maps.eox.at/wms","layerName":"terrain_3857"}]}]`                                                                                                                                                                                | A text string containing a JSON configuration object. See TypeScript interface definition file for details [IAppConfig.ts (IAppConfigMapBackgrounds)](./src/app/services/models/IAppConfig.ts).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| BASE_HREF                 | `/uwc/` (default: /)                                                                                                                                                                                                                                                                              | (optional) <br /> When the user-web-client is deployed on a sub-path, this option is mandatory. For example, when the full URL is `https://rs-domain.net/web-client` the $BASE_HREF must to be set to `/web-client/`. If it is deployed on the root `https://rs-domain.net` this setting can be ignored.                                                                                                                                                                                                                                                                                                                                                                                                           |
| KEYCLOAK                  | `{"url":"http://localhost:8080/auth","realm":"master","clientId": "user-web-client"}`                                                                                                                                                                                                             | A text string containing a JSON configuration object. See TypeScript interface definition file for details [IAppConfig.ts (IAppConfigKeycloak)](./src/app/services/models/IAppConfig.ts).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| MAP_VIEW                  | `{"regionSelectionFillColor":"rgba(255,155,51,0.3)", "regionSelectionStrokeColor":"rgba(255,155,51,0.6)",` `"selectionFillColor":"rgba(0,114,163,0.3)", selectionStrokeColor":"rgba(0,114,163,0.6)",` `"highlightFillColor":"rgba(50,211,63,0.3)", "highlightStrokeColor":"rgba(50,211,63,0.8)"}` | A text string containing a JSON configuration object. See TypeScript interface definition file for details [IAppConfig.ts (IAppConfigMapView)](./src/app/services/models/IAppConfig.ts). <br /> Configure the _regionSelectionFillColor_ and _regionSelectionStrokeColor_ to set the color of the user-defined region search filter, the _selectionFillColor_ and _selectionStrokeColor_ to set the color of the selected footprints and the _highlightFillColor_ and _highlightStrokeColor_ to set the color of the footprint currently selected to view the details. The color can be defined using CSS Color Names (see [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/color#examples)) . |
| FILTER_CONFIG             | `[{"attributeName":"PublicationDate","valueType":"date"}]` (default: [])                                                                                                                                                                                                                          | (optional) <br /> A text string containing a JSON configuration object. See TypeScript interface definition file for details [IAppConfig.ts (IAppFilterConfig)](./src/app/services/models/IAppConfig.ts).<br /> The "_attributeName_" corresponds to the attributes available on the catalog.<br /> The available "_valueType_" values are: string, date, double, long and boolean.                                                                                                                                                                                                                                                                                                                                |
### Example Kubernetes

values.yaml

```yaml
env:
  # PRIP API URL
  apiUrl: http://YOUR_PUBLIC_PRIP_HOST:YOUR_PUBLIC_PRIP_PORT/odata/v1/Products
  # EOX map configuration
  mapBackgrounds: |
    "[{\"name\":\"YOUR_CUSTOM_MAP_NAME\",\"layers\":[{\"url\":\"TYLING_SERVER_BACKEND_URL\",\"layerName\":\"CHOSEN_TYLING_LAYER\"}]}]"
  # Keycloak configuration
  keycloak: |
    "{\"url\":\"KEYCLOAK_AUTH_ENDPOINT\",\"realm\":\"KEYCLOAK_REALM\",\"clientId\": \"CLIENT_ID\"}
  mapView: |
    "{\"regionSelectionFillColor\":\"CSS_COLOR_STRING,\"regionSelectionStrokeColor\":\"CSS_COLOR_STRING,\"selectionFillColor\":\"CSS_COLOR_STRING\",\"selectionStrokeColor\":\"CSS_COLOR_STRING\",\"highlightFillColor\":\"CSS_COLOR_STRING\",\"highlightStrokeColor\":\"CSS_COLOR_STRING\"}"
  filterConfig: |
    "[{\"attributeName\":\"ATTRIBUTE_NAME",\"valueType\":\"VALUE_TYPE\"}]"
```

values.yaml (practical example)

```yaml
env:
  # PRIP API URL
  apiUrl: http://prip.some.host:4711/odata/v1/Products
  # EOX map configuration
  mapBackgrounds: |
    "[{\"name\":\"Terrain + Overlay\",\"layers\":[{\"url\":\"https://tiles.esa.maps.eox.at/wms\",\"layerName\":\"terrain_3857\"},{\"url\":\"https://tiles.esa.maps.eox.at/wms\",\"layerName\":\"overlay_bright_3857\"}]}]"
  # Keycloak configuration
  keycloak: |
    "{\"url\":\"http://localhost:8080/auth\",\"realm\":\"master\",\"clientId\": \"user-web-client\"}"
  # Map View configuration
  mapView: |
    "{\"regionSelectionFillColor\":\"rgba(255,155,51,0.3)\",\"regionSelectionStrokeColor\":\"rgba(255,155,51,0.6)\",\"selectionFillColor\":\"rgba(0, 114, 163, 0.3)\",\"selectionStrokeColor\":\"rgba(0, 114, 163, 0.6)\",\"highlightFillColor\":\"rgba(50, 211, 63, 0.3)\",\"highlightStrokeColor\":\"rgba(50, 211, 63, 0.8)\"}"
  filterConfig: |
    "[{\"attributeName\":\"PublicationDate",\"valueType\":\"date\"}]"
```
