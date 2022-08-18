import { make_confirm_dialog2, make_dialog_container, overlay_under_modal } from './dialogs';
import {
  clickLinkFromDataUrl,
  display_error_during_computation, getAvailablesFunctionnalities,
  type_col, type_col2, xhrequest,
} from './helpers';

/**
* Return a basic operator as a function, each one taking two numbers in arguments
*
* @param {String} operator
* @return {function}
*/
function get_fun_operator(operator) {
  const operators = new Map([
    ['+', function (a, b) { return a + b; }],
    ['-', function (a, b) { return a - b; }],
    ['/', function (a, b) { if (b === 0) { return ''; } return a / b; }],
    ['*', function (a, b) { return a * b; }],
    ['^', function (a, b) { return Math.pow(a, b); }],
  ]);
  return operators.get(operator);
}


/**
* Function to add a field to the targeted layer
*
* @param {Array} table - A reference to the "table" to work on
* @param {String} layer - The name of the layer
* @param {Bool} reOpenTableBox - Reopen the box table ?
*
*/
function add_field_table(table, layer_name, reOpenTableBox) {
  function check_name() {
    if (regexp_name.test(this.value) || this.value === '') {
      chooses_handler.new_name = this.value;
    } else { // Rollback to the last correct name  :
      this.value = chooses_handler.new_name;
      swal({
        title: `${_tr('Error')}!`,
        text: _tr('Unauthorized character!'),
        type: 'error',
        allowOutsideClick: false,
      });
    }
  }

  function compute_and_add() {
    const options = chooses_handler,
      fi1 = options.field1,
      fi2 = options.field2,
      new_name_field = options.new_name,
      operation = options.operator;
    let opt_val = options.opt_val;

    if (!regexp_name.test(new_name_field)) {
      swal({
        title: '',
        text: _tr('app_page.explore_box.add_field_box.invalid_name'),
        type: 'error',
        allowOutsideClick: false,
      });
      return Promise.reject('Invalid name');
    }
    if (options.type_operation === 'math_compute' && table.length > 3200) {
      const formToSend = new FormData();
      const var1 = [],
        var2 = (fi2 === 'user_const_value') ? +opt_val : [];
      for (let i = 0; i < table.length; i++) {
        var1.push(+table[i][fi1]);
      }
      if (fi2 !== 'user_const_value') {
        for (let i = 0; i < table.length; i++) {
          var2.push(+table[i][fi2]);
        }
      }
      formToSend.append('var1', JSON.stringify(var1));
      formToSend.append('var2', JSON.stringify(var2));
      formToSend.append('operator', operation);
      return xhrequest('POST', '/helpers/calc', formToSend, false).then((data) => {
        const parsed_result = JSON.parse(data);
        for (let i = 0; i < table.length; i++) {
          table[i][new_name_field] = parsed_result[i];
        }
        return true;
      });
    } else if (options.type_operation === 'math_compute') {
      const math_func = get_fun_operator(operation);
      if (fi2 !== 'user_const_value') {
        for (let i = 0; i < table.length; i++) {
          if (table[i][fi1] != null && table[i][fi1] != '' && table[i][fi2] != null && table[i][fi2] != '') {
            table[i][new_name_field] = math_func(+table[i][fi1], +table[i][fi2]);
          } else {
            table[i][new_name_field] = '';
          }
        }
      } else {
        opt_val = +opt_val;
        for (let i = 0; i < table.length; i++) {
          if (table[i][fi1] != null && table[i][fi1] != '') {
            table[i][new_name_field] = math_func(+table[i][fi1], opt_val);
          } else {
            table[i][new_name_field] = '';
          }
        }
      }
      return Promise.resolve(true);
    } else if (operation === 'truncate') {
      opt_val = +opt_val;
      if (opt_val >= 0) {
        for (let i = 0; i < table.length; i++) {
          table[i][new_name_field] = table[i][fi1].substring(0, opt_val);
        }
      } else {
        for (let i = 0; i < table.length; i++) {
          table[i][new_name_field] = table[i][fi1].substr(opt_val);
        }
      }
      return Promise.resolve(true);
    } else if (operation === 'concatenate') {
      for (let i = 0; i < table.length; i++) {
        table[i][new_name_field] = [table[i][fi1], table[i][fi2]].join(opt_val);
      }
      return Promise.resolve(true);
    }

    return Promise.reject('Unknown error');
  }


  function refresh_type_content(type) {
    field1.node().remove(); operator.node().remove(); field2.node().remove();
    field1 = div1.append('select')
      .on('change', function () { chooses_handler.field1 = this.value; });
    operator = div1.append('select')
      .on('change', function () {
        chooses_handler.operator = this.value;
        refresh_subtype_content(chooses_handler.type_operation, this.value);
      });
    field2 = div1.append('select')
      .on('change', function () {
        chooses_handler.field2 = this.value;
        val_opt.style('display', this.value === 'user_const_value' ? null : 'none');
      });
    if (type === 'math_compute') {
      math_operation.forEach((op) => { operator.append('option').text(op).attr('value', op); });
      // for (const k in fields_type) {
      const _f = Object.getOwnPropertyNames(fields_type);
      for (let i = 0, n = _f.length; i < n; i++) {
        const k = _f[i];
        if (fields_type[k] === 'number') {
          field1.append('option').text(k).attr('value', k);
          field2.append('option').text(k).attr('value', k);
        }
      }
      field2.append('option')
        .attr('value', 'user_const_value')
        .text(_tr('app_page.explore_box.add_field_box.constant_value'));
      val_opt.style('display', 'none');
      txt_op.text('');
      chooses_handler.operator = math_operation[0];
    } else {
      string_operation.forEach((op) => {
        operator.append('option').text(op[0]).attr('value', op[1]);
      });
      const _f = Object.getOwnPropertyNames(fields_type);
      for (let i = 0, n = _f.length; i < n; i++) {
        const k = _f[i];
        if (fields_type[k] === 'string') {
          field1.append('option').text(k).attr('value', k);
          field2.append('option').text(k).attr('value', k);
        }
      }
      val_opt.style('display', null);
      txt_op.html(_tr('app_page.explore_box.add_field_box.join_char'));
      chooses_handler.operator = string_operation[0][1];
    }
    chooses_handler.field1 = field1.node().value;
    chooses_handler.field2 = field2.node().value;
  }

  function refresh_subtype_content(type, subtype) {
    if (type !== 'string_field' && field2.node().value !== 'user_const_value') {
      val_opt.style('display', 'none');
      txt_op.text('');
    } else if (subtype === 'truncate') {
      txt_op.html(_tr('app_page.explore_box.add_field_box.keep_char'));
      field2.attr('disabled', true);
    } else {
      txt_op.html(_tr('app_page.explore_box.add_field_box.join_char'));
      field2.attr('disabled', null);
    }
  }

  const math_operation = ['+', '-', '*', '/', '^'];

  const string_operation = [
    [_tr('app_page.explore_box.add_field_box.concatenate'), 'concatenate'],
    [_tr('app_page.explore_box.add_field_box.truncate'), 'truncate'],
  ];

  let chooses_handler = {
    field1: undefined,
    field2: undefined,
    operator: undefined,
    type_operation: undefined,
    opt_val: undefined,
    new_name: _tr('app_page.explore_box.add_field_box.new_name_placeholder'),
  };

  make_confirm_dialog2(
    'addFieldBox',
    _tr('app_page.explore_box.button_add_field'),
    { width: w > 430 ? 430 : undefined, height: h > 280 ? 280 : undefined },
  ).then((valid) => {
    // reOpenParent('#browse_data_box');
    if (valid) {
      document.querySelector('body').style.cursor = 'wait';
      compute_and_add(chooses_handler)
        .then(() => {
          const prop_layer = data_manager.current_layers[layer_name];
          if (prop_layer && prop_layer.targeted) {
            const type_field = type_col2(table).find(el => el.name === chooses_handler.new_name);
            const existing = prop_layer.fields_type.findIndex(el => el.name === type_field.name);
            if (existing < 0) {
              prop_layer.fields_type.push(type_field);
            } else {
              prop_layer.fields_type[existing] = type_field;
            }
            getAvailablesFunctionnalities(layer_name);
            if (window.fields_handler) {
              fields_handler.unfill();
              fields_handler.fill(layer_name);
            }
          }
          if (reOpenTableBox) {
            boxExplore2.create(layer_name);
            // parent.modal_box.show();
            // parent.display_table(layer_name);
          }
        }, (error) => {
          if (error !== 'Invalid name') {
            display_error_during_computation();
          }
          console.log(error);
          document.querySelector('body').style.cursor = '';
        }).done(() => {
          document.querySelector('body').style.cursor = '';
        });
    }
  });

  const fields_type = type_col(layer_name);
  // Only allow letters (lower & upper cases), number and underscore in the field name:
  const regexp_name = new RegExp(/^[a-z0-9_]+$/i);
  const container = document.querySelector('.twbs > .addFieldBox');
  const box_content = d3.select(container).select('.modal-body').append('div');
  const div1 = box_content.append('div').attr('id', 'field_div1');
  const div2 = box_content.append('div').attr('id', 'field_div2');

  div1.append('p')
    .html(_tr('app_page.explore_box.add_field_box.new_name'))
    .insert('input')
    .property('value', _tr('app_page.explore_box.add_field_box.new_name_placeholder'))
    .on('keyup', check_name);

  const type_content = div1.append('p')
    .html(_tr('app_page.explore_box.add_field_box.new_content'))
    .insert('select')
    .attr('id', 'type_content_select')
    .on('change', function () {
      chooses_handler.type_operation = this.value;
      refresh_type_content(this.value);
    });

  [
    [_tr('app_page.explore_box.add_field_box.between_numerical'), 'math_compute'],
    [_tr('app_page.explore_box.add_field_box.between_string'), 'string_field'],
  ].forEach((d) => {
    type_content.append('option').text(d[0]).attr('value', d[1]);
  });

  let field1 = div1.append('select')
    .on('change', function () { chooses_handler.field1 = this.value; });
  let operator = div1.append('select')
    .on('change', function () {
      chooses_handler.operator = this.value;
      refresh_subtype_content(chooses_handler.type_operation, this.value);
    });
  let field2 = div1.append('select')
    .on('change', function () { chooses_handler.field2 = this.value; });

  let txt_op = div2.append('p').attr('id', 'txt_opt').text('');
  let val_opt = div2.append('input')
    .attr('id', 'val_opt')
    .style('display', 'none')
    .on('change', function () { chooses_handler.opt_val = this.value; });

  {
    const a = type_content.node();
    let b = false;
    const _f = Object.getOwnPropertyNames(fields_type);
    for (let i = 0, n = _f.length; i < n; i++) {
      const fi = _f[i];
      if (fields_type[fi] === 'number') {
        b = true;
        break;
      }
    }
    a.value = b ? 'math_compute' : 'string_field';
    a.dispatchEvent(new Event('change'));
  }
}

