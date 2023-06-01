import alertify from 'alertifyjs';
import ContextMenu from './../context-menu';
import { check_remove_existing_box, make_confirm_dialog2 } from './../dialogs';
import { up_legend, down_legend } from './../legend';
import { Msqrt } from './../helpers_math';
import { handle_click_hand } from './../interface';

const atan2 = Math.atan2;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;

export default class UserArrow {
  constructor(id, origin_pt, destination_pt, parent = undefined, untransformed = false) {
    this.parent = parent || svg_map;
    this.svg_elem = d3.select(this.parent);
    this.id = id;
    this.stroke_width = 4;
    this.color = 'rgb(0, 0, 0)';
    this.hide_head = undefined;
    if (!untransformed) {
      const zoom_param = svg_map.__zoom;
      this.pt1 = [(origin_pt[0] - zoom_param.x) / zoom_param.k, (origin_pt[1] - zoom_param.y) / zoom_param.k];
      this.pt2 = [(destination_pt[0] - zoom_param.x) / zoom_param.k, (destination_pt[1] - zoom_param.y) / zoom_param.k];
    } else {
      this.pt1 = origin_pt;
      this.pt2 = destination_pt;
    }
    const self = this;
    this.drag_behavior = d3.drag()
      .subject(function () {
        // let snap_lines = get_coords_snap_lines(this.id + this.className);
        const t = d3.select(this.querySelector('line'));
        return {
          x: +t.attr('x2') - +t.attr('x1'),
          y: +t.attr('y2') - +t.attr('y1'),
          x1: t.attr('x1'),
          x2: t.attr('x2'),
          y1: t.attr('y1'),
          y2: t.attr('y2'),
          map_locked: !!map_div.select('#hand_button').classed('locked'), //  , snap_lines: snap_lines
        };
      })
      .on('start', (event) => {
        event.sourceEvent.stopPropagation();
        handle_click_hand('lock');
      })
      .on('end', (event) => {
        if (event.subject && !event.subject.map_locked) {
          handle_click_hand('unlock');
        }
      })
      .on('drag', function (event) {
        event.sourceEvent.preventDefault();
        const _t = this.querySelector('line'),
          // arrow_head_size = +_t.style.strokeWidth.replace('px', ''),
          subject = event.subject,
          tx = (+event.x - +subject.x) / svg_map.__zoom.k,
          ty = (+event.y - +subject.y) / svg_map.__zoom.k;
        self.pt1 = [+subject.x1 + tx, +subject.y1 + ty];
        self.pt2 = [+subject.x2 + tx, +subject.y2 + ty];
          // if(_app.autoalign_features){
          //     let snap_lines_x = subject.snap_lines.x,
          //         snap_lines_y = subject.snap_lines.y;
          //     for(let i = 0; i < subject.snap_lines.x.length; i++){
          //         if(Math.abs(snap_lines_x[i] - (self.pt1[0] + svg_map.__zoom.x / svg_map.__zoom.k)) < 10){
          //           let l = map.append('line')
          //               .attrs({x1: snap_lines_x[i], x2: snap_lines_x[i], y1: 0, y2: h}).style('stroke', 'red');
          //           setTimeout(function(){ l.remove(); }, 1000);
          //           self.pt1[0] = snap_lines_x[i] - svg_map.__zoom.x / svg_map.__zoom.k;
          //         }
          //         if(Math.abs(snap_lines_x[i] - (self.pt2[0] + svg_map.__zoom.x / svg_map.__zoom.k)) < 10){
          //           let l = map.append('line')
          //               .attrs({x1: snap_lines_x[i], x2: snap_lines_x[i], y1: 0, y2: h}).style('stroke', 'red');
          //           setTimeout(function(){ l.remove(); }, 1000);
          //           if(self.pt2[0] < self.pt1[0])
          //               arrow_head_size = -arrow_head_size;
          //           self.pt2[0] = snap_lines_x[i] - svg_map.__zoom.x / svg_map.__zoom.k + arrow_head_size;
          //         }
          //         if(Math.abs(snap_lines_y[i] - (self.pt1[1] + svg_map.__zoom.y / svg_map.__zoom.k)) < 10){
          //           let l = map.append('line')
          //               .attrs({x1: 0, x2: w, y1: snap_lines_y[i], y2: snap_lines_y[i]}).style('stroke', 'red');
          //           setTimeout(function(){ l.remove(); }, 1000);
          //           self.pt1[1] = snap_lines_y[i] - svg_map.__zoom.y / svg_map.__zoom.k;
          //         }
          //         if(Math.abs(snap_lines_y[i] - (self.pt2[1] + svg_map.__zoom.y / svg_map.__zoom.k)) < 10){
          //           let l = map.append('line')
          //                 .attrs({x1: 0, x2: w, y1: snap_lines_y[i], y2: snap_lines_y[i]}).style('stroke', 'red');
          //           setTimeout(function(){ l.remove(); }, 1000);
          //           if(self.pt2[1] < self.pt1[1])
          //               arrow_head_size = -arrow_head_size;
          //           self.pt2[1] = snap_lines_y[i] - svg_map.__zoom.y / svg_map.__zoom.k + arrow_head_size;
          //         }
          //     }
          // }
        _t.x1.baseVal.value = self.pt1[0];
        _t.x2.baseVal.value = self.pt2[0];
        _t.y1.baseVal.value = self.pt1[1];
        _t.y2.baseVal.value = self.pt2[1];
      });

    const markers_exists = (defs ? defs.node().querySelector('marker') : null);

    if (!markers_exists) {
      this.add_defs_marker();
    }
    this.draw();
  }

