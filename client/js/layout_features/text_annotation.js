import ContextMenu from './../context-menu';
import { rgb2hex } from './../colors_helpers';
import { check_remove_existing_box, make_confirm_dialog2 } from './../dialogs';
import { available_fonts } from './../fonts';
import { cloneObj } from './../helpers';
import { Mabs, Mmax, Mmin } from './../helpers_math';
import { handle_click_hand } from './../interface';
import { up_legend, down_legend } from './../legend';
import { get_coords_snap_lines, make_red_line_snap, pos_lgds_elem } from './snap_lines';

const round = Math.round;

export default class Textbox {
  constructor(parent, id_text_annot, position = [10, 30]) {
    const self = this;
    this.x = position[0];
    this.y = position[1];
    this.fontSize = 14;
    const context_menu = new ContextMenu();
    const getItems = () => [
      { name: _tr('app_page.common.edit_style'), action: () => { this.editStyle(); } },
      { name: _tr('app_page.common.up_element'), action: () => { this.up_element(); } },
      { name: _tr('app_page.common.down_element'), action: () => { this.down_element(); } },
      { name: _tr('app_page.common.delete'), action: () => { this.remove(); } },
    ];
    const drag_txt_annot = d3.drag()
      .subject(function () {
        const t = d3.select(this).select('text');
        const snap_lines = get_coords_snap_lines(this.id);
        return {
          x: t.attr('x'),
          y: t.attr('y'),
          map_locked: !!map_div.select('#hand_button').classed('locked'),
          snap_lines,
        };
      })
      .on('start', () => {
        d3.event.sourceEvent.stopPropagation();
        handle_click_hand('lock');
      })
      .on('end', function () {
        if (d3.event.subject && !d3.event.subject.map_locked) { handle_click_hand('unlock'); }
        pos_lgds_elem.set(this.id, get_bounding_rect(this.querySelector('rect')));
      })
      .on('drag', function () {
        d3.event.sourceEvent.preventDefault();
        const elem = d3.select(this).select('text').attrs({ x: +d3.event.x, y: +d3.event.y });
        const transform = elem.attr('transform');
        if (transform) {
          const v = +transform.match(/[-.0-9]+/g)[0];
          elem.attr('transform', `rotate(${v}, ${d3.event.x + self.width}, ${d3.event.y + self.height})`);
        }
        elem.selectAll('tspan').attr('x', +d3.event.x);

        if (_app.autoalign_features) {
          const bbox = get_bounding_rect(elem.node()),
            xmin = bbox.x - 10,
            xmax = xmin + bbox.width + 20,
            ymin = bbox.y - 10,
            ymax = ymin + bbox.height + 20,
            snap_lines_x = d3.event.subject.snap_lines.x,
            snap_lines_y = d3.event.subject.snap_lines.y;
          for (let i = 0; i < snap_lines_x.length; i++) {
            if (Mabs(snap_lines_x[i][0] - xmin) < 10) {
              const _y1 = Mmin(Mmin(snap_lines_y[i][0], snap_lines_y[i][1]), ymin);
              const _y2 = Mmax(Mmax(snap_lines_y[i][0], snap_lines_y[i][1]), ymax);
              make_red_line_snap(snap_lines_x[i][0], snap_lines_x[i][0], _y1, _y2);
              elem.selectAll('tspan').attr('x', snap_lines_x[i][0] + 10);
              elem.attr('x', snap_lines_x[i][0] + 10);
            }
            if (Mabs(snap_lines_x[i][0] - xmax) < 10) {
              const _y1 = Mmin(Mmin(snap_lines_y[i][0], snap_lines_y[i][1]), ymin);
              const _y2 = Mmax(Mmax(snap_lines_y[i][0], snap_lines_y[i][1]), ymax);
              make_red_line_snap(snap_lines_x[i][0], snap_lines_x[i][0], _y1, _y2);
              elem.selectAll('tspan').attr('x', snap_lines_x[i][0] - bbox.width - 10);
              elem.attr('x', snap_lines_x[i][0] - bbox.width - 10);
            }
            if (Mabs(snap_lines_y[i][0] - ymin) < 10) {
              const x1 = Mmin(Mmin(snap_lines_x[i][0], snap_lines_x[i][1]), xmin);
              const x2 = Mmax(Mmax(snap_lines_x[i][0], snap_lines_x[i][1]), xmax);
              make_red_line_snap(x1, x2, snap_lines_y[i][0], snap_lines_y[i][0]);
              elem.attr('y', snap_lines_y[i][0] + bbox.height + 7.5);
            }
            if (Mabs(snap_lines_y[i][0] - ymax) < 10) {
              const x1 = Mmin(Mmin(snap_lines_x[i][0], snap_lines_x[i][1]), xmin);
              const x2 = Mmax(Mmax(snap_lines_x[i][0], snap_lines_x[i][1]), xmax);
              make_red_line_snap(x1, x2, snap_lines_y[i][0], snap_lines_y[i][0]);
              elem.attr('y', snap_lines_y[i][0] - 17.5);
            }
          }
        }
        elem.attr('x', elem.select('tspan').attr('x'));
        self.x = elem.attr('x');
        self.y = elem.attr('y');
        if (transform) {
          const v = +transform.match(/[-.0-9]+/g)[0];
          elem.attr('transform', `rotate(${v}, ${self.x}, ${self.y})`);
        }
        self.update_bbox();
      });
    const group_elem = map.append('g')
      .attrs({ id: id_text_annot, class: 'legend txt_annot' })
      .styles({ cursor: 'pointer' })
      .on('mouseover', () => {
        under_rect.style('fill-opacity', 0.1);
      })
      .on('mouseout', () => {
        under_rect.style('fill-opacity', 0);
      });
    let under_rect = group_elem.append('rect')
      .styles({ fill: 'green', 'fill-opacity': 0 });
    const text_elem = group_elem.append('text')
      .attrs({ x: this.x, y: this.y, id: ['in_', id_text_annot].join('') })
      .styles({
        'font-size': `${this.fontSize}px`,
        'font-family': 'verdana',
        'text-anchor': 'start',
        'paint-order': 'stroke fill',
      });
    text_elem.append('tspan')
      .attr('x', this.x)
      .text(_tr('app_page.text_box_edit_box.constructor_default'));

    group_elem
      .call(drag_txt_annot)
      .on('dblclick', () => {
        d3.event.preventDefault();
        d3.event.stopPropagation();
        this.editStyle();
      })
      .on('contextmenu', () => {
        context_menu.showMenu(
          d3.event,
          document.querySelector('body'),
          getItems(),
        );
      });

    this.lineHeight = round(this.fontSize * 1.4);
    this.textAnnot = text_elem;
    this.group = group_elem;
    this.fontFamily = 'verdana';
    this.anchor = 'start';
    this.buffer = undefined;
    this.id = id_text_annot;

    this.update_bbox();
    pos_lgds_elem.set(this.id, get_bounding_rect(group_elem.node()));
  }

