import { beforeUnloadWindow, load_map_project, save_map_project } from './../map_project';
import { handle_projection_select, shortListContent } from './../projections';
import { bindTooltips } from './../tooltips';


function change_lang() {
  const new_lang = this.name;
  if (new_lang !== i18next.language) {
    docCookies.setItem('user_lang', new_lang, 31536e3, '/');
    i18next.changeLanguage(new_lang, () => {
      localize('.i18n');
      bindTooltips();
    });
    document.getElementById('current_app_lang').innerHTML = new_lang;
    document.querySelector('html').setAttribute('lang', new_lang);
    const menu = document.getElementById('menu_lang');
    if (menu) menu.remove();
  }
}

export default function makeHeader() {
  const proj_options = d3.select('.header_options_projection')
    .append('div')
    .attr('id', 'const_options_projection')
    .style('display', 'inline-flex');

  const proj_select2 = proj_options.append('div')
    .attr('class', 'styled-select')
    .insert('select')
    .attrs({ class: 'i18n', id: 'form_projection2' })
    .style('width', 'calc(100% + 20px)')
    .style("display","none")
    .on('change', handle_projection_select);

  for (let i = 0; i < shortListContent.length; i++) {
    const option = shortListContent[i];
    proj_select2.append('option')
      .attrs({ class: 'i18n', value: option, 'data-i18n': `app_page.projection_name.${option}` })
      .text(_tr(`app_page.projection_name.${option}`));
  }
  proj_select2.node().value = 'NaturalEarth2';

  const const_options = d3.select('.header_options_right')
    .append('div')
    .attr('id', 'const_options')
    .style('display', 'inline');

  const_options.append('button')
    .attrs({
      class: 'const_buttons i18n tt',
      id: 'new_project',
      'data-i18n': '[data-ot]app_page.tooltips.new_project',
      'data-ot-fixed': true,
      'data-ot-remove-elements-on-hide': true,
      'data-ot-target': true,
    })
    .html('<img src="static/img/header/File_font_awesome_white.png" width="35" height="auto" alt="Load project file"/>')
    .on('click', () => {
      window.localStorage.removeItem('magrit_project');
      window.removeEventListener('beforeunload', beforeUnloadWindow);
      location.reload();
    });

  const_options.append('button')
    .attrs({
      class: 'const_buttons i18n tt',
      'data-i18n': '[data-ot]app_page.tooltips.load_project_file',
      'data-ot-fixed': true,
      'data-ot-remove-elements-on-hide': true,
      'data-ot-target': true,
      id: 'load_project',
    })
    .html('<img src="static/img/header/Folder_open_alt_font_awesome_white.png" width="35" height="auto" alt="Load project file"/>')
    .on('click', load_map_project);

  const_options.append('button')
    .attrs({
      class: 'const_buttons i18n tt',
      'data-i18n': '[data-ot]app_page.tooltips.save_file',
      'data-ot-fixed': true,
      'data-ot-remove-elements-on-hide': true,
      'data-ot-target': true,
      id: 'save_file_button',
    })
    .html('<img src="static/img/header/Breezeicons-actions-22-document-save-white.png" width="35" height="auto" alt="Save project to disk"/>')
    .on('click', save_map_project);

  const_options.append('button')
    .attrs({
      class: 'const_buttons i18n tt',
      'data-i18n': '[data-ot]app_page.tooltips.documentation',
      'data-ot-fixed': true,
      'data-ot-remove-elements-on-hide': true,
      'data-ot-target': true,
      id: 'documentation_link',
    })
    .html('<img src="static/img/header/Documents_icon_-_noun_project_5020_white.png" width="20" height="auto" alt="Documentation"/>')
    .on('click', () => {
      window.open('static/book/index.html', 'DocWindow', 'toolbar=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes').focus();
    });


}
