import ContextMenu from './context-menu';
import { rgb2hex } from './colors_helpers';
import { make_confirm_dialog2 } from './dialogs';
import { cloneObj } from './helpers';
import { get_nb_decimals, get_nb_left_separator, getTranslateNewLegend, max_fast, min_fast, PropSizer, round_value } from './helpers_calc';
import { Mmax, Mmin, Mpow, Msqrt, Mabs, Mround } from './helpers_math';
import { handle_click_hand } from './interface';
import { redraw_legends_symbols } from './map_ctrl';
import { get_coords_snap_lines, make_red_line_snap, pos_lgds_elem } from './layout_features/snap_lines';

/**
* Function called on clicking on the legend button of each layer
* - toggle the visibility of the legend (or create the legend if doesn't currently exists)
*
* @param {String} layer - The layer name
* @returns {void}
*/
export function handle_legend(layer) {
  const state = data_manager.current_layers[layer].renderer;
  if (state != undefined) {
    const class_name = ['.lgdf', _app.layer_to_id.get(layer)].join('_');
    const legends = svg_map.querySelectorAll(class_name);
    if (legends.length > 0) {
      if (legends[0].getAttribute('display') == null) {
        Array.prototype.forEach.call(legends, el => el.setAttribute('display', 'none'));
      } else {
        Array.prototype.forEach.call(legends, el => el.removeAttribute('display'));
        // Redisplay the legend(s) and also
        // verify if still in the visible part
        // of the map, if not, move them in:
        // .. so it's actually a feature if the legend is redrawn on its origin location
        // after being moved too close to the outer border of the map :
        const tol = 10;
        const { x: x0, y: y0 } = get_map_xy0();
        const limit_left = x0 - tol;
        const limit_right = x0 + +w + tol;
        const limit_top = y0 - tol;
        const limit_bottom = y0 + +h + tol;

        for (let i = 0; i < legends.length; i++) {
          const bboxLegend = legends[i].getBoundingClientRect();
          if (bboxLegend.left < limit_left || bboxLegend.left > limit_right
                  || bboxLegend.top < limit_top || bboxLegend.top > limit_bottom) {
            legends[i].setAttribute('transform', 'translate(0, 0)');
          }
        }
      }
    } else {
      createLegend(layer, '');
      up_legends();
    }
  }
}

export function up_legends() {
  const legend_features = svg_map.querySelectorAll('.legend');
  for (let i = 0; i < legend_features.length; i++) {
    svg_map.appendChild(legend_features[i], null);
  }
}

/**
* Function called on the first click on the legend button of each layer
* - delegate legend creation according to the type of function
*
* @param {String} layer - The layer name
* @param {String} title - The desired title (default: empty - can be modified later)
*
*/
function createLegend(layer, title) {
  const renderer = data_manager.current_layers[layer].renderer,
    field = data_manager.current_layers[layer].rendered_field,
    field2 = data_manager.current_layers[layer].rendered_field2,
    type_layer = data_manager.current_layers[layer].type;
  let el,
    el2;

  const lgd_pos = getTranslateNewLegend();

  if (renderer.indexOf('Choropleth') > -1 || renderer.indexOf('Gridded') > -1
            || renderer.indexOf('Stewart') > -1 || renderer.indexOf('TypoSymbols') > -1) {
    el = createLegend_choro(layer, field, title, field, 0);
  } else if (renderer.indexOf('Categorical') > -1) {
    el = createLegend_choro(layer, field, title, field, 4);
  } else if (renderer.indexOf('LinksGraduated') !== -1
          || renderer.indexOf('DiscLayer') !== -1) {
    el = createLegend_discont_links(layer, field, title, field);
  } else if (renderer.indexOf('PropSymbolsChoro') !== -1) {
    el = createLegend_choro(layer, field2, title, field2, 0);
    el2 = type_layer === 'Line' ? createLegend_line_symbol(layer, field, title, field)
                                : createLegend_symbol(layer, field, title, field);
  } else if (renderer.indexOf('PropSymbolsTypo') !== -1) {
    el = createLegend_choro(layer, field2, title, field2, 4);
    el2 = type_layer === 'Line' ? createLegend_line_symbol(layer, field, title, field)
                                : createLegend_symbol(layer, field, title, field);
  } else if (renderer.indexOf('PropSymbols') !== -1) {
    el = type_layer === 'Line' ? createLegend_line_symbol(layer, field, title, field)
                               : createLegend_symbol(layer, field, title, field);
  } else if (renderer.indexOf('LinksProp') !== -1) {
    el = createLegend_line_symbol(layer, field, title, field);
  } else if (renderer.indexOf('TwoStocksWaffle') !== -1) {
    el = createLegend_waffle(layer, field, title, '');
  } else if (!renderer) {
    el = createLegend_layout(layer, data_manager.current_layers[layer].type, title, '', undefined, layer);
  } else {
    swal(
      'Oops..',
      `${_tr('No legend available for this representation')}.<br>${
        _tr('Want to make a <a href="/">suggestion</a> ?')}`,
      'warning',
    );
    return;
  }

  if (el && lgd_pos && lgd_pos.x) {
    el.attr('transform', `translate(${lgd_pos.x},${lgd_pos.y})`);
  }
  pos_lgds_elem.set(`${el.attr('id')} ${el.attr('class')}`, get_bounding_rect(el.node()));
  if (el2) {
    const prev_bbox = get_bounding_rect(el.node()),
      dim_h = lgd_pos.y + prev_bbox.height,
      dim_w = lgd_pos.x + prev_bbox.width;
    const lgd_pos2 = getTranslateNewLegend();
    if (lgd_pos2.x !== lgd_pos.x || lgd_pos2.y !== lgd_pos.y) {
      el2.attr('transform', `translate(${lgd_pos2.x},${lgd_pos2.y})`);
    } else if (dim_h < h) {
      el2.attr('transform', `translate(${lgd_pos.x},${dim_h})`);
    } else if (dim_w < w) {
      el2.attr('transform', `translate(${dim_w},${lgd_pos.y})`);
    }
    pos_lgds_elem.set(`${el2.attr('id')} ${el2.attr('class')}`, get_bounding_rect(el2.node()));
  }
}

export function up_legend(legend_node) {
  const lgd_features = svg_map.querySelectorAll('.legend'),
    nb_lgd_features = +lgd_features.length;
  let self_position;

  for (let i = 0; i < nb_lgd_features; i++) {
    if (lgd_features[i].id === legend_node.id
          && lgd_features[i].classList === legend_node.classList) {
      self_position = i;
    }
  }
  // if (self_position === nb_lgd_features - 1) {
  //
  // } else {
  //   svg_map.insertBefore(lgd_features[self_position + 1], lgd_features[self_position]);
  // }
  if (!(self_position === nb_lgd_features - 1)) {
    svg_map.insertBefore(lgd_features[self_position + 1], lgd_features[self_position]);
  }
}

export function down_legend(legend_node) {
  const lgd_features = svg_map.querySelectorAll('.legend'),
    nb_lgd_features = +lgd_features.length;
  let self_position;

  for (let i = 0; i < nb_lgd_features; i++) {
    if (lgd_features[i].id === legend_node.id
        && lgd_features[i].classList === legend_node.classList) {
      self_position = i;
    }
  }
  if (self_position !== 0) {
    svg_map.insertBefore(lgd_features[self_position], lgd_features[self_position - 1]);
  }
}

function make_legend_context_menu(legend_node) {
  const context_menu = new ContextMenu();
  const getItems = () => [
    { name: _tr('app_page.common.edit_style'), action: () => { createlegendEditBox(legend_node.attr('id'), legend_node.attr('layer_name')); } },
    { name: _tr('app_page.common.up_element'), action: () => { up_legend(legend_node.node()); } },
    { name: _tr('app_page.common.down_element'), action: () => { down_legend(legend_node.node()); } },
    {
      name: _tr('app_page.common.hide'),
      action: () => {
        if (!(legend_node.attr('display') === 'none')) legend_node.attr('display', 'none');
        else legend_node.attr('display', null);
      },
    },
  ];
  legend_node.on('dblclick', (event) => {
    event.stopPropagation();
    event.preventDefault();
    createlegendEditBox(legend_node.attr('id'), legend_node.attr('layer_name'));
  });

  legend_node.on('contextmenu', (event) => {
    context_menu.showMenu(
      event,
      document.querySelector('body'),
      getItems(),
    );
  });
}

export const drag_legend_func = function drag_legend_func(legend_group) {
  return d3.drag()
    .subject(function () {
      let t = d3.select(this),
        prev_translate = t.attr('transform'),
        snap_lines = get_coords_snap_lines(`${t.attr('id')} ${t.attr('class')}`);

      prev_translate = prev_translate ? prev_translate.slice(10, -1).split(/[ ,]+/).map(f => +f) : [0, 0];
      if (prev_translate.length === 1) prev_translate = [prev_translate[0], 0];

      return {
        x: +t.attr('x') + prev_translate[0],
        y: +t.attr('y') + prev_translate[1],
        map_locked: !!map_div.select('#hand_button').classed('locked'),
        snap_lines,
        offset: [+legend_group.select('#under_rect').attr('x'), +legend_group.select('#under_rect').attr('y')],
      };
    })
    .on('start', (event) => {
      event.sourceEvent.stopPropagation();
      event.sourceEvent.preventDefault();
      handle_click_hand('lock');
    })
    .on('end', (event) => {
      if (event.subject && !event.subject.map_locked) { handle_click_hand('unlock'); }
      legend_group.style('cursor', 'grab');
      pos_lgds_elem.set(`${legend_group.attr('id')} ${legend_group.attr('class')}`, get_bounding_rect(legend_group.node()));
    })
    .on('drag', (event) => {
      const Min = Mmin;
      const Max = Mmax;
      const new_value = [event.x, event.y];
      let prev_value = legend_group.attr('transform');
      prev_value = prev_value ? prev_value.slice(10, -1).split(/[ ,]+/).map(f => +f) : [0, 0];
      if (prev_value.length === 1) prev_value = [prev_value[0], 0];
      legend_group.attr('transform', `translate(${new_value})`)
        .style('cursor', 'grabbing');

      const bbox_elem = get_bounding_rect(legend_group.node());
      let val_x = event.x,
        val_y = event.y,
        change;

      if (_app.autoalign_features) {
        const xmin = bbox_elem.x,
          xmax = bbox_elem.x + bbox_elem.width,
          ymin = bbox_elem.y,
          ymax = bbox_elem.y + bbox_elem.height;

        const snap_lines_x = event.subject.snap_lines.x,
          snap_lines_y = event.subject.snap_lines.y;
        for (let i = 0; i < snap_lines_x.length; i++) {
          if (Mabs(snap_lines_x[i][0] - xmin) < 10) {
            const _y1 = Min(Min(snap_lines_y[i][0], snap_lines_y[i][1]), ymin);
            const _y2 = Max(Max(snap_lines_y[i][0], snap_lines_y[i][1]), ymax);
            make_red_line_snap(snap_lines_x[i][0], snap_lines_x[i][0], _y1, _y2);
            val_x = snap_lines_x[i][0] - event.subject.offset[0];
            change = true;
          }
          if (Mabs(snap_lines_x[i][0] - xmax) < 10) {
            const _y1 = Min(Min(snap_lines_y[i][0], snap_lines_y[i][1]), ymin);
            const _y2 = Max(Max(snap_lines_y[i][0], snap_lines_y[i][1]), ymax);
            make_red_line_snap(snap_lines_x[i][0], snap_lines_x[i][0], _y1, _y2);
            val_x = snap_lines_x[i][0] - bbox_elem.width - event.subject.offset[0];
            change = true;
          }
          if (Mabs(snap_lines_y[i][0] - ymin) < 10) {
            const x1 = Min(Min(snap_lines_x[i][0], snap_lines_x[i][1]), xmin);
            const x2 = Max(Max(snap_lines_x[i][0], snap_lines_x[i][1]), xmax);
            make_red_line_snap(x1, x2, snap_lines_y[i][0], snap_lines_y[i][0]);
            val_y = snap_lines_y[i][0] - event.subject.offset[1];
            change = true;
          }
          if (Mabs(snap_lines_y[i][0] - ymax) < 10) {
            const x1 = Min(Min(snap_lines_x[i][0], snap_lines_x[i][1]), xmin);
            const x2 = Max(Max(snap_lines_x[i][0], snap_lines_x[i][1]), xmax);
            make_red_line_snap(x1, x2, snap_lines_y[i][0], snap_lines_y[i][0]);
            val_y = snap_lines_y[i][0] - bbox_elem.height - event.subject.offset[1];
            change = true;
          }
        }
      }

      if ((bbox_elem.width < w && (bbox_elem.x < -10)) || (bbox_elem.x + bbox_elem.width > (+w + 10))) {
        val_x = prev_value[0];
        change = true;
      }
      if ((bbox_elem.height < h && bbox_elem.y < -10) || (bbox_elem.y + bbox_elem.height > (+h + 10))) {
        val_y = prev_value[1];
        change = true;
      }
      if (change) {
        legend_group.attr('transform', `translate(${[val_x, val_y]})`);
      }
    });
};

