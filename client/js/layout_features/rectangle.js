import alertify from 'alertifyjs';
import ContextMenu from './../context-menu';
import { rgb2hex } from './../colors_helpers';
import { Mabs } from './../helpers_math';
import { handle_click_hand } from './../interface';
import { make_confirm_dialog2 } from './../dialogs';
import { up_legend, down_legend } from './../legend';

export default class UserRectangle {
  constructor(id, origin_pt, parent = undefined, untransformed = false, width = 30, height = 40) {
    this.parent = parent || svg_map;
    this.svg_elem = d3.select(this.parent);
    this.id = id;
    this.stroke_width = 4;
    this.stroke_color = 'rgb(0, 0, 0)';
    this.fill_color = 'rgb(255, 255, 255)';
    this.fill_opacity = 0;
    this.height = height;
    this.width = width;
    const self = this;
    if (!untransformed) {
      const zoom_param = svg_map.__zoom;
      this.pt1 = [
        (+origin_pt[0] - zoom_param.x) / zoom_param.k,
        (+origin_pt[1] - zoom_param.y) / zoom_param.k,
      ];
    } else {
      this.pt1 = [+origin_pt[0], +origin_pt[1]];
    }

    this.drag_behavior = d3.drag()
      .subject(function () {
        const t = d3.select(this.querySelector('rect'));
        return {
          x: +t.attr('x'),
          y: +t.attr('y'),
          map_locked: !!map_div.select('#hand_button').classed('locked'),
        };
      })
      .on('start', (event) => {
        event.sourceEvent.stopPropagation();
        handle_click_hand('lock');
      })
      .on('end', (event) => {
        if (event.subject && !event.subject.map_locked) { handle_click_hand('unlock'); }
      })
      .on('drag', function (event) {
        event.sourceEvent.preventDefault();
        const _t = this.querySelector('rect'),
          subject = event.subject,
          tx = (+event.x - +subject.x) / svg_map.__zoom.k,
          ty = (+event.y - +subject.y) / svg_map.__zoom.k;
        self.pt1 = [+subject.x + tx, +subject.y + ty];
        // self.pt2 = [self.pt1[0] + self.width, self.pt1[1] + self.height];
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
          //           self.pt1[0] = snap_lines_x[i] - svg_map.__zoom.x / svg_map.__zoom.k - self.width;
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
          //           self.pt1[1] = snap_lines_y[i] - svg_map.__zoom.y / svg_map.__zoom.k - self.height;
          //         }
          //     }
          // }
        _t.x.baseVal.value = self.pt1[0];
        _t.y.baseVal.value = self.pt1[1];
      });
    this.draw();
    return this;
  }

  up_element() {
    up_legend(this.rectangle.node());
  }

  down_element() {
    down_legend(this.rectangle.node());
  }

  draw() {
    const context_menu = new ContextMenu();
    const getItems = () => [
        { name: _tr('app_page.common.edit_style'), action: () => { this.editStyle(); } },
        { name: _tr('app_page.common.up_element'), action: () => { this.up_element(); } },
        { name: _tr('app_page.common.down_element'), action: () => { this.down_element(); } },
        { name: _tr('app_page.common.delete'), action: () => { this.remove(); } },
    ];

    this.rectangle = this.svg_elem.append('g')
      .attrs({ class: 'user_rectangle legend scalable-legend',
        id: this.id,
        transform: svg_map.__zoom.toString() });

    this.rectangle.insert('rect')
      .attrs({
        x: this.pt1[0],
        y: this.pt1[1],
        height: this.height,
        width: this.width,
      })
      .styles({
        fill: this.fill_color,
        'fill-opacity': 0,
        stroke: this.stroke_color,
        'stroke-width': this.stroke_width,
      });

    this.rectangle
      .on('contextmenu', (event) => {
        context_menu.showMenu(event, document.body, getItems());
      })
      .on('dblclick', (event) => {
        event.preventDefault();
        event.stopPropagation();
        this.handle_ctrl_pt();
      })
      .call(this.drag_behavior);
  }

  remove() {
    this.rectangle.remove();
  }

