import alertify from 'alertifyjs';
import UserArrow from './arrow';
import UserEllipse from './ellipse';
import { northArrow } from './north_arrow';
import UserRectangle from './rectangle';
import { scaleBar } from './scalebar';
import Textbox from './text_annotation';
import ContextMenu from './../context-menu';
import { check_layer_name } from './../function';
import { create_li_layer_elem, drag_elem_geo } from './../helpers';
import { Mround } from './../helpers_math';
import { prepare_available_symbols, setSphereBottom } from './../interface';
import { up_legends, up_legend, down_legend } from './../legend';
import { zoom_without_redraw } from './../map_ctrl';
import { isInterrupted } from './../projections';
import { box_choice_symbol, make_style_box_indiv_symbol } from './../symbols_picto';


function ask_existing_feature(feature_name) {
  return swal({
    title: '',
    text: _tr(`app_page.common.error_existing_${feature_name}`),
    allowOutsideClick: false,
    allowEscapeKey: false,
    type: 'question',
    showConfirmButton: true,
    showCancelButton: true,
    confirmButtonText: _tr('app_page.common.yes'),
    cancelButtonText: _tr('app_page.common.no'),
  });
}

const getIdLayoutFeature = (type) => {
  let class_name,
    id_prefix,
    error_name;
  if (type === 'ellipse') {
    class_name = 'user_ellipse';
    id_prefix = 'user_ellipse_';
    error_name = 'error_max_ellipses';
  } else if (type === 'rectangle') {
    class_name = 'user_rectangle';
    id_prefix = 'user_rectangle_';
    error_name = 'error_max_rectangles';
  } else if (type === 'arrow') {
    class_name = 'arrow';
    id_prefix = 'arrow_';
    error_name = 'error_max_arrows';
  } else if (type === 'single_symbol') {
    class_name = 'single_symbol';
    id_prefix = 'single_symbol_';
    error_name = 'error_max_symbols';
  }
  const features = document.getElementsByClassName(class_name);
  if (!features) {
    return 0;
  } else if (features.length > 30) {
    swal(_tr('app_page.common.error'), _tr(`app_page.common.${error_name}`), 'error').catch(swal.noop);
    return null;
  }
  const ids = [];
  for (let i = 0; i < features.length; i++) {
    ids.push(+features[i].id.split(id_prefix)[1]);
  }
  if (ids.indexOf(features.length) === -1) {
    return features.length;
  }
  for (let i = 0; i < features.length; i++) {
    if (ids.indexOf(i) === -1) {
      return i;
    }
  }
  return null;
};


function handleClickAddRectangle() {
  const esc_cancel = function esc_cancel(evt) {
    evt = evt || window.event;
    if (('key' in evt && (
        evt.key !== 'Escape' && evt.key !== 'Esc')) || evt.keyCode !== 27) {
      return;
    }
    msg.dismiss();
    map.select('.brush_rect_draw').remove();
    document.body.style.cursor = '';
    document.removeEventListener('keydown', esc_cancel);
  };
  function rectbrushended() {
    if (!d3.event.selection) {
      map.select('.brush_rect_draw').remove();
      document.body.style.cursor = '';
      msg.dismiss();
      document.removeEventListener('keydown', esc_cancel);
      alertify.notify(_tr('app_page.notification.brush_map_cancelled'), 'warning', 5);
      return;
    }
    msg.dismiss();
    const k = svg_map.__zoom.k;
    const wi = (d3.event.selection[1][0] - d3.event.selection[0][0]) / k;
    const he = (d3.event.selection[1][1] - d3.event.selection[0][1]) / k;
    new UserRectangle(`user_rectangle_${rectangle_id}`, d3.event.selection[0], svg_map, false, wi, he);
    map.select('.brush_rect_draw').remove();
    document.removeEventListener('keydown', esc_cancel);
    document.body.style.cursor = '';
  }
  const rectangle_id = getIdLayoutFeature('rectangle');
  if (rectangle_id === null) {
    return;
  }
  const msg = alertify.notify(_tr('app_page.notification.instruction_brush_map'), 'warning', 0);
  document.addEventListener('keydown', esc_cancel);
  document.body.style.cursor = 'not-allowed';
  const _brush = d3.brush().on('end', rectbrushended);
  map.append('g')
    .attr('class', 'brush_rect_draw')
    .call(_brush);
}

