function createBoxTextImportWizard(file) {
  const modal_box = make_dialog_container(
        'box_text_import_wizard',
        _tr('app_page.box_text_import.title'),
        'dialog');

  if (!file) {
    file = new File(['id;val1;val2\r\n"foo";2;3\r\n"bar";5;6\r\n'], 'filename.csv');
  }

  const box_content = d3.select('#box_text_import_wizard').select('.modal-body');
  const a = new TextImportWizard(box_content.node(), file);
  let deferred = Promise.pending(),
    container = document.getElementById('box_text_import_wizard'),
    dialog = container.querySelector('.modal-dialog');
  dialog.style.width = undefined;
  	dialog.style.maxWidth = '620px';
  	dialog.style.minWidth = '380px';

  const clean_up_box = function () {
    container.remove();
    overlay_under_modal.hide();
    document.removeEventListener('keydown', fn_cb);
  };
  let fn_cb = (evt) => { helper_esc_key_twbs_cb(evt, _onclose); };
  let _onclose = function () {
    clean_up_box();
    deferred.resolve(false);
  };
  container.querySelector('.btn_cancel').onclick = _onclose;
  container.querySelector('#xclose').onclick = _onclose;
  container.querySelector('.btn_ok').onclick = function () {
    clean_up_box();
    deferred.resolve([a.parsed_data, a.valid]);
  };
  document.addEventListener('keydown', fn_cb);
  overlay_under_modal.display();

  return deferred.promise;
}

 // let encoding = jschardet.detect(data);
 // if(encoding.encoding != "utf-8"
 //         || encoding.confidence){
 //     console.log(encoding);
 //    //  Todo : do something in order to get a correct encoding
 // }

function firstGuessSeparator(line) {
  if (line.indexOf('\t') > -1) {
    return 'tab';
  } else if (line.indexOf(';') > -1) {
    return 'semi-collon';
  }
  return 'comma';
}

class TextImportWizard {
  constructor(parent_element, file_txt) {
    if (!parent_element) { parent_element = document.body; }
    const self = this;
    self.delim_char = { tab: '\t', comma: ',', 'semi-collon': ';', space: ' ' };
    const handle_change_delimiter = () => {
      let buttons = document.getElementsByName('txtwzrd_delim_char'),
        n_buttons = buttons.length,
        delim;
      for (let i = 0; i < n_buttons; i++) {
        if (buttons[i].checked) { delim = self.delim_char[buttons[i].value]; }
      }
      if (delim) { self.change_delimiter(delim); }
    };
    const html_content = '<div>' +
            '<p style="font-weight: bold;"><span>Import</span><span style="float: right;" id="txtwzrd_filename"></span></p>' +
            '<p><span>Encodage</span><select id="txtwzrd_encoding" style="position: absolute; left: 200px;"></select></p>' +
            '<p><span>A partir de la ligne</span><input style="position: absolute; left: 200px;width: 60px;" type="number" value="1" min="1" step="1" id="txtwzrd_from_line"/></p>' +
            '</div>' +
            '<div>' +
            '<p style="font-weight: bold;"><span>Délimiteur</span></p>' +
            // "<p><input type=\"radio\" name=\"txtwzrd_radio_delim\" value=\"fixed\">Taille de colonne fixe</input><input type=\"radio\" name=\"txtwzrd_radio_delim\" value=\"char\">Caractère</input></p>" +
            '<p><input type="radio" name="txtwzrd_delim_char" value="tab" style="margin-left: 10px;">Tabulation</input>' +
            '<input type="radio" name="txtwzrd_delim_char" value="comma" style="margin-left: 10px;">Virgule</input>' +
            '<input type="radio" name="txtwzrd_delim_char" value="semi-collon" style="margin-left: 10px;">Point-virgule</input>' +
            '<input type="radio" name="txtwzrd_delim_char" value="space" style="margin-left: 10px;">Espace</input></p>' +
            "<p><span>Séparateur de texte</span><select id=\"txtwzrd_txt_sep\" style=\"position: absolute; left: 200px;\"><option value=\"&quot;\">&quot;</option><option value=\"'\">'</option></select></p>" +
            '<p><span>Séparateur des décimales</span><select id="txtwzrd_decimal_sep" style="position: absolute; left: 200px;"><option value=".">.</option><option value=",">,</option></select></p>' +
            '</div>' +
            '<p style="font-weight: bold;clear: both;"><span>Table</span><span id="valid_message" style="float: right; color: red; font-weight: bold;"></span></p>' +
            '<div style="max-height: 160px; overflow-y: scroll; margin-top: 12px;">' +
            '<table id="txtwzr_table" style="font-size: 14px; margin: 0 5px 0 5px;"><thead></thead><tbody></tbody>' +
            '</div>';

    const div_content = document.createElement('div');
    div_content.setAttribute('class', '.txtwzrd_box_content');
    div_content.style = 'minWidth: 400px; maxWidth: 600px; minHeight: 400px; maxHeight: 600px';
    div_content.innerHTML = html_content;
    parent_element.appendChild(div_content);
    parent_element.querySelector('#txtwzrd_filename').innerHTML = file_txt.name;
    parent_element.querySelector('#txtwzrd_from_line').onchange = function () {
      const val = +this.value;
      if (isNaN(val) || val < 1 || (val | 0) != val) {
        this.value = self.from_line;
      } else {
        self.from_line = val;
        self.parse_data();
        self.update_table();
      }
    };
    parent_element.querySelector('#txtwzrd_txt_sep').onchange = function () {
      self.text_separator = this.value;
      self.parse_data();
      self.update_table();
    };
    Array.prototype.forEach.call(
            document.getElementsByName('txtwzrd_delim_char'),
            (el) => { el.onclick = handle_change_delimiter; });
    this.content = div_content;
    this.table = div_content.querySelector('table');
    this.file = file_txt;
    this.readed_text = null;
    this.encoding = document.characterSet;
    this.delimiter = undefined;
    this.from_line = 1;
    this.line_separator = undefined;
    this.text_separator = '"';
    this.parsed_data = undefined;
    this.valid = undefined;
    this.valid_message;
    self.add_encodage_to_selection([self.encoding]);
    self.read_file_to_text({ first_read: true, update: true });
    return this;
  }

