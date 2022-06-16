# User-Web-Client

The user-web-client is a user facing web application of the Copernicus Reference System (COPRS), intended to be used by a person to query products in a catalog and display them on a map (where applicable).

It connects to the PRIP interface via OData in order to retrieve its data.

![user-web-client](./user-web-client.png "user-web-client")

## Configuration

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