export function createLegend_waffle(layer, fields, title, subtitle, rect_fill_value, ratio_txt, note_bottom) {
  const space_elem = 18;
  const boxheight = 18;
  const boxwidth = 18;
  const boxgap = 12;
  const xpos = 30;
  const ypos = 30;
  const y_pos2 = ypos + space_elem;
  const tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`;
  const nbVar = fields.length;
  const ref_colors = data_manager.current_layers[layer].fill_color;
  const symbol = data_manager.current_layers[layer].symbol;
  const size_symbol = data_manager.current_layers[layer].size;
  let last_pos;

  const legend_root = map.insert('g')
    .attrs({
      id: 'legend_root_waffle',
      class: tmp_class_name,
      transform: 'translate(0,0)',
      layer_name: layer,
    })
    .styles({
      cursor: 'grab',
      'font-size': '11px',
      'font-family': 'verdana',
    });

  const rect_under_legend = legend_root.insert('rect');

  legend_root.insert('text')
    .attrs(subtitle != ''
      ? { id: 'legendtitle', x: xpos + space_elem, y: ypos }
      : { id: 'legendtitle', x: xpos + space_elem, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .text(title || '');

  legend_root.insert('text')
    .attrs({ id: 'legendsubtitle', x: xpos + space_elem, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .text(subtitle);

  const fields_colors = [];
  for (let i = 0; i < nbVar; i++) {
    fields_colors.push([fields[i], ref_colors[i]]);
  }

  const legend_elems = legend_root.selectAll('.legend')
    .append('g')
    .data(fields_colors)
    .enter()
    .insert('g')
    .attr('class', (d, i) => `lg legend_${i}`);

  legend_elems
    .append('rect')
    .attrs((d, i) => {
      last_pos = y_pos2 + (i * boxgap) + (i * boxheight);
      return {
        x: xpos + boxwidth,
        y: last_pos,
        width: boxwidth,
        height: boxheight,
      };
    })
    .styles(d => ({ fill: d[1], stroke: d[1] }));

  legend_elems
    .append('text')
    .attr('x', xpos + boxwidth * 2 + 10)
    .attr('y', (d, i) => y_pos2 + i * boxheight + (i * boxgap) + (boxheight * 2 / 3))
    .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
    .text(d => d[0]);

  const legend_symbol_size = legend_root.append('g');
  if (symbol === 'rect') {
    legend_symbol_size
      .insert('rect')
      .attrs({
        x: xpos + boxwidth + (boxwidth - size_symbol) / 2,
        y: last_pos + 2 * space_elem,
        width: size_symbol,
        height: size_symbol,
      })
      .styles({ fill: 'lightgray', stroke: 'black', 'stroke-width': '0.8px' });
    legend_symbol_size
      .insert('text')
      .attrs({
        x: xpos + boxwidth + space_elem + size_symbol,
        y: last_pos + 2 * space_elem + size_symbol / 2 + 4,
        id: 'ratio_txt',
      })
      .html(ratio_txt || ` = ${data_manager.current_layers[layer].ratio}`);
    last_pos = last_pos + 3 * space_elem + size_symbol;
  } else {
    legend_symbol_size
      .insert('circle')
      .attrs({
        cx: xpos + boxwidth * 1.5,
        cy: last_pos + 2 * space_elem + size_symbol,
        r: size_symbol,
      })
      .styles({ fill: 'lightgray', stroke: 'black', 'stroke-width': '0.8px' });
    legend_symbol_size
      .insert('text')
      .attrs({ x: xpos + boxwidth + space_elem + size_symbol * 2, y: last_pos + 2 * space_elem + size_symbol + 4, id: 'ratio_txt' })
      .html(ratio_txt || ` = ${data_manager.current_layers[layer].ratio}`);
    last_pos = last_pos + 3 * space_elem + size_symbol * 2;
  }

  legend_root.append('g')
    .insert('text')
    .attrs({ id: 'legend_bottom_note', x: xpos + space_elem, y: last_pos })
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .html(note_bottom != null ? note_bottom : '');

  legend_root.call(drag_legend_func(legend_root));

  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  make_legend_context_menu(legend_root, layer);
  return legend_root;
}

export function createLegend_discont_links(layer, field, title, subtitle, rect_fill_value, rounding_precision, note_bottom) {
  const space_elem = 18,
    boxgap = 12,
    xpos = 30,
    ypos = 30,
    y_pos2 = ypos + space_elem,
    tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`,
    breaks = data_manager.current_layers[layer].breaks,
    nb_class = breaks.length;

  if (rounding_precision === undefined) {
    const b_val = breaks.map(v => v[0][0]).concat(breaks[nb_class - 1][0][1]);
    rounding_precision = get_lgd_display_precision(b_val);
  }

  const legend_root = map.insert('g')
    .attrs({
      id: 'legend_root_lines_class',
      class: tmp_class_name,
      transform: 'translate(0,0)',
      rounding_precision,
      layer_field: field,
      layer_name: layer,
    })
    .styles({ cursor: 'grab', 'font-size': '11px', 'font-family': 'verdana' });

  const rect_under_legend = legend_root.insert('rect');

  legend_root.insert('text')
    .attrs(subtitle != ''
      ? { id: 'legendtitle', x: xpos + space_elem, y: ypos }
      : { id: 'legendtitle', x: xpos + space_elem, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .text(title || '');

  legend_root.insert('text')
    .attrs({ id: 'legendsubtitle', x: xpos + space_elem, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .text(subtitle);


  const ref_symbols_params = [];

  // Prepare symbols for the legend, taking care of not representing values
  // under the display threshold defined by the user (if any) :
  let current_min_value = +data_manager.current_layers[layer].min_display;
  if (data_manager.current_layers[layer].renderer === 'DiscLayer') {
  // Todo use the same way to store the threshold for links and disclayer
  // in order to avoid theses condition
    const values = Array.prototype.map.call(
      svg_map.querySelector(`#${_app.layer_to_id.get(layer)}`).querySelectorAll('path'),
      d => +d.__data__.properties.disc_value,
    );
    current_min_value = current_min_value !== 1
      ? values[Mround(current_min_value * data_manager.current_layers[layer].n_features)]
      : values[values.length - 1];
  }

  for (let ix = 0; ix < nb_class; ix++) {
    const b_val = breaks[ix];
    if (b_val[1] !== 0) {
      if (current_min_value >= +b_val[0][0] && current_min_value < +b_val[0][1]) {
        ref_symbols_params.push({ value: [current_min_value, b_val[0][1]], size: b_val[1] });
      } else if (current_min_value < +b_val[0][0] && current_min_value < +b_val[0][1]) {
        ref_symbols_params.push({ value: b_val[0], size: b_val[1] });
      }
    }
  }

  ref_symbols_params.reverse();

  const legend_elems = legend_root.selectAll('.legend')
    .append('g')
    .data(ref_symbols_params)
    .enter()
    .insert('g')
    .attr('class', (d, i) => `lg legend_${i}`);

  const max_size = data_manager.current_layers[layer].size[1],
    color = data_manager.current_layers[layer].fill_color.single,
    xrect = xpos + space_elem + max_size / 2;
  let last_size = 0,
    last_pos = y_pos2;

  legend_elems
    .append('rect')
    .styles({
      fill: color,
      stroke: 'rgb(0, 0, 0)',
      'fill-opacity': 1,
      'stroke-width': 0,
    })
    .attrs((d) => {
      last_pos = boxgap + last_pos + last_size;
      last_size = d.size * svg_map.__zoom.k;
      return {
        x: xrect,
        y: last_pos,
        width: 45,
        height: last_size,
      };
    });

  last_pos = y_pos2;
  last_size = 0;

  const x_text_pos = xpos + space_elem + max_size * 1.5 + 45;
  let tmp_pos;
  legend_elems.append('text')
    .attrs((d) => {
      last_pos = boxgap + last_pos + last_size;
      last_size = d.size * svg_map.__zoom.k;
      tmp_pos = last_pos - (last_size / 4);
      return { x: x_text_pos, y: tmp_pos };
    })
    .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
    .text(d => round_value(d.value[1], rounding_precision).toLocaleString());

  legend_root.insert('text')
    .attrs({ id: 'lgd_choro_min_val', x: x_text_pos, y: tmp_pos + boxgap })
    .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
    .text(round_value(
      ref_symbols_params[ref_symbols_params.length - 1].value[0],
      rounding_precision,
    ).toLocaleString());

  legend_root.call(drag_legend_func(legend_root));

  legend_root.append('g')
    .insert('text')
    .attrs({
      id: 'legend_bottom_note',
      x: xpos + space_elem,
      y: last_pos + 2 * space_elem,
    })
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .text(note_bottom != null ? note_bottom : '');
  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  // legend_root.select('#legendtitle').text(title || "");
  make_legend_context_menu(legend_root, layer);
  return legend_root;
}

/**
* Function computing the size of the rectangle to be put under the legend
* (called on each change modifying the size of the legend box,
* eg. longer title, switching to nested symbols, etc..)
*
*/
function make_underlying_rect(legend_root, under_rect, fill) {
  under_rect.attrs({ width: 0, height: 0 });
  const bboxLegend = get_bounding_rect(legend_root.node());
  let translate = legend_root.attr('transform');

  translate = translate
    ? translate.split('translate(')[1].split(')')[0].split(/[ ,]+/).map(d => +d)
    : [0, 0];
  if (translate.length === 1) translate = [translate[0], 0];

  const x_top_left = bboxLegend.x - 12.5 - translate[0];
  const y_top_left = bboxLegend.y - 12.5 - translate[1];
  const x_top_right = bboxLegend.x + bboxLegend.width + 12.5 - translate[0];
  const y_bottom_left = bboxLegend.y + bboxLegend.height + 12.5 - translate[1];
  const rect_height = y_bottom_left - y_top_left;
  const rect_width = x_top_right - x_top_left;

  under_rect.attrs({
    id: 'under_rect',
    x: x_top_left,
    y: y_top_left,
    height: rect_height,
    width: rect_width,
  });

  if (!fill || (!fill.color || !fill.opacity)) {
    under_rect.styles({ fill: 'green', 'fill-opacity': 0 });
    legend_root
      .attr('visible_rect', 'false')
      .on('mouseover', () => { under_rect.style('fill-opacity', 0.1); })
      .on('mouseout', () => { under_rect.style('fill-opacity', 0); });
  } else {
    under_rect.styles({ fill: fill.color, 'fill-opacity': fill.opacity });
    legend_root
      .attr('visible_rect', 'true')
      .on('mouseover', null)
      .on('mouseout', null);
  }
}

export function createLegend_symbol(layer, field, title, subtitle, nested = 'false', join_line = 'false', rect_fill_value, rounding_precision, note_bottom, options = {}) {
  const parent = options.parent || window.map;
  const layer_prop = data_manager.current_layers[layer];
  const space_elem = 18;
  const boxgap = 4;
  let y_pos2 = space_elem * 1.5;
  const tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`;
  const symbol_type = layer_prop.symbol;

  const color_symb_lgd = (
    layer_prop.renderer === 'PropSymbolsChoro'
      || layer_prop.renderer === 'PropSymbolsTypo'
      || layer_prop.fill_color.two !== undefined
      || layer_prop.fill_color.random !== undefined)
    ? '#FFF' : layer_prop.fill_color.single;

  const stroke_color = (layer_prop.renderer === 'PropSymbolsChoro'
    || layer_prop.renderer === 'PropSymbolsTypo'
    || layer_prop.fill_color.two !== undefined
    || layer_prop.fill_color.random !== undefined)
    ? 'rgb(0, 0, 0)' : map.select(`#${_app.layer_to_id.get(layer)}`).select(symbol_type).style('stroke');

  const ref_symbols = document.getElementById(
    _app.layer_to_id.get(layer)).getElementsByTagName(symbol_type);
  const type_param = symbol_type === 'circle' ? 'r' : 'width';
  const z_scale = +d3.zoomTransform(map.node()).k;
  const [ref_value, ref_size] = layer_prop.size;
  const propSize = new PropSizer(ref_value, ref_size, symbol_type);

  if (!layer_prop.size_legend_symbol) {
    const non_empty = Array.prototype.filter.call(ref_symbols, (d) => {
      if (d[type_param].baseVal.value !== 0) return d[type_param].baseVal.value;
    });
    const size_max = +non_empty[0].getAttribute(type_param),
      size_min = +non_empty[non_empty.length - 1].getAttribute(type_param),
      val_max = Mabs(+non_empty[0].__data__.properties[field]),
      val_min = Mabs(+non_empty[non_empty.length - 1].__data__.properties[field]);
    let r = Mmax(get_nb_decimals(val_max), get_nb_decimals(val_min)),
      diff_size = Msqrt(size_max) - Msqrt(size_min),
      size_interm1 = Msqrt(size_min) + diff_size / 3,
      size_interm2 = Mpow(size_interm1 + diff_size / 3, 2);
    size_interm1 = Mpow(size_interm1, 2);
    layer_prop.size_legend_symbol = [
      { value: val_max },
      { value: round_value(propSize.get_value(size_interm2), r) },
      { value: round_value(propSize.get_value(size_interm1), r) },
      { value: val_min },
    ];
    if ((layer_prop.size_legend_symbol[0].value - layer_prop.size_legend_symbol[1].value) > 1) {
      rounding_precision = 0;
    } else {
      rounding_precision = Mmax(get_nb_decimals(val_max), get_nb_decimals(val_min));
    }
  }

  const t = layer_prop.size_legend_symbol;
  const ref_symbols_params = [
    { size: propSize.scale(t[0].value) * z_scale, value: t[0].value },
    { size: propSize.scale(t[1].value) * z_scale, value: t[1].value },
    { size: propSize.scale(t[2].value) * z_scale, value: t[2].value },
    { size: propSize.scale(t[3].value) * z_scale, value: t[3].value },
  ];
  if (ref_symbols_params[3].value === 0) {
    ref_symbols_params.pop();
  }
  if (ref_symbols_params[2].value === 0) {
    ref_symbols_params.pop();
  }

  const legend_root = parent.insert('g')
    .styles({
      cursor: 'grab',
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .attrs({
      id: 'legend_root_symbol',
      class: tmp_class_name,
      transform: 'translate(0,0)',
      layer_name: layer,
      nested,
      join_line,
      rounding_precision,
      layer_field: field,
    });

  const rect_under_legend = legend_root.insert('rect');

  const legend_elems = legend_root.selectAll('.legend')
    .append('g')
    .data(ref_symbols_params)
    .enter()
    .insert('g')
    .attr('class', (d, i) => `lg legend_${i}`);

  const max_size = ref_symbols_params[0].size * 2;
  let last_size = 0;

  if (symbol_type === 'rect') {
    y_pos2 -= max_size / 4;
  }

  let last_pos = y_pos2;
  let max_dist = null;

  if (nested === 'false') {
    if (symbol_type === 'circle') {
      legend_elems
        .append('circle')
        .styles({ fill: color_symb_lgd, stroke: stroke_color, 'fill-opacity': 1 })
        .attrs((d, i) => {
          last_pos = (i * boxgap) + d.size + last_pos + last_size;
          last_size = d.size;
          if (max_dist === null) {
            max_dist = (space_elem + boxgap + max_size / 4) - d.size;
          }
          return {
            cx: space_elem + boxgap + max_size / 4,
            cy: last_pos,
            r: d.size,
          };
        });

      last_pos = y_pos2;
      last_size = 0;
      legend_elems.append('text')
        .attrs((d, i) => {
          last_pos = (i * boxgap) + d.size + last_pos + last_size;
          last_size = d.size;
          return {
            x: space_elem + boxgap + max_size * 0.75 + 7,
            y: last_pos + (i * 2 / 3),
          };
        })
        .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
        .text(d => round_value(d.value, rounding_precision).toLocaleString());
    } else if (symbol_type === 'rect') {
      legend_elems
        .append('rect')
        .styles({ fill: color_symb_lgd, stroke: stroke_color, 'fill-opacity': 1 })
        .attrs((d, i) => {
          last_pos = (i * boxgap) + (d.size / 2) + last_pos + last_size;
          last_size = d.size;
          if (max_dist === null) {
            max_dist = space_elem + boxgap + max_size / 4 - last_size / 2;
          }
          return {
            x: space_elem + boxgap + max_size / 4 - last_size / 2,
            y: last_pos,
            width: last_size,
            height: last_size,
          };
        });

      last_pos = y_pos2; last_size = 0;
      const x_text_pos = space_elem + boxgap + max_size / 2 + 7;
      legend_elems.append('text')
        .attrs((d, i) => {
          last_pos = (i * boxgap) + (d.size / 2) + last_pos + last_size;
          last_size = d.size;
          return { x: x_text_pos, y: last_pos + (d.size * 0.51) };
        })
        .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
        .text(d => round_value(d.value, rounding_precision).toLocaleString());
    }
  } else if (nested === 'true') {
    const dist_to_title = 30;
    if (symbol_type === 'circle') {
      if (join_line === 'true') {
        legend_elems.append('line')
          .attrs((d) => ({
            x1: space_elem + boxgap + max_size / 4 - d.size,
            x2: space_elem + boxgap + max_size * 0.75 + 6.5,
            y1: dist_to_title + max_size - d.size + 0.5,
            y2: dist_to_title + max_size - d.size + 0.5,
            stroke: '#3f3f3f',
            'stroke-width': 0.8,
          }));
        legend_elems
          .append('circle')
          .attrs((d) => {
            if (max_dist === null) {
              max_dist = (space_elem + boxgap + max_size / 4) - d.size;
            }
            return {
              cx: space_elem + boxgap + max_size / 4,
              cy: dist_to_title + max_size - d.size,
              r: d.size,
            };
          })
          .styles({ fill: color_symb_lgd, stroke: stroke_color, 'fill-opacity': 1 });
        last_pos = y_pos2;
        last_size = 0;
        legend_elems.append('text')
          .attrs((d) => ({
            x: space_elem + boxgap + max_size * 0.75 + 7,
            y: dist_to_title + 3 + max_size - d.size,
          }))
          .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
          .text(d => round_value(d.value, rounding_precision).toLocaleString());
      } else {
        legend_elems
          .append('circle')
          .attrs((d) => {
            if (max_dist === null) {
              max_dist = (space_elem + boxgap + max_size / 4) - d.size;
            }
            return {
              cx: space_elem + boxgap + max_size / 4,
              cy: dist_to_title + max_size - d.size,
              r: d.size,
            };
          })
          .styles({ fill: color_symb_lgd, stroke: stroke_color, 'fill-opacity': 1 });
        last_pos = y_pos2;
        last_size = 0;
        legend_elems.append('text')
          .attrs(d => ({
            x: space_elem + boxgap + max_size * 0.75 + 7,
            y: dist_to_title + 1 + max_size - d.size * 2,
          }))
          .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
          .text(d => round_value(d.value, rounding_precision).toLocaleString());
      }
      last_pos = 20 + max_size;
    } else if (symbol_type === 'rect') {
      legend_elems
        .append('rect')
        .attrs((d) => {
          if (max_dist === null) {
            max_dist = space_elem + boxgap;
          }
          return {
            x: space_elem + boxgap,
            y: dist_to_title + max_size / 2 - d.size,
            width: d.size,
            height: d.size,
          };
        })
        .styles({ fill: color_symb_lgd, stroke: stroke_color, 'fill-opacity': 1 });
      last_pos = y_pos2;
      last_size = 0;
      legend_elems.append('text')
        .attrs(d => ({
          x: space_elem + boxgap + max_size / 2 + 7,
          y: dist_to_title + 1 + max_size / 2 - d.size,
        }))
        .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
        .text(d => round_value(d.value, rounding_precision).toLocaleString());
      last_pos = 20 + max_size / 2;
    }
  }

  if (layer_prop.break_val !== undefined) {
    const bottom_colors = legend_root.append('g');
    bottom_colors.insert('text')
      .attrs({
        id: 'col1_txt',
        x: space_elem,
        y: last_pos + 1.75 * space_elem,
      })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .html(`< ${layer_prop.break_val.toLocaleString()}`);
    bottom_colors
      .insert('rect')
      .attrs({
        id: 'col1',
        x: space_elem,
        y: last_pos + 2 * space_elem,
        width: space_elem,
        height: space_elem,
      })
      .style('fill', layer_prop.fill_color.two[0]);
    bottom_colors.insert('text')
      .attrs({
        id: 'col1_txt',
        x: 3 * space_elem,
        y: last_pos + 1.75 * space_elem,
      })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .html(`> ${layer_prop.break_val.toLocaleString()}`);
    bottom_colors
      .insert('rect')
      .attrs({
        id: 'col2',
        x: 3 * space_elem,
        y: last_pos + 2 * space_elem,
        width: space_elem,
        height: space_elem,
      })
      .style('fill', layer_prop.fill_color.two[1]);
    last_pos += 2.5 * space_elem;
  }

  const legend_txt_items = legend_root.append('g')
    .attr('class', 'texts');

  legend_txt_items.insert('text')
    .attrs(subtitle != ''
      ? { 'id': 'legendtitle', x: max_dist, y: 0 }
      : { 'id': 'legendtitle', x: max_dist, y: 15 }
    )
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .text(title);

  legend_txt_items.insert('text')
    .attrs({ id: 'legendsubtitle', x: max_dist, y: 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .text(subtitle);

  legend_txt_items
    .insert('text')
    .attrs({
      id: 'legend_bottom_note',
      x: max_dist,
      y: last_pos + 2 * space_elem
    })
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .text(note_bottom != null ? note_bottom : '');

  legend_root.call(drag_legend_func(legend_root));
  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  if (parent == map) make_legend_context_menu(legend_root, layer);
  return legend_root;
}

export function createLegend_line_symbol(layer, field, title, subtitle, rect_fill_value, rounding_precision, note_bottom) {
  const space_elem = 18,
    boxgap = 12,
    xpos = 30,
    ypos = 30,
    y_pos2 = ypos + space_elem,
    tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`;

  const ref_symbols = document.getElementById(_app.layer_to_id.get(layer)).getElementsByTagName('path');
  const type_param = 'strokeWidth';

  const non_empty = Array.prototype.filter.call(ref_symbols, (d) => d.style[type_param] !== '0'),
    size_max = +non_empty[0].style[type_param].replace('px', ''),
    size_min = +non_empty[non_empty.length - 1].style[type_param].replace('px', ''),
    val_max = Mabs(+non_empty[0].__data__.properties[field]),
    val_min = Mabs(+non_empty[non_empty.length - 1].__data__.properties[field]),
    diff_size = size_max - size_min,
    diff_val = val_max - val_min,
    val_interm1 = val_min + diff_val / 3,
    val_interm2 = val_interm1 + diff_val / 3,
    size_interm1 = size_min + diff_size / 3,
    size_interm2 = size_interm1 + diff_size / 3,
    ref_symbols_params = [
      { size: size_max, value: val_max },
      { size: size_interm2, value: val_interm2 },
      { size: size_interm1, value: val_interm1 },
      { size: size_min, value: val_min },
    ];

  if (rounding_precision === undefined) {
    rounding_precision = get_lgd_display_precision(ref_symbols_params.map(d => d.value));
  }

  const legend_root = map.insert('g')
    .attrs({
      id: 'legend_root_lines_symbol',
      class: tmp_class_name,
      transform: 'translate(0,0)',
      rounding_precision,
      layer_field: field,
      layer_name: layer,
    })
    .styles({
      cursor: 'grab',
      'font-size': '11px',
      'font-family': 'verdana'
    });

  const rect_under_legend = legend_root.insert('rect');

  legend_root.insert('text')
    .attrs(subtitle != ''
      ? { id: 'legendtitle', x: xpos + space_elem, y: ypos }
      : { id: 'legendtitle', x: xpos + space_elem, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .text(title || 'Title');

  legend_root.insert('text')
    .attrs({ id: 'legendsubtitle', x: xpos + space_elem, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .text(subtitle);

  const legend_elems = legend_root.selectAll('.legend')
    .append('g')
    .data(ref_symbols_params)
    .enter()
    .insert('g')
    .attr('class', (d, i) => `lg legend_${i}`);

  let last_size = 0;
  let last_pos = y_pos2;
  const color = data_manager.current_layers[layer].fill_color.single;
  const xrect = xpos + space_elem;

  legend_elems
    .append('rect')
    .styles({
      fill: color,
      stroke: 'rgb(0, 0, 0)',
      'fill-opacity': 1,
      'stroke-width': 0,
    })
    .attrs((d) => {
      last_pos = boxgap + last_pos + last_size;
      last_size = d.size;
      return {
        x: xrect,
        y: last_pos,
        width: 45,
        height: d.size,
      };
    });

  last_pos = y_pos2; last_size = 0;
  const x_text_pos = xrect + 75;
  legend_elems.append('text')
    .attrs((d) => {
      last_pos = boxgap + last_pos + d.size;
      return { x: x_text_pos, y: last_pos + 4 - d.size / 2 };
    })
    .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
    .text(d => round_value(d.value, rounding_precision).toLocaleString());

  legend_root.append('g')
    .insert('text')
    .attrs({
      id: 'legend_bottom_note',
      x: xpos + space_elem,
      y: last_pos + space_elem,
    })
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .text(note_bottom != null ? note_bottom : '');

  legend_root.call(drag_legend_func(legend_root));
  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  legend_root.select('#legendtitle').text(title || '');
  make_legend_context_menu(legend_root, layer);
  return legend_root;
}


const get_lgd_display_precision = function get_lgd_display_precision(breaks) {
  // Set rounding precision to 0 if they are all integers :
  // eslint-disable-next-line no-bitwise
  if (breaks.filter(b => (b | 0) === b).length === breaks.length) {
    return 0;
  }
  // Compute the difference between each break to set
  // ... the rounding precision in order to differenciate each class :
  let diff;
  for (let i = 0; i < (breaks.length - 1); i++) {
    const d = +breaks[i + 1] - +breaks[i];
    if (!diff) diff = d;
    else if (d < diff) diff = d;
  }
  if (diff > 1 || diff > 0.1) {
    return 1;
  } else if (diff > 0.01) {
    return 2;
  } else if (diff > 0.001) {
    return 3;
  } else if (diff > 0.0001) {
    return 4;
  } else if (diff > 0.00001) {
    return 5;
  } else if (diff > 0.000001) {
    return 6;
  } else if (diff > 0.0000001) {
    return 7;
  }
  return undefined;
};

export function createLegend_layout(layer, type_geom, title, subtitle, rect_fill_value, text_value, note_bottom) {
  const space_elem = 18;
  const boxheight = 18;
  const boxwidth = 18;
  const xpos = 30;
  let ypos = 30;
  const tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`;
  const color_layer = data_manager.current_layers[layer].fill_color.single;
  const legend_root = map.insert('g')
    .styles({ cursor: 'grab', 'font-size': '11px', 'font-family': 'verdana' })
    .attrs({
      id: 'legend_root_layout',
      class: tmp_class_name,
      transform: 'translate(0,0)',
      layer_name: layer,
    });
  const rect_under_legend = legend_root.insert('rect');

  legend_root.insert('text')
    .attrs(subtitle != ''
      ? { id: 'legendtitle', x: xpos + boxheight, y: ypos }
      : { id: 'legendtitle', x: xpos + boxheight, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .text(title || '');

  legend_root.insert('text')
    .attrs({ id: 'legendsubtitle', x: xpos + boxheight, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .text(subtitle);

  const legend_elems = legend_root
    .append('g')
    .insert('g')
    .attr('class', 'lg legend_0');

  if (type_geom === 'Polygon') {
    const stroke_color = map.select(`#${_app.layer_to_id.get(layer)}`).select('path').style('stroke');
    const stroke_width = map.select(`#${_app.layer_to_id.get(layer)}`).select('path').style('stroke-width');
    legend_elems
      .append('rect')
      .attrs({
        x: xpos + boxwidth,
        y: ypos + boxheight * 1.8,
        width: boxwidth,
        height: boxheight,
      })
      .styles({
        fill: color_layer,
        stroke: stroke_color,
        'stroke-width': stroke_width,
      });

    legend_elems
      .append('text')
      .attrs({ x: xpos + boxwidth * 2 + 10, y: ypos + boxheight * 2.6 })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .text(text_value);
    ypos += (30 + boxheight);
  } else if (type_geom === 'Line') {
    const stroke_width = +data_manager.current_layers[layer]['stroke-width-const'];
    legend_elems
      .append('rect')
      .styles({
        fill: color_layer,
        stroke: 'rgb(0, 0, 0)',
        'fill-opacity': 1,
        'stroke-width': 0,
      })
      .attrs({
        x: xpos + boxwidth,
        y: ypos + boxheight * 1.9 + (boxheight / 2) - (stroke_width / 2),
        width: boxwidth,
        height: stroke_width,
      });

    legend_elems
      .append('text')
      .attrs({ x: xpos + boxwidth * 2 + 10, y: ypos + boxheight * 2.6 })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .text(text_value);
    ypos = ypos + boxheight * 1.9 + (boxheight / 2) + (stroke_width / 2);
  } else if (type_geom === 'Point') {
    const radius = data_manager.current_layers[layer].pointRadius * svg_map.__zoom.k;
    const stroke_color = map.select(`#${_app.layer_to_id.get(layer)}`).select('path').style('stroke');
    const stroke_width = map.select(`#${_app.layer_to_id.get(layer)}`).style('stroke-width');
    const dist_to_title = 30;
      legend_elems
        .append('circle')
        .styles({
          fill: color_layer,
          stroke: stroke_color,
          'fill-opacity': 1,
          'stroke-width': stroke_width,
        })
        .attrs(d => ({
          cx: xpos + space_elem + 4 + radius / 2,
          cy: ypos + dist_to_title + radius,
          r: radius,
        }));
      legend_elems.append('text')
        .attrs(d => ({
          x: xpos + space_elem + 4 + (radius * 2) * 0.75 + 7,
          y: ypos + dist_to_title + 1 + radius,
        }))
        .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
        .text(text_value);
      ypos = ypos + dist_to_title + 1 + radius * 2;
  }

  legend_root.append('g')
    .insert('text')
    .attrs({ id: 'legend_bottom_note', x: xpos + boxheight, y: ypos + boxheight})
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .text(note_bottom != null ? note_bottom : '');

  legend_root.call(drag_legend_func(legend_root));
  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  make_legend_context_menu(legend_root, layer);
  return legend_root;
}

export function createLegend_choro(layer, field, title, subtitle, box_gap = 0, rect_fill_value, rounding_precision, no_data_txt, note_bottom) {
  const layer_prop = data_manager.current_layers[layer];
  const boxheight = 18,
    boxwidth = 18,
    xpos = 30,
    ypos = 30,
    y_pos2 = ypos + boxheight * 1.8,
    tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`;

  const boxgap = +box_gap;

  let last_pos = null,
    // nb_class,
    data_colors_label;

  if (layer_prop.renderer.indexOf('Categorical') > -1 || layer_prop.renderer.indexOf('PropSymbolsTypo') > -1) {
    data_colors_label = [];
    layer_prop.color_map.forEach((v) => {
      data_colors_label.push({ value: v[1], color: v[0] });
    });
    // nb_class = layer_prop.color_map.size;
  } else if (layer_prop.renderer.indexOf('TypoSymbols') > -1) {
    data_colors_label = [];
    layer_prop.symbols_to_display.forEach((v) => {
      data_colors_label.push({ value: v[2], image: v[0] });
    });
    // nb_class = layer_prop.symbols_map.size;
  } else {
    data_colors_label = layer_prop.colors_breaks.map(obj => ({ value: obj[0], color: obj[1] }));
    // nb_class = layer_prop.colors_breaks.length;
    if (rounding_precision === undefined) {
      const breaks = layer_prop.options_disc.breaks;
      rounding_precision = get_lgd_display_precision(breaks);
    }
  }

  const legend_root = map.insert('g')
    .styles({ cursor: 'grab', 'font-size': '11px', 'font-family': 'verdana' })
    .attrs({
      id: 'legend_root',
      class: tmp_class_name,
      layer_field: field,
      transform: 'translate(0,0)',
      boxgap,
      rounding_precision,
      layer_name: layer,
    });

  const rect_under_legend = legend_root.insert('rect');

  legend_root.insert('text')
    .attrs(subtitle != ''
      ? { id: 'legendtitle', x: xpos + boxheight, y: ypos }
      : { id: 'legendtitle', x: xpos + boxheight, y: ypos + 15 }
    )
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .text(title || '');

  legend_root.insert('text')
    .attrs({ id: 'legendsubtitle', x: xpos + boxheight, y: ypos + 15 })
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .text(subtitle);

  const legend_elems = legend_root.selectAll('.legend')
    .append('g')
    .data(data_colors_label)
    .enter()
    .insert('g')
    .attr('class', (d, i) => `lg legend_${i}`);

  if (layer_prop.renderer.indexOf('TypoSymbols') === -1) {
    legend_elems
      .append('rect')
      .attrs((d, i) => {
        last_pos = y_pos2 + (i * boxgap) + (i * boxheight);
        return {
          x: xpos + boxwidth,
          y: last_pos,
          width: boxwidth,
          height: boxheight,
        };
      })
      .styles(d => ({ fill: d.color, stroke: d.color }));
  } else {
    legend_elems
      .append('image')
      .attrs((d, i) => ({
        x: xpos + boxwidth,
        y: y_pos2 + (i * boxgap) + (i * boxheight),
        width: boxwidth,
        height: boxheight,
        'xlink:href': d.image,
      }));
  }

  if (layer_prop.renderer.indexOf('Choropleth') > -1
        || layer_prop.renderer.indexOf('PropSymbolsChoro') > -1
        || layer_prop.renderer.indexOf('Gridded') > -1
        || layer_prop.renderer.indexOf('Stewart') > -1) {
    let tmp_pos;
    legend_elems
      .append('text')
      .attrs((d, i) => {
        tmp_pos = y_pos2 + i * boxheight + (i * boxgap);
        return { x: xpos + boxwidth * 2 + 10, y: tmp_pos };
      })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .text(d => round_value(+d.value.split(' - ')[1], rounding_precision).toLocaleString());

    legend_root
      .insert('text')
      .attrs({
        id: 'lgd_choro_min_val',
        x: xpos + boxwidth * 2 + 10,
        y: tmp_pos + boxheight + boxgap,
      })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .text(() => round_value(data_colors_label[data_colors_label.length - 1].value.split(' - ')[0], rounding_precision).toLocaleString());
  } else {
    legend_elems
      .append('text')
      .attr('x', xpos + boxwidth * 2 + 10)
      .attr('y', (d, i) => y_pos2 + i * boxheight + (i * boxgap) + (boxheight * 2 / 3))
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .text(d => d.value);
  }
  if (layer_prop.options_disc && layer_prop.options_disc.no_data) {
    const gp_no_data = legend_root.append('g');
    gp_no_data
      .append('rect')
      .attrs({
        x: xpos + boxheight,
        y: last_pos + 2 * boxheight,
        width: boxwidth,
        height: boxheight
      })
      .styles({
        fill: layer_prop.options_disc.no_data,
        stroke: layer_prop.options_disc.no_data,
      });

    gp_no_data
      .append('text')
      .attrs({ x: xpos + boxwidth * 2 + 10, y: last_pos + 2.7 * boxheight, id: 'no_data_txt' })
      .styles({ 'alignment-baseline': 'middle', 'font-size': '10px' })
      .text(no_data_txt != null ? no_data_txt : 'No data');

    last_pos += 2 * boxheight;
  }

  legend_root.append('g')
    .insert('text')
    .attrs({ id: 'legend_bottom_note', x: xpos + boxheight, y: last_pos + 2 * boxheight })
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    })
    .text(note_bottom != null ? note_bottom : '');
  legend_root.call(drag_legend_func(legend_root));
  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  make_legend_context_menu(legend_root, layer);
  return legend_root;
}

export function createLegend_choro_horizontal(layer, field, title, subtitle, box_gap = 0, rect_fill_value, rounding_precision, no_data_txt, note_bottom) {
  const layer_prop = data_manager.current_layers[layer];
  const boxheight = 16,
    boxwidth = 42,
    xpos = 30,
    ypos = 30,
    y_pos2 = ypos + boxheight * 1.8,
    tmp_class_name = `legend legend_feature lgdf_${_app.layer_to_id.get(layer)}`;

  const boxgap = +box_gap;

  const data_colors_label = layer_prop.colors_breaks
    .map(obj => ({ value: obj[0], color: obj[1] }))
    .reverse();
  // const nb_class = data_colors_label;

  if (rounding_precision === undefined) {
    rounding_precision = get_lgd_display_precision(layer_prop.options_disc.breaks);
  }

  const legend_root = map.insert('g')
    .styles({ cursor: 'grab', 'font-size': '11px', 'font-family': 'verdana' })
    .attrs({
      id: 'legend_root_horiz',
      class: tmp_class_name,
      layer_field: field,
      transform: 'translate(0,0)',
      boxgap: boxgap,
      rounding_precision,
      layer_name: layer,
    });

  const rect_under_legend = legend_root.insert('rect');

  const lgd_title = legend_root.insert('text')
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-weight': 'bold',
    })
    .attrs({
      id: 'legendtitle',
      x: xpos + boxwidth,
      y: subtitle !== '' ? ypos : ypos + 15,
      'text-anchor': 'middle',
    });
    // .text(title || '');

  const lgd_subtitle = legend_root.insert('text')
    .styles({
      'font-size': '12px',
      'font-family': 'verdana',
      'font-style': 'italic',
    })
    .attrs({
      id: 'legendsubtitle',
      x: xpos + boxwidth,
      y: ypos + 15,
      'text-anchor': 'middle',
    });
    // .text(subtitle);

  const legend_elems = legend_root.selectAll('.legend')
    .append('g')
    .data(data_colors_label)
    .enter()
    .insert('g')
    .attr('class', (d, i) => `lg legend_${i}`);

  legend_elems
    .append('rect')
    .attr('x', (d, i) => xpos + (boxgap + boxwidth) * i)
    .attr('y', y_pos2)
    .attrs({ width: boxwidth, height: boxheight })
    .styles(d => ({ fill: d.color, stroke: d.color }));

  legend_elems
    .append('text')
    .attr('x', (d, i) => xpos + (boxgap + boxwidth) * i)
    .attr('y', y_pos2 + boxheight + 20)
    .attr('text-anchor', 'middle')
    .styles({ 'font-size': '10px' })
    .text(d => round_value(+d.value.split(' - ')[0], rounding_precision).toLocaleString());

  legend_root
    .insert('text')
    .attrs({
      id: 'lgd_choro_min_val',
      x: xpos + (boxgap + boxwidth) * data_colors_label.length,
      y: y_pos2 + boxheight + 20,
      'text-anchor': 'middle',
    })
    .styles({ 'font-size': '10px' })
    .text(() => round_value(data_colors_label[data_colors_label.length - 1].value.split(' - ')[1], rounding_precision).toLocaleString());

  if (layer_prop.options_disc && layer_prop.options_disc.no_data) {
    const gp_no_data = legend_root.append('g');
    gp_no_data
      .append('rect')
      .attrs({
        x: xpos + boxwidth + (boxgap + boxwidth) * data_colors_label.length,
        y: y_pos2,
        width: boxwidth,
        height: boxheight,
      })
      .styles({
        fill: layer_prop.options_disc.no_data,
        stroke: layer_prop.options_disc.no_data,
      });

    gp_no_data
      .append('text')
      .attrs({
        x: xpos + (boxwidth / 2) + (boxgap + boxwidth) * (data_colors_label.length + 1),
        y: y_pos2 + boxheight + 20,
        id: 'no_data_txt',
        'text-anchor': 'middle',
      })
      .styles({ 'font-size': '10px' })
      .text(no_data_txt != null ? no_data_txt : 'No data');
  }

  const bottom_note = legend_root.append('g')
    .insert('text')
    .attrs({
      id: 'legend_bottom_note',
      x: xpos + boxwidth,
      y: y_pos2 + boxheight + 40,
      'text-anchor': 'middle',
    })
    .styles({
      'font-size': '11px',
      'font-family': 'verdana',
    });

  // Center the title and the subtitle:
  const bb = get_bounding_rect(legend_root.node());
  const x_middle = (bb.x + bb.width / 2);
  lgd_title.attr('x', x_middle).text(title || '');
  lgd_subtitle.attr('x', x_middle).text(subtitle);
  bottom_note.attr('x', x_middle).text(note_bottom != null ? note_bottom : '');
  legend_root.call(drag_legend_func(legend_root));
  make_underlying_rect(legend_root, rect_under_legend, rect_fill_value);
  make_legend_context_menu(legend_root, layer);
  return legend_root;
}


function display_box_value_symbol(layer_name) {
  const symbol_type = data_manager.current_layers[layer_name].symbol,
    field = data_manager.current_layers[layer_name].rendered_field,
    ref_symbols = document.getElementById(_app.layer_to_id.get(layer_name)).getElementsByTagName(symbol_type),
    type_param = symbol_type === 'circle' ? 'r' : 'width';
  const non_empty = Array.prototype.filter.call(ref_symbols, (d) => {
    if (d[type_param].baseVal.value != 0) return d[type_param].baseVal.value;
  });
  const val_max = Mabs(+non_empty[0].__data__.properties[field]);

  const redraw_sample_legend = (() => {
    const legend_node = svg_map.querySelector(['#legend_root_symbol.lgdf_', _app.layer_to_id.get(layer_name)].join(''));
    const rendered_field = data_manager.current_layers[layer_name].rendered_field;
    const nested = legend_node.getAttribute('nested');
    const join_line = legend_node.getAttribute('join_line');
    const rounding_precision = legend_node.getAttribute('rounding_precision');
    const lgd_title = legend_node.querySelector('#legendtitle').innerHTML,
      lgd_subtitle = legend_node.querySelector('#legendsubtitle').innerHTML,
      note = legend_node.querySelector('#legend_bottom_note').innerHTML;
    return (values) => {
      if (values) {
        data_manager.current_layers[layer_name].size_legend_symbol = values.sort((a, b) => b.value - a.value);
        val1.property('value', values[0].value);
        val2.property('value', values[1].value);
        val3.property('value', values[2].value);
        val4.property('value', values[3].value);
      }
      sample_svg.selectAll('g').remove();
      createLegend_symbol(layer_name, rendered_field, lgd_title, lgd_subtitle, nested, join_line, {}, rounding_precision, note, { parent: sample_svg });
      sample_svg.select('g').select('#under_rect').remove();
      sample_svg.select('#legend_root_symbol').on('.drag', null);
    };
  })();

  const prom = make_confirm_dialog2('legend_symbol_values_box', `${layer_name} - ${_tr('app_page.legend_symbol_values_box.title')}`)
    .then((confirmed) => {
      data_manager.current_layers[layer_name].size_legend_symbol = confirmed ? data_manager.current_layers[layer_name].size_legend_symbol : original_values;
      return Promise.resolve(confirmed);
    });

  const box_body = d3.select('.legend_symbol_values_box')
    .select('.modal-content').style('width', '400px')
    .select('.modal-body');
    // .html(_tr("app_page.legend_symbol_values_box.subtitle"));
  let sample_svg = box_body.append('div')
    .attr('id', 'sample_svg')
    .style('float', 'left')
    .append('svg')
    .attrs({
      id: 'svg_sample_legend',
      width: 200,
      height: 300,
      transform: 'translate(20, 40)',
    });

  const values_to_use = [].concat(
    data_manager.current_layers[layer_name].size_legend_symbol.map((f) => cloneObj(f)),
  );
  const [ref_value, ref_size] = data_manager.current_layers[layer_name].size;
  const propSize = new PropSizer(ref_value, ref_size, symbol_type);
  const input_zone = box_body.append('div')
    .styles({
      float: 'right',
      top: '100px',
      right: '20px',
      position: 'relative',
    });
  const a = input_zone.append('p');
  const b = input_zone.append('p');
  const c = input_zone.append('p');
  const d = input_zone.append('p');
  let original_values = [].concat(values_to_use);
  let val1 = a.insert('input')
    .style('width', '80px')
    .attrs({ class: 'without_spinner', type: 'number', max: val_max })
    .property('value', values_to_use[0].value)
    .on('change', function () {
      const val = +this.value;
      if (isNaN(val)) return;
      values_to_use[0] = { size: propSize.scale(val), value: val };
      val2.attr('max', val);
      redraw_sample_legend(values_to_use);
    });
  let val2 = b.insert('input')
    .style('width', '80px')
    .attrs({ class: 'without_spinner', type: 'number', max: values_to_use[0].value, min: values_to_use[2] })
    .property('value', values_to_use[1].value)
    .on('change', function () {
      const val = +this.value;
      if (isNaN(val)) return;
      values_to_use[1] = { size: propSize.scale(val), value: val };
      val1.attr('min', val);
      val3.attr('max', val);
      redraw_sample_legend(values_to_use);
    });
  let val3 = c.insert('input')
    .style('width', '80px')
    .attrs({ class: 'without_spinner', type: 'number', max: values_to_use[1].value, min: values_to_use[3].value })
    .property('value', values_to_use[2].value)
    .on('change', function () {
      const val = +this.value;
      if (isNaN(val)) return;
      values_to_use[2] = { size: propSize.scale(val), value: val };
      val2.attr('min', val);
      val4.attr('max', val);
      redraw_sample_legend(values_to_use);
    });
  let val4 = d.insert('input')
    .style('width', '80px')
    .attrs({ class: 'without_spinner', type: 'number', min: 0, max: values_to_use[2].value })
    .property('value', values_to_use[3].value)
    .on('change', function () {
      const val = +this.value;
      if (isNaN(val)) return;
      values_to_use[3] = { size: propSize.scale(val), value: val };
      val3.attr('min', val);
      redraw_sample_legend(values_to_use);
    });
  box_body.append('div')
    .styles({ clear: 'both', 'text-align': 'center' })
    .append('p')
    .styles({ 'text-align': 'center' })
    .insert('span')
    .attrs({ class: 'button_st3' })
    .html(_tr('app_page.legend_symbol_values_box.reset'))
    .on('click', () => {
      data_manager.current_layers[layer_name].size_legend_symbol = undefined;
      redraw_sample_legend(original_values);
    });

  redraw_sample_legend();
  return prom;
}

// Todo : find a better organization for the options in this box
function createlegendEditBox(legend_id, layer_name) {
  function bind_selections() {
    box_class = [layer_id, '_legend_popup'].join('');
    legend_node = svg_map.querySelector(['#', legend_id, '.lgdf_', layer_id].join(''));
    title_content = legend_node.querySelector('#legendtitle');
    subtitle_content = legend_node.querySelector('#legendsubtitle');
    note_content = legend_node.querySelector('#legend_bottom_note');
    no_data_txt = legend_node.querySelector('#no_data_txt');
    ratio_waffle_txt = legend_node.querySelector('#ratio_txt');
    legend_node_d3 = d3.select(legend_node);
    legend_boxes = legend_node_d3.selectAll(['#', legend_id, ' .lg'].join('')).select('text');
  }
  const layer_id = _app.layer_to_id.get(layer_name);
  let box_class,
    legend_node,
    title_content,
    subtitle_content,
    note_content;

  let legend_node_d3,
    legend_boxes,
    no_data_txt,
    ratio_waffle_txt,
    rect_fill_value = {},
    original_rect_fill_value;

  bind_selections();
  if (document.querySelector(`.${box_class}`)) document.querySelector(`.${box_class}`).remove();
  const original_params = {
    title_content: title_content.textContent,
    y_title: title_content.y.baseVal.getItem(0).value,
    subtitle_content: subtitle_content.textContent,
    y_subtitle: subtitle_content.y.baseVal.getItem(0).value,
    note_content: note_content.textContent,
    no_data_txt: no_data_txt != null ? no_data_txt.textContent : null,
    ratio_waffle_txt: ratio_waffle_txt != null ? ratio_waffle_txt.textContent : null,
    boxgap: +legend_node.getAttribute('boxgap'),
    layout_text_value: legend_id === 'legend_root_layout' ? legend_node.querySelector('.lg.legend_0 > text').innerHTML : undefined,
  }; // , source_content: source_content.textContent ? source_content.textContent : ""

  if (legend_node.getAttribute('visible_rect') === 'true') {
    rect_fill_value = {
      color: legend_node.querySelector('#under_rect').style.fill,
      opacity: legend_node.querySelector('#under_rect').style.fillOpacity,
    };
    original_rect_fill_value = cloneObj(rect_fill_value);
  }

  make_confirm_dialog2(box_class, layer_name)
    .then((confirmed) => {
      if (!confirmed) {
        title_content.textContent = original_params.title_content;
        title_content.y.baseVal.getItem(0).value = original_params.y_title;
        subtitle_content.textContent = original_params.subtitle_content;
        subtitle_content.y.baseVal.getItem(0).value = original_params.y_subtitle;
        note_content.textContent = original_params.note_content;
        if (no_data_txt) {
          no_data_txt.textContent = original_params.no_data_txt;
        } else if (ratio_waffle_txt) {
          ratio_waffle_txt.textContent = original_params.ratio_waffle_txt;
        }
        rect_fill_value = original_rect_fill_value;
        if (original_params.layout_text_value) {
          legend_node.querySelector('.lg.legend_0 > text').innerHTML = original_params.layout_text_value;
        }
      }
      make_underlying_rect(
        legend_node_d3,
        legend_node_d3.select('#under_rect'),
        rect_fill_value,
      );
      bind_selections();
    });
  const container = document.querySelectorAll(`.${box_class}`)[0];
  const box_body = d3.select(container)
    .select('.modal-dialog').style('width', '375px')
    .select('.modal-body');
  let current_nb_dec;

  box_body.append('p').style('text-align', 'center')
    .insert('h3').html(_tr('app_page.legend_style_box.subtitle'));

  const a = box_body.append('p');
  a.append('span')
    .html(_tr('app_page.legend_style_box.lgd_title'));

  a.append('input')
    .style('float', 'right')
    .property('value', title_content.textContent)
    .on('keyup', function () {
      title_content.textContent = this.value;
    });

  const b = box_body.append('p');
  b.insert('span')
    .html(_tr('app_page.legend_style_box.var_name'));
  b.insert('input')
    .style('float', 'right')
    .property('value', subtitle_content.textContent)
    .on('keyup', function () {
      const empty = subtitle_content.textContent == '';
      // Move up the title to its original position if the subtitle isn't empty :
      if (empty && this.value != '') {
        title_content.y.baseVal.getItem(0).value = title_content.y.baseVal.getItem(0).value - 15;
      }
      // Change the displayed content :
      subtitle_content.textContent = this.value;
      // Move down the title (if it wasn't already moved down), if the new subtitle is empty
      if (!empty && subtitle_content.textContent == '') {
        title_content.y.baseVal.getItem(0).value = title_content.y.baseVal.getItem(0).value + 15;
      }
    });

  const c = box_body.insert('p');
  c.insert('span')
    .html(_tr('app_page.legend_style_box.additionnal_notes'));
  c.insert('input')
    .styles({ float: 'right', 'font-family': '12px Gill Sans Extrabold, sans-serif' })
    .property('value', note_content.textContent)
    .on('keyup', function () {
      note_content.textContent = this.value;
    });

  if (no_data_txt) {
    const d = box_body.insert('p');
    d.insert('span')
      .html(_tr('app_page.legend_style_box.no_data'));
    d.insert('input')
      .styles({ float: 'right', 'font-family': '12px Gill Sans Extrabold, sans-serif' })
      .property('value', no_data_txt.textContent)
      .on('keyup', function () {
        no_data_txt.textContent = this.value;
      });
  } else if (ratio_waffle_txt) {
    const d = box_body.insert('p');
    d.insert('span')
      .html(_tr('app_page.legend_style_box.ratio_waffle_txt'));
    d.insert('input')
      .styles({ float: 'right', 'font-family': '12px Gill Sans Extrabold, sans-serif' })
      .property('value', ratio_waffle_txt.textContent)
      .on('keyup', function () {
        ratio_waffle_txt.textContent = this.value;
      });
  }

  if (legend_id === 'legend_root_symbol') {
    const choice_break_value_section1 = box_body.insert('p')
      .styles({ 'text-align': 'center', 'margin-top': '25px !important' });
    choice_break_value_section1.append('span')
      .attr('class', 'button_disc')
      .styles({ cursor: 'pointer' })
      .html(_tr('app_page.legend_style_box.choice_break_symbol'))
      .on('click', () => {
        container.modal.hide();
        display_box_value_symbol(layer_name).then((confirmed) => {
          container.modal.show();
          if (confirmed) {
            redraw_legends_symbols(svg_map.querySelector(
              ['#legend_root_symbol.lgdf_', _app.layer_to_id.get(layer_name)].join('')));
          }
        });
      });
  }
  if ((data_manager.current_layers[layer_name].renderer !== 'TwoStocksWaffle' && data_manager.current_layers[layer_name].renderer !== 'Categorical' && data_manager.current_layers[layer_name].renderer !== 'TypoSymbols')
      && !(data_manager.current_layers[layer_name].renderer === 'PropSymbolsTypo' && legend_id.indexOf('legend_root_symbol') < 0)
      && !data_manager.current_layers[layer_name].layout_legend_displayed) {
    // Float precision for label in the legend
    // (actually it's not really the float precision but an estimation based on
    // the string representation of only two values but it will most likely do the job in many cases)
    let max_nb_decimals = 0;
    let max_nb_left = 0;
    if (legend_id.indexOf('legend_root_symbol') === -1) { //&& legend_id.indexOf('links') === -1) {
      max_nb_decimals = get_max_nb_dec(layer_name);
      max_nb_left = get_max_nb_left_sep(layer_name);
    } else {
      const nb_dec = [],
        nb_left = [];
      legend_boxes.each((d) => {
        nb_dec.push(get_nb_decimals(d.value));
        nb_left.push(get_nb_left_separator(d.value));
      });
      max_nb_decimals = max_fast(nb_dec);
      max_nb_left = min_fast(nb_left);
    }
    max_nb_left = max_nb_left > 2 ? max_nb_left : 2;
    if (max_nb_decimals > 0 || max_nb_left >= 2) {
      if (legend_node.getAttribute('rounding_precision')) {
        current_nb_dec = legend_node.getAttribute('rounding_precision');
      } else {
        const nbs = [],
          nb_dec = [];
        legend_boxes.each(function () { nbs.push(this.textContent); });
        for (let i = 0; i < nbs.length; i++) {
          nb_dec.push(get_nb_decimals(nbs[i]));
        }
        current_nb_dec = max_fast(nb_dec);
      }
      if (max_nb_decimals > +current_nb_dec && max_nb_decimals > 18) { max_nb_decimals = 18; }
      const e = box_body.append('div')
        .attr('class', 'line_elem');

      e.append('span')
        .style('flex', 0.9)
        .html(_tr('app_page.legend_style_box.float_rounding'));

      e.append('span')
        .attr('id', 'precision_change_txt')
        .html(`${current_nb_dec}`);

      e.append('input')
        .attrs({
          id: 'precision_range',
          type: 'range',
          min: -(+max_nb_left),
          max: max_nb_decimals,
          step: 1,
        })
        .styles({
          width: '90px',
          'vertical-align': 'middle',
        })
        .property('value', current_nb_dec)
        .on('change', function () {
          const nb_float = +this.value;
          d3.select('#precision_change_txt').html(nb_float);
          legend_node.setAttribute('rounding_precision', nb_float);
          if (legend_id === 'legend_root') {
            for (let i = 0; i < legend_boxes._groups[0].length; i++) {
              const values = legend_boxes._groups[0][i].__data__.value.split(' - ');
              legend_boxes._groups[0][i].innerHTML = round_value(+values[1], nb_float).toLocaleString();
            }
            const min_val = +legend_boxes._groups[0][legend_boxes._groups[0].length - 1].__data__.value.split(' - ')[0];
            legend_node.querySelector('#lgd_choro_min_val').innerHTML = round_value(min_val, nb_float).toLocaleString();
          } else if (legend_id === 'legend_root_horiz') {
            for (let i = 0; i < legend_boxes._groups[0].length; i++) {
              const values = legend_boxes._groups[0][i].__data__.value.split(' - ');
              legend_boxes._groups[0][i].innerHTML = round_value(+values[0], nb_float).toLocaleString();
            }
            const min_val = +legend_boxes._groups[0][legend_boxes._groups[0].length - 1].__data__.value.split(' - ')[1];
            legend_node.querySelector('#lgd_choro_min_val').innerHTML = round_value(min_val, nb_float).toLocaleString();
          } else if (legend_id === 'legend_root_symbol') {
            for (let i = 0; i < legend_boxes._groups[0].length; i++) {
              const value = legend_boxes._groups[0][i].__data__.value;
              legend_boxes._groups[0][i].innerHTML = round_value(+value, nb_float).toLocaleString();
            }
          } else if (legend_id === 'legend_root_lines_class') {
            for (let i = 0; i < legend_boxes._groups[0].length; i++) {
              const value = legend_boxes._groups[0][i].__data__.value[1];
              legend_boxes._groups[0][i].innerHTML = round_value(+value, nb_float).toLocaleString();
            }
            const min_val = +legend_boxes._groups[0][legend_boxes._groups[0].length - 1].__data__.value[0];
            legend_node.querySelector('#lgd_choro_min_val').innerHTML = round_value(min_val, nb_float).toLocaleString();
          }
        });
    }
  }

  if (legend_id === 'legend_root' || legend_id === 'legend_root_horiz') {
    const current_state = +legend_node.getAttribute('boxgap') === 0;
    const gap_section = box_body.insert('div')
      .attr('class', 'line_elem');

    gap_section.append('label')
      .attrs({ for: 'style_lgd', class: 'i18n', 'data-i18n': '[html]app_page.legend_style_box.gap_boxes' })
      .html(_tr('app_page.legend_style_box.gap_boxes'));

    gap_section.append('input')
      .style('margin-left', '0px')
      .attrs({ type: 'checkbox', id: 'style_lgd' })
      .property('checked', current_state)
      .on('change', () => {
        const rendered_field = data_manager.current_layers[layer_name].rendered_field2
          ? data_manager.current_layers[layer_name].rendered_field2
          : data_manager.current_layers[layer_name].rendered_field;
        legend_node = svg_map.querySelector(`#${legend_id}.lgdf_${_app.layer_to_id.get(layer_name)}`);
        const boxgap = +legend_node.getAttribute('boxgap') === 0 ? 4 : 0;
        const rounding_precision = legend_node.getAttribute('rounding_precision');
        const transform_param = legend_node.getAttribute('transform'),
          lgd_title = legend_node.querySelector('#legendtitle').innerHTML,
          lgd_subtitle = legend_node.querySelector('#legendsubtitle').innerHTML,
          note = legend_node.querySelector('#legend_bottom_note').innerHTML;
        let _no_data_txt = legend_node.querySelector('#no_data_txt');
        _no_data_txt = _no_data_txt != null ? _no_data_txt.textContent : null;
        legend_node.remove();
        if (legend_id === 'legend_root') {
          createLegend_choro(
            layer_name,
            rendered_field,
            lgd_title,
            lgd_subtitle,
            boxgap,
            rect_fill_value,
            rounding_precision,
            _no_data_txt,
            note,
          );
        } else if (legend_id === 'legend_root_horiz') {
          createLegend_choro_horizontal(
            layer_name,
            rendered_field,
            lgd_title,
            lgd_subtitle,
            boxgap,
            rect_fill_value,
            rounding_precision,
            _no_data_txt,
            note,
          );
        }
        bind_selections();
        if (transform_param) {
          svg_map.querySelector(`#${legend_id}.lgdf_${_app.layer_to_id.get(layer_name)}`)
            .setAttribute('transform', transform_param);
        }
      });
  } else if (legend_id === 'legend_root_symbol') {
    const type_symbol = data_manager.current_layers[layer_name].symbol;
    const current_state_nested = legend_node.getAttribute('nested') === 'true';
    const gap_section = box_body.insert('div')
      .attr('class', 'line_elem');

    gap_section.append('label')
      .attrs({ for: 'style_lgd', class: 'i18n', 'data-i18n': '[html]app_page.legend_style_box.nested_symbols' })
      .html(_tr('app_page.legend_style_box.nested_symbols'));

    gap_section.append('input')
      .style('margin-left', '0px')
      .attrs({ id: 'style_lgd', type: 'checkbox' })
      .property('checked', current_state_nested)
      .on('change', function () {
        join_line_section.style('display', this.checked && (type_symbol === 'circle') ? null : 'none');
        legend_node = svg_map.querySelector(['#legend_root_symbol.lgdf_', _app.layer_to_id.get(layer_name)].join(''));
        const rendered_field = data_manager.current_layers[layer_name].rendered_field;
        const nested = this.checked ? 'true' : 'false';
        const join_line = join_line_section.select('input').property('checked') ? 'true' : 'false';
        const rounding_precision = legend_node.getAttribute('rounding_precision');
        const transform_param = legend_node.getAttribute('transform'),
          lgd_title = legend_node.querySelector('#legendtitle').innerHTML,
          lgd_subtitle = legend_node.querySelector('#legendsubtitle').innerHTML,
          note = legend_node.querySelector('#legend_bottom_note').innerHTML;

        legend_node.remove();
        createLegend_symbol(layer_name, rendered_field, lgd_title, lgd_subtitle, nested, join_line, rect_fill_value, rounding_precision, note);
        bind_selections();
        if (transform_param) {
          svg_map.querySelector(['#legend_root_symbol.lgdf_', _app.layer_to_id.get(layer_name)].join(''))
            .setAttribute('transform', transform_param);
        }
      });

    const current_state_line = legend_node.getAttribute('join_line') === 'true';
    const join_line_section = box_body.insert('div')
      .attr('class', 'line_elem')
      .style('display', current_state_nested && (type_symbol === 'circle') ? null : 'none');

    join_line_section.append('label')
      .attrs({ for: 'style_lgd_join_line', class: 'i18n', 'data-i18n': '[html]app_page.legend_style_box.join_line' })
      .html(_tr('app_page.legend_style_box.join_line'));

    join_line_section.append('input')
      .style('margin-left', '0px')
      .attrs({ id: 'style_lgd_join_line', type: 'checkbox' })
      .property('checked', current_state_line)
      .on('change', function () {
        legend_node = svg_map.querySelector(['#legend_root_symbol.lgdf_', _app.layer_to_id.get(layer_name)].join(''));
        const rendered_field = data_manager.current_layers[layer_name].rendered_field;
        const nested = legend_node.getAttribute('nested') === 'true' ? 'true' : 'false';
        const join_line = this.checked ? 'true' : 'false';
        const rounding_precision = legend_node.getAttribute('rounding_precision');
        const transform_param = legend_node.getAttribute('transform'),
          lgd_title = legend_node.querySelector('#legendtitle').innerHTML,
          lgd_subtitle = legend_node.querySelector('#legendsubtitle').innerHTML,
          note = legend_node.querySelector('#legend_bottom_note').innerHTML;

        legend_node.remove();
        createLegend_symbol(
          layer_name,
          rendered_field,
          lgd_title,
          lgd_subtitle,
          nested,
          join_line,
          rect_fill_value,
          rounding_precision,
          note,
        );
        bind_selections();
        if (transform_param) {
          svg_map.querySelector(['#legend_root_symbol.lgdf_', _app.layer_to_id.get(layer_name)].join(''))
            .setAttribute('transform', transform_param);
        }
      });
  } else if (legend_id === 'legend_root_layout') {
    const text_value_section = box_body.insert('p');
    text_value_section.insert('span')
      .html(_tr('app_page.legend_style_box.layout_legend_text_value'));
    text_value_section.insert('input')
      .styles({ float: 'right', 'font-family': '12px Gill Sans Extrabold, sans-serif' })
      .property('value', legend_node.querySelector('.lg.legend_0 > text').innerHTML)
      .on('keyup', function () {
        legend_node.querySelector('.lg.legend_0 > text').innerHTML = this.value;
      });
  }
// Todo : Reactivate this functionnality :
//    box_body.insert("p").html("Display features count ")
//            .insert("input").attr("type", "checkbox")
//            .on("change", function(){
//                alert("to be done!");
//            });

  const rectangle_options1 = box_body.insert('div')
    .attr('class', 'line_elem');

  rectangle_options1.append('label')
    .attrs({ for: 'rect_lgd_checkbox', class: 'i18n', 'data-i18n': '[html]app_page.legend_style_box.under_rectangle' })
    .html(_tr('app_page.legend_style_box.under_rectangle'));

  const rect_color = rectangle_options1.insert('input')
    .attrs({ id: 'choice_color_under_rect', type: 'color' })
    .style('display', rect_fill_value.color === undefined ? 'none' : null)
    .property('value', rect_fill_value.color === undefined ? '#ffffff' : rgb2hex(rect_fill_value.color))
    .on('change', function () {
      rect_fill_value = { color: this.value, opacity: 1 };
      make_underlying_rect(legend_node_d3, legend_node_d3.select('#under_rect'), rect_fill_value);
    });

  rectangle_options1.insert('input')
    .style('margin-left', '0px')
    .property('checked', rect_fill_value.color === undefined ? null : true)
    .attrs({ type: 'checkbox', id: 'rect_lgd_checkbox' })
    .on('change', function () {
      if (this.checked) {
        rect_color.style('display', '');
        const r = document.getElementById('choice_color_under_rect');
        rect_fill_value = r ? { color: r.value, opacity: 1 } : { color: '#ffffff', opacity: 1 };
      } else {
        rect_color.style('display', 'none');
        rect_fill_value = {};
      }
      make_underlying_rect(
        legend_node_d3,
        legend_node_d3.select('#under_rect'),
        rect_fill_value,
      );
    });

  if (legend_id === 'legend_root_horiz'
      || (legend_id === 'legend_root'
        && data_manager.current_layers[layer_name].options_disc)) {
    const change_legend_type = box_body.insert('p');
    // Vertical layout option:
    change_legend_type.append('p')
      .attr('id', 'vert_layout')
      .attr('class', legend_id === 'legend_root' ? 'opts_lgd_layout selected' : 'opts_lgd_layout')
      .text(_tr('app_page.legend_style_box.lgd_layout_vertical'));
    // Horizontal layout option:
    change_legend_type.append('p')
      .attr('id', 'horiz_layout')
      .attr('class', legend_id !== 'legend_root' ? 'opts_lgd_layout selected' : 'opts_lgd_layout')
      .text(_tr('app_page.legend_style_box.lgd_layout_horizontal'));

    change_legend_type.selectAll('.opts_lgd_layout')
      .on('click', function () {
        if (this.classList.contains('selected')) { return; }
        change_legend_type.selectAll('.opts_lgd_layout').attr('class', 'opts_lgd_layout');
        this.classList.add('selected');
        const rendered_field = data_manager.current_layers[layer_name].rendered_field2
          ? data_manager.current_layers[layer_name].rendered_field2
          : data_manager.current_layers[layer_name].rendered_field;
        legend_node = svg_map.querySelector(`#${legend_id}.lgdf_${_app.layer_to_id.get(layer_name)}`);
        const boxgap = +legend_node.getAttribute('boxgap');
        const rounding_precision = legend_node.getAttribute('rounding_precision');
        const transform_param = legend_node.getAttribute('transform'),
          lgd_title = legend_node.querySelector('#legendtitle').innerHTML,
          lgd_subtitle = legend_node.querySelector('#legendsubtitle').innerHTML,
          note = legend_node.querySelector('#legend_bottom_note').innerHTML;
        let _no_data_txt = legend_node.querySelector('#no_data_txt');
        _no_data_txt = _no_data_txt != null ? _no_data_txt.textContent : null;
        legend_node.remove();

        if (this.id === 'horiz_layout') {
          createLegend_choro_horizontal(
            layer_name,
            rendered_field,
            lgd_title,
            lgd_subtitle,
            boxgap,
            rect_fill_value,
            rounding_precision,
            _no_data_txt,
            note,
          );
          legend_id = 'legend_root_horiz';
        } else {
          createLegend_choro(
            layer_name,
            rendered_field,
            lgd_title,
            lgd_subtitle,
            boxgap,
            rect_fill_value,
            rounding_precision,
            _no_data_txt,
            note,
          );
          legend_id = 'legend_root';
        }
        bind_selections();
        if (transform_param) {
          svg_map.querySelector(`#${legend_id}.lgdf_${_app.layer_to_id.get(layer_name)}`)
            .setAttribute('transform', transform_param);
        }
      });
  }
}

export function move_legends() {
  const xy0_map = get_map_xy0();
  const dim_width = w + xy0_map.x;
  const dim_height = h + xy0_map.y;

  // Move the legends and the scale bar according to svg map resizing:
  const legends = [
    svg_map.querySelectorAll('.legend_feature'),
    svg_map.querySelectorAll('#scale_bar.legend'),
  ];
  for (let j = 0; j < 2; ++j) {
    const legends_type = legends[j];
    for (let i = 0, i_len = legends_type.length; i < i_len; ++i) {
      const legend_bbox = legends_type[i].getBoundingClientRect();
      if ((legend_bbox.left + legend_bbox.width) > dim_width) {
        const current_transform = legends_type[i].getAttribute('transform');
        const [val_x, val_y] = /\(([^\)]+)\)/.exec(current_transform)[1].split(/[ ,]+/);
        const trans_x = legend_bbox.left + legend_bbox.width - dim_width;
        legends_type[i].setAttribute(
          'transform',
          ['translate(', [+val_x - trans_x, val_y], ')'].join(''),
        );
      }
      if ((legend_bbox.top + legend_bbox.height) > dim_height) {
        const current_transform = legends_type[i].getAttribute('transform');
        const [val_x, val_y] = /\(([^\)]+)\)/.exec(current_transform)[1].split(/[ ,]+/);
        const trans_y = legend_bbox.top + legend_bbox.height - dim_height;
        legends_type[i].setAttribute(
          'transform',
          ['translate(', [val_x, +val_y - trans_y], ')'].join(''),
        );
      }
    }
  }

  // Move the text_annotation according to svg map resizing:
  const text_annot = document.querySelectorAll('.txt_annot');
  for (let i = 0, len_i = text_annot.length; i < len_i; i++) {
    const legend_bbox = text_annot[i].getBoundingClientRect();
    if ((legend_bbox.left + legend_bbox.width) > dim_width) {
      const trans_x = legend_bbox.left + legend_bbox.width - dim_width;
      const annot = d3.select(text_annot[i]);
      const x_rect = +annot.select('rect').attr('x') - trans_x;
      const x_txt = +annot.select('text').attr('x') - trans_x;
      if (x_txt > 0) {
        annot.select('rect')
          .attr('x', x_rect);
        annot.select('text')
          .attr('x', x_txt)
          .selectAll('tspan')
          .attr('x', x_txt);
      }
    }
    if ((legend_bbox.top + legend_bbox.height) > dim_height) {
      const trans_y = legend_bbox.top + legend_bbox.height - dim_height;
      const annot = d3.select(text_annot[i]);
      const y_rect = +annot.select('rect').attr('y') - trans_y;
      const y_txt = +annot.select('text').attr('y') - trans_y;
      if (y_txt > 0) {
        annot.select('rect')
          .attr('y', y_rect);
        annot.select('text')
          .attr('y', y_txt);
      }
    }
  }
}

const get_max_nb_dec = function get_max_nb_dec(layer_name) {
  if (!(data_manager.current_layers[layer_name])
      || !(data_manager.current_layers[layer_name].colors_breaks)) {
    return undefined;
  }
  let max = 0;
  data_manager.current_layers[layer_name].colors_breaks.forEach((el) => {
    const tmp = el[0].split(' - ');
    const p1 = tmp[0].indexOf('.');
    const p2 = tmp[1].indexOf('.');
    if (p1 > -1) {
      if (tmp[0].length - 1 - p1 > max) { max = tmp[0].length - 1 - tmp[0].indexOf('.'); }
    }
    if (p2 > -1) {
      if (tmp[1].length - 1 - p2 > max) { max = tmp[1].length - 1 - tmp[1].indexOf('.'); }
    }
  });
  return max;
};

// function _get_max_nb_left_sep(values) {
//   return max_fast(values.map(d => (`${d}`).split('.')[0].length));
// }

const get_max_nb_left_sep = function get_max_nb_left_sep(layer_name) {
  if (!(data_manager.current_layers[layer_name])
      || !(data_manager.current_layers[layer_name].colors_breaks)) {
    return undefined;
  }
  const nb_left = [];
  data_manager.current_layers[layer_name].colors_breaks.forEach((el) => {
    const tmp = el[0].split(' - ');
    const p1 = tmp[0].indexOf('.');
    const p2 = tmp[1].indexOf('.');
    nb_left.push(p1);
    nb_left.push(p2);
  });
  return min_fast(nb_left);
};
