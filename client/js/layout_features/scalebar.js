import ContextMenu from './../context-menu';
import { make_confirm_dialog2 } from './../dialogs';
import { coslaw_dist } from './../helpers_calc';
import { Mround } from './../helpers_math';
import { up_legend, down_legend, drag_legend_func } from './../legend';

import { pos_lgds_elem } from './snap_lines';

const convert_dist = (unit_in, unit_out, value) => {
  if (unit_in === unit_out) {
    return value;
  } else if (unit_in === 'km' && unit_out === 'm') {
    return +value * 1000;
  } else if (unit_in === 'km' && unit_out === 'mi') {
    return +value * 0.621371;
  } else if (unit_in === 'm' && unit_out === 'km') {
    return +value / 1000;
  } else if (unit_in === 'm' && unit_out === 'mi') {
    return +value * 0.000621371;
  } else if (unit_in === 'mi' && unit_out === 'km') {
    return +value * 1.60934;
  } else if (unit_in === 'mi' && unit_out === 'm') {
    return +value * 1609.34;
  }
  throw 'Invalid unit';
}

/**
* Handler for the scale bar (only designed for one scale bar)
*
*/
export const scaleBar = {
  create(x, y) {
    // if (!proj.invert) {
    //   swal({ title: '',
    //     text: _tr('app_page.common.error_interrupted_projection_scalebar'),
    //     type: 'error',
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //   }).then(() => { null; }, () => { null; });
    //   return;
    // }
    const scale_gp = map.append('g').attrs({ id: 'scale_bar', class: 'legend scale' }),
      x_pos = 40,
      y_pos = h - 100,
      bar_size = 50,
      self = this;

    this.x = x_pos;
    this.y = y_pos;
    this.bar_size = bar_size;
    this.unit = 'km';
    this.precision = 0;
    this.start_end_bar = false;
    this.fixed_size = false;
    const rv = this.getDist();
    if (rv) return;

    const getItems = () => [
      { name: _tr('app_page.common.edit_style'), action: () => { this.editStyle(); } },
      { name: _tr('app_page.common.up_element'), action: () => { this.up_element(); } },
      { name: _tr('app_page.common.down_element'), action: () => { this.down_element(); } },
      { name: _tr('app_page.common.delete'), action: () => { this.remove(); } },
    ];

    const scale_context_menu = new ContextMenu();
    this.under_rect = scale_gp.insert('rect')
      .attrs({ x: x_pos - 10, y: y_pos - 20, height: 30, width: this.bar_size + 20, id: 'under_rect' })
      .styles({ fill: 'green', 'fill-opacity': 0 });
    scale_gp.insert('rect')
      .attrs({ id: 'rect_scale', x: x_pos, y: y_pos, height: 2, width: this.bar_size })
      .style('fill', 'black');
    scale_gp.insert('text')
      .attrs({ id: 'text_limit_sup_scale', x: x_pos + bar_size, y: y_pos - 5 })
      .styles({
        'font-family': 'verdana',
        'font-size': '11px',
        'text-anchor': 'middle',
      })
      .text(`${this.dist_txt} km`);

    scale_gp.call(drag_legend_func(scale_gp));
    scale_gp.on('mouseover', function () {
      this.style.cursor = 'pointer';
      self.under_rect.style('fill-opacity', 0.1);
    })
    .on('mouseout', function () {
      this.style.cursor = 'pointer';
      self.under_rect.style('fill-opacity', 0);
    })
    .on('contextmenu dblclick', () => {
      d3.event.preventDefault();
      d3.event.stopPropagation();
      return scale_context_menu
        .showMenu(d3.event, document.querySelector('body'), getItems());
    });
    if (x && y) {
      scale_gp.attr('transform', `translate(${[x - this.x, y - this.y]})`);
    }
    this.Scale = scale_gp;
    this.displayed = true;
    if (this.dist > 100) {
      this.resize(Mround(this.dist / 100) * 100);
    } else if (this.dist > 10) {
      this.resize(Mround(this.dist / 10) * 10);
    } else if (Mround(this.dist) > 1) {
      this.resize(Mround(this.dist));
    } else if (Mround(this.dist * 10) / 10 > 0.1) {
      this.precision = 1;
      this.resize(Mround(this.dist * 10) / 10);
    } else {
      const t = this.dist.toString().split('.');
      this.precision = (t && t.length > 1) ? t[1].length : (`${this.dist}`).length;
      this.resize(this.dist);
    }
    pos_lgds_elem.set(`${scale_gp.attr('id')} ${scale_gp.attr('class')}`, get_bounding_rect(scale_gp.node()));
  },
  getDist() {
    const x_pos = w / 2,
      y_pos = h / 2,
      transform = d3.zoomTransform(svg_map),
      z_trans = [transform.x, transform.y],
      z_scale = transform.k;

    if (isNaN(+this.bar_size)) {
      console.log('scaleBar.bar_size : NaN');
      this.bar_size = 50;
    }

    const pt1 = proj.invert(
      [(x_pos - z_trans[0]) / z_scale, (y_pos - z_trans[1]) / z_scale]);
    const pt2 = proj.invert(
      [(x_pos + this.bar_size - z_trans[0]) / z_scale, (y_pos - z_trans[1]) / z_scale]);
    if (!pt1 || !pt2) {
      this.remove();
      return true;
    }
    this.dist = coslaw_dist([pt1[1], pt1[0]], [pt2[1], pt2[0]]);
    const mult = this.unit == 'km' ? 1
                : this.unit == 'm' ? 1000
                : this.unit == 'mi' ? 0.621371 : 1;
    this.dist_txt = (this.dist * mult).toFixed(this.precision);
  },
  resize(desired_dist) {
    desired_dist = desired_dist || this.fixed_size;
    const ratio = +this.dist / desired_dist;
    const new_size = this.bar_size / ratio;

    this.Scale.select('#rect_scale')
      .attr('width', new_size);
    this.Scale.select('#text_limit_sup_scale')
      .attr('x', this.x + new_size / 2);
    this.bar_size = new_size;
    this.fixed_size = desired_dist;
    this.under_rect.attr('width', new_size + 20);
    const err = this.getDist();
    if (err) {
      this.remove();
      return;
    }
    this.Scale.select('#text_limit_sup_scale').text(`${this.dist_txt} ${this.unit}`);
    this.handle_start_end_bar();
  },
  update() {
    const err = this.getDist();
    if (err) {
      this.remove();
      return;
    }
    if (this.fixed_size) {
      this.resize();
    } else {
      this.Scale.select('#text_limit_sup_scale').text(`${this.dist_txt} ${this.unit}`);
    }
  },
  up_element() {
    up_legend(this.Scale.node());
  },
  down_element() {
    down_legend(this.Scale.node());
  },
  remove() {
    pos_lgds_elem.delete(`${this.Scale.attr('id')} ${this.Scale.attr('class')}`);
    this.Scale.remove();
    this.Scale = null;
    this.displayed = false;
  },
  handle_start_end_bar() {
    this.Scale.selectAll('.se_bar').remove();
    if (this.start_end_bar) {
      this.Scale.insert('rect')
        .attrs({ class: 'start_bar se_bar', x: this.x, y: this.y - 4.5, width: '1.5px', height: '4.5px' });

      this.Scale.insert('rect')
        .attrs({ class: 'end_bar se_bar', x: this.x + this.bar_size - 1.5, y: this.y - 4.5, width: '1.5px', height: '4.5px' });
    }
  },
  editStyle() {
    let new_val;
    const self = this;
    const initial_params = {
      bar_size: self.bar_size,
      displayed: self.displayed,
      dist: self.dist,
      dist_txt: self.dist_txt,
      fixed_size: self.fixed_size,
      precision: self.precision,
      unit: self.unit,
      x: self.x,
      y: self.y,
      transform: self.Scale._groups[0][0].getAttribute('transform') || '',
    };

    make_confirm_dialog2('scaleBarEditBox', _tr('app_page.scale_bar_edit_box.title'), { widthFitContent: true })
      .then((confirmed) => {
        if (!confirmed) {
          let _t = self.dist_txt;
          self.bar_size = initial_params.bar_size;
          self.displayed = initial_params.displayed;
          self.dist = initial_params.dist;
          self.dist_txt = initial_params.dist_txt;
          self.fixed_size = initial_params.fixed_size;
          self.precision = initial_params.precision;
          self.unit = initial_params.unit;
          self.x = initial_params.x;
          self.y = initial_params.y;
          if (_t == initial_params.dist_txt) {
            self.update();
          } else {
            self.resize(+_t);
          }
        }
      });
    const box_body = d3.select('.scaleBarEditBox').select('.modal-body').style('width', '295px');

    const a = box_body.append('div')
      .attr('class', 'line_elem');

    a.append('span')
      .style('flex-grow', '0.9')
      .html(_tr('app_page.scale_bar_edit_box.fixed_size'));

    a.append('input')
      .attrs({ type: 'checkbox', checked: self.fixed_size ? true : null })
      .on('change', () => {
        if (!self.fixed_size) {
          box_body.select('#scale_fixed_field').property('disabled', false);
          const v = convert_dist(self.unit, 'km', +box_body.select('#scale_fixed_field').property('value'));
          self.fixed_size = v;
          self.resize(v);
        } else {
          box_body.select('#scale_fixed_field').property('disabled', true);
          self.fixed_size = false;
          self.update()
        }
      });

    a.append('input')
      .attrs({ id: 'scale_fixed_field', type: 'number' })
      .property('disabled', initial_params.fixed_size ? null : true)
      .property('value', +this.dist_txt)
      .on('change', function () {
        const v = convert_dist(self.unit, 'km', +this.value);
        self.resize(v);
      });

    const b = box_body.append('div')
      .attr('class', 'line_elem');

    b.insert('span')
      .html(_tr('app_page.scale_bar_edit_box.precision'));

    b.insert('input')
      .attrs({
        id: 'scale_precision',
        type: 'number',
        min: 0,
        max: 6,
        step: 1,
      })
      .property('value', +self.precision)
      .on('change', function () {
        self.precision = +this.value;
        self.update();
      });

    const c = box_body.append('div')
      .attr('class', 'line_elem');

    c.insert('span')
      .html(_tr('app_page.scale_bar_edit_box.unit'));

    const unit_select = c.insert('select')
      .style('float', 'right')
      .attr('id', 'scale_unit')
      .on('change', function () {
        const old_unit = self.unit;
        let v;
        self.unit = this.value;
        if (self.fixed_size != false) {
          v = convert_dist(old_unit, self.unit, +self.fixed_size).toFixed(self.precision);
          self.fixed_size = +self.dist;
        } else {
          v = convert_dist(old_unit, self.unit, +self.dist_txt)
            .toFixed(self.precision);
        }
        box_body.select('#scale_fixed_field').property('value', +v);
        self.update();
      });
    unit_select.append('option').text('km').attr('value', 'km');
    unit_select.append('option').text('m').attr('value', 'm');
    unit_select.append('option').text('mi').attr('value', 'mi');
    unit_select.node().value = self.unit;

    const e = box_body.append('div')
      .attr('class', 'line_elem');

    e.append('label')
      .attr('for', 'checkbox_start_end_bar')
      .html(_tr('app_page.scale_bar_edit_box.start_end_bar'));

    e.append('input')
      .attrs({ id: 'checkbox_start_end_bar', type: 'checkbox' })
      .on('change', () => {
        self.start_end_bar = self.start_end_bar !== true;
        self.handle_start_end_bar();
      });
    document.getElementById('checkbox_start_end_bar').checked = self.start_end_bar;
  },
  displayed: false,
};