  add_defs_marker() {
    defs.append('marker')
      .attrs({
        id: 'arrow_head',
        viewBox: '0 -5 10 10',
        refX: 5,
        refY: 0,
        orient: 'auto',
        markerWidth: 4,
        markerHeight: 4
      })
      .style('stroke-width', 1)
      .append('path')
      .attrs({ d: 'M0,-5L10,0L0,5', class: 'arrowHead' });
    if (this.parent.childNodes[0].tagName !== 'defs') {
      this.parent.insertBefore(defs.node(), this.parent.childNodes[0]);
    }
  }

  draw() {
    const context_menu = new ContextMenu(),
      getItems = () => [
        { name: _tr('app_page.common.edit_style'), action: () => { this.editStyle(); } },
        { name: _tr('app_page.common.up_element'), action: () => { this.up_element(); } },
        { name: _tr('app_page.common.down_element'), action: () => { this.down_element(); } },
        { name: _tr('app_page.common.delete'), action: () => { this.remove(); } },
      ];

    this.arrow = this.svg_elem.append('g')
      .style('cursor', 'all-scroll')
      .attrs({ class: 'arrow legend scalable-legend', id: this.id, transform: svg_map.__zoom.toString() });

    this.arrow.insert('line')
      .attrs({
        'marker-end': this.hide_head ? null : 'url(#arrow_head)',
        x1: this.pt1[0],
        y1: this.pt1[1],
        x2: this.pt2[0],
        y2: this.pt2[1] })
      .styles({ 'stroke-width': this.stroke_width, stroke: 'rgb(0, 0, 0)' });

    this.arrow.call(this.drag_behavior);

    this.arrow.on('contextmenu', (event) => {
      context_menu.showMenu(
        event,
        document.querySelector('body'),
        getItems(),
      );
    });
    this.arrow.on('dblclick', (event) => {
      event.preventDefault();
      event.stopPropagation();
      this.handle_ctrl_pt();
    });
  }

  remove() {
    // pos_lgds_elem.delete(this.arrow.attr('id'));
    this.arrow.remove();
  }

  up_element() {
    up_legend(this.arrow.node());
  }

  down_element() {
    down_legend(this.arrow.node());
  }

