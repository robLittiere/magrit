import geostats from 'geostats';
import { addNewCustomPalette, getColorBrewerArray, randomColor } from './../colors_helpers';
import { make_dialog_container, overlay_under_modal, reOpenParent } from './../dialogs';
import { isNumber, make_content_summary, setSelected } from './../helpers';
import { accordionize } from './../interface';
import { get_precision_axis, round_value } from './../helpers_calc';
import { Mmax, Mround } from './../helpers_math';
import {
  discretiz_geostats_switch, getBreaksQ6,
  getBreaksStdDev, getBreaks_userDefined,
  prepare_ref_histo,
} from './common';

function make_box_custom_palette(nb_classes, existing_colors) {
  const is_hex_color = new RegExp(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i);
  const is_ok_name = new RegExp(/^[a-zA-Z0-9_]*$/);
  const existing_palette = Array.from(_app.custom_palettes.keys());
  let pal_name;
  let ref_colors;
  if (existing_colors && existing_colors.length === nb_classes) {
    ref_colors = existing_colors.slice();
  } else {
    ref_colors = [];
    for (let i = 0; i < nb_classes; i++) {
      ref_colors.push(randomColor());
    }
  }

  const verif_palette_name = (name) => {
    if (name !== '' && is_ok_name.test(name)) {
      if (existing_palette.indexOf(name) > -1) {
        d3.select('#palette_box_error_zone')
          .html(_tr('app_page.palette_box.error_name_existing'));
        document.querySelector('.swal2-confirm').disabled = true;
        return null;
      }
      d3.select('#palette_box_error_zone')
        .html('');
      document.querySelector('.swal2-confirm').disabled = false;
      return name;
    } else {
      d3.select('#palette_box_error_zone')
        .html(_tr('app_page.palette_box.error_name_invalid'));
      document.querySelector('.swal2-confirm').disabled = true;
      return null;
    }
  };

  return swal({
    title: _tr('app_page.palette_box.title', { nb_classes }),
    html: '<div id="palette_box_content" style="display: inline-flex;"></div><div id="palette_box_name"></div>',
    allowOutsideClick: false,
    allowEscapeKey: false,
    showCancelButton: true,
    showConfirmButton: true,
    // cancelButtonText: _tr('app_page.common.close'),
    animation: 'slide-from-top',
    onOpen: () => {
      document.querySelector('.swal2-modal').style.width = `${nb_classes * 85}px`;
      const colors = d3.select('#palette_box_content');
      const g = colors.selectAll('p')
        .data(ref_colors)
        .enter()
        .append('p');

      g.append('input')
        .attr('id', (_, i) => `pal-color-box-${i}`)
        .attr('type', 'color')
        .style('width', '60px')
        .property('value', d => d)
        .on('change', function () {
          const i = +this.id.replace('pal-color-box-', '');
          ref_colors[i] = this.value;
          this.nextSibling.value = this.value;
        });

      g.append('input')
        .attr('id', (_, i) => `pal-color-field-${i}`)
        .style('width', '60px')
        .property('value', d => d)
        .on('keyup', function () {
          if (is_hex_color.test(this.value)) {
            const i = +this.id.replace('pal-color-field-', '');
            ref_colors[i] = this.value;
            this.previousSibling.value = this.value;
          }
        });
      const bottom = d3.select('#palette_box_name');
      bottom.append('p')
        .attr('id', 'palette_box_error_zone')
        .style('background', '#e3e3e3');
      bottom
        .append('span')
        .html(_tr('app_page.palette_box.new_name'));
      bottom
        .append('input')
        .styles({
          width: '160px',
          'margin-left': '5px',
        })
        .on('keyup', function () {
          if (verif_palette_name(this.value) !== null) pal_name = this.value;
        });
      document.querySelector('.swal2-confirm').disabled = true;
    },
  }).then(
    () => [ref_colors, pal_name],
    () => null,
  );
}