  handle_ctrl_pt() {
    const self = this,
      rectangle_elem = self.rectangle.node().querySelector('rect'),
      zoom_param = svg_map.__zoom,
      map_locked = !!map_div.select('#hand_button').classed('locked');
    const center_pt = [
      self.pt1[0] + rectangle_elem.width.baseVal.value / 2,
      self.pt1[1] + rectangle_elem.height.baseVal.value / 2,
    ];
    const bottomright = [
      self.pt1[0] + rectangle_elem.width.baseVal.value,
      self.pt1[1] + rectangle_elem.height.baseVal.value,
    ];
    const msg = alertify.notify(_tr('app_page.notification.instruction_modify_feature'), 'warning', 0);

    let topleft = self.pt1.slice();

    const cleanup_edit_state = () => {
      edit_layer.remove();
      msg.dismiss();
      self.rectangle.call(self.drag_behavior);
      self.rectangle.on('dblclick', (event) => {
        event.preventDefault();
        event.stopPropagation();
        self.handle_ctrl_pt();
      });
      if (!map_locked) {
        handle_click_hand('unlock');
      }
      document.getElementById('hand_button').onclick = handle_click_hand;
    };

    // Change the behavior of the 'lock' button :
    document.getElementById('hand_button').onclick = function () {
      cleanup_edit_state();
      handle_click_hand();
    };

    // Desactive the ability to drag the rectangle :
    self.rectangle.on('.drag', null);
    // Desactive the ability to zoom/move on the map ;
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

    // Temporary top point:
    edit_layer.append('rect')
      .attrs({
        class: 'ctrl_pt',
        id: 'pt_top',
        height: 8,
        width: 8,
        x: center_pt[0] * zoom_param.k + zoom_param.x - 4,
        y: (center_pt[1] - rectangle_elem.height.baseVal.value / 2) * zoom_param.k + zoom_param.y - 4,
      })
      .call(d3.drag().on('drag', function (event) {
        const dist = (event.y - zoom_param.y) / zoom_param.k;
        if ((self.height - (dist - self.pt1[1])) < 2) {
          return;
        }
        d3.select(this).attr('y', event.y - 4);
        const a = self.pt1[1];
        self.pt1[1] = rectangle_elem.y.baseVal.value = dist;
        topleft = self.pt1.slice();
        rectangle_elem.height.baseVal.value = self.height = Mabs(self.height - (self.pt1[1] - a));
        map.selectAll('#pt_left,#pt_right').attr('y', (topleft[1] + self.height / 2) * zoom_param.k + zoom_param.y);
      }));

    // Temporary left point:
    edit_layer.append('rect')
      .attrs({
        class: 'ctrl_pt',
        height: 8,
        width: 8,
        id: 'pt_left',
        x: (center_pt[0] - rectangle_elem.width.baseVal.value / 2) * zoom_param.k + zoom_param.x - 4,
        y: center_pt[1] * zoom_param.k + zoom_param.y - 4
      })
      .call(d3.drag().on('drag', function (event) {
        const dist = /*topleft[0] -*/ (event.x - zoom_param.x) / zoom_param.k;
        if ((self.width + (self.pt1[0] -dist)) < 2) {
          return;
        }
        d3.select(this).attr('x', event.x - 4);
        const a = self.pt1[0];
        self.pt1[0] = rectangle_elem.x.baseVal.value = dist; // topleft[0] - dist;
        topleft = self.pt1.slice();
        rectangle_elem.width.baseVal.value = self.width = Mabs(self.width + (a - self.pt1[0]));
        map.selectAll('#pt_top,#pt_bottom').attr('x', (topleft[0] + self.width / 2) * zoom_param.k + zoom_param.x);
      }));

    // Temporary bottom point:
    edit_layer.append('rect')
      .attrs({
        class: 'ctrl_pt',
        id: 'pt_bottom',
        x: center_pt[0] * zoom_param.k + zoom_param.x - 4,
        y: bottomright[1] * zoom_param.k + zoom_param.y - 4,
        height: 8,
        width: 8,
      })
      .call(d3.drag().on('drag', function (event) {
        const dist = -(topleft[1] - (event.y - zoom_param.y) / zoom_param.k);
        if (dist < 2) {
          return;
        }
        d3.select(this).attr('y', event.y - 4);
        self.height = rectangle_elem.height.baseVal.value = dist;
        map.selectAll('#pt_left,#pt_right').attr('y', (topleft[1] + self.height / 2) * zoom_param.k + zoom_param.y);
      }));

    // Temporary right point:
    edit_layer.append('rect')
      .attrs({
        class: 'ctrl_pt',
        id: 'pt_right',
        x: bottomright[0] * zoom_param.k + zoom_param.x - 4,
        y: center_pt[1] * zoom_param.k + zoom_param.y - 4,
        height: 8,
        width: 8,
      })
      .call(d3.drag().on('drag', function (event) {
        const dist = -(topleft[0] - (event.x - zoom_param.x) / zoom_param.k);
        if (dist < 2) {
          return;
        }
        d3.select(this).attr('x', event.x - 4);
        self.width = rectangle_elem.width.baseVal.value = dist;
        map.selectAll('#pt_top,#pt_bottom').attr('x', (topleft[0] + self.width / 2) * zoom_param.k + zoom_param.x);
      }));

    self.rectangle.on('dblclick', (event) => {
      event.stopPropagation();
      event.preventDefault();
      cleanup_edit_state();
    });
  }

