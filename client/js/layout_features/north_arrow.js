import ContextMenu from './../context-menu';
import { make_confirm_dialog2 } from './../dialogs';
import { Mabs, Mmax, Mmin } from './../helpers_math';
import { handle_click_hand } from './../interface';
import { up_legend, down_legend } from './../legend';
import { get_coords_snap_lines, make_red_line_snap, pos_lgds_elem } from './snap_lines';

export const northArrow = { /* eslint-disable-line import/prefer-default-export */
  display(x, y) {
    let x_pos = x || w - 100,
      y_pos = y || h - 100,
      self = this;

    const arrow_gp = map.append('g')
      .attrs({ id: 'north_arrow', class: 'legend', scale: 1, rotate: null })
      .style('cursor', 'all-scroll');

    this.svg_node = arrow_gp;
    this.displayed = true;

    this.arrow_img = arrow_gp.insert('image')
      .attrs({ x: x_pos, y: y_pos, height: '30px', width: '30px' })
      .attr('xlink:href', 'data:image/png;base64,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');

    this.drag_behavior = d3.drag()
      .subject(function () {
        const t = d3.select(this.querySelector('image'));
        const snap_lines = get_coords_snap_lines(this.id);
        return {
          x: +t.attr('x'),
          y: +t.attr('y'),
          map_locked: !!map_div.select('#hand_button').classed('locked'),
          snap_lines,
        };
      })
      .on('start', () => {
        d3.event.sourceEvent.stopPropagation();
        handle_click_hand('lock');
      })
      .on('end', function () {
        if (d3.event.subject && !d3.event.subject.map_locked) {
          handle_click_hand('unlock');
        }
        pos_lgds_elem.set(this.id, get_bounding_rect(this));
      })
      .on('drag', function () {
        d3.event.sourceEvent.preventDefault();
        const t1 = this.querySelector('image'),
          t2 = this.querySelector('rect'),
          dim = t2.width.baseVal.value / 2;
        let tx = +d3.event.x,
          ty = +d3.event.y;
        if (tx < 0 - dim || tx > w + dim || ty < 0 - dim || ty > h + dim) {
          return;
        }
        t1.x.baseVal.value = tx;
        t1.y.baseVal.value = ty;
        t2.x.baseVal.value = tx - 7.5;
        t2.y.baseVal.value = ty - 7.5;
        self.x_center = tx - 7.5 + dim;
        self.y_center = ty - 7.5 + dim;
        if (_app.autoalign_features) {
          const bbox = get_bounding_rect(t2),
            xmin = t2.x.baseVal.value,
            xmax = xmin + bbox.width,
            ymin = t2.y.baseVal.value,
            ymax = ymin + bbox.height,
            snap_lines_x = d3.event.subject.snap_lines.x,
            snap_lines_y = d3.event.subject.snap_lines.y;
          for (let i = 0; i < snap_lines_x.length; i++) {
            if (Mabs(snap_lines_x[i][0] - xmin) < 10) {
              const _y1 = Mmin(Mmin(snap_lines_y[i][0], snap_lines_y[i][1]), ymin);
              const _y2 = Mmax(Mmax(snap_lines_y[i][0], snap_lines_y[i][1]), ymax);
              make_red_line_snap(snap_lines_x[i][0], snap_lines_x[i][0], _y1, _y2);
              tx = snap_lines_x[i][0] + 7.5;
            }
            if (Mabs(snap_lines_x[i][0] - xmax) < 10) {
              const _y1 = Mmin(Mmin(snap_lines_y[i][0], snap_lines_y[i][1]), ymin);
              const _y2 = Mmax(Mmax(snap_lines_y[i][0], snap_lines_y[i][1]), ymax);
              make_red_line_snap(snap_lines_x[i][0], snap_lines_x[i][0], _y1, _y2);
              tx = snap_lines_x[i][0] - bbox.width + 7.5;
            }
            if (Mabs(snap_lines_y[i][0] - ymin) < 10) {
              const _x1 = Mmin(Mmin(snap_lines_x[i][0], snap_lines_x[i][1]), xmin);
              const _x2 = Mmax(Mmax(snap_lines_x[i][0], snap_lines_x[i][1]), xmax);
              make_red_line_snap(_x1, _x2, snap_lines_y[i][0], snap_lines_y[i][0]);
              ty = snap_lines_y[i][0] + 7.5;
            }
            if (Mabs(snap_lines_y[i][0] - ymax) < 10) {
              const _x1 = Mmin(Mmin(snap_lines_x[i][0], snap_lines_x[i][1]), xmin);
              const _x2 = Mmax(Mmax(snap_lines_x[i][0], snap_lines_x[i][1]), xmax);
              make_red_line_snap(_x1, _x2, snap_lines_y[i][0], snap_lines_y[i][0]);
              ty = snap_lines_y[i][0] - bbox.height + 7.5;
            }
          }
          t1.x.baseVal.value = tx;
          t1.y.baseVal.value = ty;
          t2.x.baseVal.value = tx - 7.5;
          t2.y.baseVal.value = ty - 7.5;
          self.x_center = tx - 7.5 + dim;
          self.y_center = ty - 7.5 + dim;
        }
      });

    const getItems = () => [
      { name: _tr('app_page.common.options'), action: () => { this.editStyle(); } },
      { name: _tr('app_page.common.up_element'), action: () => { this.up_element(); } },
      { name: _tr('app_page.common.down_element'), action: () => { this.down_element(); } },
      { name: _tr('app_page.common.delete'), action: () => { this.remove(); } },
    ];

    const arrow_context_menu = new ContextMenu();

    const bbox = document.getElementById('north_arrow').getBBox();

    this.under_rect = arrow_gp.append('g')
      .insert('rect')
      .styles({ fill: 'green', 'fill-opacity': 0 })
      .attrs({
        x: bbox.x - 7.5,
        y: bbox.y - 7.5,
        height: bbox.height + 15,
        width: bbox.width + 15,
      });

    this.x_center = bbox.x + bbox.width / 2;
    this.y_center = bbox.y + bbox.height / 2;

    arrow_gp.call(this.drag_behavior);

    arrow_gp
      .on('mouseover', () => {
        self.under_rect.style('fill-opacity', 0.1);
      })
      .on('mouseout', () => {
        self.under_rect.style('fill-opacity', 0);
      })
      .on('contextmenu dblclick', () => {
        d3.event.preventDefault();
        return arrow_context_menu
          .showMenu(d3.event, document.querySelector('body'), getItems());
      });
  },
  up_element() {
    up_legend(this.svg_node.node());
  },
  down_element() {
    down_legend(this.svg_node.node());
  },
  remove() {
    pos_lgds_elem.delete(this.svg_node.attr('id'));
    this.svg_node.remove();
    this.displayed = false;
  },
  editStyle() {
    const self = this,
      old_dim = +self.under_rect.attr('width'),
      old_rotate = !isNaN(+self.svg_node.attr('rotate')) ? +self.svg_node.attr('rotate') : 0,
      x_pos = +self.x_center - old_dim / 2,
      y_pos = +self.y_center - old_dim / 2;

    make_confirm_dialog2('arrowEditBox', _tr('app_page.north_arrow_edit_box.title'), { widthFitContent: true })
      .then((confirmed) => {
        if (confirmed) {
          null;
        }
      });

    const box_body = d3.select('.arrowEditBox').select('.modal-body').style('width', '295px');

    const a = box_body.append('div')
      .attr('class', 'line_elem');

    a.append('span')
      .styles({ flex: '0.9' })
      .html(_tr('app_page.north_arrow_edit_box.size'));

    const a_group_px = a.append('div');

    a_group_px.append('input')
      .attrs({
        class: 'without_spinner',
        id: 'txt_size_n_arrow',
        min: 0,
        max: 200,
        step: 1,
        type: 'number',
      })
      .styles({ width: '40px' })
      .property('value', old_dim)
      .on('change', function () {
        const elem = document.getElementById('range_size_n_arrow');
        elem.value = +this.value;
        elem.dispatchEvent(new Event('change'));
      });

    a_group_px.append('span')
      .html('px');

    a.append('input')
      .attrs({
        type: 'range',
        min: 1,
        max: 200,
        step: 1,
        id: 'range_size_n_arrow',
      })
      .property('value', old_dim)
      .on('change', function () {
        const new_size = +this.value;
        self.arrow_img.attrs({
          width: new_size,
          height: new_size,
        });
        const bbox = self.arrow_img.node().getBBox();
        self.under_rect.attrs({
          x: bbox.x - 7.5,
          y: bbox.y - 7.5,
          height: bbox.height + 15,
          width: bbox.width + 15,
        });
        self.x_center = x_pos + new_size / 2;
        self.y_center = y_pos + new_size / 2;
        document.getElementById('txt_size_n_arrow').value = new_size;
      });

    const b = box_body.append('div')
      .attr('class', 'line_elem');

    b.append('span')
      .styles({ flex: '0.9' })
      .html(_tr('app_page.north_arrow_edit_box.rotation'));

    const b_group_angle = b.append('div');

    b_group_angle.append('input')
      .attrs({
        class: 'without_spinner',
        id: 'txt_rotate_n_arrow',
        min: 0,
        max: 360,
        step: 'any',
        type: 'number',
      })
      .styles({ width: '40px' })
      .property('value', old_rotate)
      .on('change', function () {
        const rotate_value = +this.value;
        self.svg_node.attrs({
          rotate: rotate_value,
          transform: `rotate(${[rotate_value, self.x_center, self.y_center]})`,
        });
        document.getElementById('range_rotate_n_arrow').value = rotate_value;
      });

    b_group_angle.append('span')
      .html(' °');

    b.append('input')
      .attrs({
        type: 'range',
        min: 0,
        max: 360,
        step: 0.1,
        id: 'range_rotate_n_arrow',
      })
      .property('value', old_rotate)
      .on('change', function () {
        const rotate_value = +this.value;
        self.svg_node.attrs({
          rotate: rotate_value,
          transform: `rotate(${[rotate_value, self.x_center, self.y_center]})`,
        });
        document.getElementById('txt_rotate_n_arrow').value = rotate_value;
      });
  },
  displayed: false,
};