export const display_discretization = (layer_name, field_name, nb_class, options) => {
  const make_no_data_section = () => {
    const section = d3.select('#color_div')
      .append('div')
      .attr('id', 'no_data_section')
      // .append('p')
      .html(_tr('disc_box.withnodata', { count: +no_data }));

    section.append('input')
      .attrs({ type: 'color', id: 'no_data_color' })
      .style('margin', '0px 10px')
      .property('value', '#ebebcd');
  };

  const make_custom_palette_box = () => {
    palette_box_opened = true;
    make_box_custom_palette(nb_class)
      .then((result) => {
        palette_box_opened = false;
        if (result) {
          const [colors, palette_name] = result;
          const select_palette = document.querySelector('.color_params');
          addNewCustomPalette(palette_name, colors);
          if (select_palette) {
            d3.select(select_palette)
              .append('option')
              .text(`${palette_name} (${colors.length})`)
              .attrs({
                value: `user_${palette_name}`,
                title: palette_name,
                nb_colors: colors.length,
              });
            setSelected(select_palette, `user_${palette_name}`);
          }
        } else {
          // The user clicked on cancel.
          // Two options:
          // - if there is an existing custom palette for this number of classes,
          //   we stay on the 'custom' section and select this palette
          // - otherwise, we go back to the 'sequential' section
          const suitableEntries = document.querySelectorAll(`.color_params option[nb_colors="${nb_class}"]`);
          if (suitableEntries.length > 0) {
            setSelected(
              document.querySelector('.color_params'),
              suitableEntries[0].value,
            );
          } else {
            document.querySelector('#button_sequential').click();
          }
        }
      });
  };

  const make_custom_palette_section = () => {
    const col_div = d3.select('#color_div');
    col_div.selectAll('p').remove();
    const custom_palette_select = col_div.append('p')
      .append('select')
      .attr('class', 'color_params')
      .styles({
        width: '220px',
      })
      .on('change', function() {
        redisplay.draw();
      });

    // All the custom palettes
    const additional_colors = Array.from(_app.custom_palettes.entries());

    // Custom palette for the current number of classes
    const candidates = [];

    // Fill the select with the custom palettes
    // and disable all the custom palettes with a different number of classes
    for (let ixp = 0; ixp < additional_colors.length; ixp++) {
      const disabled = additional_colors[ixp][1].length !== nb_class;
      custom_palette_select.append('option')
        .text(`${additional_colors[ixp][0]} (${additional_colors[ixp][1].length})`)
        .attrs({ value: `user_${additional_colors[ixp][0]}`, title: additional_colors[ixp][0], nb_colors: additional_colors[ixp][1].length })
        .property('disabled', disabled);
      if (!disabled) {
        candidates.push(ixp);
      }
    }

    // Button allowing the reverse a color palette:
    col_div.append('p')
      .style('text-align', 'center')
      .insert('button')
      .style('margin-top', '8px')
      .attrs({ class: 'button_st3', id: 'reverse_pal_btn' })
      .html(_tr('disc_box.reverse_palette'))
      .on('click', () => {
        to_reverse = true;
        redisplay.draw();
      });

    // Button that allows the user to create a new custom palette
    col_div
      .append('p')
      .attr('id', 'button_palette_box')
      .styles({
        margin: '5px',
        cursor: 'pointer',
        'font-style': 'italic',
      })
      .html(_tr('app_page.palette_box.button'))
      .on('click', () => {
        make_custom_palette_box();
      });

    if (additional_colors.length === 0 || candidates.length === 0) {
      // If there is no custom palette for the current number of classes
      // we ask the user right away to create one
      make_custom_palette_box();
    } else {
      // Otherwise, select the first custom palette with the right number of classes
      setSelected(custom_palette_select.node(), `user_${additional_colors[candidates[0]][0]}`);
    }
  };

  const make_sequential_section = () => {
    const col_div = d3.select('#color_div');

    col_div.selectAll('p').remove();

    const sequential_color_select = col_div.insert('p')
      .attr('class', 'color_txt')
      .style('margin-left', '10px')
      .html(_tr('disc_box.color_palette'))
      .insert('select')
      .attr('class', 'color_params')
      .styles({
        width: '116px',
        'background-image': 'url(static/img/palettes/Blues.png)',
      })
      .on('change', function () {
        this.style.backgroundImage = `url(static/img/palettes/${this.value}.png)`;
        redisplay.draw();
      });

    ['Blues', 'BuGn', 'BuPu', 'GnBu', 'OrRd',
      'PuBu', 'PuBuGn', 'PuRd', 'RdPu', 'YlGn',
      'Greens', 'Greys', 'Oranges', 'Purples',
      'Reds',
    ].forEach((name) => {
      sequential_color_select.append('option')
        .text(name)
        .attrs({ value: name, title: name })
        .style('background-image', `url(static/img/palettes/${name}.png)`);
    });

    // Button allowing the reverse a color palette:
    d3.select('.color_txt')
      .insert('p')
      .style('text-align', 'center')
      .insert('button')
      .style('margin-top', '10px')
      .attrs({ class: 'button_st3', id: 'reverse_pal_btn' })
      .html(_tr('disc_box.reverse_palette'))
      .on('click', () => {
        to_reverse = true;
        redisplay.draw();
      });
  };

  const make_diverging_section = () => {
    const col_div = d3.select('#color_div');

    col_div.selectAll('p').remove();

    col_div.insert('p')
      .attr('class', 'central_class')
      .html(_tr('disc_box.break_on'))
      .insert('input')
      .style('width', '50px')
      .attrs({
        type: 'number',
        class: 'central_class',
        id: 'centr_class',
        min: 1,
        max: nb_class - 1,
        step: 1,
        value: Mround(nb_class / 2),
      })
      .on('change', () => { redisplay.draw(); });

    const pal_names = ['Blues', 'BuGn', 'BuPu', 'GnBu', 'OrRd',
      'PuBu', 'PuBuGn', 'PuRd', 'RdPu', 'YlGn',
      'Greens', 'Greys', 'Oranges', 'Purples', 'Reds'];
    const left_color_select = col_div.insert('p')
      .attr('class', 'color_txt')
      .style('display', 'inline')
      .html(_tr('disc_box.left_colramp'))
      .insert('select')
      .styles({ width: '116px', 'margin-left': '4px', 'background-image': 'url(static/img/palettes/Blues.png)' })
      .attr('class', 'color_params_left')
      .on('change', function () {
        this.style.backgroundImage = `url(static/img/palettes/${this.value}.png)`;
        redisplay.draw();
      });
    const right_color_select = col_div.insert('p')
      .styles({ display: 'inline', 'margin-left': '70px' })
      .attr('class', 'color_txt2')
      .html(_tr('disc_box.right_colramp'))
      .insert('select')
      .styles({ width: '116px', 'margin-left': '4px', 'background-image': 'url(static/img/palettes/Reds.png)' })
      .attr('class', 'color_params_right')
      .on('change', function () {
        this.style.backgroundImage = `url(static/img/palettes/${this.value}.png)`;
        redisplay.draw();
      });
    pal_names.forEach((name) => {
      left_color_select.append('option')
        .attrs({ value: name, title: name })
        .styles({ 'background-image': `url(static/img/palettes/${name}.png)` })
        .text(name);
      right_color_select.append('option')
        .attrs({ value: name, title: name })
        .styles({ 'background-image': `url(static/img/palettes/${name}.png)` })
        .text(name);
    });

    document.getElementsByClassName('color_params_right')[0].selectedIndex = 14;

    const central_color = col_div.insert('p')
      .attr('class', 'central_color')
      .style('padding-top', '15px');
    central_color.insert('input')
      .attrs({ type: 'checkbox', id: 'central_color_chkbx' })
      .on('change', function () {
        redisplay.draw();
        if (this.checked) {
          col_div.select('#central_color_val').style('display', '');
        } else {
          col_div.select('#central_color_val').style('display', 'none');
        }
      });
    central_color.select('input').node().checked = true;
    central_color.insert('label')
      .attr('for', 'central_color_chkbx')
      .html(_tr('disc_box.colored_central_class'));
    central_color.insert('input')
      .attrs({ type: 'color', id: 'central_color_val', value: '#e5e5e5' })
      .style('margin', '0px 10px')
      .on('change', redisplay.draw);
  };

  const make_box_histo_option = () => {
    const histo_options = newBox.append('div')
      .attrs({ id: 'histo_options', class: 'row equal' })
      .styles({ margin: '5px 5px 10px 15px', width: '100%' });
    const a = histo_options.append('div').attr('class', 'col-xs-6 col-sm-3'),
      b = histo_options.append('div').attr('class', 'col-xs-6 col-sm-3'),
      c = histo_options.append('div').attr('class', 'col-xs-6 col-sm-3'),
      d = histo_options.append('div').attr('class', 'col-xs-6 col-sm-3');

    a.insert('button')
      .attrs({ class: 'btn_population' })
      .html(_tr('disc_box.disp_rug_pop'))
      .on('click', function () {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          rug_plot.style('display', 'none');
          rug_plot.classed('active', false);
        } else {
          this.classList.add('active');
          rug_plot.style('display', '');
          rug_plot.classed('active', true);
        }
      });

    b.insert('button')
      .attrs({ class: 'btn_mean' })
      .html(_tr('disc_box.disp_mean'))
      .on('click', function () {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          line_mean.style('stroke-width', 0);
          txt_mean.style('fill', 'none');
          line_mean.classed('active', false);
        } else {
          this.classList.add('active');
          line_mean.style('stroke-width', 2);
          txt_mean.style('fill', 'blue');
          line_mean.classed('active', true);
        }
      });

    c.insert('button')
      .attrs({ class: 'btn_median' })
      .html(_tr('disc_box.disp_median'))
      .on('click', function () {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          line_median.style('stroke-width', 0)
            .classed('active', false);
          txt_median.style('fill', 'none');
        } else {
          this.classList.add('active');
          line_median.style('stroke-width', 2)
            .classed('active', true);
          txt_median.style('fill', 'darkgreen');
        }
      });

    d.insert('button')
      .attrs({ class: 'btn_stddev' })
      .html(_tr('disc_box.disp_sd'))
      .on('click', function () {
        if (this.classList.contains('active')) {
          this.classList.remove('active');
          line_std_left.style('stroke-width', 0);
          line_std_left.classed('active', false);
          line_std_right.style('stroke-width', 0);
          line_std_right.classed('active', false);
        } else {
          this.classList.add('active');
          line_std_left.style('stroke-width', 2);
          line_std_left.classed('active', true);
          line_std_right.style('stroke-width', 2);
          line_std_right.classed('active', true);
        }
      });
  };

  const update_nb_class = (value) => {
    txt_nb_class.node().value = value;
    document.getElementById('nb_class_range').value = value;
    nb_class = value;
    const color_select = document.querySelector('.color_params');
    // Only do stuff related to custom palettes if we are using a "custom" scheme:
    if (current_scheme !== 'custom') return;
    // const selected_index = color_select.selectedIndex;
    const select_options = color_select.querySelectorAll('option');
    const candidates = [];
    for (let ixc = 0; ixc < select_options.length; ixc++) {
      if (select_options[ixc].value.startsWith('user_')) {
        const disabled = (nb_class !== +select_options[ixc].getAttribute('nb_colors'))
        select_options[ixc].disabled = disabled;
        if (!disabled) {
          candidates.push(ixc);
        }
      }
    }
    if (candidates.length === 0) {
      make_custom_palette_box();
    } else { // if (select_options[selected_index].getAttribute('nb_colors') !== nb_class) {
      color_select.selectedIndex = candidates[0];
    }
  };

  const update_axis = (group) => {
    group.call(d3.axisBottom()
      .scale(x)
      .tickFormat(formatCount));
  };

  const make_overlay_elements = () => {
    line_mean = overlay_svg.append('line')
      .attrs({
        class: 'line_mean',
        x1: x(mean_serie),
        y1: 10,
        x2: x(mean_serie),
        y2: svg_h - margin.bottom,
      })
      .styles({ 'stroke-width': 0, stroke: 'blue', fill: 'none' })
      .classed('active', false);

    txt_mean = overlay_svg.append('text')
      .attrs({
        y: 0,
        dy: '0.75em',
        x: x(mean_serie),
        'text-anchor': 'middle',
      })
      .style('fill', 'none')
      .text(_tr('disc_box.mean'));

    line_median = overlay_svg.append('line')
      .attrs({
        class: 'line_med',
        x1: x(serie.median()),
        y1: 10,
        x2: x(serie.median()),
        y2: svg_h - margin.bottom,
      })
      .styles({ 'stroke-width': 0, stroke: 'darkgreen', fill: 'none' })
      .classed('active', false);

    txt_median = overlay_svg.append('text')
      .attrs({
        y: 0,
        dy: '0.75em',
        x: x(serie.median()),
        'text-anchor': 'middle',
      })
      .style('fill', 'none')
      .text(_tr('disc_box.median'));

    line_std_left = overlay_svg.append('line')
      .attrs({
        class: 'lines_std',
        x1: x(mean_serie - stddev_serie),
        y1: 10,
        x2: x(mean_serie - stddev_serie),
        y2: svg_h - margin.bottom,
      })
      .styles({ 'stroke-width': 0, stroke: 'grey', fill: 'none' })
      .classed('active', false);

    line_std_right = overlay_svg.append('line')
      .attrs({
        class: 'lines_std',
        x1: x(mean_serie + stddev_serie),
        y1: 10,
        x2: x(mean_serie + stddev_serie),
        y2: svg_h - margin.bottom,
      })
      .styles({ 'stroke-width': 0, stroke: 'grey', fill: 'none' })
      .classed('active', false);

    rug_plot = overlay_svg.append('g')
      .style('display', 'none');
    rug_plot.selectAll('.indiv')
      .data(values.map(i => ({ value: +i })))
      .enter()
      .insert('line')
      .attrs(d => ({
        class: 'indiv',
        x1: x(d.value),
        y1: svg_h - margin.bottom - 10,
        x2: x(d.value),
        y2: svg_h - margin.bottom,
      }))
      .styles({ stroke: 'red', fill: 'none', 'stroke-width': 1 });
  };

  const make_summary = () => {
    const content_summary = make_content_summary(serie);
    upper_part.append('div')
      .attr('id', 'summary')
      .styles({ 'font-size': '11px', margin: '10px 10px 0px 10px' })
      .insert('p')
      .style('line-height', '1.4em')
      .html(['<b>', _tr('disc_box.summary'), '</b><br>', content_summary].join(''));
  };

  const redisplay = {
    compute() {
      let tmp;
      breaks = [];
      return new Promise((resolve, reject) => {
        if (type === 'jenks') {
          const jenks_worker = new Worker('../static/dist/webworker_jenks.js');
          _app.webworker_to_cancel = jenks_worker;
          if (values.length > 5000) _app.waitingOverlay.display({ zIndex: 5000 });
          jenks_worker.postMessage([values, nb_class]);
          jenks_worker.onmessage = function (e) {
            breaks = e.data;
            serie.setClassManually(breaks);
            serie.doCount();
            stock_class = Array.prototype.slice.call(serie.counter);
            if (values.length > 5000) _app.waitingOverlay.hide();
            _app.webworker_to_cancel = undefined;
            bins = [];
            for (let i = 0, len = stock_class.length; i < len; i++) {
              const bin = {};
              bin.val = stock_class[i];
              bin.offset = i === 0 ? 0 : (bins[i - 1].width + bins[i - 1].offset);
              bin.width = breaks[i + 1] - breaks[i];
              bin.height = bin.val / bin.width;
              bins[i] = bin;
            }
            resolve(true);
            jenks_worker.terminate();
          };
          return;
        }
        if (type === 'Q6') {
          tmp = getBreaksQ6(values, serie.precision);
          // stock_class = tmp.stock_class;
          breaks = tmp.breaks;
          breaks[0] = min_serie;
          breaks[6] = max_serie;
          serie.setClassManually(breaks);
          serie.doCount();
          stock_class = Array.prototype.slice.call(serie.counter);
        } else if (type === 'stddev_f') {
          tmp = getBreaksStdDev(serie, std_dev_params.share, std_dev_params.role_mean, serie.precision);
          update_nb_class(nb_class = tmp.nb_class);
          breaks = tmp.breaks;
          serie.setClassManually(tmp.breaks);
          serie.doCount();
          stock_class = Array.prototype.slice.call(serie.counter);
        } else if (type === 'user_defined') {
          tmp = getBreaks_userDefined(serie.sorted(), user_break_list);
          stock_class = tmp.stock_class;
          breaks = tmp.breaks;
          nb_class = tmp.breaks.length - 1;
          update_nb_class(nb_class);

          if (breaks[0] > min_serie) breaks[0] = min_serie;
          if (breaks[nb_class] < max_serie) breaks[nb_class] = max_serie;

          const breaks_serie = breaks.slice();
          if (breaks_serie[0] < min_serie) {
            breaks_serie[0] = min_serie;
          }
          if (breaks_serie[nb_class] > max_serie) {
            breaks_serie[nb_class] = max_serie;
          }
          serie.setClassManually(breaks_serie);
        } else {
          breaks = serie[discretiz_geostats_switch.get(type)](nb_class);
          // if (serie.precision) breaks = breaks.map(val => round_value(val, serie.precision));
          serie.doCount();
          stock_class = Array.prototype.slice.call(serie.counter);
        }
        // In order to avoid class limit falling out the serie limits with Std class :
        // breaks[0] = breaks[0] < serie.min() ? serie.min() : breaks[0];
        // ^^ well finally not ?
        if (stock_class.length === 0) {
          resolve(false);
        }

        bins = [];
        for (let i = 0, len = stock_class.length; i < len; i++) {
          const _stock = stock_class[i];
          const _bin_width = breaks[i + 1] - breaks[i];
          bins.push({
            val: _stock,
            offset: i === 0 ? 0 : (bins[i - 1].width + bins[i - 1].offset),
            height: _stock / _bin_width,
            width: _bin_width,
          });
        }
        resolve(true);
      });
    },

    draw(provided_colors) {
      // Clean-up previously made histogram :
      newBox.select('#svg_discretization').selectAll('.bar').remove();
      newBox.select('#svg_discretization').selectAll('.text_bar').remove();

      if (!provided_colors) {
        if (to_reverse) {
          // Do we just want to redraw with reversed palette ?
          color_array = color_array.reverse();
          to_reverse = false;
        } else if (current_scheme === 'sequential') {
          // Prepare the color array for the requested sequential scheme
          const selected_palette = document.querySelector('.color_params').value;
          color_array = getColorBrewerArray(nb_class, selected_palette);
          color_array = color_array.slice(0, nb_class);
        } else if (current_scheme === 'diverging') {
          // Prepare the color array for the diverging scheme
          // It is made of two palettes and an optional middle color
          const left_palette = document.querySelector('.color_params_left').value,
            right_palette = document.querySelector('.color_params_right').value,
            ctl_class_value = +document.getElementById('centr_class').value,
            ctl_class_color = document.querySelector('.central_color > input').checked
              ? document.getElementById('central_color_val').value : [];

          const class_right = nb_class - ctl_class_value + 1,
            class_left = ctl_class_value - 1,
            max_col_nb = Mmax(class_right, class_left);

          let right_pal = getColorBrewerArray(max_col_nb, right_palette);
          let left_pal = getColorBrewerArray(max_col_nb, left_palette);

          right_pal = right_pal.slice(0, class_right);
          left_pal = left_pal.slice(0, class_left).reverse();
          color_array = [].concat(left_pal, ctl_class_color, right_pal);
        } else { // current_scheme is 'custom'
          // Prepare the color array for 'custom palette' (user defined) scheme
          const selected_palette = document.querySelector('.color_params').value;
          // Trim the 'user_' part of the palette name:
          const custom_pal_name = selected_palette.slice(5);
          color_array = _app.custom_palettes.get(custom_pal_name);
        }
      } else {
        color_array = provided_colors.slice();
      }
      for (let i = 0, len = bins.length; i < len; ++i) {
        bins[i].color = color_array[i];
      }

      y.domain([0, d3.max(bins.map(d => d.height + d.height / 3))]);

      // This could be removed because
      // we (or at least we should) ensure that
      // breaks[0] = min_serie and breaks[breaks.length - 1] = max_serie
      x.domain([breaks[0], breaks[breaks.length - 1]]);

      svg_histo.select('.x_axis')
        .transition()
        .call(update_axis);

      // update_overlay_elements();

      const xx = d3.scaleLinear()
        .range([0, svg_w])
        .domain([0, d3.max(bins.map(d => d.offset + d.width))]);

      svg_histo.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attrs((d, i) => ({
          class: 'bar',
          id: `bar_${i}`,
          transform: 'translate(0, -7.5)',
          x: xx(d.offset),
          y: y(d.height) - margin.bottom,
          width: xx(d.width),
          height: svg_h - y(d.height),
        }))
        .styles((d) => ({
          fill: d.color,
          opacity: 0.95,
          'stroke-opacity': 1,
        }))
        .on('mouseover', function () {
          this.parentElement.querySelector(`#text_bar_${this.id.split('_')[1]}`).style.display = null;
        })
        .on('mouseout', function () {
          this.parentElement.querySelector(`#text_bar_${this.id.split('_')[1]}`).style.display = 'none';
        });

      svg_histo.selectAll('.txt_bar')
        .data(bins)
        .enter().append('text')
        .attrs((d, i) => ({
          id: `text_bar_${i}`,
          class: 'text_bar',
          'text-anchor': 'middle',
          dy: '.75em',
          x: xx(d.offset + d.width / 2),
          y: y(d.height) - margin.top * 2 - margin.bottom - 1.5,
        }))
        .styles({ color: 'black', cursor: 'default', display: 'none' })
        .text((d) => formatCount(d.val));

      document.getElementById('user_breaks_area').value = breaks.join(' - ');
      return true;
    },
  };

  const modal_box = make_dialog_container(
    'discretiz_charts',
    [_tr('disc_box.title'), ' - ', layer_name, ' - ', field_name].join(''),
    'discretiz_charts_dialog',
  );
  const container = document.getElementById('discretiz_charts');
  const newBox = d3.select(container).select('.modal-body');
  let db_data;
  if (data_manager.result_data.hasOwnProperty(layer_name)) {
    db_data = data_manager.result_data[layer_name];
  } else if (data_manager.user_data.hasOwnProperty(layer_name)) {
    db_data = data_manager.user_data[layer_name];
  } else {
    const layer = svg_map.querySelector(`#${_app.idLayer.get(layer_name)}`);
    db_data = Array.prototype.map.call(layer.children, d => d.__data__.properties);
  }

  let color_array = [],
    nb_values = db_data.length,
    values = [],
    no_data;

  let type = options.type;

  let current_scheme = options.scheme;

  let palette_box_opened = false;

  for (let i = 0; i < nb_values; i++) {
    const value = db_data[i][field_name];
    if (isNumber(value)) { // eslint-disable-line no-restricted-globals
      values.push(+value);
    }
  }

  if (nb_values === values.length) {
    no_data = 0;
  } else {
    no_data = nb_values - values.length;
    nb_values = values.length;
  }

  const max_nb_class = nb_values > 20 ? 20 : nb_values;
  let serie = new geostats(values),
    breaks = [],
    stock_class = [],
    bins = [],
    user_break_list = null,
    std_dev_params = options.extra_options && options.extra_options.role_mean ? options.extra_options : { role_mean: 'center', share: 1 };

  serie.roundlength = Math.max(2, serie.precision);
  serie.resetStatistics();

  const min_serie = serie.min();
  const max_serie = serie.max();
  const mean_serie = round_value(serie.mean(), 2);
  const stddev_serie = round_value(serie.stddev(), 2);

  values = serie.sorted();

  const available_functions = [
    [_tr('app_page.common.equal_interval'), 'equal_interval'],
    [_tr('app_page.common.quantiles'), 'quantiles'],
    [_tr('app_page.common.stddev_f'), 'stddev_f'],
    [_tr('app_page.common.Q6'), 'Q6'],
    [_tr('app_page.common.jenks'), 'jenks'],
  ];

  if (!serie._hasZeroValue() && !serie._hasNegativeValue()) {
    available_functions.push([_tr('app_page.common.geometric_progression'), 'geometric_progression']);
  }
  const precision_axis = get_precision_axis(min_serie, max_serie, serie.precision);
  const formatCount = d3.format(precision_axis);

  // The upper part of the discretisation panel
  const upper_part = newBox.append('div')
    .style('display', 'flex')
    .style('justify-content', 'space-between');

  // The left section, that allows the user to choose the number of classes and the type
  // of discretisation
  const discretization_panel = upper_part.append('div')
    .attr('id', 'discretization_panel');

  const discretization = discretization_panel.insert('p')
    .insert('select')
    .attr('class', 'params')
    .on('change', function () {
      type = this.value;
      if (type === 'stddev_f') {
        input_section_stddev.style('display', '');
        document.getElementById('nb_class_range').disabled = 'disabled';
        txt_nb_class.style('disabled', 'disabled');
        disc_nb_class.style('display', 'none');
      } else {
        input_section_stddev.style('display', 'none');
        document.getElementById('nb_class_range').disabled = false;
        txt_nb_class.style('disabled', false);
        disc_nb_class.style('display', 'inline');
      }
      if (type === 'Q6') {
        update_nb_class(6);
      }
      redisplay.compute().then((v) => {
        if (v) redisplay.draw();
      });
    });

  available_functions.forEach((func) => {
    discretization.append('option').text(func[0]).attr('value', func[1]);
  });

  let input_section_stddev = discretization_panel.insert('p')
    .styles({ margin: 'auto', display: type === 'stddev_f' ? '' : 'none' });
  input_section_stddev.insert('span')
    .html(_tr('disc_box.stddev_share_txt1'));
  input_section_stddev.insert('input')
    .attrs({
      type: 'number', min: 0.1, max: 10, step: 0.1, class: 'without_spinner', id: 'stddev_share',
    })
    .styles({
      width: '45px', 'margin-left': '10px', 'margin-right': '10px',
    })
    .property('value', std_dev_params.share)
    .on('change', function () {
      const val = this.value;
      if (val === 0 || (val * stddev_serie) > (max_serie - min_serie)
          || (val * stddev_serie * 21) < (max_serie - min_serie)) {
        // If the new value is too big or too small:
        this.value = std_dev_params.share;
        return;
      }
      std_dev_params.share = val;
      redisplay.compute().then((v) => {
        if (v) redisplay.draw();
      });
    });
  input_section_stddev.insert('span')
    .html(_tr('disc_box.stddev_share_txt2'));
  const std_dev_mean_choice = input_section_stddev.insert('p').style('margin', 'auto');
  std_dev_mean_choice.insert('p')
    .style('margin', 'auto')
    .html(_tr('disc_box.stddev_role_mean'));

  [
    [_tr('disc_box.stddev_center_mean'), 'center'],
    [_tr('disc_box.stddev_break_mean'), 'bound'],
  ].forEach((el) => {
    std_dev_mean_choice
      .insert('input')
      .attrs({ type: 'radio', name: 'role_mean', id: `button_stddev_${el[1]}` })
      .property('value', el[1])
      .on('change', function () {
        std_dev_params.role_mean = this.value;
        redisplay.compute().then((v) => {
          if (v) redisplay.draw();
        });
      });
    std_dev_mean_choice
      .insert('label')
      .style('font-weight', '400')
      .attr('for', `button_stddev_${el[1]}`)
      .html(el[0]);
  });
  document.getElementById(`button_stddev_${std_dev_params.role_mean}`).checked = true;
  let txt_nb_class = discretization_panel.append('input')
    .attrs({
      type: 'number',
      class: 'without_spinner',
      min: 2,
      max: max_nb_class,
      step: 1,
    })
    .styles({
      width: '30px',
      margin: '0 10px',
      'vertical-align': 'calc(20%)',
    })
    .property('value', nb_class)
    .on('change', function () {
      const a = disc_nb_class.node();
      a.value = this.value;
      a.dispatchEvent(new Event('change'));
    });

  discretization_panel
    .append('span')
    .html(_tr('disc_box.class'));

  let disc_nb_class = discretization_panel
    .insert('input')
    .attrs({
      id: 'nb_class_range',
      type: 'range',
      min: 2,
      max: max_nb_class,
      step: 1,
    })
    .styles({ display: 'inline', width: '85px', 'vertical-align': 'middle', margin: '10px' })
    .property('value', nb_class)
    .on('change', function () {
      type = discretization.node().value;
      const old_nb_class = nb_class;
      if (type === 'Q6') {
        update_nb_class(6);
      } else if (type === 'stddev_f') {
        update_nb_class(nb_class);
        return;
      }
      // nb_class = +this.value;
      // txt_nb_class.node().value = nb_class;
      update_nb_class(+this.value);
      redisplay.compute().then((v) => {
        if (!v) {
          this.value = old_nb_class;
          txt_nb_class.node().value = +old_nb_class;
        } else {
          redisplay.draw();
          const ctl_class = document.getElementById('centr_class');
          if (ctl_class) {
            ctl_class.max = nb_class;
            if (ctl_class > nb_class) ctl_class.value = Mround(nb_class / 2);
          }
        }
      });
    });

  discretization.node().value = type;
  make_summary();

  const ref_histo_box = upper_part.append('div').attr('id', 'ref_histo_box');
  ref_histo_box.append('div').attr('id', 'inner_ref_histo_box');

  const refDisplay = prepare_ref_histo(upper_part, serie, formatCount);
  refDisplay('histogram');

  const svg_h = h / 5 > 100 ? h / 5 : 100,
    svg_w = (window.innerWidth - 40) > 760 ? 760 : (window.innerWidth - 40),
    margin = { top: 7.5, right: 30, bottom: 7.5, left: 30 },
    height = svg_h - margin.top - margin.bottom;

  d3.select(container)
    .select('.modal-dialog')
    .styles({
      width: `${svg_w + margin.top + margin.bottom + 90}px`,
      height: `${window.innerHeight - 60}px`,
    });

  if (values.length < 500) { // Only allow for beeswarm plot if there isn't too many values
      // as it seems to be costly due to the "simulation" + the voronoi
    let current_histo = 'histogram';
    ref_histo_box.append('p')
      .style('text-align', 'center')
      .insert('button')
      .attrs({
        id: 'button_switch_plot', class: 'i18n button_st4', 'data-i18n': '[text]disc_box.switch_ref_histo',
      })
      .styles({ padding: '3px', 'font-size': '10px' })
      .html(_tr('disc_box.switch_ref_histo'))
      .on('click', () => {
        let str_tr;
        if (current_histo === 'histogram') {
          refDisplay('box_plot');
          current_histo = 'box_plot';
          str_tr = '_boxplot';
        } else if (current_histo === 'box_plot') {
          refDisplay('beeswarm');
          current_histo = 'beeswarm';
          str_tr = '_beeswarm';
        } else if (current_histo === 'beeswarm') {
          refDisplay('histogram');
          current_histo = 'histogram';
          str_tr = '';
        }
        document.getElementById('ref_histo_title').innerHTML = `<b>${_tr('disc_box.hist_ref_title' + str_tr)}</b>`;
      });
  }
  const div_svg = newBox.append('div')
    .append('svg')
    .attrs({
      id: 'svg_discretization',
      width: svg_w + margin.left + margin.right,
      height: svg_h + margin.top + margin.bottom,
    });

  make_box_histo_option();

  let svg_histo = div_svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  let x = d3.scaleLinear()
    .domain([min_serie, max_serie])
    .range([0, svg_w]);

  let y = d3.scaleLinear()
    .range([svg_h, 0]);

  let overlay_svg = div_svg.append('g').attr('transform', 'translate(30, 0)'),
    line_mean,
    line_std_right,
    line_std_left,
    line_median,
    txt_median,
    txt_mean,
    rug_plot;

  svg_histo.append('g')
    .attrs({ class: 'x_axis', transform: `translate(0,${height})` })
    .call(d3.axisBottom()
      .scale(x)
      .tickFormat(formatCount));

  newBox.append('button')
    .attrs({ class: 'accordion_disc active', id: 'btn_acc_disc_color' })
    .style('padding', '0 6px')
    .html(_tr('disc_box.title_color_scheme'));
  const accordion_colors = newBox.append('div')
    .attrs({ class: 'panel show', id: 'accordion_colors' })
    .style('width', '98%');
  const color_scheme = accordion_colors
    .append('div')
    .attr('id', 'color_div')
    .style('text-align', 'center');

  [
    [_tr('disc_box.sequential'), 'sequential'],
    [_tr('disc_box.diverging'), 'diverging'],
    [_tr('disc_box.custom'), 'custom'],
  ].forEach((el) => {
    color_scheme.insert('label').style('margin', '20px').html(el[0])
      .insert('input')
      .attrs({ type: 'radio', name: 'color_scheme', id: `button_${el[1]}` })
      .property('value', el[1])
      .on('change', function () {
        if (this.value === 'sequential') {
          current_scheme = 'sequential';
          make_sequential_section();
        } else if (this.value === 'diverging') {
          current_scheme = 'diverging';
          make_diverging_section();
        } else {
          current_scheme = 'custom';
          make_custom_palette_section();
        }
        redisplay.draw();
      });
  });
  let to_reverse = false;
  document.getElementById('button_sequential').checked = true;

  newBox.append('button')
    .attrs({ class: 'accordion_disc', id: 'btn_acc_disc_break' })
    .style('padding', '0 6px')
    .html(_tr('disc_box.title_break_values'));
  const accordion_breaks = newBox.append('div')
    .attrs({ class: 'panel', id: 'accordion_breaks_vals' })
    .style('width', '98%');
  const user_defined_breaks = accordion_breaks.append('div').attr('id', 'user_breaks');

  user_defined_breaks.insert('textarea')
    .attrs({
      id: 'user_breaks_area',
      placeholder: _tr('app_page.common.expected_class'),
    })
    .style('width', '600px');

  user_defined_breaks
    .insert('button')
    .text(_tr('app_page.common.valid'))
    .on('click', () => {
      // const old_nb_class = nb_class;
      user_break_list = document.getElementById('user_breaks_area').value;
      type = 'user_defined';
      // nb_class = user_break_list.split('-').length - 1;
      // txt_nb_class.node().value = +nb_class;
      // txt_nb_class.html(_tr("disc_box.class", {count: +nb_class}));
      // document.getElementById("nb_class_range").value = nb_class;
      redisplay.compute().then((v) => {
        if (v) redisplay.draw();
      });
    });

  accordionize('.accordion_disc', container);

  make_overlay_elements();

  if (no_data > 0) {
    make_no_data_section();
    if (options.no_data) {
      document.getElementById('no_data_color').value = options.no_data;
    }
  }

  if (!options.schema) {
    make_sequential_section();
  } else if (options.schema.length === 1 && !options.schema[0].startsWith('user_')) {
    current_scheme = 'sequential';
    make_sequential_section();
    document.querySelector('.color_params').value = options.schema[0];
    document.querySelector('.color_params').style.backgroundImage = `url(static/img/palettes/${options.schema[0]}.png)`;
  } else if (options.schema.length > 1) {
    current_scheme = 'diverging';
    make_diverging_section();
    document.getElementById('button_diverging').checked = true;
    let tmp = 0;
    setSelected(document.querySelector('.color_params_left'), options.schema[0]);
    // document.querySelector(".color_params_left").value = options.schema[0];
    if (options.schema.length > 2) {
      const elem = document.getElementById('central_color_val');
      elem.style.display = '';
      elem.value = options.schema[1];
      tmp = 1;
      document.querySelector('.central_color').querySelector('input').checked = true;
    } else {
      document.querySelector('.central_color').querySelector('input').checked = false;
    }
    setSelected(document.querySelector('.color_params_right'), options.schema[1 + tmp]);
  } else if (options.schema.length === 1 && options.schema[0].startsWith('user_')) {
    current_scheme = 'custom';
    document.getElementById('button_custom').checked = true;
    make_custom_palette_section();
    document.querySelector('.color_params').value = options.schema[0];
  }

  if (options.type && options.type === 'user_defined') {
    user_break_list = options.breaks;
  }

  redisplay.compute().then((v) => {
    if (v) redisplay.draw(options.colors);
  });

  // update_overlay_elements();

  return new Promise((resolve, reject) => {
    container.querySelector('.btn_ok').onclick = function () {
      breaks = breaks.map(i => +i);
      const colors_map = [];
      let no_data_color = null;
      if (no_data > 0) {
        no_data_color = document.getElementById('no_data_color').value;
      }
      for (let j = 0; j < db_data.length; ++j) {
        const value = db_data[j][field_name];
        // if (value !== null && value !== '' && !isNaN(+value)) {
        if (isNumber(value)) {
          const idx = serie.getClass(+value);
          colors_map.push(color_array[idx]);
        } else {
          colors_map.push(no_data_color);
        }
      }
      const col_schema = [];
      if (!d3.select('.color_params_left').node()) {
        col_schema.push(document.querySelector('.color_params').value);
      } else {
        col_schema.push(document.querySelector('.color_params_left').value);
        if (document.querySelector('.central_color').querySelector('input').checked) {
          col_schema.push(document.getElementById('central_color_val').value);
        }
        col_schema.push(document.querySelector('.color_params_right').value);
      }
      resolve([
        nb_class,
        type,
        breaks,
        color_array,
        colors_map,
        col_schema,
        no_data_color,
        type === 'stddev_f' ? std_dev_params : undefined,
      ]);
      document.removeEventListener('keydown', helper_esc_key_twbs);
      container.remove();
      const p = reOpenParent();
      if (!p) overlay_under_modal.hide();
    };

    const _onclose = () => {
      resolve(false);
      document.removeEventListener('keydown', helper_esc_key_twbs);
      container.remove();
      const p = reOpenParent();
      if (!p) overlay_under_modal.hide();
    };
    container.querySelector('.btn_cancel').onclick = _onclose;
    container.querySelector('#xclose').onclick = _onclose;
    const helper_esc_key_twbs = (evt) => {
      const _event = evt || window.event;
      const isEscape = ('key' in _event)
        ? (_event.key === 'Escape' || _event.key === 'Esc')
        : (_event.keyCode === 27);
      if (isEscape) {
        _event.stopPropagation();
        if (palette_box_opened) return;
        _onclose();
      }
    };
    document.addEventListener('keydown', helper_esc_key_twbs);
    overlay_under_modal.display();
  });
};