  editStyle() {
    const self = this,
      rectangle_elem = self.rectangle.node().querySelector('rect'),
      // zoom_param = svg_map.__zoom,
      map_locked = !!map_div.select('#hand_button').classed('locked'),
      current_options = { pt1: this.pt1.slice() };
    if (!map_locked) handle_click_hand('lock');
    make_confirm_dialog2('styleBoxRectangle', _tr('app_page.rectangle_edit_box.title'), { widthFitContent: true })
      .then((confirmed) => {
        if (confirmed) {
          // Store shorcut of useful values :
          self.stroke_width = rectangle_elem.style.strokeWidth;
          self.stroke_color = rectangle_elem.style.stroke;
          self.fill_color = rectangle_elem.style.fill;
          self.fill_opacity = +rectangle_elem.style.fillOpacity;
        } else {
          // Rollback on initials parameters :
          self.pt1 = current_options.pt1.slice();
          rectangle_elem.style.strokeWidth = self.stroke_width;
          rectangle_elem.style.stroke = self.stroke_color;
          rectangle_elem.style.fill = self.fill_color;
          rectangle_elem.style.fillOpacity = self.fill_opacity;
        }
        if (!map_locked) handle_click_hand('unlock');
      });
    const box_content = d3.select('.styleBoxRectangle')
      .select('.modal-body')
      .style('width', '295px')
      .insert('div')
      .attr('id', 'styleBoxRectangle');

    const s1 = box_content.append('div')
      .attr('class', 'line_elem');

    s1.append('span')
      .style('flex-grow', '0.9')
      .html(_tr('app_page.rectangle_edit_box.stroke_width'));

    const txt_line_weight = s1.append('span')
      .html(`${self.stroke_width} px`);

    s1.append('input')
      .attrs({
        min: 0,
        max: 34,
        step: 0.1,
        type: 'range',
      })
      .property('value', self.stroke_width)
      .on('change', function () {
        rectangle_elem.style.strokeWidth = this.value;
        txt_line_weight.html(`${this.value} px`);
      });

    const s2 = box_content.append('div')
      .attr('class', 'line_elem');

    s2.append('span')
      .html(_tr('app_page.rectangle_edit_box.stroke_color'));

    s2.append('input')
      .attr('type', 'color')
      .property('value', rgb2hex(self.stroke_color))
      .on('change', function () {
        rectangle_elem.style.stroke = this.value;
      });

    const s3 = box_content.append('div')
      .attr('class', 'line_elem');

    s3.append('span')
      .html(_tr('app_page.rectangle_edit_box.fill_color'));

    s3.append('input')
      .attr('type', 'color')
      .property('value', rgb2hex(self.fill_color))
      .on('change', function () {
        rectangle_elem.style.fill = this.value;
      });

    const s4 = box_content.append('div')
      .attr('class', 'line_elem');

    s4.append('span')
      .style('flex', '0.9')
      .html(_tr('app_page.rectangle_edit_box.fill_opacity'));

    const txt_fillop_value = s4.append('span')
      .html(`${rectangle_elem.style.fillOpacity}`);

    s4.append('input')
      .attrs({
        min: 0,
        max: 1,
        step: 0.1,
        type: 'range',
      })
      .property('value', rectangle_elem.style.fillOpacity)
      .on('change', function () {
        rectangle_elem.style.fillOpacity = this.value;
        txt_fillop_value.html(`${rectangle_elem.style.fillOpacity}`);
      });

    // rx : Coordonnée sur l'axe X du centre de l'ellipse pour les angles arrondis
    // ry : .................... Y
    const s5 = box_content.append('div')
      .attr('class', 'line_elem');

    s5.append('span')
      .style('flex', '0.9')
      .html(_tr('app_page.rectangle_edit_box.rounded_corner'));

    const txt_rx_value = s5.append('span')
      .html(`${rectangle_elem.rx.baseVal.value}`);

    s5.append('input')
      .attrs({
        min: 0,
        max: Math.round(self.width / 2),
        step: 1,
        type: 'range',
      })
      .property('value', rectangle_elem.rx.baseVal.value)
      .on('change', function () {
        rectangle_elem.rx.baseVal.value = this.value;
        rectangle_elem.ry.baseVal.value = this.value;
        txt_rx_value.html(`${rectangle_elem.rx.baseVal.value}`);
      });
  }
}
