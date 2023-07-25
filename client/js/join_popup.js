import { make_confirm_dialog2 } from './dialogs';
import {
  display_error_during_computation,
  make_box_type_fields,
  path_to_geojson2,
  xhrequest,
  type_col2
  
} from './helpers';
import { has_duplicate } from './helpers_calc';
import { updateLayer } from './interface';
import { get_unique_value } from './helpers';

function handleJoin() {
  const layer_name = Object.getOwnPropertyNames(global.data_manager.user_data);

  if (!(layer_name.length === 1 && global.data_manager.joined_dataset.length === 1)) {
    swal('', _tr('app_page.join_box.unable_join'), 'error');
  } else if (data_manager.field_join_map.length !== 0) {
    make_confirm_dialog2('dialogBox', undefined, { html_content: _tr('app_page.join_box.ask_forget_join') })
      .then((confirmed) => {
        if (confirmed) {
          valid_join_check_display();
          data_manager.field_join_map = [];
          removeExistingJointure(layer_name);
          createJoinBox(layer_name[0]);
        }
      });
  } else if (global.data_manager.user_data[layer_name].length !== global.data_manager.joined_dataset[0].length) {
    make_confirm_dialog2('dialogBox', undefined, { html_content: _tr('app_page.join_box.ask_diff_nb_features') })
      .then((confirmed) => {
        if (confirmed) { createJoinBox(layer_name[0]); }
      });
  } else {
    createJoinBox(layer_name[0]);
  }
}

/**
* Function called to update the menu according to user operation
* (triggered when layers/dataset are added and after a join operation)
* @param {bool} val - ...
* @param {Array} prop - The proportion of joined features
* @return {void}
*/
export function valid_join_check_display(val, prop) {
  if (!val) {
    const extDatasetImg = document.getElementById('img_data_ext');
    extDatasetImg.setAttribute('src', 'static/img/b/joinfalse.png');
    extDatasetImg.setAttribute('alt', 'Non-validated join');
    extDatasetImg.style.width = '28px';
    extDatasetImg.style.height = '28px';
    extDatasetImg.onclick = handleJoin;

    const joinSec = document.getElementById('join_section');
    joinSec.innerHTML = [prop, _tr('app_page.join_box.state_not_joined')].join('');

    const button = document.createElement('button');
    button.setAttribute('id', 'join_button');
    button.style.display = 'inline';
    button.innerHTML = `<button style="font-size: 11px;" class="button_st3" id="_join_button">${_tr('app_page.join_box.button_join')}</button>`;
    button.onclick = handleJoin;
    joinSec.appendChild(button);
  } else {
    const extDatasetImg = document.getElementById('img_data_ext');
    extDatasetImg.setAttribute('src', 'static/img/b/jointrue.png');
    extDatasetImg.setAttribute('alt', 'Validated join');
    extDatasetImg.style.width = '28px';
    extDatasetImg.style.height = '28px';
    extDatasetImg.onclick = null;

    const [v1, ] = prop.split('/').map(d => +d);

    const joinSec = document.getElementById('join_section');
    joinSec.innerHTML = [' <b>', prop, _tr('app_page.join_box.match', { count: v1 }), '</b>'].join(' ');

    const button = document.createElement('button');
    button.setAttribute('id', 'join_button');
    button.style.display = 'inline';
    button.innerHTML = [' - <i> ', _tr('app_page.join_box.change_field'), ' </i>'].join('');
    button.onclick = handleJoin;
    joinSec.appendChild(button);
  }
}


