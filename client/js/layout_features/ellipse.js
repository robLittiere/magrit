import alertify from 'alertifyjs';
import ContextMenu from './../context-menu';
import { make_confirm_dialog2 } from './../dialogs';
import { handle_click_hand } from './../interface';
import { up_legend, down_legend } from './../legend';

const atan2 = Math.atan2;
const sin = Math.sin;
const cos = Math.cos;
const PI = Math.PI;


export default class UserEllipse {
  constructor(id, origin_pt, parent = undefined, untransformed = false) {
    this.parent = parent || svg_map;
    this.svg_elem = d3.select(this.parent);
    this.id = id;
    this.stroke_width = 4;
    this.stroke_color = 'rgb(0, 0, 0)';

    if (!untransformed) {
      const zoom_param = svg_map.__zoom;
      this.pt1 = [
        (+origin_pt[0] - zoom_param.x) / zoom_param.k,
        (+origin_pt[1] - zoom_param.y) / zoom_param.k,
      ];
    } else {
      this.pt1 = [+origin_pt[0], +origin_pt[1]];
    }
    const self = this;
    this.drag_behavior = d3.drag()
      .subject(function () {
        const t = d3.select(this.querySelector('ellipse'));
        return {
          x: +t.attr('cx'),
          y: +t.attr('cy'),
          map_locked: !!map_div.select('#hand_button').classed('locked'),
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
        const _t = this.querySelector('ellipse'),
          subject = event.subject,
          tx = (+event.x - +subject.x) / svg_map.__zoom.k,
          ty = (+event.y - +subject.y) / svg_map.__zoom.k;
        self.pt1 = [+subject.x + tx, +subject.y + ty];
        _t.cx.baseVal.value = self.pt1[0];
        _t.cy.baseVal.value = self.pt1[1];
      });

    this.draw();
    return this;
  }

  draw() {
    const context_menu = new ContextMenu();
    const getItems = () => [
      { name: _tr('app_page.common.edit_style'), action: () => { this.editStyle(); } },
      { name: _tr('app_page.common.up_element'), action: () => { this.up_element(); } },
      { name: _tr('app_page.common.down_element'), action: () => { this.down_element(); } },
      { name: _tr('app_page.common.delete'), action: () => { this.remove(); } },
    ];

    this.ellipse = this.svg_elem.append('g')
      .attrs({ class: 'user_ellipse legend scalable-legend', id: this.id, transform: svg_map.__zoom.toString() });

    this.ellipse.insert('ellipse')
      .attrs({
        rx: 30,
        ry: 40,
        cx: this.pt1[0],
        cy: this.pt1[1],
      })
      .styles({
        fill: 'rgb(255, 255, 255)',
        'fill-opacity': 0,
        stroke: this.stroke_color,
        'stroke-width': this.stroke_width,
      });

    this.ellipse
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
    this.ellipse.remove();
  }

  up_element() {
    up_legend(this.ellipse.node());
  }

  down_element() {
    down_legend(this.ellipse.node());
  }

  calcAngle() {
    const ellipse_elem = this.ellipse.node().querySelector('ellipse'),
      dx = ellipse_elem.rx.baseVal.value - this.pt1[0],
      dy = ellipse_elem.ry.baseVal.value - this.pt1[1];
    return atan2(dy, dx) * (180 / PI);
  }

  static calcDestFromOAD(origin, angle, distance) {
    const theta = angle / (180 / PI),
      dx = distance * cos(theta),
      dy = distance * sin(theta);
    return [origin[0] + dx, origin[1] + dy];
  }

  editStyle() {
    const self = this,
      ellipse_elem = self.ellipse.node().querySelector('ellipse'),
      // zoom_param = svg_map.__zoom,
      map_locked = !!map_div.select('#hand_button').classed('locked'),
      current_options = {
        pt1: this.pt1.slice(),
        rx: ellipse_elem.rx.baseVal.value,
        ry: ellipse_elem.ry.baseVal.value,
      };
    // const angle = (-this.calcAngle()).toFixed(0);

    if (!map_locked) handle_click_hand('lock');
    make_confirm_dialog2('styleBoxEllipse', _tr('app_page.ellipse_edit_box.title'), { widthFitContent: true })
      .then((confirmed) => {
        map.selectAll('.ctrl_pt').remove();
        if (confirmed) {
          // Store shorcut of useful values :
          self.stroke_width = ellipse_elem.style.strokeWidth;
          self.stroke_color = ellipse_elem.style.stroke;
        } else {
          // Rollback on initials parameters :
          self.pt1 = current_options.pt1.slice();
          ellipse_elem.style.strokeWidth = self.stroke_width;
          ellipse_elem.style.stroke = self.stroke_color;
        }
        if (!map_locked) handle_click_hand('unlock');
      });
    const box_content = d3.select('.styleBoxEllipse')
      .select('.modal-body')
      .style('width', '295px')
      .insert('div')
      .attr('id', 'styleBoxEllipse');

    const s1 = box_content.append('div')
      .attr('class', 'line_elem');

    s1.append('span')
      .style('flex', '0.9')
      .html(_tr('app_page.ellipse_edit_box.stroke_width'));

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
        ellipse_elem.style.strokeWidth = this.value;
        txt_line_weight.html(`${this.value}px`);
      });

