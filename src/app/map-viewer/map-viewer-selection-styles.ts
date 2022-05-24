import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import CircleStyle from 'ol/style/Circle';

const r = 255;
const g = 155;
const b = 51;
const a = 0.3;
const defaultLineDash = [10, 0, 0, 10];
const defaultLineWidth = 3;

export const SELECTED_STYLE_POLYGON = new Style({
  fill: new Fill({
    color: `rgba(${r}, ${g}, ${b}, ${a})`,
  }),
  stroke: new Stroke({
    color: `rgba(${r}, ${g}, ${b}, ${a + 0.2})`,
    width: defaultLineWidth,
    lineDash: defaultLineDash,
  }),
});

export function SELECTED_STYLE_POINT(_feature) {
  var style = new Style({
    image: new CircleStyle({
      radius: 6,
      stroke: new Stroke({
        color: `rgba(${r}, ${g}, ${b}, ${a + 0.4})`,
        width: defaultLineWidth,
      }),
      fill: new Fill({
        color: `rgba(${r}, ${g}, ${b}, ${a + 0.2})`,
      }),
    }),
  });
  return [style];
}

export const SELECTED_STYLE_LINE = new Style({
  stroke: new Stroke({
    color: `rgba(${r}, ${g}, ${b}, ${a + 0.3})`,
    width: defaultLineWidth,
    lineDash: defaultLineDash,
  }),
});