function handleClickAddOther(type) {
  const esc_cancel = function esc_cancel(evt) {
    evt = evt || window.event;
    if (('key' in evt && (
        evt.key !== 'Escape' && evt.key !== 'Esc')) || evt.keyCode !== 27) {
      return;
    }
    msg.dismiss();
    document.body.style.cursor = '';
    map.style('cursor', '').on('click', null);
    document.removeEventListener('keydown', esc_cancel);
  };
  const msg = alertify.notify(_tr('app_page.notification.instruction_click_map'), 'warning', 0);
  document.addEventListener('keydown', esc_cancel);
  document.body.style.cursor = 'not-allowed';
  map.style('cursor', 'crosshair')
    .on('click', () => {
      msg.dismiss();
      document.removeEventListener('keydown', esc_cancel);
      map.style('cursor', '').on('click', null);
      document.body.style.cursor = '';
      if (type === 'north_arrow') {
        northArrow.display(d3.event.layerX, d3.event.layerY);
      } else if (type === 'scalebar') {
        scaleBar.create(d3.event.layerX, d3.event.layerY);
      }
    });
}

function handleClickAddEllipse() {
  const esc_cancel = function esc_cancel(evt) {
    evt = evt || window.event;
    if (('key' in evt && (
        evt.key !== 'Escape' && evt.key !== 'Esc')) || evt.keyCode !== 27) {
      return;
    }
    msg.dismiss();
    document.body.style.cursor = '';
    map.style('cursor', '').on('click', null);
    document.removeEventListener('keydown', esc_cancel);
  };
  const ellipse_id = getIdLayoutFeature('ellipse');
  if (ellipse_id === null) {
    return;
  }
  document.body.style.cursor = 'not-allowed';
  let start_point,
    tmp_start_point;
  const msg = alertify.notify(_tr('app_page.notification.instruction_click_map'), 'warning', 0);
  document.addEventListener('keydown', esc_cancel);
  map.style('cursor', 'crosshair')
    .on('click', () => {
      msg.dismiss();
      document.removeEventListener('keydown', esc_cancel);
      start_point = [d3.event.layerX, d3.event.layerY];
      tmp_start_point = map.append('rect')
        .attrs({ x: start_point[0] - 2, y: start_point[1] - 2, height: 4, width: 4 })
        .style('fill', 'red');
      setTimeout(() => { tmp_start_point.remove(); }, 1000);
      map.style('cursor', '').on('click', null);
      document.body.style.cursor = '';
      new UserEllipse(`user_ellipse_${ellipse_id}`, start_point, svg_map);
    });
}

function handleClickTextBox(text_box_id) {
  const esc_cancel = function esc_cancel(evt) {
    evt = evt || window.event;
    if (('key' in evt && (
        evt.key !== 'Escape' && evt.key !== 'Esc')) || evt.keyCode !== 27) {
      return;
    }
    msg.dismiss();
    document.body.style.cursor = '';
    map.style('cursor', '').on('click', null);
    document.removeEventListener('keydown', esc_cancel);
  };
  const msg = alertify.notify(_tr('app_page.notification.instruction_click_map'), 'warning', 0);
  document.body.style.cursor = 'not-allowed';
  map.style('cursor', 'crosshair')
    .on('click', () => {
      msg.dismiss();
      document.removeEventListener('keydown', esc_cancel);
      map.style('cursor', '').on('click', null);
      document.body.style.cursor = '';
      const text_box = new Textbox(svg_map, text_box_id, [d3.event.layerX, d3.event.layerY]);
      setTimeout(() => { text_box.editStyle(); }, 350);
    });
  document.addEventListener('keydown', esc_cancel);
}

