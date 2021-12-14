# User-Web-Client

The user-web-client is a user facing web application of the Copernicus Reference System (COPRS), intended to be used by a person to query products in a catalog and display them on a map (where applicable).

It connects to the PRIP interface via OData in order to retrieve its data.

![user-web-client](./user-web-client.png "user-web-client")

## Configuration in Kubernetes

values.yaml

```yaml
env:
  # PRIP API URL
  apiUrl: http://YOUR_PUBLIC_PRIP_HOST:YOUR_PUBLIC_PRIP_PORT/api/v1/
  # EOX map configuration
  mapBackgrounds: |
    "[{\"name\":\"YOUR_CUSTOM_MAP_NAME\",\"layers\":[{\"url\":\"TYLING_SERVER_BACKEND_URL\",\"layerName\":\"CHOSEN_TYLING_LAYER\"}]}]"
```

values.yaml (practical example)

```yaml
env:
  # PRIP API URL
  apiUrl: http://prip.some.host:4711/api/v1/
  # EOX map configuration
  mapBackgrounds: |
    "[{\"name\":\"Terrain + Overlay\",\"layers\":[{\"url\":\"https://tiles.esa.maps.eox.at/wms\",\"layerName\":\"terrain_3857\"},{\"url\":\"https://tiles.esa.maps.eox.at/wms\",\"layerName\":\"overlay_bright_3857\"}]}]"
```
