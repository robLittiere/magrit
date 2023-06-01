import { fill_export_png_options } from './section5';
import { get_nb_decimals, round_value } from './../helpers_calc';
import { Mround } from './../helpers_math';
import { handle_title, handle_title_properties } from './../interface';
import { canvas_mod_size, handle_bg_color, rotate_global, zoom_without_redraw } from './../map_ctrl';
import { add_layout_feature } from './../layout_features/helpers';
import { sys_run_button } from './../ui/buttons';

export default function makeSection4() {
  const zoom_prop = svg_map.__zoom;
  const section4 = d3.select('#section4');
  const dv4 = section4.append('div')
    .style('margin', 'auto')
    .append('ul')
    .attr('class', 'config_map_options');

  const e = dv4.append('li')
    .styles({
      'text-align': 'center',
    });

  e.append('input')
    .attrs({
      id: 'title',
      class: 'list_elem_section4 i18n',
      placeholder: '',
      'data-i18n': '[placeholder]app_page.section4.map_title',
    })
    .styles({ margin: '0px 0px 0px 3px', width: '160px' })
    .on('keyup', function () { handle_title(this.value); });

  e.append('span')
    .styles({
      display: 'inline', top: '4px', cursor: 'pointer', 'vertical-align': 'sub',
    })
    .html(sys_run_button.replace('submit', 'Title properties'))
    .on('click', handle_title_properties);

  const f = dv4.append('li');
  f.append('input')
    .styles({
      position: 'absolute', right: '20px', width: '60px', 'margin-left': '15px',
    })
    .attrs({ type: 'color', id: 'bg_color', class: 'list_elem_section4 m_elem_right' })
    .property('value', '#ffffff')
    .on('change', function () { handle_bg_color(this.value); });
  f.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.background_color',
    });

  const a1 = dv4.append('li');
  a1.append('input')
    .attrs({ id: 'input-width', type: 'number', class: 'list_elem_section4 m_elem_right' })
    .property('value', w)
    .on('change', function () {
      const new_width = +this.value;
      if (new_width === 0 || isNaN(new_width)) {
        this.value = w;
        return;
      }
      const ratio_type = document.getElementById('map_ratio_select').value;
      if (ratio_type === 'portrait') {
        h = round_value(new_width / 0.70707, 0);
        canvas_mod_size([new_width, h]);
      } else if (ratio_type === 'landscape') {
        h = round_value(new_width * 0.70707, 0);
        canvas_mod_size([new_width, h]);
      } else {
        canvas_mod_size([new_width, null]);
      }
    });
  a1.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.map_width',
    });

  const a2 = dv4.append('li');
  a2.append('input')
    .attrs({ id: 'input-height', type: 'number', class: 'm_elem_right list_elem_section4' })
    .property('value', h)
    .on('change', function () {
      const new_height = +this.value;
      if (new_height === 0 || isNaN(new_height)) {
        this.value = h;
        return;
      }
      const ratio_type = document.getElementById('map_ratio_select').value;
      if (ratio_type === 'portrait') {
        w = round_value(new_height * 0.70707, 0);
        canvas_mod_size([w, new_height]);
      } else if (ratio_type === 'landscape') {
        w = round_value(new_height / 0.70707, 0);
        canvas_mod_size([w, new_height]);
      } else {
        canvas_mod_size([null, new_height]);
      }
    });
  a2.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.map_height',
    });

  const b = dv4.append('li');
  const ratio_select = b.append('select')
    .attrs({ class: 'list_elem_section4 i18n m_elem_right', id: 'map_ratio_select' });
  b.append('p').attr('class', 'list_elem_section4 i18n')
    .style('padding', '4px 0')
    .attr('data-i18n', '[html]app_page.section4.map_ratio');
  ratio_select.append('option').text('').attr('data-i18n', '[html]app_page.section4.ratio_user').attr('value', 'ratio_user');
  ratio_select.append('option').text('').attr('data-i18n', '[html]app_page.section4.ratio_landscape').attr('value', 'landscape');
  ratio_select.append('option').text('').attr('data-i18n', '[html]app_page.section4.ratio_portait').attr('value', 'portrait');
  ratio_select.on('change', function () {
    const map_xy = get_map_xy0();
    const dispo_w = document.innerWidth - map_xy.x - 1;
    const dispo_h = document.innerHeight - map_xy.y - 1;
    const diff_w = dispo_w - w;
    const diff_h = dispo_h - h;
    if (this.value === 'portrait') {
      if (round_value(w / h, 1) === 1.4) {
        const tmp = h;
        h = w;
        w = tmp;
      } else if (diff_h >= diff_w) {
        w = round_value(h * 0.70707, 0);
      } else {
        h = round_value(w / 0.70707, 0);
      }
    } else if (this.value === 'landscape') {
      if (round_value(h / w, 1) === 1.4) {
        const tmp = h;
        h = w;
        w = tmp;
      } else if (diff_h <= diff_w) {
        w = round_value(h / 0.70707, 0);
      } else {
        h = round_value(w * 0.70707, 0);
      }
    }
    canvas_mod_size([w, h]);
    fill_export_png_options(this.value);
  });

  const d2 = dv4.append('li');
  d2.append('button')
    .styles({ margin: 0, padding: 0 })
    .attrs({
      id: 'resize_fit',
      class: 'm_elem_right list_elem_section4 button_st4 i18n',
      'data-i18n': '[html]app_page.common.ok',
    })
    .on('click', () => {
      document.getElementById('btn_s4').click();
      window.scrollTo(0, 0);
      w = Mround(window.innerWidth - 361);
      h = window.innerHeight - 55;
      canvas_mod_size([w, h]);
      document.getElementById('map_ratio_select').value = 'ratio_user';
    });
  d2.append('p').attr('class', 'list_elem_section4 i18n')
    .attr('data-i18n', '[html]app_page.section4.resize_fit');

  const c = dv4.append('li');
  c.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.map_center_menu',
    })
    .style('cursor', 'pointer');
  c.append('span')
    .attr('id', 'map_center_menu_ico')
    .styles({ display: 'inline-table', cursor: 'pointer' });
  c.on('click', () => {
    const sections = document.getElementsByClassName('to_hide');
    let arg;
    if (sections[0].style.display === 'none') {
      arg = '';
      document.getElementById('map_center_menu_ico').classList.add('active');
    } else {
      arg = 'none';
      document.getElementById('map_center_menu_ico').classList.remove('active');
    }
    sections[0].style.display = arg;
    sections[1].style.display = arg;
    sections[2].style.display = arg;
    sections[3].style.display = arg;
  });

  const c1 = dv4.append('li').style('display', 'none').attr('class', 'to_hide');
  c1.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.map_center_x',
    });
  c1.append('input')
    .attrs({
      id: 'input-center-x',
      class: 'm_elem_right',
      type: 'number',
      step: 'any',
    })
    .property('value', round_value(zoom_prop.x, 2))
    .on('change', function () {
      svg_map.__zoom.x = +this.value;
      zoom_without_redraw();
    });

  const c2 = dv4.append('li').style('display', 'none').attr('class', 'to_hide');
  c2.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.map_center_y',
    });
  c2.append('input')
    .attrs({
      id: 'input-center-y',
      class: 'list_elem_section4 m_elem_right',
      type: 'number',
      step: 'any',
    })
    .property('value', round_value(zoom_prop.y, 2))
    .on('change', function () {
      svg_map.__zoom.y = +this.value;
      zoom_without_redraw();
    });

  const d = dv4.append('li').style('display', 'none').attr('class', 'to_hide');
  d.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.map_scale_k',
    });
  d.append('input')
    .attrs({
      id: 'input-scale-k',
      class: 'list_elem_section4 m_elem_right',
      type: 'number',
      step: 'any',
    })
    .property('value', () => {
      const _k = zoom_prop.k * proj.scale();
      return (_k > 2 || _k < -2)
        ? round_value(_k, 2)
        : round_value(_k, Math.round(get_nb_decimals(_k) / 2));
    })
    .on('change', function () {
      svg_map.__zoom.k = +this.value / proj.scale();
      zoom_without_redraw();
    });

  const g = dv4.append('li').style('display', 'none').attr('class', 'to_hide');
  g.append('p')
    .attrs({
      class: 'list_elem_section4 i18n',
      'data-i18n': '[html]app_page.section4.canvas_rotation',
    });

  g.append('span')
    .style('float', 'right')
    .html('°');

  g.append('input')
    .attrs({
      id: 'canvas_rotation_value_txt',
      class: 'without_spinner',
      type: 'number',
      min: 0,
      max: 360,
      step: 'any',
    })
    .styles({ width: '30px', 'margin-left': '10px', float: 'right' })
    .property('value', 0)
    .on('change', function () {
      const val = +this.value,
        old_value = document.getElementById('form_rotate').value;
      if (isNaN(val) || val < -361) {
        this.value = old_value;
        return;
      } else if (val < 0 && val > -361) {
        this.value = 360 + val;
      } else if (val > 360) {
        this.value = 360;
      } else { // Should remove trailing zeros (right/left) if any :
        this.value = +this.value;
      }
      rotate_global(this.value);
      document.getElementById('form_rotate').value = this.value;
    });

  g.append('input')
    .attrs({
      type: 'range',
      id: 'form_rotate',
      min: 0,
      max: 360,
      step: 1,
    })
    .styles({
      width: '80px',
      margin: '0px 10px 5px 15px',
      float: 'right',
    })
    .property('value', 0)
    .on('input', function () {
      rotate_global(this.value);
      document.getElementById('canvas_rotation_value_txt').value = this.value;
    });

  const g2 = dv4.append('li');
  g2.append('input')
    .styles({ margin: 0, padding: 0 })
    .attrs({
      id: 'autoalign_features',
      type: 'checkbox',
      class: 'm_elem_right list_elem_section4 i18n',
    })
    .on('change', function () {
      _app.autoalign_features = this.checked;
    });
  g2.append('p').attr('class', 'list_elem_section4 i18n')
    .attr('data-i18n', '[html]app_page.section4.autoalign_features');

  const _i = dv4.append('li').styles({ 'text-align': 'center' });
  _i.insert('p')
    .styles({ clear: 'both', display: 'block', margin: 0 })
    .attrs({
      class: 'i18n', 'data-i18n': '[html]app_page.section4.layout_features',
    });
  const p1 = _i.insert('p').styles({ display: 'inline-block', margin: 'auto' });
  p1.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_arrow',
      src: 'static/img/layout_icons/arrow-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.arrow',
    })
    .on('click', () => add_layout_feature('arrow'));
  p1.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_text_annot',
      src: 'static/img/layout_icons/text-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.text_annot',
    })
    .on('click', () => add_layout_feature('text_annot'));
  if (!window.isIE) {
    p1.insert('span')
      .insert('img')
      .attrs({
        id: 'btn_symbol',
        src: 'static/img/layout_icons/symbols-01.png',
        class: 'layout_ft_ico i18n tt',
        'data-i18n': '[title]app_page.layout_features_box.symbol',
      })
      .on('click', () => add_layout_feature('symbol'));
  }
  p1.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_rectangle',
      src: 'static/img/layout_icons/rect-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.rectangle',
    })
    .on('click', () => add_layout_feature('rectangle'));
  p1.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_ellipse',
      src: 'static/img/layout_icons/ellipse-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.ellipse',
    })
    .on('click', () => add_layout_feature('ellipse'));

  const p2 = _i.insert('p').styles({ display: 'inline-block', margin: 'auto' });
  p2.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_graticule',
      src: 'static/img/layout_icons/graticule-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.graticule',
    })
    .on('click', () => add_layout_feature('graticule'));
  p2.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_north',
      src: 'static/img/layout_icons/north-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.north_arrow',
    })
    .on('click', () => add_layout_feature('north_arrow'));
  p2.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_scale',
      src: 'static/img/layout_icons/scale.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.scale',
    })
    .on('click', () => add_layout_feature('scale'));
  p2.insert('span')
    .insert('img')
    .attrs({
      id: 'btn_sphere',
      src: 'static/img/layout_icons/sphere-01.png',
      class: 'layout_ft_ico i18n tt',
      'data-i18n': '[title]app_page.layout_features_box.sphere',
    })
    .on('click', () => add_layout_feature('sphere'));

const ids = [
      'btn_graticule',
      'btn_sphere',]
  
  
for(let i = 0 ; i < ids.length ; i++){
    
    let element = document.getElementById(ids[i])
    element.style.display = "none" 
    }   
}