function handleClickAddPicto() {
  const esc_cancel = function esc_cancel(evt) {
    evt = evt || window.event;
    if (('key' in evt && (
        evt.key !== 'Escape' && evt.key !== 'Esc')) || evt.keyCode !== 27) {
      return;
    }
    msg.dismiss();
    document.body.style.cursor = '';
    map.style('cursor', '').on('click', null);
    document.removeEventListener('keydown', esc_cancel);
  };

  const on_result = (result) => {
    if (result) {
      add_single_symbol(
        result.split('url(')[1].substring(1).slice(0, -2),
        click_pt[0],
        click_pt[1],
        45,
        45,
        `single_symbol_${symbol_id}`,
      );
    }
  };

  const display_box_symbol = () => {
    box_choice_symbol(_app.default_symbols).then(on_result);
  }

  const symbol_id = getIdLayoutFeature('single_symbol');
  if (symbol_id === null) {
    return;
  }
  const msg = alertify.notify(_tr('app_page.notification.instruction_click_map'), 'warning', 0);
  document.addEventListener('keydown', esc_cancel);
  let map_point,
    click_pt,
    prep_symbols,
    available_symbols = false;

  if (!(_app.default_symbols) || _app.default_symbols.length === 0) {
    _app.default_symbols = [];
    prep_symbols = prepare_available_symbols();
  } else {
    available_symbols = true;
  }

  document.body.style.cursor = 'not-allowed';
  map.style('cursor', 'crosshair')
    .on('click', () => {
      msg.dismiss();
      document.removeEventListener('keydown', esc_cancel);
      click_pt = [d3.event.layerX, d3.event.layerY];
      map_point = map.append('rect')
        .attrs({ x: click_pt[0] - 2, y: click_pt[1] - 2, height: 4, width: 4 })
        .style('fill', 'red');
      setTimeout(() => {
        map_point.remove();
      }, 500);
      map.style('cursor', '').on('click', null);
      document.body.style.cursor = '';
      if (!available_symbols) {
        prep_symbols.then(display_box_symbol);
      } else {
        display_box_symbol();
      }
    });
}


// function handleFreeDraw(){
//     var line_gen = d3.line(d3.curveBasis);
//     var draw_layer = map.select('#_m_free_draw_layer');
//     if(!draw_layer.node()){
//         draw_layer = map.append('g').attrs({id: "_m_free_draw_layer"});
//     } else {
//         // up the draw_layer ?
//     }
//     var draw_rect = draw_layer.append('rect')
//         .attrs({fill: 'transparent', height: h, width: w, x: 0, y:0});
//     draw_layer.call(d3.drag()
//         .container(function(){ return this; })
//         .subject(_ =>  [[d3.event.x, d3.event.y], [d3.event.x, d3.event.y]])
//         .on('start', _ => {
//             handle_click_hand('lock');
//             let d = d3.event.subject,
//                 active_line = draw_layer.append('path').datum(d),
//                 x0 = d3.event.x,
//                 y0 = d3.event.y;
//             d3.event.on('drag', function(){
//                 var x1 = d3.event.x,
//                     y1 = d3.event.y,
//                     dx = x1 - x0,
//                     dy = y1 - y0;
//                 if(dx * dx + dy * dy > 100) d.push([x0 = x1, y0 = y1]);
//                 else d[d.length -1] = [x1, y1];
//                 active_line.attr('d', line_gen)
//             });
//         }));
// }

function handleClickAddArrow() {
  const esc_cancel = function esc_cancel(evt) {
    evt = evt || window.event;
    if (('key' in evt && (
        evt.key !== 'Escape' && evt.key !== 'Esc')) || evt.keyCode !== 27) {
      return;
    }
    msg.dismiss();
    document.body.style.cursor = '';
    map.style('cursor', '').on('click', null);
    if (tmp_start_point && tmp_start_point.remove) {
      tmp_start_point.remove();
    }
    document.removeEventListener('keydown', esc_cancel);
  };
  const arrow_id = getIdLayoutFeature('arrow');
  if (arrow_id === null) {
    return;
  }
  let start_point,
    tmp_start_point,
    end_point,
    tmp_end_point;
  document.body.style.cursor = 'not-allowed';
  let msg = alertify.notify(_tr('app_page.notification.instruction_click_map_arrow1'), 'warning', 0);
  document.addEventListener('keydown', esc_cancel);
  map.style('cursor', 'crosshair')
    .on('click', () => {
      if (!start_point) {
        start_point = [d3.event.layerX, d3.event.layerY];
        tmp_start_point = map.append('rect')
          .attrs({ x: start_point[0] - 2, y: start_point[1] - 2, height: 4, width: 4 })
          .style('fill', 'red');
        msg.dismiss();
        msg = alertify.notify(_tr('app_page.notification.instruction_click_map_arrow2'), 'warning', 0);
      } else {
        end_point = [d3.event.layerX, d3.event.layerY];
        tmp_end_point = map.append('rect')
          .attrs({ x: end_point[0] - 2, y: end_point[1] - 2, height: 4, width: 4 })
          .style('fill', 'red');
      }
      if (start_point && end_point) {
        msg.dismiss();
        document.removeEventListener('keydown', esc_cancel);
        setTimeout(() => {
          tmp_start_point.remove();
          tmp_end_point.remove();
        }, 1000);
        map.style('cursor', '').on('click', null);
        document.body.style.cursor = '';
        new UserArrow(`arrow_${arrow_id}`, start_point, end_point, svg_map);
      }
    });
}

