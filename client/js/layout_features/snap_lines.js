
export const pos_lgds_elem = new Map();

export const get_coords_snap_lines = function (uid) {
  const snap_lines = { x: [], y: [] };
  pos_lgds_elem.forEach((v, k) => {
    if (k != uid) {
      snap_lines.y.push([v.top + v.height, v.top], [v.top, v.top + v.height]);
      snap_lines.x.push([v.left, v.left + v.width], [v.left + v.width, v.left]);
      // snap_lines.y.push([v.bottom, v.top], [v.top, v.bottom]);
      // snap_lines.x.push([v.left, v.right], [v.right, v.left]);
    }
  });
  return snap_lines;
};

export const make_red_line_snap = function (x1, x2, y1, y2, timeout = 750) {
  let current_timeout;
  return (function () {
    if (current_timeout) {
      clearTimeout(current_timeout);
    }
    map.select('.snap_line').remove();
    const line = map.append('line')
      .attrs({ x1, x2, y1, y2, class: 'snap_line' })
      .styles({ stroke: 'red', 'stroke-width': 0.7 });
    current_timeout = setTimeout(() => { line.remove(); }, timeout);
  }());
};
