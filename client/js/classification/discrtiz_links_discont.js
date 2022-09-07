import geostats from 'geostats';
import { make_dialog_container, overlay_under_modal, reOpenParent } from './../dialogs';
import { fetch_min_max_table_value, make_min_max_tableau } from './../function';
import { make_content_summary } from './../helpers';
import { get_precision_axis, max_fast, min_fast } from './../helpers_calc';
import { Mabs } from './../helpers_math';
import { prepare_ref_histo } from './common';

export const display_discretization_links_discont = function (layer_name, field_name, nb_class, type) {
  const make_box_histo_option = function () {
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

  const make_overlay_elements = function () {
    const mean_val = serie.mean(),
      stddev = serie.stddev();

    line_mean = overlay_svg.append('line')
      .attrs({
        class: 'line_mean',
        x1: x(mean_val),
        y1: 10,
        x2: x(mean_val),
        y2: svg_h - margin.bottom,
      })
      .styles({ 'stroke-width': 0, stroke: 'blue', fill: 'none' })
      .classed('active', false);

    txt_mean = overlay_svg.append('text')
      .attrs({
        dy: '0.75em',
        x: x(mean_val),
        y: 0,
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
        dy: '0.75em',
        x: x(serie.median()),
        y: 0,
        'text-anchor': 'middle',
      })
      .style('fill', 'none')
      .text(_tr('disc_box.median'));

    line_std_left = overlay_svg.append('line')
      .attrs({
        class: 'lines_std',
        x1: x(mean_val - stddev),
        y1: 10,
        x2: x(mean_val - stddev),
        y2: svg_h - margin.bottom,
      })
      .styles({ 'stroke-width': 0, stroke: 'grey', fill: 'none' })
      .classed('active', false);

    line_std_right = overlay_svg.append('line')
      .attrs({
        class: 'lines_std',
        x1: x(mean_val + stddev),
        y1: 10,
        x2: x(mean_val + stddev),
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

  const make_summary = function () {
    const content_summary = make_content_summary(serie);
    newBox.append('div')
      .attr('id', 'summary')
      .styles({
        'margin-left': '25px',
        'margin-right': '50px',
        'font-size': '10px',
        float: 'right',
      })
      .insert('p')
      .html(['<b>', _tr('disc_box.summary'), '</b><br>', content_summary].join(''));
  };

  const update_breaks = function (user_defined) {
    if (!user_defined) {
      make_min_max_tableau(values, nb_class, type, last_min, last_max, 'sizes_div', undefined, callback);
    }
    const tmp_breaks = fetch_min_max_table_value('sizes_div');
    const len_breaks = tmp_breaks.sizes.length;
    breaks_info = [];
    last_min = tmp_breaks.sizes[0];
    last_max = tmp_breaks.sizes[tmp_breaks.sizes.length - 1];
    if (Mabs(+serie.min() - +tmp_breaks.mins[0]) > 0.01) {
      nb_class += 1;
      txt_nb_class.node().value = nb_class;
      // txt_nb_class.html(_tr("disc_box.class", {count: nb_class}));
      breaks_info.push([[serie.min(), +tmp_breaks.mins[0]], 0]);
    }

    for (let i = 0; i < len_breaks; i++) {
      breaks_info.push([[tmp_breaks.mins[i], tmp_breaks.maxs[i]], tmp_breaks.sizes[i]]);
    }
    breaks = [breaks_info[0][0][0]].concat(breaks_info.map(ft => ft[0][1]));
    if (user_defined) {
      make_min_max_tableau(null, nb_class, type, last_min, last_max, 'sizes_div', breaks_info, callback);
    }
  };

  const redisplay = {
    compute() {
      bins = [];
      for (let i = 0, len = breaks_info.length; i < len; i++) {
        // const bin = {};
        // bin.offset = i === 0 ? 0 : (bins[i - 1].width + bins[i - 1].offset);
        // bin.width = breaks[i + 1] - breaks[i];
        // bin.height = breaks_info[i][1];
        // bins[i] = bin;
        bins.push({
          offset: i === 0 ? 0 : (bins[i - 1].width + bins[i - 1].offset),
          width: breaks[i + 1] - breaks[i],
          height: breaks_info[i][1],
        });
      }
      return true;
    },
    draw() {
      // Clean-up previously made histogram :
      d3.select('#svg_discretization').selectAll('.bar').remove();

      for (let i = 0, len = bins.length; i < len; ++i) {
        bins[i].color = array_color[i % array_color.length];
      }

      const x = d3.scaleLinear()
        .domain([serie.min(), serie.max()])
        .range([0, svg_w]);

      const y = d3.scaleLinear().range([svg_h, 0]);

      x.domain([0, d3.max(bins.map(d => d.offset + d.width))]);
      y.domain([0, d3.max(bins.map(d => d.height + d.height / 5))]);

      svg_histo.selectAll('.bar')
        .data(bins)
        .enter()
        .append('rect')
        .attrs((d, i) => ({
          class: 'bar',
          id: `bar_${i}`,
          transform: 'translate(0, -17.5)',
          x: x(d.offset),
          y: y(d.height) - margin.bottom,
          width: x(d.width),
          height: svg_h - y(d.height),
        }))
        .styles(d => ({
          opacity: 0.95,
          'stroke-opacity': 1,
          fill: d.color,
        }));

      return true;
    },
  };

  const title_box = [_tr('disc_box.title'), ' - ', layer_name, ' - ', field_name].join('');
  const modal_box = make_dialog_container('discretiz_charts', title_box, 'discretiz_charts_dialog');
  const newBox = d3.select('#discretiz_charts').select('.modal-body');
  let db_data;
  if (data_manager.result_data.hasOwnProperty(layer_name)) {
    db_data = data_manager.result_data[layer_name];
  } else if (data_manager.user_data.hasOwnProperty(layer_name)) {
    db_data = data_manager.user_data[layer_name];
  }

  let nb_values = db_data.length;
  let values = [];
  let no_data;

  for (let i = 0; i < nb_values; i++) {
    if (db_data[i][field_name] != null) {
      values.push(+db_data[i][field_name]);
    }
  }

  if (nb_values === values.length) {
    no_data = 0;
  } else {
    no_data = nb_values - values.length;
    nb_values = values.length;
  }
  const max_nb_class = nb_values > 20 ? 20 : nb_values;
  const sizes = data_manager.current_layers[layer_name].breaks.map(el => el[1]);

  let serie = new geostats(values),
    breaks_info = [].concat(data_manager.current_layers[layer_name].breaks),
    breaks = [+breaks_info[0][0][0]],
    bins = [],
    last_min = min_fast(sizes),
    last_max = max_fast(sizes),
    array_color = d3.schemeSet3.slice();

  serie.roundlength = serie.precision;
  serie.resetStatistics();

  breaks_info.forEach((elem) => { breaks.push(elem[0][1]); });

  values = serie.sorted();

  const available_functions = [
    [_tr('app_page.common.equal_interval'), 'equal_interval'],
    [_tr('app_page.common.quantiles'), 'quantiles'],
    [_tr('app_page.common.user_defined'), 'user_defined'],
    [_tr('app_page.common.Q6'), 'Q6'],
    [_tr('app_page.common.jenks'), 'jenks'],
  ];

  if (!serie._hasZeroValue() && !serie._hasZeroValue()) {
    available_functions.push([_tr('app_page.common.geometric_progression'), 'geometric_progression']);
  }
  const precisionAxis = get_precision_axis(serie.min(), serie.max(), serie.precision);
  const formatCount = d3.format(precisionAxis);

  const discretization_panel = newBox.append('div')
    .attr('id', 'discretization_panel');
  const discretization_choice = discretization_panel
    .insert('p')
    .html('Type ')
    .insert('select')
    .attr('class', 'params')
    .on('change', function () {
      const old_type = type;
      if (this.value === 'user_defined') {
        this.value = old_type;
        return;
      }
      type = this.value;
      if (type === 'Q6') {
        nb_class = 6;
        txt_nb_class.node().value = nb_class;
        document.getElementById('nb_class_range').value = 6;
      }
      update_breaks();
      redisplay.compute();
      redisplay.draw();
    });

  available_functions.forEach((func) => {
    discretization_choice.append('option').text(func[0]).attr('value', func[1]);
  });

  const ref_histo_box = newBox.append('div').attr('id', 'ref_histo_box');
  ref_histo_box.append('div').attr('id', 'inner_ref_histo_box');

  discretization_choice.node().value = type;

  make_summary();

  const refDisplay = prepare_ref_histo(newBox, serie, formatCount);
  refDisplay('histogram');

  if (values.length < 750) { // Only allow for beeswarm plot if there isn't too many values
    // as it seems to be costly due to the "simulation" + the voronoi
    const choiceHisto = ref_histo_box.append('p').style('text-align', 'center');
    let currentHisto = 'histogram';
    choiceHisto.insert('button')
      .attrs({
        id: 'button_switch_plot',
        class: 'i18n button_st4',
        'data-i18n': '[text]disc_box.switch_ref_histo',
      })
      .styles({ padding: '3px', 'font-size': '10px' })
      .html(_tr('disc_box.switch_ref_histo'))
      .on('click', () => {
        if (currentHisto === 'histogram') {
          refDisplay('box_plot');
          currentHisto = 'box_plot';
        } else if (currentHisto === 'box_plot') {
          refDisplay('beeswarm');
          currentHisto = 'beeswarm';
        } else if (currentHisto === 'beeswarm') {
          refDisplay('histogram');
          currentHisto = 'histogram';
        }
      });
  }

  let txt_nb_class = discretization_panel
    .append('input')
    .attrs({
      type: 'number', class: 'without_spinner', min: 2, max: max_nb_class, step: 1,
    })
    .styles({ width: '30px', margin: '0 10px', 'vertical-align': 'calc(20%)' })
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
    .styles({
      display: 'inline', width: '60px', 'vertical-align': 'middle', margin: '10px',
    })
    .attrs({
      id: 'nb_class_range',
      type: 'range',
      min: 2,
      max: max_nb_class,
      step: 1,
    })
    .property('value', nb_class)
    .on('change', function () {
      type = discretization_choice.node().value;
      if (type === 'user_defined') {
        type = 'equal_interval';
        discretization_choice.node().value = 'equal_interval';
      }
      if (type === 'Q6') {
        this.value = 6;
        return;
      }
      nb_class = +this.value;
      txt_nb_class.node().value = nb_class;
      update_breaks();
      redisplay.compute();
      redisplay.draw();
    });

  const svg_h = h / 5 > 100 ? h / 5 : 100,
    svg_w = (window.innerWidth - 40) > 760 ? 760 : (window.innerWidth - 40),
    margin = { top: 17.5, right: 30, bottom: 7.5, left: 30 },
    height = svg_h - margin.top - margin.bottom;

  d3.select('#discretiz_charts')
    .select('.modal-dialog')
    .styles({
      width: `${svg_w + margin.top + margin.bottom + 90}px`,
      height: `${window.innerHeight - 60}px`,
    });

  const div_svg = newBox.append('div')
    .append('svg')
    .attrs({
      id: 'svg_discretization',
      width: svg_w + margin.left + margin.right,
      height: svg_h + margin.top + margin.bottom,
    });

  make_box_histo_option();

  let svg_histo = div_svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  let x = d3.scaleLinear()
    .domain([serie.min(), serie.max()])
    .range([0, svg_w]);

  const overlay_svg = div_svg.append('g')
    .attr('transform', 'translate(30, 0)');

  let line_mean,
    line_std_right,
    line_std_left,
    line_median,
    txt_median,
    txt_mean,
    rug_plot;

  make_overlay_elements();

  // As the x axis and the mean didn't change, they can be drawn only once :
  svg_histo.append('g')
    .attrs({
      class: 'x axis',
      transform: `translate(0,${height})`,
    })
    .call(d3.axisBottom()
      .scale(x)
      .tickFormat(formatCount));

  const box_content = newBox.append('div')
    .attr('id', 'box_content')
    .style('text-align', 'center')
    .style('margin-top', '20px');

  box_content.append('h3')
    .style('margin', '0')
    .html(_tr('disc_box.line_size'));

  box_content
    .append('div')
    .attr('id', 'sizes_div');

  // What to do when the min - max - size table changes
  const callback = function () {
    discretization_choice.node().value = type;
    update_breaks(true);
    redisplay.compute();
    redisplay.draw();
  };

  // Make and fill the min - max - size table
  make_min_max_tableau(null, nb_class, type, null, null, 'sizes_div', breaks_info, callback);

  redisplay.compute();
  redisplay.draw();

  const container = document.getElementById('discretiz_charts');
  return new Promise((resolve, reject) => {
    const _onclose = () => {
      resolve(false);
      document.removeEventListener('keydown', helper_esc_key_twbs);
      container.remove();
      const p = reOpenParent('.styleBox');
      if (!p) overlay_under_modal.hide();
    };
    const helper_esc_key_twbs = (evt) => {
      const _event = evt || window.event;
      const isEscape = ('key' in _event)
        ? (_event.key === 'Escape' || _event.key === 'Esc')
        : (_event.keyCode === 27);
      if (isEscape) {
        _event.preventDefault();
        _onclose();
      }
    };
    container.querySelector('.btn_ok').onclick = () => {
      breaks[0] = serie.min();
      breaks[nb_class] = serie.max();
      resolve([serie, breaks_info, breaks]);
      document.removeEventListener('keydown', helper_esc_key_twbs);
      container.remove();
      const p = reOpenParent('.styleBox');
      if (!p) overlay_under_modal.hide();
    };
    container.querySelector('.btn_cancel').onclick = _onclose;
    container.querySelector('#xclose').onclick = _onclose;
    document.addEventListener('keydown', helper_esc_key_twbs);
  });
};