export function add_layout_feature(selected_feature, options = {}) {
  if (document.body.style.cursor === 'not-allowed') {
    return;
  }
  if (selected_feature === 'text_annot') {
    const existing_annotation = document.getElementsByClassName('txt_annot');
    let existing_id = [];
    let new_id;
    if (existing_annotation) {
      existing_id = Array.prototype.map.call(
        existing_annotation,
        elem => +elem.id.split('text_annotation_')[1]);
    }
    for (let i = 0; i < 50; i++) {
      if (existing_id.indexOf(i) === -1) {
        existing_id.push(i);
        new_id = ['text_annotation_', i].join('');
        break;
      }
    }
    if (!(new_id)) {
      swal(`${_tr('app_page.common.error')}!`, _tr('app_page.common.error_max_text_annot'), 'error');
      return;
    }
    handleClickTextBox(new_id);
  } else if (selected_feature === 'sphere') {
    // if(data_manager.current_layers.Sphere) return;
    const layer_to_add = check_layer_name(options.layer_name || 'Sphere');
    const layer_id = encodeId(layer_to_add);
    const fill = options.fill || '#add8e6';
    const fill_opacity = options.fill_opacity || 0.2;
    const stroke_width = options.stroke_width || '0.5px';
    const stroke_opacity = options.stroke_opacity || 1;
    const stroke = options.stroke || '#ffffff';
    _app.layer_to_id.set(layer_to_add, layer_id);
    _app.id_to_layer.set(layer_id, layer_to_add);
    data_manager.current_layers[layer_to_add] = {
      sphere: true,
      type: 'Polygon',
      n_features: 1,
      'stroke-width-const': +stroke_width.slice(0, -2),
      fill_color: { single: fill },
    };
    map.append('g')
      .attrs({ id: layer_id, class: 'layer' })
      .styles({ 'stroke-width': stroke_width })
      .append('path')
      .datum({ type: 'Sphere' })
      .styles({ fill: fill, 'fill-opacity': fill_opacity, 'stroke-opacity': stroke_opacity, stroke: stroke })
      .attrs({ d: path });
    if (isInterrupted(_app.current_proj_name.toLowerCase())) {
      map.select(`g#${layer_id}`).attr('clip-path', 'url(#clip)');
    }
    create_li_layer_elem(layer_to_add, null, 'Polygon', 'sample');
    alertify.notify(_tr('app_page.notification.success_sphere_added'), 'success', 5);
    zoom_without_redraw();
    setSphereBottom(layer_id);
  } else if (selected_feature === 'graticule') {
    if (data_manager.current_layers.Graticule !== undefined) return;
    const stroke = options.stroke || '#808080';
    const stroke_width = options.stroke_width || '1px';
    const stroke_opacity = options.stroke_opacity || 1;
    const stroke_dasharray = options.stroke_dasharray || 5;
    const step = options.step || 10;
    let graticule = d3.geoGraticule().step([step, step]);
    let extent;
    if (options.extent) {
      if (options.extent instanceof Array) {
        extent = options.extent;
      } else {
        const bbox_layer = _target_layer_file.bbox;
        extent = [
          [Mround((bbox_layer[0] - 10) / 10) * 10, Mround((bbox_layer[1] - 10) / 10) * 10],
          [Mround((bbox_layer[2] + 10) / 10) * 10, Mround((bbox_layer[3] + 10) / 10) * 10],
        ];
      }
      graticule = graticule.extent(extent);
    }
    const layer_to_add = 'Graticule';
    const layer_id = encodeId(layer_to_add);
    _app.layer_to_id.set(layer_to_add, layer_id);
    _app.id_to_layer.set(layer_id, layer_to_add);
    map.insert('g', '.legend')
      .attrs({ id: layer_id, class: 'layer' })
      .styles({ 'stroke-width': stroke_width })
      .append('path')
      .datum(graticule)
      .attrs({ d: path, class: 'graticule' })
      .styles({ 'stroke-dasharray': stroke_dasharray, fill: 'none', stroke: stroke });
    data_manager.current_layers.Graticule = {
      dasharray: stroke_dasharray,
      extent: extent,
      fill_color: { single: stroke },
      graticule: true,
      n_features: 1,
      opacity: stroke_opacity,
      step: step,
      'stroke-width-const': +stroke_width.slice(0, -2),
      type: 'Line',
    };
    if (isInterrupted(_app.current_proj_name.toLowerCase())) {
      map.select(`g#${layer_id}`).attr('clip-path', 'url(#clip)');
    }
    create_li_layer_elem('Graticule', null, 'Line', 'sample');
    alertify.notify(_tr('app_page.notification.success_graticule_added'), 'success', 5);
    up_legends();
    zoom_without_redraw();
  } else if (selected_feature === 'scale') {
    if (!(scaleBar.displayed)) {
      handleClickAddOther('scalebar');
    } else {
      ask_existing_feature('scalebar')
        .then(() => {
          scaleBar.remove();
          handleClickAddOther('scalebar');
        }, () => null);
    }
  } else if (selected_feature === 'north_arrow') {
    if (!(northArrow.displayed)) {
      handleClickAddOther('north_arrow');
    } else {
      ask_existing_feature('north_arrow')
        .then(() => {
          northArrow.remove();
          handleClickAddOther('north_arrow');
        }, () => null);
    }
  } else if (selected_feature === 'arrow') {
    handleClickAddArrow();
  } else if (selected_feature === 'ellipse') {
    handleClickAddEllipse();
  } else if (selected_feature === 'rectangle') {
    handleClickAddRectangle();
  } else if (selected_feature === 'symbol') {
    handleClickAddPicto();
  } else {
    swal(`${_tr('app_page.common.error')}!`, _tr('app_page.common.error'), 'error');
  }
}