function valid_join_on(layer_name, join_values1, join_values2, field1, field2, hits) {
  const ext_dataset = global.data_manager.joined_dataset[0];
  const layer_dataset = global.data_manager.user_data[layer_name];
  const prop = [hits, '/', join_values1.length].join('');
  let f_name = '';
  let val;

  if (hits >= join_values1.length) {
    swal({
      title: '',
      text: _tr('app_page.common.success'),
      type: 'success',
      allowOutsideClick: true,
    });
    const fields_name_to_add = Object.getOwnPropertyNames(ext_dataset[0]);
    for (let i = 0, len = join_values1.length; i < len; i++) {
      val = data_manager.field_join_map[i];
      for (let j = 0, leng = fields_name_to_add.length; j < leng; j++) {
        f_name = fields_name_to_add[j];
        if (f_name.length > 0) {
          layer_dataset[i][f_name] = ext_dataset[val][f_name];
        }
      }
    }
    valid_join_check_display(true, prop);
    return Promise.resolve(true);
  } else if (hits > 0) {
    return swal({
      title: `${_tr('app_page.common.confirm')}!`,
      text: _tr('app_page.join_box.partial_join', { ratio: prop }),
      allowOutsideClick: false,
      allowEscapeKey: true,
      type: 'question',
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: _tr('app_page.common.yes'),
      cancelButtonText: _tr('app_page.common.no'),
    }).then(() => {
      const fields_name_to_add = Object.getOwnPropertyNames(ext_dataset[0]);
      for (let i = 0, len = data_manager.field_join_map.length; i < len; i++) {
        val = data_manager.field_join_map[i];
        for (let j = 0, leng = fields_name_to_add.length; j < leng; j++) {
          f_name = fields_name_to_add[j];
          if (f_name.length > 0) {
            // let t_val;
            // if (val == undefined) t_val = null;  // eslint-disable-line
            // else if (ext_dataset[val][f_name] === '') t_val = null;
            // else t_val = ext_dataset[val][f_name];
            layer_dataset[i][f_name] = val != undefined ? ext_dataset[val][f_name] : null; // eslint-disable-line
          }
        }
      }
      return swal({
        title: `${_tr('app_page.common.confirm')}!`,
        text: _tr('app_page.join_box.delete_not_join'),
        allowOutsideClick: false,
        allowEscapeKey: true,
        type: 'question',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: _tr('app_page.common.yes'),
        cancelButtonText: _tr('app_page.common.no'),
      }).then(() => {
        const k = Object.keys(_target_layer_file.objects);
        const geoms = _target_layer_file.objects[k[0]].geometries;
        const temp1 = [];
        const temp2 = [];
        for (let i = 0; i < layer_dataset.length; i++) {
          if (data_manager.field_join_map[i] !== undefined) {
            temp1.push(layer_dataset[i]);
            temp2.push(geoms[i]);
          }
        }
        global.data_manager.user_data[layer_name] = temp1;
        _target_layer_file.objects[k[0]].geometries = temp2;
        updateLayer(layer_name);
        valid_join_check_display(true, [global.data_manager.user_data[layer_name].length, global.data_manager.user_data[layer_name].length].join('/'));
        const formToSend = new FormData();
        const json_layer = path_to_geojson2(layer_name);
        formToSend.append('geojson', json_layer);
        formToSend.append('layer_name', layer_name);
        xhrequest('POST', '/layers/add', formToSend, false).then((e) => {
          data_manager.current_layers[layer_name].key_name = JSON.parse(e).key;
        }).catch((err) => {
          display_error_during_computation();
          console.log(err);
        });
        return Promise.resolve(true);
      }, () => {
        valid_join_check_display(true, prop);
        return Promise.resolve(true);
      });
    }, () => {
      data_manager.field_join_map = [];
      return Promise.resolve(false);
    });
  }
  swal(
    '',
    _tr('app_page.join_box.no_match', { field1, field2 }),
    'error',
  );
  data_manager.field_join_map = [];
  return Promise.resolve(false);
}