  handle_ctrl_pt() {
    const self = this,
      line = self.arrow.node().querySelector('line'),
      zoom_params = svg_map.__zoom,
      map_locked = !!map_div.select('#hand_button').classed('locked'),
      msg = alertify.notify(_tr('app_page.notification.instruction_modify_feature'), 'warning', 0);

    // New behavior if the user click on the lock to move on the map :
    const cleanup_edit_state = () => {
      edit_layer.remove();
      msg.dismiss();
      self.pt1 = [line.x1.baseVal.value, line.y1.baseVal.value];
      self.pt2 = [line.x2.baseVal.value, line.y2.baseVal.value];

      // Reactive the ability to move the arrow :
      self.arrow.call(self.drag_behavior);

      // Restore the ability to edit the control points on dblclick on the arrow :
      self.arrow.on('dblclick', (event) => {
        event.preventDefault();
        event.stopPropagation();
        self.handle_ctrl_pt();
      });
      if (!map_locked) {
        handle_click_hand('unlock');
      }
      // Restore the previous behavior for the 'lock' button :
      document.getElementById('hand_button').onclick = handle_click_hand;
    };

    // Change the behavior of the 'lock' button :
    document.getElementById('hand_button').onclick = function () {
      cleanup_edit_state();
      handle_click_hand();
    };
    // Deactivate the ability to drag the arrow :
    self.arrow.on('.drag', null);
    // Deactivate the ability to zoom/move on the map ;
    handle_click_hand('lock');

    // Add a layer to intercept click on the map :
    let edit_layer = map.insert('g');
    edit_layer.append('rect')
      .attrs({ x: 0, y: 0, width: w, height: h, class: 'edit_rect' })
      .style('fill', 'transparent')
      .on('dblclick', (event) => {
        event.stopPropagation();
        event.preventDefault();
        cleanup_edit_state();
      });

    // Append two red squares for the start point and the end point of the arrow :
    edit_layer.append('rect')
      .attrs({ x: self.pt1[0] * zoom_params.k + zoom_params.x - 3, y: self.pt1[1] * zoom_params.k + zoom_params.y - 3, height: 6, width: 6, id: 'arrow_start_pt' })
      .styles({ fill: 'red', cursor: 'grab' })
      .call(d3.drag().on('drag', function (event) {
        const t = d3.select(this),
          nx = event.x,
          ny = event.y;
        t.attrs({ x: nx - 3, y: ny - 3 });
        line.x1.baseVal.value = (nx - zoom_params.x) / zoom_params.k;
        line.y1.baseVal.value = (ny - zoom_params.y) / zoom_params.k;
      }));
    edit_layer.append('rect')
      .attrs({ x: self.pt2[0] * zoom_params.k + zoom_params.x - 3, y: self.pt2[1] * zoom_params.k + zoom_params.y - 3, height: 6, width: 6, id: 'arrow_end_pt' })
      .styles({ fill: 'red', cursor: 'grab' })
      .call(d3.drag().on('drag', function (event) {
        const t = d3.select(this),
          nx = event.x,
          ny = event.y;
        t.attrs({ x: nx - 3, y: ny - 3 });
        line.x2.baseVal.value = (nx - zoom_params.x) / zoom_params.k;
        line.y2.baseVal.value = (ny - zoom_params.y) / zoom_params.k;
      }));

    // Exit the "edit" state by double-clicking again on the arrow :
    self.arrow.on('dblclick', (event) => {
      event.stopPropagation();
      event.preventDefault();
      cleanup_edit_state();
    });
  }

  calcAngle() {
    const dx = this.pt2[0] - this.pt1[0],
      dy = this.pt2[1] - this.pt1[1];
    return atan2(dy, dx) * (180 / PI);
  }

  calcDestFromOAD(origin, angle, distance) {
    const theta = angle / (180 / PI),
      dx = distance * cos(theta),
      dy = distance * sin(theta);
    return [origin[0] + dx, origin[1] + dy];
  }

