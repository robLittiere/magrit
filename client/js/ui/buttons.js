// A bunch of references to the buttons used in the layer manager
// and some mapping to theses reference according to the type of geometry :
export const button_replace = ' <img src="static/img/replace_target_layer.png" id="replace_button" width="16" height="16" alt="replace_button"/>';
export const button_trash = ' <img src="static/img/Trash_font_awesome.png" id="trash_button" width="15" height="15" alt="trash_button"/>';
export const button_legend = ' <img src="static/img/qgis_legend.png" id="legend_button" width="17" height="17" alt="legend_button"/>';
export const button_zoom_fit = ' <img src="static/img/Inkscape_icons_zoom_fit_page.png" id="zoom_fit_button" width="16" height="16" alt="zoom_button"/></button>';
export const button_table = ' <img src="static/img/dataset.png" id="browse_data_button" width="16" height="16" alt="dataset_button"/></button>';
export const button_type = new Map([
  ['Point', '<img src="static/img/type_geom/dot.png" class="ico_type" width="17" height="17" alt="Point"/>'],
  ['Line', '<img src="static/img/type_geom/line.png" class="ico_type" width="17" height="17" alt="Line"/>'],
  ['Polygon', '<img src="static/img/type_geom/poly.png" class="ico_type" width="17" height="17" alt="Polygon"/>'],
]);

export const button_result_type = new Map([
  ['flow', '<img src="static/img/type_geom/layer_flow.png" class="ico_type" width="17" height="17" alt="flow"/>'],
  ['symbol', '<img src="static/img/type_geom/layer_symbol.png" class="ico_type" width="17" height="17" alt="symbol"/>'],
  ['grid', '<img src="static/img/type_geom/layer_grid.png" class="ico_type" width="17" height="17" alt="grid"/>'],
  ['propchoro', '<img src="static/img/type_geom/layer_propchoro.png" class="ico_type" width="17" height="17" alt="propchoro"/>'],
  ['typo', '<img src="static/img/type_geom/layer_typo.png" class="ico_type" width="17" height="17" alt="typo"/>'],
  ['discont', '<img src="static/img/type_geom/layer_disc.png" class="ico_type" width="17" height="17" alt="discont"/>'],
  ['cartogram', '<img src="static/img/type_geom/layer_cartogram.png" class="ico_type" width="17" height="17" alt="cartogram"/>'],
  ['label', '<img src="static/img/type_geom/layer_label.png" class="ico_type" width="17" height="17" alt="label"/>'],
  ['choro', '<img src="static/img/type_geom/layer_choro.png" class="ico_type" width="17" height="17" alt="choro"/>'],
  ['smooth', '<img src="static/img/type_geom/layer_smooth.png" class="ico_type" width="17" height="17" alt="smooth"/>'],
  ['prop', '<img src="static/img/type_geom/layer_prop.png" class="ico_type" width="17" height="17" alt="prop"/>'],
  ['waffle', '<img src="static/img/type_geom/layer_waffle.png" class="ico_type" width="17" height="17" alt="waffle"/>'],
]);

export const eye_open0 = '<img src="static/img/b/eye_open.png" class="active_button" id="eye_open"  width="17" height="17" alt="Visible"/>';

// Reference to the sys run button already in two requested sizes are they are called many times :
export const sys_run_button = '<img src="static/img/High-contrast-system-run.png" width="22" height="22" style="vertical-align: inherit;" alt="submit"/>';
export const sys_run_button_t2 = '<img src="static/img/High-contrast-system-run.png" class="style_target_layer" width="18" height="18" alt="Layer_rendering" style="float:right;"/>';
