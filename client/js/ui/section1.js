import { handle_upload_files } from './../interface';
import { make_box_type_fields, prepareFileExt } from './../helpers';
import { add_sample_layer } from './../layers';

/**
* Function triggered when some images of the interface are clicked
* in order to create an <input> element, simulate a click on it, let the user
* browse its file and dispatch the files to the appropriate handler according
* to the file type
*/
function click_button_add_layer() {
  const self = this;
  const input = document.createElement('input');
  input.style.display = 'none';
  if (self.id === 'img_data_ext' || self.id === 'data_ext') {
    input.setAttribute('accept', '.xls,.xlsx,.csv,.tsv,.ods,.txt');
  } else if (self.id === 'input_geom' || self.id === 'img_in_geom') {
    input.setAttribute('accept', '.gml,.kml,.geojson,.topojson,.shp,.dbf,.shx,.prj,.cpg,.json');
  }
  input.setAttribute('type', 'file');
  input.setAttribute('multiple', '');
  input.setAttribute('name', 'file[]');
  input.setAttribute('enctype', 'multipart/form-data');
  input.onchange = (event) => {
    const files = prepareFileExt(event.target.files);
    handle_upload_files(files, self);
    input.remove();
  };
  document.body.appendChild(input);
  input.click();
}


export default function makeSection1() {
  const section1 = d3.select('#menu').select('#section1');

  // Section for current target layer:
  section1.append('div')
    .attrs({
      class: 'i18n',
      id: 'target_layer_zone',
      'data-i18n': '[html]app_page.section1.no_target',
    })
    .styles({
      border: '3px dashed #ccc',
      color: '#ccc',
      'margin-bottom': '3px',
      padding: '3px',
      'text-align': 'center',
    });

  // Section for current dataset:
  section1.append('div')
    .attrs({
      class: 'i18n',
      id: 'ext_dataset_zone',
      'data-i18n': '[html]app_page.section1.no_ext_dataset',
    })
    .styles({
      border: '3px dashed #ccc',
      color: '#ccc',
      'margin-bottom': '3px',
      padding: '3px',
      'text-align': 'center',
    });

  // Section about joining target layer and external dataset:
  section1.append('p')
    .attr('id', 'join_section')
    .styles({ 'text-align': 'center', 'margin-top': '2px', 'margin-bottom': '1px' })
    .html('');

  section1.append('p')
    .attr('id', 'layout_layers_section')
    .styles({ display: 'none', 'margin-top': '2px' });

  section1.append('hr')
    .style('border-top', '2px #ccc');

  section1.append('p')
    .attrs({
      id: 'info_section1',
      class: 'i18n',
      'data-i18n': '[data-ot]app_page.tooltips.section1',
      'data-ot-remove-elements-on-hide': true,
    })
    .styles({
      margin: 'auto',
      float: 'right',
    })
    .append('img')
    .attrs({
      alt: 'info',
      src: 'static/img/Information.png',
    });

  const dv11 = section1.append('div').style('width', 'auto');

  dv11.append('img')
    .attrs({
      id: 'img_in_geom',
      src: 'static/img/b/addgeom.png',
      width: '25',
      height: '25',
      alt: 'Geometry layer',
    })
    .style('cursor', 'pointer')
    .on('click', click_button_add_layer);

  dv11.append('p')
    .attrs({ id: 'input_geom', class: 'i18n' })
    .styles({
      cursor: 'pointer',
      display: 'inline',
      'font-weight': 'bold',
      'margin-left': '4px',
      'vertical-align': 'super',
    })
    .attr('data-i18n', '[html]app_page.section1.add_geom')
    .on('click', click_button_add_layer);

  const dv12 = section1.append('div');
  dv12.append('img')
    .attrs({
      id: 'img_data_ext',
      src: 'static/img/b/addtabular.png',
      width: '25',
      height: '25',
      alt: 'Additional dataset',
    })
    .style('cursor', 'pointer')
    .on('click', click_button_add_layer);

  dv12.append('p')
    .attrs({
      id: 'data_ext',
      class: 'i18n',
      'data-i18n': '[html]app_page.section1.add_ext_dataset',
    })
    .styles({
      cursor: 'pointer',
      display: 'inline',
      'font-weight': 'bold',
      'margin-left': '4px',
      'vertical-align': 'super',
    })
    .on('click', click_button_add_layer);

  const div_sample = section1.append('div').attr('id', 'sample_zone');
  div_sample.append('img')
    .attrs({
      alt: 'Sample layers',
      id: 'sample_button',
      width: '25',
      height: '25',
      src: 'static/img/b/addsample.png',
    })
    .style('cursor', 'pointer')
    .on('click', add_sample_layer);

  div_sample.append('span')
    .attrs({
      id: 'sample_link',
      class: 'i18n',
      'data-i18n': '[html]app_page.section1.add_sample_data',
    })
    .styles({
      cursor: 'pointer',
      display: 'inline',
      'font-weight': 'bold',
      'margin-left': '4px',
      'vertical-align': 'super',
    })
    .on('click', add_sample_layer);

  section1.append('p')
    .styles({ 'text-align': 'center', margin: '5px' })
    .insert('button')
    .attrs({
      id: 'btn_type_fields',
      class: 'i18n',
      'data-i18n': '[html]app_page.box_type_fields.title',
      disabled: true,
    })
    .styles({
      'border-radius': '4px',
      cursor: 'pointer',
      border: '1px solid lightgrey',
      padding: '3.5px',
    })
    .html(_tr('app_page.box_type_fields.title'))
    .on('click', () => {
      const layer_name = Object.keys(data_manager.user_data)[0];
      make_box_type_fields(layer_name);
    });
}