// Where the real join is done
// Its two main results are:
//    -the update of the global "data_manager.field_join_map" array
//       (storing the relation between index of the geometry
//         layer and index of the external dataset)
//    -the update of the global "data_manager.user_data" object, adding actualy the value
//     to each object representing each feature of the layer
function prepare_join_on(layer_name, field1, field2, kept_fields, operation) {
  const join_values1 = [],
    join_values2 = [];
  const layer_dataset = global.data_manager.user_data[layer_name];
  global.data_manager.joined_dataset[0] = reduce_for_sql_join(global.data_manager.joined_dataset[0],field2, operation,kept_fields)
  var ext_dataset = global.data_manager.joined_dataset[0];
  const nb_features = layer_dataset.length;
  let hits = 0;
  let val;

  data_manager.field_join_map = [];

  for (let i = 0, len = ext_dataset.length; i < len; i++) {
    join_values2.push(ext_dataset[i][field2]);
  }
  for (let i = 0, len = layer_dataset.length; i < len; i++) {
    join_values1.push(layer_dataset[i][field1]);
  }
  if (has_duplicate(join_values1) || has_duplicate(join_values2)) {
    return swal('', _tr('app_page.join_box.error_not_uniques'), 'warning');
  }
  if (nb_features > 5000) {
    _app.waitingOverlay.display();
    const jointure_worker = new Worker('static/dist/webworker_jointure.js');
    _app.webworker_to_cancel = jointure_worker;
    jointure_worker.postMessage([join_values1, join_values2]);
    jointure_worker.onmessage = function jointure_worker_onmessage(e) {
      const [join_map, _hits] = e.data;
      _app.webworker_to_cancel = undefined;
      hits = _hits;
      data_manager.field_join_map = join_map;
      _app.waitingOverlay.hide();
      valid_join_on(layer_name, join_values1, join_values2, field1, field2, hits)
        .then((valid) => {
          jointure_worker.terminate();
          if (valid) make_box_type_fields(layer_name);
        });
    };
  } else {
    if (typeof join_values1[0] === 'number' && typeof join_values2[0] === 'string') {
      for (let i = 0; i < nb_features; i++) {
        val = join_values2.indexOf(String(join_values1[i]));
        if (val !== -1) {
          data_manager.field_join_map.push(val);
          hits += 1;
        } else {
          data_manager.field_join_map.push(undefined);
        }
      }
    } else if (typeof join_values2[0] === 'number' && typeof join_values1[0] === 'string') {
      for (let i = 0; i < nb_features; i++) {
        val = join_values2.indexOf(Number(join_values1[i]));
        if (val !== -1) {
          data_manager.field_join_map.push(val);
          hits += 1;
        } else {
          data_manager.field_join_map.push(undefined);
        }
      }
    } else if (typeof join_values2[0] === 'number' && typeof join_values1[0] === 'number') {
      for (let i = 0; i < nb_features; i++) {
        val = join_values2.indexOf(join_values1[i]);
        if (val !== -1) {
          data_manager.field_join_map.push(val);
          hits += 1;
        } else {
          data_manager.field_join_map.push(undefined);
        }
      }
    } else {
      for (let i = 0; i < nb_features; i++) {
        val = join_values2.indexOf(String(join_values1[i]));
        if (val !== -1) {
          data_manager.field_join_map.push(val);
          hits += 1;
        } else {
          data_manager.field_join_map.push(undefined);
        }
      }
    }
    valid_join_on(layer_name, join_values1, join_values2, field1, field2, hits)
      .then((valid) => {
        if (valid) make_box_type_fields(layer_name);
      });
  }
}
// Function creating the join box, filled by two "select" input, one containing
// the field names of the geometry layer, the other one containing those from
// the external dataset, in order to let the user choose the common field to do
// the join.
export const createJoinBox = function createJoinBox(layer) {
  const unique_fields = get_unique_value(layer)
  //Filter non unique value
  var geom_layer_fields = []
  for(let field of Object.keys(unique_fields)){
    if(unique_fields[field].length == data_manager.user_data[layer].length){
      geom_layer_fields.push(field)
    }
  }
  const ext_dataset_fields = get_unique_value("",true)
  var options_fields_ext_dataset = [];
  var fields_ext_dataset = [];
  for(let field of Object.keys(ext_dataset_fields)){
      fields_ext_dataset.push(field)
  }
  const options_fields_layer = [];
  const lastChoice = { field1: geom_layer_fields[0], field2: fields_ext_dataset[0] };
  // operation to be applied on the kept fields, intialised to sum
  var chosen_operation  = {}
  for(let field of fields_ext_dataset){
    chosen_operation[field] = "Somme"
  }
  for (let i = 0, len = geom_layer_fields.length; i < len; i++) {
    options_fields_layer.push(
      `<option value="${geom_layer_fields[i]}">${geom_layer_fields[i]}</option>`);
  }
  for (let i = 0, len = fields_ext_dataset.length; i < len; i++) {
    if (fields_ext_dataset[i].length > 0) {
      options_fields_ext_dataset.push(
        `<option value="${fields_ext_dataset[i]}">${fields_ext_dataset[i]}</option>`);
    }
  }

  //If the dataset has duplicates, then a groupby join is needed
  var ext_dataset = data_manager.joined_dataset[0]
  let ext_unique_values = get_unique_value("",true)
  let numerical_external_fields = []
  for(let field of Object.keys(ext_unique_values)){
    // get the type of field
    let type_field = type_col2(ext_dataset,field,true)[0].type
    if( type_field == "stock" || type_field == "ratio"){
      // Exclude the join field, to keep it as an id
        numerical_external_fields.push(field)    
    }
  }
  //fields to keep for the join
  var select_fields_to_keep = new Set(numerical_external_fields)
  if(data_manager.joined_dataset[0].lenght == Object.values(data_manager.user_data)[0].length ){
    var inner_box =
      `<p style="font-size: 12px;"><b><i>${_tr('app_page.join_box.select_fields')}</i></b></p>
      <div style="padding:20px 10px 10px;">
        <p>${_tr('app_page.join_box.geom_layer_field')}</p>
        <p><em>(${layer})</em></p>
        <select id="button_field1">${options_fields_layer.join('')}</select>
      </div>
      <div style="padding:30px 10px 10px;">
        <p>${_tr('app_page.join_box.ext_dataset_field')}</p>
        <p><em>(${data_manager.dataset_name}.csv)</em></p>
        <select id="button_field2">${options_fields_ext_dataset.join('')}</select>
      </div>
      <div style="margin-top:30px; clear: both;">
        <strong>${_tr('app_page.join_box.ask_join')}</strong>
      </div>`;
}
  else{
    let operations = []
    for(let element of ["Somme","Max","Min","Moyenne"]){
      operations.push(`<option value="${element}">${element}</option>`)
    }
    var inner_box =
      `<p style="font-size: 12px;"><b><i>${_tr('app_page.join_box.select_fields')}</i></b></p>
      <div style="padding:20px 10px 10px;">
        <p>${_tr('app_page.join_box.geom_layer_field')}</p>
        <p><em>(${layer})</em></p>
        <select id="button_field1">${options_fields_layer.join('')}</select>
      </div>
      <div style="padding:30px 10px 10px;">
        <p>${_tr('app_page.join_box.ext_dataset_field')}</p>
        <p><em>(${data_manager.dataset_name}.csv)</em></p>
        <select id="button_field2">${options_fields_ext_dataset.join('')}</select>
      </div>
      <div style="padding:30px 10px 10px; background-color:orange">
        <p>Le jeu de données a plus d'entités que le fond de carte. </br> 
        Choissisez l'opération à effectuer sur les colonnes numériques</p>
      </div>
      <div id="field_to_keep">
      </div>
      <div style="margin-top:30px; clear: both;">
        <strong>${_tr('app_page.join_box.ask_join')}</strong>
      </div>
      <ul  id = "kept_fields_join" style="display: flex;flex-direction: column;align-items: flex-start;list-style-type: none;padding-top: 2em;">`;
    for(let field of numerical_external_fields){
      inner_box += `<li draggable="false" style = "padding-left:20%" ><span style="margin-left: 10px;"><input id=group_by_field_${field} class="field-selection" type="checkbox" style="margin: 0px;" checked = true></span><span style="width: 250px; height: 30px; vertical-align: middle; margin-left: 10px; margin-right: 20px;">${field}</span><select id="operation_choice_${field}">${operations.join('')}</select></li>`
    }
    inner_box += `</ul>`

  }
  make_confirm_dialog2('joinBox', _tr('app_page.join_box.title'), { html_content: inner_box, widthFitContent: true })
    .then((confirmed) => {
      if (confirmed) {
        prepare_join_on(layer, lastChoice.field1, lastChoice.field2,select_fields_to_keep, chosen_operation );
      }
    });

  d3.select('.joinBox')
    .styles({ 'text-align': 'center', 'line-height': '0.9em' });

  d3.select('#button_field1')
    .on('change', function () {
      lastChoice.field1 = this.value;
    });

  d3.select('#button_field2')
    .on('change', function () {
      lastChoice.field2 = this.value;
    });
  //Chosen operation, for each field
  d3.selectAll('[id*=operation_choice_]')
    .on('change', function () {
        chosen_operation[this.id.replace("operation_choice_","")] = this.value
    });
  // Add the selected fields to a set later given as an argument for the group by join
  d3.selectAll('#kept_fields_join input')
    .on('change', function () {
      let field  = this.id.replace("group_by_field_","")
      if(this.checked){
        select_fields_to_keep.add(field)
      }
      if(this.checked == false){
        if(select_fields_to_keep.has(field)){
          select_fields_to_keep.delete(field)
        }
      }
  });  
};