  remove() {
    pos_lgds_elem.delete(this.group.attr('id'));
    this.group.remove();
  }

  update_text(new_content) {
    const split = new_content.split('\n');
    this.textAnnot.selectAll('tspan').remove();
    for (let i = 0; i < split.length; i++) {
      this.textAnnot.append('tspan')
        .attrs({ x: this.x, dy: i === 0 ? null : this.lineHeight })
        .html(split[i]);
    }
    this.update_bbox();
  }

  get_text_content() {
    const content = [];
    this.textAnnot.selectAll('tspan')
      .each(function () {
        content.push(this.innerHTML);
      });
    return content.join('\n');
  }

  update_bbox() {
    const bbox = get_bounding_rect(this.textAnnot.node());
    this.width = bbox.width;
    this.height = bbox.height;
    this.group.select('rect')
      .attrs({
        x: bbox.x - 10,
        y: bbox.y - 10,
        height: this.height + 20,
        width: this.width + 20,
      });
  }

  updateLineHeight() {
    const self = this;
    self.lineHeight = round(self.fontSize * 1.33);
    self.textAnnot.selectAll('tspan').each(function (d, i) {
      if (i !== 0) {
        d3.select(this).attr('dy', self.lineHeight);
      }
    });
  }

  editStyle() {
    const self = this;
    const text_elem = self.textAnnot;
    check_remove_existing_box('.styleTextAnnotation');

    const current_options = {
      size: self.fontSize,
      color: text_elem.style('fill'),
      content: unescape(this.get_text_content()),
      transform_rotate: text_elem.attr('transform'),
      x: text_elem.attr('x'),
      y: text_elem.attr('y'),
      font_weight: text_elem.style('font-weight'),
      font_style: text_elem.style('font-style'),
      text_decoration: text_elem.style('text-decoration'),
      buffer: self.buffer !== undefined ? cloneObj(self.buffer) : undefined,
      stroke_width: text_elem.style('stroke-width'),
      stroke: text_elem.style('stroke'),
      font_family: self.fontFamily,
    };
    current_options.font_weight = (current_options.font_weight === '400' || current_options.font_weight === '') ? '' : 'bold';
    make_confirm_dialog2('styleTextAnnotation', _tr('app_page.text_box_edit_box.title'), { widthFitContent: true })
      .then((confirmed) => {
        if (!confirmed) {
          text_elem
            .styles({
              color: current_options.color,
              'font-size': `${current_options.size}px`,
              'font-weight': current_options.font_weight,
              'text-decoration': current_options.text_decoration,
              'font-style': current_options.font_style,
              'font-family': current_options.font_family,
              stroke: current_options.stroke,
              'stroke-width': current_options.stroke_width,
              'paint-order': 'stroke fill',
            });
          self.fontSize = current_options.size;
          self.fontFamily = current_options.font_family;
          text_elem.attr('transform', current_options.transform_rotate);
          self.buffer = current_options.buffer;
          this.update_text(current_options.content);
        } else if (!buffer_txt_chk.node().checked) {
          self.buffer = undefined;
        }
        // always update the bbox when quitting the dialog
        this.update_bbox();
      });
    const box_content = d3.select('.styleTextAnnotation')
      .select('.modal-body')
      .style('width', '295px')
      .insert('div')
      .attr('id', 'styleTextAnnotation');

    let current_rotate = typeof current_options.transform_rotate === 'string' ? current_options.transform_rotate.match(/[-.0-9]+/g) : 0;
    if (current_rotate && current_rotate.length === 3) {
      current_rotate = +current_rotate[0];
    } else {
      current_rotate = 0;
    }

    const bbox = get_bounding_rect(text_elem.node()),
      nx = bbox.x,
      ny = bbox.y,
      x_center = nx + bbox.width / 2,
      y_center = ny + bbox.height / 2;

    const option_rotation = box_content.append('div')
      .attr('class', 'line_elem');

    option_rotation.append('span')
      .style('flex-grow', '0.9')
      .html(_tr('app_page.text_box_edit_box.rotation'));

    const angle_display = option_rotation.append('div');

    angle_display.append('input')
      .attrs({
        type: 'number',
        min: 0,
        max: 360,
        step: 'any',
        class: 'without_spinner',
        id: 'textbox_txt_rotate',
      })
      .styles({ width: '40px' })
      .property('value', current_rotate)
      .on('change', function () {
        const rotate_value = +this.value;
        text_elem.attrs({ x: nx, y: ny, transform: `rotate(${[rotate_value, x_center, y_center]})` });
        text_elem.selectAll('tspan')
          .attr('x', nx);
        document.getElementById('textbox_range_rotate').value = rotate_value;
      });

    angle_display.append('span')
      .html('°');

    option_rotation.append('input')
      .attrs({ type: 'range', min: 0, max: 360, step: 0.1, id: 'textbox_range_rotate' })
      .property('value', current_rotate)
      .on('change', function () {
        const rotate_value = +this.value;
        text_elem
          .attrs({ x: nx, y: ny, transform: `rotate(${[rotate_value, x_center, y_center]})` });
        text_elem.selectAll('tspan')
          .attr('x', nx);
        document.getElementById('textbox_txt_rotate').value = rotate_value;
      });

    const options_font = box_content.append('div')
      .attr('class', 'line_elem');

    const font_select = options_font.insert('select')
      .on('change', function () {
        text_elem.style('font-family', this.value);
        self.fontFamily = this.value;
      });

    available_fonts.forEach((font) => {
      font_select.append('option').text(font[0]).attr('value', font[1]);
    });

    // Get the current font and select it in the dropdown
    // (we read the list in reverse order because we have Arial then Arial Black in
    // the list, and we don't want to get 'arial' result when its in fact 'arial black'
    // - because we use 'include' predicate just below)
    font_select.node().selectedIndex = (
      available_fonts.length - 1 - available_fonts.slice().reverse()
        .map(([name, cssString]) => {
          if (self.fontFamily.toLowerCase().includes(name.toLowerCase())) {
            return 1;
          }
          return 0;
        })
        .indexOf(1)
    );

    options_font.append('input')
      .attrs({
        id: 'font_size',
        min: 0,
        max: 34,
        step: 0.1,
        type: 'number',
      })
      .styles({ width: '60px' })
      .property('value', self.fontSize)
      .on('change', function () {
        self.fontSize = +this.value;
        text_elem.style('font-size', `${self.fontSize}px`);
        self.updateLineHeight();
        self.update_bbox();
      });

    options_font.append('input')
      .attrs({ type: 'color', id: 'font_color' })
      .style('width', '60px')
      .property('value', rgb2hex(current_options.color))
      .on('change', function () {
        text_elem.style('fill', this.value);
      });

    const options_format = box_content.append('p').style('text-align', 'center');
    const btn_bold = options_format
      .insert('span')
      .attr('class', current_options.font_weight === 'bold' ? 'active button_disc' : 'button_disc')
      .html('<img title="Bold" src="data:image/gif;base64,R0lGODlhFgAWAID/AMDAwAAAACH5BAEAAAAALAAAAAAWABYAQAInhI+pa+H9mJy0LhdgtrxzDG5WGFVk6aXqyk6Y9kXvKKNuLbb6zgMFADs=">');
    const btn_italic = options_format
      .insert('span')
      .attr('class', current_options.font_style === 'italic' ? 'active button_disc' : 'button_disc')
      .html('<img title="Italic" src="data:image/gif;base64,R0lGODlhFgAWAKEDAAAAAF9vj5WIbf///yH5BAEAAAMALAAAAAAWABYAAAIjnI+py+0Po5x0gXvruEKHrF2BB1YiCWgbMFIYpsbyTNd2UwAAOw==">');
    const btn_underline = options_format
      .insert('span')
      .attr('class', current_options.text_decoration === 'underline' ? 'active button_disc' : 'button_disc')
      .html('<img title="Underline" src="data:image/gif;base64,R0lGODlhFgAWAKECAAAAAF9vj////////yH5BAEAAAIALAAAAAAWABYAAAIrlI+py+0Po5zUgAsEzvEeL4Ea15EiJJ5PSqJmuwKBEKgxVuXWtun+DwxCCgA7">');

    const content_modif_zone = box_content.append('p');
    content_modif_zone.append('span')
      .html(_tr('app_page.text_box_edit_box.content'));
    const right = content_modif_zone.append('span')
      .attr('class', 'align-option')
      .styles({ 'font-size': '11px', 'font-weight': '', 'margin-left': '10px', float: 'right' })
      .html('right')
      .on('click', () => {
        content_modif_zone.selectAll('.align-option').style('font-weight', '');
        right.style('font-weight', 'bold')
          .style('font-size', '12px');
        text_elem.style('text-anchor', 'end');
        self.anchor = 'end';
        self.update_bbox();
      });
    const center = content_modif_zone.append('span')
      .styles({ 'font-size': '11px', 'font-weight': '', 'margin-left': '10px', float: 'right' })
      .attr('class', 'align-option')
      .html('center')
      .on('click', () => {
        content_modif_zone.selectAll('.align-option').style('font-weight', '');
        center.style('font-weight', 'bold')
          .style('font-size', '12px');
        text_elem.style('text-anchor', 'middle');
        self.anchor = 'middle';
        self.update_bbox();
      });
    const left = content_modif_zone.append('span')
      .styles({ 'font-size': '11px', 'font-weight': '', 'margin-left': '10px', float: 'right' })
      .attr('class', 'align-option')
      .html('left')
      .on('click', () => {
        content_modif_zone.selectAll('.align-option')
          .style('font-weight', '')
          .style('font-size', '11px');
        left.style('font-weight', 'bold')
          .style('font-size', '12px');
        text_elem.style('text-anchor', 'start');
        self.anchor = 'start';
        self.update_bbox();
      });
    const selected = self.anchor === 'start' ? left : self.anchor === 'middle' ? center : right;
    selected.style('font-weight', 'bold')
      .style('font-size', '12px');

    content_modif_zone.append('span')
      .html('<br>');
    content_modif_zone.append('textarea')
      .attr('id', 'annotation_content')
      .styles({ margin: '5px 0px 0px', 'min-width': '100%', 'max-width': '100%' })
      .on('keyup', function () {
        self.update_text(this.value);
      });
    document.getElementById('annotation_content').value = current_options.content;

    const buffer_text_zone = box_content.append('div')
      .attr('class', 'line_elem');

    let buffer_txt_chk = buffer_text_zone.append('input')
      .attrs({ type: 'checkbox', id: 'buffer_txt_chk', checked: current_options.buffer !== undefined ? true : null })
      .on('change', function () {
        if (this.checked) {
          buffer_color.style('display', '');
          buffer_size.style('display', '');
          if (self.buffer === undefined) {
            self.buffer = { color: '#FFFFFF', size: 1 };
          }
          const color = self.buffer.color,
            size = self.buffer.size;
          text_elem
            .style('stroke', color)
            .style('stroke-width', `${size}px`);
        } else {
          buffer_color.style('display', 'none');
          buffer_size.style('display', 'none');
          text_elem
            .style('stroke', null)
            .style('stroke-width', null);
        }
      });

    buffer_text_zone.append('label')
      .style('width', 'inherit')
      .attrs({ for: 'buffer_txt_chk' })
      .text(_tr('app_page.text_box_edit_box.buffer'));

    const buffer_size = buffer_text_zone.append('input')
      .styles({
        display: current_options.buffer !== undefined ? '' : 'none',
        width: '40px',
      })
      .attr('type', 'number')
      .property('value', current_options.buffer !== undefined ? current_options.buffer.size : 1)
      .on('change', function () {
        self.buffer.size = this.value;
        const color = self.buffer.color,
          size = self.buffer.size;
        text_elem
          .style('stroke', color)
          .style('stroke-width', `${size}px`);
      });

    const buffer_color = buffer_text_zone.append('input')
      .styles({
        display: current_options.buffer !== undefined ? '' : 'none',
      })
      .attr('type', 'color')
      .property('value', current_options.buffer && current_options.buffer.color ? rgb2hex(current_options.buffer.color) : '#FFFFFF')
      .on('change', function () {
        self.buffer.color = this.value;
        const color = self.buffer.color,
          size = self.buffer.size;
        text_elem
          .style('stroke', color)
          .style('stroke-width', `${size}px`);
      });

    btn_bold.on('click', function () {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        text_elem.style('font-weight', '');
      } else {
        this.classList.add('active');
        text_elem.style('font-weight', 'bold');
      }
    });

    btn_italic.on('click', function () {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        text_elem.style('font-style', '');
      } else {
        this.classList.add('active');
        text_elem.style('font-style', 'italic');
      }
    });

    btn_underline.on('click', function () {
      if (this.classList.contains('active')) {
        this.classList.remove('active');
        text_elem.style('text-decoration', '');
      } else {
        this.classList.add('active');
        text_elem.style('text-decoration', 'underline');
      }
    });
  }

  up_element() {
    up_legend(this.group.node());
  }

  down_element() {
    down_legend(this.group.node());
  }
}