    const s2 = box_content.append('div')
      .attr('class', 'line_elem');

    s2.append('span')
      .style('margin', 'auto')
      .html(_tr('app_page.ellipse_edit_box.stroke_color'));

    s2.append('input')
      .attr('type', 'color')
      .property('value', self.stroke_color)
      .on('change', function () {
        ellipse_elem.style.stroke = this.value;
      });
      //  let s2b = box_content.append("p").attr('class', 'line_elem2')
      //  s2b.append("span").html(_tr("app_page.ellipse_edit_box.ellispeAngle"))
      //  s2b.insert("span").styles({float: 'right', 'width': '12px'}).html("&nbsp;°");
      //  s2b.insert("input")
      //      .attrs({id: "ellipse_angle_text", class: "without_spinner", value: angle, min: 0, max: 1, step: 1})
      //      .styles({width: "30px", "margin-left": "10px", 'float': 'right'})
      //      .on("input", function(){
      //          let elem = document.getElementById("ellipse_angle");
      //          elem.value = this.value;
      //          elem.dispatchEvent(new Event('change'));
      //      });
      //  s2b.insert("input")
      //      .attrs({id: "ellipse_angle", type: "range", value: Math.abs(angle), min: 0, max: 360, step: 1})
      //      .styles({width: "80px", "vertical-align": "middle", 'float': 'right'})
      //      .on("change", function(){
      //         let pt2 = [self.pt1[0] - ellipse_elem.rx.baseVal.value, self.pt1[1]],
      //             distance = Math.sqrt((self.pt1[0] - pt2[0]) * (self.pt1[0] - pt2[0]) + (self.pt1[1] - pt2[1]) * (self.pt1[1] - pt2[1])),
      //             angle = Math.abs(+this.value);
      //          let [nx, ny] = self.calcDestFromOAD(self.pt1, angle, distance);
      //          console.log("angle :", angle); console.log("pt2 :", pt2); console.log("distance :", distance);
      //          console.log(ellipse_elem.rx.baseVal.value, self.pt1[0], nx);
      //          console.log(ellipse_elem.ry.baseVal.value, self.pt1[1], ny);
      //          ellipse_elem.rx.baseVal.value = nx;
      //          ellipse_elem.ry.baseVal.value = ny;
      //          document.getElementById("ellipse_angle_text").value = +this.value;
      //      });
  }

  handle_ctrl_pt() {
    const self = this,
      ellipse_elem = self.ellipse.node().querySelector('ellipse'),
      zoom_param = svg_map.__zoom,
      map_locked = !!map_div.select('#hand_button').classed('locked'),
      msg = alertify.notify(_tr('app_page.notification.instruction_modify_feature'), 'warning', 0);

    const cleanup_edit_state = () => {
      edit_layer.remove();
      msg.dismiss();
      self.ellipse.call(self.drag_behavior);
      self.ellipse.on('dblclick', (event) => {
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
    // Desactive the ability to drag the ellipse :
    self.ellipse.on('.drag', null);
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

    // Temporary start point:
    edit_layer.append('rect')
      .attrs({
        id: 'pt1',
        class: 'ctrl_pt',
        height: 8,
        width: 8,
        x: (self.pt1[0] - ellipse_elem.rx.baseVal.value) * zoom_param.k + zoom_param.x - 4,
        y: self.pt1[1] * zoom_param.k + zoom_param.y - 4,
      })
      .call(d3.drag().on('drag', function (event) {
        const t = d3.select(this);
        t.attr('x', event.x - 4);
        const dist = self.pt1[0] - (event.x - zoom_param.x) / zoom_param.k;
        ellipse_elem.rx.baseVal.value = dist;
      }));

    // Temporary end point:
    edit_layer.append('rect')
      .attrs({ class: 'ctrl_pt',
        height: 8,
        width: 8,
        id: 'pt2',
        x: self.pt1[0] * zoom_param.k + zoom_param.x - 4,
        y: (self.pt1[1] - ellipse_elem.ry.baseVal.value) * zoom_param.k + zoom_param.y - 4 })
      .call(d3.drag().on('drag', function (event) {
        const t = d3.select(this);
        t.attr('y', event.y - 4);
        const dist = self.pt1[1] - (event.y - zoom_param.y) / zoom_param.k;
        ellipse_elem.ry.baseVal.value = dist;
      }));

    self.ellipse.on('dblclick', (event) => {
      event.stopPropagation();
      event.preventDefault();
      cleanup_edit_state();
    });
  }
 }