  editStyle() {
    const current_options = { pt1: this.pt1.slice(),
      pt2: this.pt2.slice() };
    const self = this,
      line = self.arrow.node().querySelector('line'),
      angle = (-this.calcAngle()).toFixed(0),
      map_locked = !!map_div.select('#hand_button').classed('locked');

    if (!map_locked) handle_click_hand('lock');

    check_remove_existing_box('.styleBoxArrow');

    make_confirm_dialog2('styleBoxArrow', _tr('app_page.arrow_edit_box.title'), { widthFitContent: true })
      .then((confirmed) => {
        if (confirmed) {
          // Store shorcut of useful values :
          self.stroke_width = line.style.strokeWidth;
          self.color = line.style.stroke;
          self.pt1 = [line.x1.baseVal.value, line.y1.baseVal.value];
          self.pt2 = [line.x2.baseVal.value, line.y2.baseVal.value];
        } else {
          // Rollback on initials parameters :
          line.x1.baseVal.value = current_options.pt1[0];
          line.y1.baseVal.value = current_options.pt1[1];
          line.x2.baseVal.value = current_options.pt2[0];
          line.y2.baseVal.value = current_options.pt2[1];
          self.pt1 = current_options.pt1.slice();
          self.pt2 = current_options.pt2.slice();
          line.style.strokeWidth = self.stroke_width;
          line.style.stroke = self.color;
        }
        map.select('#arrow_start_pt').remove();
        map.select('#arrow_end_pt').remove();
        if (!map_locked) handle_click_hand('unlock');
      });

    const box_content = d3.select('.styleBoxArrow')
      .select('.modal-body')
      .style('width', '295px')
      .insert('div')
      .attr('id', 'styleBoxArrow');

    const s1 = box_content.append('div')
      .attr('class', 'line_elem');

    s1.append('span')
      .styles({ flex: '0.9' })
      .html(_tr('app_page.arrow_edit_box.arrowWeight'));

    const s1_group_size = s1.append('div');

    s1_group_size.append('input')
      .attrs({ id: 'arrow_weight_text', class: 'without_spinner', min: 0, max: 34, step: 0.1 })
      .styles({ width: '30px' })
      .property('value', self.stroke_width)
      .on('input', function () {
        const elem = document.getElementById('arrow_stroke_width');
        elem.value = this.value;
        elem.dispatchEvent(new Event('change'));
      });

    s1_group_size.append('span')
      .html('px');

    s1.append('input')
      .attrs({
        id: 'arrow_stroke_width',
        min: 0,
        max: 34,
        step: 0.1,
        type: 'range',
      })
      .property('value', self.stroke_width)
      .on('change', function () {
        line.style.strokeWidth = this.value;
        document.getElementById('arrow_weight_text').value = +this.value;
      });

    const s2 = box_content.append('div')
      .attr('class', 'line_elem');

    s2.append('span')
      .styles({ flex: '0.9' })
      .html(_tr('app_page.arrow_edit_box.arrowAngle'));

    const s2_group_angle = s2.append('div');

    s2_group_angle.append('input')
      .attrs({ id: 'arrow_angle_text', class: 'without_spinner', min: 0, max: 1, step: 1 })
      .styles({ width: '30px' })
      .property('value', angle)
      .on('input', function () {
        const elem = document.getElementById('arrow_angle');
        elem.value = this.value;
        elem.dispatchEvent(new Event('change'));
      });

    s2_group_angle.append('span')
      .html('°');

    s2.append('input')
      .attrs({ id: 'arrow_angle', type: 'range', min: 0, max: 360, step: 1 })
      .property('value', angle)
      .on('change', function () {
        const distance = Msqrt(
          (self.pt1[0] - self.pt2[0]) * (self.pt1[0] - self.pt2[0])
          + (self.pt1[1] - self.pt2[1]) * (self.pt1[1] - self.pt2[1]));
        const _angle = -(+this.value);
        const [nx, ny] = self.calcDestFromOAD(self.pt1, _angle, distance);
        line.x2.baseVal.value = nx;
        line.y2.baseVal.value = ny;
        document.getElementById('arrow_angle_text').value = +this.value;
      });

    const s3 = box_content.append('div').attr('class', 'line_elem');

    s3.append('label')
      .attrs({ for: 'checkbox_head_arrow' })
      .html(_tr('app_page.arrow_edit_box.arrowHead'));

    s3.append('input')
      .attrs({ type: 'checkbox', id: 'checkbox_head_arrow' })
      .property('checked', self.hide_head === true)
      .on('change', function () {
        if (this.checked) {
          self.hide_head = true;
          self.arrow.select('line').attr('marker-end', null);
        } else {
          self.hide_head = false;
          self.arrow.select('line').attr('marker-end', 'url(#arrow_head)');
        }
      });
  }
}
