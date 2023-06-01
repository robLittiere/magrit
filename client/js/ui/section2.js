import { clean_menu_function, get_menu_option } from './../function';
import { switch_accordion_section } from './../interface';

export default function makeSection2() {
  const list_fun_ico = [
    'prop.png',
    'choro.png',
    'typo.png',
    'choroprop.png',
    'proptypo.png',
    'grid.png',
    'cartogram.png',
    'smooth.png',
    'discont.png',
    'typosymbol.png',
    'flow.png',
    'two_stocks.png',
  ];

  const function_panel = d3.select('#section2_pre')
    .append('div')
    .attr('id', 'list_ico_func');

  for (let i = 0, len_i = list_fun_ico.length; i < len_i; i++) {
    const ico_name = list_fun_ico[i],
      func_name = ico_name.split('.')[0],
      // func_desc = get_menu_option(func_name).desc,
      margin_value = '5px 16px';
    function_panel
      .insert('img')
      .styles({
        margin: margin_value, cursor: 'pointer', width: '50px', float: 'left',
      })
      .attrs({
        class: 'i18n tt_func',
        'data-i18n': ['[data-ot]app_page.func_description.', func_name].join(''),
        'data-ot-delay': 0,
        'data-ot-fixed': true,
        'data-ot-hideDelay': 0,
        'data-ot-target': true,
        id: `button_${func_name}`,
        src: ['static/img/func_icons2/', ico_name].join(''),
      })
      .on('click', function () {
        // Do some clean-up related to the previously displayed options :
        if (window.fields_handler) {
          if (this.classList.contains('active')) {
            switch_accordion_section('btn_s2b');
            return;
          }
          clean_menu_function();
        }

        document.getElementById('accordion2b').style.display = '';
        // Get the function to fill the menu with the appropriate options (and do it):
        _app.current_functionnality = get_menu_option(func_name);
        // const make_menu = _app.current_functionnality.menu_factory();
        // make_menu();
        _app.current_functionnality.menu_factory()();
        window.fields_handler = _app.current_functionnality.fields_handler();

        // Replace the title of the section:
        const selec_title = document.getElementById('btn_s2b');
        // selec_title.innerHTML = '<span class="i18n" data-i18n="app_page.common.representation">' +
        //                         _tr('app_page.common.representation') +
        //                         '</span><span> : </span><span class="i18n" data-i18n="app_page.func_title.' +
        //                         global._app.current_functionnality.name +
        //                         '">' +
        //                         _tr('app_page.func_title.' + global._app.current_functionnality.name) +
        //                         '</span>';
        selec_title.innerHTML = `
<span class="i18n" data-i18n="app_page.common.representation">${_tr('app_page.common.representation')}</span>
<span> : </span>
<span class="i18n" data-i18n="app_page.func_title.${global._app.current_functionnality.name}">
${_tr(['app_page.func_title.', global._app.current_functionnality.name].join(''))}</span>`;

        selec_title.style.display = '';

        // Don't fill the menu / don't highlight the icon
        // if the type of representation is not allowed :
        if (this.style.filter !== 'grayscale(100%)') {
          this.classList.add('active');
          // Highlight the icon of the selected functionnality :
          this.style.filter = 'invert(100%) saturate(200%)';

          // Fill the field of the functionnality with the field
          // of the targeted layer if already uploaded by the user :
          if (global._app.targeted_layer_added) {
            const target_layer = Object.getOwnPropertyNames(data_manager.user_data)[0];
            fields_handler.fill(target_layer);
          }

          // Specific case for flow/link functionnality as we are also
          // filling the fields with data from the uploaded tabular file if any :
          if (func_name === 'flow' && data_manager.joined_dataset) {
            fields_handler.fill();
          }
        }
        switch_accordion_section('btn_s2b');
      });
  }

  const ids = [
    'button_typo',
    'button_choroprop',
    'button_proptypo',
    'button_grid',
    'button_cartogram',
    'button_smooth',
    'button_discont',
    'button_flow',
    'button_two_stocks']


  for(let i = 0 ; i < ids.length ; i++){
  
    let element = document.getElementById(ids[i])
    element.style.display = "none" 
    console.log(element)
  }
  

}