function createTableDOM(data, opts) {
  const options = opts || {};
  options.id = options.id || 'myTable';
  const doc = document,
    nb_features = data.length,
    column_names = Object.getOwnPropertyNames(data[0]),
    nb_columns = column_names.length;
  const myTable = doc.createElement('table'),
    headers = doc.createElement('thead'),
    body = doc.createElement('tbody'),
    headers_row = doc.createElement('tr');
  for (let i = 0; i < nb_columns; i++) {
    const cell = doc.createElement('th');
    cell.innerHTML = column_names[i];
    headers_row.appendChild(cell);
  }
  headers.appendChild(headers_row);
  myTable.appendChild(headers);
  for (let i = 0; i < nb_features; i++) {
    const row = doc.createElement('tr');
    for (let j = 0; j < nb_columns; j++) {
      const cell = doc.createElement('td');
      cell.innerHTML = data[i][column_names[j]];
      row.appendChild(cell);
    }
    body.appendChild(row);
  }
  myTable.appendChild(body);
  myTable.setAttribute('id', options.id);
  return myTable;
}

export function make_table(layer_name) {
  const features = svg_map.querySelector(`#${_app.layer_to_id.get(layer_name)}`).childNodes;
  const table = [];
  if (!features[0].__data__.properties
      || Object.getOwnPropertyNames(features[0].__data__.properties).length === 0) {
    for (let i = 0, nb_ft = features.length; i < nb_ft; i++) {
      table.push({ id: features[i].__data__.id || i });
    }
  } else {
    for (let i = 0, nb_ft = features.length; i < nb_ft; i++) {
      table.push(features[i].__data__.properties);
    }
  }
  return table;
}

