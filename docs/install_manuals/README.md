:arrow_heading_up: Go back to the [User Web Client Documentation](../README.md) :arrow_heading_up:

# COPRS-UWC-IM RS UWC Installation Manual

## Installation Requirements

The User Web Client requires an endpoint of the RS access management component (KeyCloak) that is configured so that user can be authenticated. Before installing it, it will be required to have an instance of it running. It is available in the Infrastrcture layer of the COPRS. Further information on how to use the infrastructure and how to deploy it, can be found [here](https://github.com/COPRS/infrastructure)

## How to deploy

In order to deploy the User Web Client on your cluster, you can utilize helm to install the chart. This can be done by using the following command:
`helm install rs-helm/rs-user-web-client --version <VERSION>`

For more information about available parameters for the helm chart, see the configuration below.

## Configuration

### Helm configuration

The User Web Client is using the interface to the DDIP in order to provide the user a graphical interface to explore the products stored within the Reference System.

| Name                 | Description                                                                                                                                                                                                                                                                                                                                                                            | Value Example                                                                                                                                                                                                                                                                                                                               |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env.apiUrl`         | The URL to the endpoint that shall be used as backend to query the products.                                                                                                                                                                                                                                                                                                           | `https://endpoint.server/prip/odata/v1/Products` (mandatory)                                                                                                                                                                                                                                                                                |
| `env.mapBackgrounds` | Allows to define as JSON the different background layers that shall be used.                                                                                                                                                                                                                                                                                                           | `"[{\"name\":\"Terrain + Overlay\",\"layers\":[{\"url\":\"https://tiles.esa.maps.eox.at/wms\",\"layerName\":\"terrain_3857\"}]}]"` (mandatory)                                                                                                                                                                                              |
| `env.baseHref`       | When the user-web-client is deployed on a sub-path, this option is mandatory. For example, when the full URL is `https://rs-domain.net/web-client` the $BASE_HREF must to be set to `/web-client/`. If it is deployed on the root `https://rs-domain.net` this setting can be ignored.                                                                                                 | `"/uwc"` (optional, default: `"/"`)                                                                                                                                                                                                                                                                                                         |
| `env.keycloak`       | Allows setting the information about the keycloak endpoint, realm and clientid that shall be used by the UWC.                                                                                                                                                                                                                                                                          | `"{\"url\":\"http://keycloack-server:8080/auth\",\"realm\":\"master\",\"clientId\": \"user-web-client\"}"` (mandatory)                                                                                                                                                                                                                      |
| `env.mapView`        | Allows to set the color of the user-defined region search filter (regionSelection\*Color), the color of the selected footprints (selection\*Color) and the color of the footprint currently selected to view the details (highlight\*Color). The color can be defined using CSS Color Names (see [MDN Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/color#examples)) | `"{\"regionSelectionFillColor\":\"rgba(255,155,51,0.3)\",\"regionSelectionStrokeColor\":\"rgba(255,155,51,0.6)\",\"selectionFillColor\":\"rgba(0, 114, 163, 0.3)\",\"selectionStrokeColor\":\"rgba(0, 114, 163, 0.6)\",\"highlightFillColor\":\"rgba(50, 211, 63, 0.3)\",\"highlightStrokeColor\":\"rgba(50, 211, 63, 0.8)\"}"` (mandatory) |
| `env.filterConfig`   | Allows to predefine the input type of specific attributes when selecting them as a filter in the sidebar. The "attributeName" corresponds to the attributes available on the catalog. The available "valueType" values are: string, date, double, long and boolean                                                                                                                     | `"[{\"attributeName\":\"PublicationDate\",\"valueType\":\"date\"}]"` (optional, default:`"[]"`)                                                                                                                                                                                                                                             |

### Example Kubernetes

values.yaml

```yaml
env:
  # PRIP API URL
  apiUrl: http://YOUR_PUBLIC_PRIP_HOST:YOUR_PUBLIC_PRIP_PORT/odata/v1/Products
  # EOX map configuration
  mapBackgrounds: |
    "[{\"name\":\"YOUR_CUSTOM_MAP_NAME\",\"layers\":[{\"url\":\"TYLING_SERVER_BACKEND_URL\",\"layerName\":\"CHOSEN_TYLING_LAYER\"}]}]"
  # Base HREF
  baseHref: /SOME/PATH/
  # Keycloak configuration
  keycloak: |
    "{\"url\":\"KEYCLOAK_AUTH_ENDPOINT\",\"realm\":\"KEYCLOAK_REALM\",\"clientId\": \"CLIENT_ID\"}
  mapView: |
    "{\"regionSelectionFillColor\":\"CSS_COLOR_STRING,\"regionSelectionStrokeColor\":\"CSS_COLOR_STRING,\"selectionFillColor\":\"CSS_COLOR_STRING\",\"selectionStrokeColor\":\"CSS_COLOR_STRING\",\"highlightFillColor\":\"CSS_COLOR_STRING\",\"highlightStrokeColor\":\"CSS_COLOR_STRING\"}"
  filterConfig: |
    "[{\"attributeName\":\"ATTRIBUTE_NAME",\"valueType\":\"VALUE_TYPE\"}]"
```
