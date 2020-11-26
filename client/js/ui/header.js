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
    .html('<img src="static/img/header/File_font_awesome_white.png" width="25" height="auto" alt="Load project file"/>')
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
    .html('<img src="static/img/header/Folder_open_alt_font_awesome_white.png" width="25" height="auto" alt="Load project file"/>')
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
    .html('<img src="static/img/header/Breezeicons-actions-22-document-save-white.png" width="25" height="auto" alt="Save project to disk"/>')
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

  const_options.append('button')
    .attrs({
      class: 'const_buttons i18n tt',
      'data-i18n': '[data-ot]app_page.help_box.tooltip_btn',
      'data-ot-fixed': true,
      'data-ot-remove-elements-on-hide': true,
      'data-ot-target': true,
      id: 'help_btn',
    })
    .html('<img src="static/img/header/High-contrast-help-browser_white.png" width="20" height="20" alt="export_load_preferences" style="margin-bottom:3px;"/>')
    .on('click', () => {
      if (document.getElementById('menu_lang')) {
        document.getElementById('menu_lang').remove();
      }

      const box_content = '<div class="about_content">' +
        '<p style="font-size: 0.8em; margin-bottom:auto;"><span>' +
        _tr('app_page.help_box.version', { version: global._app.version }) + '</span></p>' +
        '<p><b>' + _tr('app_page.help_box.useful_links') + '</b></p>' +
        '<p><button class="swal2-styled swal2_blue btn_doc">' +
        _tr('app_page.help_box.carnet_hypotheses') + '</button></p>' +
        '<p><button class="swal2-styled swal2_blue btn_contact">' +
        _tr('app_page.help_box.contact') + '</button></p>' +
        '<p><button class="swal2-styled swal2_blue btn_gh">' +
        _tr('app_page.help_box.gh_link') + '</button></p>' +
        '<p style="font-size: 0.8em; margin:auto;"><span>' +
        _tr('app_page.help_box.credits') + '</span></p></div>';
      swal({
        title: _tr('app_page.help_box.title'),
        html: box_content,
        showCancelButton: true,
        showConfirmButton: false,
        cancelButtonText: _tr('app_page.common.close'),
        animation: 'slide-from-top',
        onOpen: () => {
          const content = document.getElementsByClassName('about_content')[0];
          const credit_link = content.querySelector('#credit_link');
          credit_link.style.fontWeight = 'bold';
          credit_link.style.cursor = 'pointer';
          credit_link.color = '#000';
          credit_link.onclick = () => {
            window.open('http://riate.cnrs.fr', 'RiatePage', 'toolbar=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes').focus();
          };
          content.querySelector('.btn_doc').onclick = () => {
            window.open('http://magrit.hypotheses.org/', 'Carnet hypotheses', 'toolbar=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes').focus();
          };
          content.querySelector('.btn_contact').onclick = () => {
            window.open('/contact', 'ContactWindow', 'toolbar=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes').focus();
          };
          content.querySelector('.btn_gh').onclick = () => {
            window.open('https://www.github.com/riatelab/magrit', 'GitHubPage', 'toolbar=yes,menubar=yes,resizable=yes,scrollbars=yes,status=yes').focus();
          };
        },
      }).then(() => null, () => null);
    });

  const_options.append('button')
    .attrs({ id: 'current_app_lang', class: 'const_buttons' })
    .styles({
      color: 'white',
      'font-size': '14px',
      'vertical-align': 'super',
      'font-weight': 'bold',
    })
    .html(i18next.language)
    .on('click', () => {
      if (document.getElementById('menu_lang')) {
        document.getElementById('menu_lang').remove();
      } else {
        const current_lang = i18next.language;
        const other_langs = current_lang === 'en' ? ['es', 'fr'] : current_lang === 'fr' ? ['en', 'es'] : ['en', 'fr'];
        const actions = [
          { name: current_lang, callback: change_lang },
          { name: other_langs[0], callback: change_lang },
          { name: other_langs[1], callback: change_lang },
        ];
        const menu = document.createElement('div');
        menu.style.top = '40px';
        menu.style.right = '0px';
        menu.className = 'context-menu';
        menu.id = 'menu_lang';
        menu.style.minWidth = '30px';
        menu.style.width = '50px';
        menu.style.background = '#000';
        const list_elems = document.createElement('ul');
        menu.appendChild(list_elems);
        for (let i = 0; i < actions.length; i++) {
          const item = document.createElement('li');
          const name = document.createElement('span');
          list_elems.appendChild(item);
          item.setAttribute('data-index', i);
          item.style.textAlign = 'right';
          item.style.paddingRight = '16px';
          name.className = 'context-menu-item-name';
          name.style.color = 'white';
          name.textContent = actions[i].name;
          item.appendChild(name);
          item.onclick = () => {
            actions[i].callback();
            menu.remove();
          };
        }
        document.querySelector('body').appendChild(menu);
      }
    });
}