  add_encodage_to_selection(encodage) {
    const select = this.content.querySelector('#txtwzrd_encoding');
    if (typeof encodage === 'string') { encodage = [encodage]; }
    for (let i = 0; i < encodage.length; i++) {
      const o = document.createElement('option');
      o.value = encodage[i];
      o.innerText = encodage[i];
      select.append(o);
    }
  }

  set_first_guess_delimiter() {
    const self = this;
    const delim = firstGuessSeparator(self.readed_text.split(self.line_separator)[0]);
    self.delimiter = self.delim_char[delim];
    Array.prototype.forEach.call(document.getElementsByName('txtwzrd_delim_char'), (el) => {
      if (el.value == delim) {
        el.checked = true;
      }
    });
  }

  set_line_separator() {
    this.line_separator = this.readed_text.indexOf('\r\n') > -1 ? '\r\n' : '\n';
  }

  read_file_to_text(options = {}) {
    const self = this;
    const reader = new FileReader();
    reader.onloadend = function () {
      self.readed_text = reader.result;
      if (options.first_read == true) {
        self.set_line_separator();
        self.set_first_guess_delimiter();
      }
      if (options.update == true) {
        self.parse_data();
        self.update_table();
      }
    };
    reader.readAsText(self.file, self.encoding);
  }

  change_delimiter(new_delim) {
    const self = this;
    self.delimiter = new_delim;
    self.parse_data();
    self.update_table();
  }

  parse_data() {
    const strip_text_separator = (line) => {
      const len = line.length;
      for (let i = 0; i < len; i++) {
        const val = line[i];
        if (val.startsWith(self.text_separator) && val.endsWith(self.text_separator)) {
          line[i] = val.slice(1, -1);
        }
      }
    };
    let self = this,
      lines = self.readed_text.split(self.line_separator),
      fields = lines[self.from_line - 1].split(self.delimiter),
      tmp_nb_fields = fields.length,
      nb_ft;

    strip_text_separator(fields);

    lines = lines.slice(self.from_line).filter(line => line != '');
    nb_ft = lines.length;
    self.parsed_data = [];
    self.valid = true;
    for (let i = 0; i < nb_ft; i++) {
      const values = lines[i].split(self.delimiter);
      strip_text_separator(values);
      const ft = {};
      if (values.length != tmp_nb_fields) {
        self.valid = false;
        self.valid_message = 'Nombre de colonne différent (en-tetes / valeurs)';
      }
      for (let j = 0; j < tmp_nb_fields; j++) {
        ft[fields[j] || `Field${j}`] = values[j];
      }
      self.parsed_data.push(ft);
    }
  }

  update_table() {
    const self = this;
    const doc = document;

    self.table.parentElement.scrollTop = 0;
    self.table.innerHTML = '<thead></thead><tbody></tbody>';

    const field_names = Object.getOwnPropertyNames(self.parsed_data[0]);
    const headers = self.table.querySelector('thead');
    const tbody = self.table.querySelector('tbody');
    const length_table = self.parsed_data.length < 10 ? self.parsed_data.length : 10;
    const headers_row = doc.createElement('tr');

    for (let i = 0; i < field_names.length; i++) {
      const cell = doc.createElement('th');
      cell.innerHTML = field_names[i];
      headers_row.appendChild(cell);
    }
    headers.append(headers_row);

    for (let i = 0; i < length_table; i++) {
      let row = doc.createElement('tr'),
        values = self.parsed_data[i],
        fields = Object.getOwnPropertyNames(values);
      for (let j = 0; j < fields.length; j++) {
        const cell = doc.createElement('td');
        cell.innerHTML = values[fields[j]];
        row.appendChild(cell);
      }
      tbody.appendChild(row);
    }
    self.content.querySelector('#valid_message').innerHTML = self.valid === false ? self.valid_message : '';
  }
}