export const boxExplore2 = {
  clean() {
    this.box_table.remove();
    this.footer.remove();
    this.datatable.destroy();
    this.datatable = null;
    this.footer = null;
    this.box_table = null;
    this.nb_features = null;
    this.columns_names = null;
    this.columns_headers = null;
    this.tables = null;
    this.modal_box = null;
  },

  display_table(table_name) {
    document.querySelector('body').style.cursor = '';
    let the_table = this.tables.get(table_name);
    the_table = the_table ? the_table[1] : make_table(table_name);

    this.nb_features = the_table.length;
    this.columns_names = Object.getOwnPropertyNames(the_table[0]);
    this.columns_headers = [];
    for (let i = 0, col = this.columns_names, len = col.length; i < len; ++i) {
      this.columns_headers.push({ data: col[i], title: col[i] });
    }

    // A div to group buttons on the bottom left of the footer
    const div_bottom_button = this.footer.append('div')
      .styles({
        'margin-left': '15px', position: 'absolute', display: 'inline-block', left: '0px',
      });

    // Add a button to add a new field
    if (this.tables.get(table_name) && (table_name !== data_manager.dataset_name
          || (table_name === data_manager.dataset_name
            && data_manager.field_join_map.length === 0))) {
      div_bottom_button
        .append('button')
        .attrs({ id: 'add_field_button', class: 'button_st4' })
        .styles({ padding: '10px', 'font-size': '1.1em', 'margin-right': '10px' })
        .html(_tr('app_page.explore_box.button_add_field'))
        .on('click', () => {
          this.modal_box.hide();
          document.getElementById('browse_data_box').querySelector('#xclose').click();
          add_field_table(the_table, table_name, this);
        });
    }

    // Add a button to export as csv
    div_bottom_button
      .append('button')
      .attrs({ id: 'export_table_csv_button', class: 'button_st4' })
      .styles({ padding: '10px', 'font-size': '1.1em' })
      .html(_tr('app_page.explore_box.button_export_csv'))
      .on('click', () => {
        const csvStr = d3.csvFormat(the_table);
        clickLinkFromDataUrl(
          `data:text/plan;charset=utf-8,${encodeURIComponent(csvStr)}`,
          `${table_name}-table.csv`,
        );
      });

    // Prepare the title and subtitle of the table component
    const txt_intro = [
      '<b>', table_name, '</b><br>',
      this.nb_features, ' ', _tr('app_page.common.feature', { count: this.nb_features }), ' - ',
      this.columns_names.length, ' ', _tr('app_page.common.field', { count: this.columns_names.length }),
    ].join('');
    this.box_table.append('p')
      .attr('id', 'table_intro')
      .html(txt_intro);
    this.box_table.node().appendChild(createTableDOM(the_table, { id: 'myTable' }));
    const list_per_page_select = [5, 10, 15, 20, 25];
    if (this.nb_features > 25) {
      if (this.nb_features > 100) {
        list_per_page_select.push(100);
      }
      list_per_page_select.push(this.nb_features);
    }
    let per_page_value = list_per_page_select[list_per_page_select.length - 1];
    if (per_page_value > 1000) {
      per_page_value = 100;
    }

    // Actually prepare the table
    const myTable = document.getElementById('myTable');
    this.datatable = new DataTable(myTable, {
      sortable: true,
      searchable: true,
      perPage: per_page_value,
      perPageSelect: list_per_page_select,
      labels: {
        placeholder: _tr('app_page.table.search'), // The search input placeholder
        perPage: _tr('app_page.table.entries_page'), // per-page dropdown label
        noRows: _tr('app_page.table.no_rows'), // Message shown when there are no search results
        info: _tr('app_page.table.info'), // "Showing {start} to {end} of {rows} entries"
      },
    });
    // Adjust the size of the box (on opening and after adding a new field)
    // and/or display scrollbar if its overflowing the size of the window minus a little margin :
    const box = document.getElementById('browse_data_box');
    const modal_body = box.querySelector('.modal-body');
    modal_body.style.padding = '12.5px 15px 15px 15px';
    modal_body.style.height = `${window.innerHeight - 150}px`;
    modal_body.style.overflow = 'auto';
    box.style.height = null;

    setTimeout(() => {
      const bbox = box.querySelector('#myTable').getBoundingClientRect();
      // const new_height = bbox.height
      //     + box.querySelector('.dataTable-pagination').getBoundingClientRect().height;
      let new_width = bbox.width;
      if (new_width > window.innerWidth * 0.85) {
        new_width = window.innerWidth * 0.9;
        box.querySelector('.modal-content').style.overflow = 'auto';
        box.querySelector('.modal-dialog').style.width = `${new_width}px`;
      } else { // if (new_width > 560) {
        new_width += 80;
        box.querySelector('.modal-dialog').style.width = `${new_width}px`;
      }
      box.style.left = `${(window.innerWidth - new_width) / 2}px`;
    }, 200);
  },

  get_available_tables() {
    const target_layer = Object.getOwnPropertyNames(data_manager.user_data),
      ext_dataset = data_manager.dataset_name,
      result_layers = Object.getOwnPropertyNames(data_manager.result_data),
      available = new Map();
    for (let i = 0, n = target_layer.length; i < n; i++) {
      const lyr_name = target_layer[i];
      available.set(lyr_name, [_tr('app_page.common.target_layer'), data_manager.user_data[lyr_name]]);
    }
    if (ext_dataset) {
      available.set(data_manager.dataset_name, [_tr('app_page.common.ext_dataset'), data_manager.joined_dataset[0]]);
    }
    for (let i = 0, n = result_layers.length; i < n; i++) {
      const lyr_name = result_layers[i];
      available.set(lyr_name, [_tr('app_page.common.result_layer'), data_manager.result_data[lyr_name]]);
    }
    return available;
  },

  create(layer_name) {
    this.columns_headers = [];
    this.nb_features = undefined;
    this.columns_names = undefined;
    this.tables = this.get_available_tables();
    this.modal_box = make_dialog_container('browse_data_box', _tr('app_page.explore_box.title'), 'discretiz_charts_dialog');
    const container = document.getElementById('browse_data_box');
    this.box_table = d3.select(container).select('.modal-body');
    this.footer = d3.select(container).select('.modal-footer');

    const fn_cb = (evt) => { helper_esc_key_twbs_cb(evt, _onclose); };
    let _onclose = () => {
      container.remove();
      overlay_under_modal.hide();
      document.removeEventListener('keydown', fn_cb);
      this.clean();
    };
    container.querySelector('.btn_cancel').onclick = _onclose;
    container.querySelector('#xclose').onclick = _onclose;
    container.querySelector('.btn_ok').onclick = _onclose;
    document.addEventListener('keydown', fn_cb);
    overlay_under_modal.display();
    this.display_table(layer_name);
  },
};