const removeExistingJointure = (layer_name) => {
  const { user_data } = global.data_manager;
  if (!user_data[layer_name] || user_data[layer_name].length < 1) return;
  const dataLayer = user_data[layer_name];
  const original_fields = global.data_manager.current_layers[layer_name];
  const fieldDifference = Object.getOwnPropertyNames(dataLayer[0])
    .filter(f => !original_fields.has(f));
  const nbFields = fieldDifference.length;
  for (let i = 0, nbFt = dataLayer.length; i < nbFt; i++) {
    for (let j = 0; j < nbFields; j++) {
      delete dataLayer[i][fieldDifference[j]];
    }
  }
};

/**
 * Reduces an array of objects with duplicates for a given ID collumn (key_col) in parameter
 * to ouput an array with no duplicates.
 * The remaining columns undergo an operation : sum, mean, max, average or string extraction if
 * the field is composed of a unique string for every line
 * 
 * The ouput is use for a "group by" SQL-like join
 * 
 * @param {Array} array : array of object 
 * @returns {Array} array of objects
 */
function reduce_for_sql_join(array, key_col, operation, kept_fields){
  // Key / index of the insertion position to avoid doing an insertion sort 
 var id_key = {}
 var i = 0

 // Filter the input array to keep only selected fields
 var kept_array = array.map((obj) =>{
    var filtered_array =  {}
    for( let field in obj){
      if(kept_fields.has(field) == true || field == key_col){
        filtered_array[field] = obj[field]
      }
    }
    return filtered_array
  }
 )
 var resultat= kept_array.reduce((result,currentObj) => {
  // Id and values (fields) of the current object
  var {[key_col] :  id , ...values  } = currentObj;

  let trimmed_id = (id.toString()).trim()
  if(id != ""){
  // If the element doesn't exists, it gets initalised.  
  if(id_key[trimmed_id] == undefined){
    id_key[trimmed_id] = i
    result[id_key[trimmed_id]] = { [key_col] : trimmed_id ,...values};
    // Counter to check where to insert the next object
    i += 1
  }
  // Apply the operation to the remaining fields
  else{
    for(let column of kept_fields){
        if(column != key_col){ 
        let value = parseFloat(values[column])
        if(operation[column] == "Somme"){
          // Sum for each value
          result[id_key[trimmed_id]][column] += value
        }
        else if(operation[column] == "Moyenne"){
          //Mean
          result[id_key[trimmed_id]][column] += (value/array.length)
        }
        else if(operation[column] == "Min"){
          //Min
          if(result[id_key[trimmed_id]][column] > value){
            result[id_key[trimmed_id]][column] = value
          }
        }
        else if(operation[column] == "Max"){
          //Max
          if(result[id_key[trimmed_id]][column] < value){
            result[id_key[trimmed_id]][column] = value
          }
        } }
    }
  }}
  // return as a list of object to be reused by other functions
  return Object.values(result)
}, {})
return resultat
}