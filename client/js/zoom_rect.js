import { Mmax } from './helpers_math';
import { displayInfoOnMove } from './interface';
import { zoom_without_redraw } from './map_ctrl';

/**
* Function handling the click on the map and the brush effect when
* the "zoom by tracing a rectangle" is enabled.
* It may fail on some projections when the user click outside of the sphere.
*
* @return {void}
*/
const makeZoomRect = function makeZoomRect() {
  if (!proj.invert) return;
  const brush = d3.brush().on('end', brushended);
  const idleDelay = 350;
  let idleTimeout;
  function idled() { idleTimeout = null; }
  function brushended(event) {
    const s = event.selection;
    if (!s) {
      if (!idleTimeout) {
        idleTimeout = setTimeout(idled, idleDelay);
        return idleTimeout;
      }
    } else {
      const x_min = s[0][0];
      const x_max = s[1][0];
      const y_min = s[1][1];
      const y_max = s[0][1];
      const transform = d3.zoomTransform(svg_map);
      const z_trans = [transform.x, transform.y];
      const z_scale = transform.k;

      const pt1 = proj.invert([(x_min - z_trans[0]) / z_scale, (y_min - z_trans[1]) / z_scale]);
      const pt2 = proj.invert([(x_max - z_trans[0]) / z_scale, (y_max - z_trans[1]) / z_scale]);
      const path_bounds = path.bounds({ type: 'MultiPoint', coordinates: [pt1, pt2] });
      // Todo : use these two points to make zoom on them
      map.select('.brush').call(brush.move, null);

      const zoom_scale = 0.95 / Mmax((
        path_bounds[1][0] - path_bounds[0][0]) / w, (path_bounds[1][1] - path_bounds[0][1]) / h);
      // const zoom_translate = [
      //   (w - zoom_scale * (path_bounds[1][0] + path_bounds[0][0])) / 2,
      //   (h - zoom_scale * (path_bounds[1][1] + path_bounds[0][1])) / 2,
      // ];
      svg_map.__zoom.k = zoom_scale;
      svg_map.__zoom.x = (w - zoom_scale * (path_bounds[1][0] + path_bounds[0][0])) / 2;
      svg_map.__zoom.y = (h - zoom_scale * (path_bounds[1][1] + path_bounds[0][1])) / 2;
      zoom_without_redraw();
    }
  }

  map.append('g')
    .attr('class', 'brush')
    .call(brush);
};

/**
* Function triggered when the user click on the "zoom by tracing a rectangle"
* button.
* If the feature is already active, it disable it. Otherwise it enable it.
*
* @return {void}
*
*/
export default function handleZoomRect() {
  const b = map.select('.brush');
  if (b.node()) {
    d3.select('#brush_zoom_button').classed('active', false);
    b.remove();
  } else {
    if (d3.select('#info_button').classed('active')) {
      displayInfoOnMove();
    }
    d3.select('#brush_zoom_button').classed('active', true);
    makeZoomRect();
  }
}