// function handleCreateFreeDraw(){
//     let start_point,
//         tmp_start_point,
//         active_line,
//         drawing_data = { "lines": [] };
//
//     let render_line = d3.line().x(d => d[0]).y(d => d[1]);
//     let draw_calc = map.append("g")
//                         .append("rect")
//                         .attrs({class: "draw_calc", x: 0, y: 0, width: w, height: h})
//                         .style("opacity", 0.1).style("fill", "grey");
//
//     function redraw() {
//       var lines;
//       lines = draw_calc.selectAll('.line').data(drawing_data.lines);
//       lines.enter().append('path').attrs({
//         "class": 'line',
//         stroke: function(d) {
//           return d.color;
//         }
//       });
//       lines.attr("d", function(d) { return render_line(d.points);});
//       return lines.exit();
//     };
//
//     let drag = d3.drag()
//            .on('start', function() {
//               active_line = {
//                 points: [],
//                 color: "black"
//               };
//               drawing_data.lines.push(active_line);
//               return redraw();
//             })
//             .on('drag', function() {
//               active_line.points.push([d3.event.x, d3.event.y]);
//               console.log(drawing_data);
//               return redraw();
//             })
//             .on('end', function() {
//               if (active_line.points.length === 0) {
//                 drawing_data.lines.pop();
//               }
//               active_line = null;
//               console.log(drawing_data);
//               return;
//             });
//     zoom.on("zoom", null);
//     draw_calc.call(drag);
// }

export function add_single_symbol(symbol_dataurl, x, y, width = '30', height = '30', symbol_id = null) {
  const context_menu = new ContextMenu();
  const getItems = self_parent => [
    { name: _tr('app_page.common.options'), action: () => { make_style_box_indiv_symbol(self_parent); } },
    { name: _tr('app_page.common.up_element'), action: () => { up_legend(self_parent.parentElement); } },
    { name: _tr('app_page.common.down_element'), action: () => { down_legend(self_parent.parentElement); } },
    { name: _tr('app_page.common.delete'), action: () => { self_parent.parentElement.remove(); } },
  ];

  return map.append('g')
    .attrs({ class: 'legend single_symbol', id: symbol_id })
    .insert('image')
    .attrs({
      x: x || w / 2,
      y: y || h / 2,
      width: width,
      height: height,
      'xlink:href': symbol_dataurl
    })
    .on('mouseover', function () { this.style.cursor = 'pointer'; })
    .on('mouseout', function () { this.style.cursor = 'initial'; })
    .on('dblclick contextmenu', function () {
      context_menu.showMenu(d3.event, document.querySelector('body'), getItems(this));
    })
    .call(drag_elem_geo);
}
