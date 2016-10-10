"use strict";

function get_menu_option(func){
    var menu_option = {
        "smooth":{
            "name": "smooth",
            "title":i18next.t("app_page.func_title.smooth"),
            "menu_factory": "fillMenu_Stewart",
            "fields_handler": "fields_Stewart",
            },
        "prop":{
            "name": "prop",
            "title": i18next.t("app_page.func_title.prop"),
            "menu_factory": "fillMenu_PropSymbol",
            "fields_handler": "fields_PropSymbol",
            },
        "choroprop":{
            "name": "choroprop",
            "title": i18next.t("app_page.func_title.choroprop"),
            "menu_factory": "fillMenu_PropSymbolChoro",
            "fields_handler": "fields_PropSymbolChoro",
            },
        "choro":{
            "name": "choro",
            "title": i18next.t("app_page.func_title.choro"),
            "menu_factory": "fillMenu_Choropleth",
            "fields_handler": "fields_Choropleth",
            },
        "cartogram":{
            "name": "cartogram",
            "title": i18next.t("app_page.func_title.cartogram"),
            "menu_factory": "fillMenu_Anamorphose",
            "fields_handler": "fields_Anamorphose",
            "add_options": "keep_file",
            },
        "grid":{
            "name": "grid",
            "title": i18next.t("app_page.func_title.grid"),
            "menu_factory": "fillMenu_griddedMap",
            "fields_handler": "fields_griddedMap",
            },
        "flow":{
            "name": "flow",
            "title": i18next.t("app_page.func_title.flow"),
            "menu_factory": "fillMenu_FlowMap",
            "fields_handler": "fields_FlowMap",
            },
        "discont":{
            "name": "discont",
            "title": i18next.t("app_page.func_title.discont"),
            "menu_factory": "fillMenu_Discont",
            "fields_handler": "fields_Discont",
            "add_options": "keep_file",
            },
        "typo":{
            "name": "typo",
            "title": i18next.t("app_page.func_title.typo"),
            "menu_factory": "fillMenu_Typo",
            "fields_handler": "fields_Typo",
            },
        "label":{
            "name": "label",
            "title": i18next.t("app_page.func_title.label"),
            "menu_factory": "fillMenu_Label",
            "fields_handler": "fields_Label",
            },
        "typosymbol":{
            "name": "typosymbol",
            "title": i18next.t("app_page.func_title.typosymbol"),
            "menu_factory": "fillMenu_TypoSymbol",
            "fields_handler": "fields_Symbol",
            },
    };
    return menu_option[func.toLowerCase()] || {};
}


function clean_menu_function(){
    let s2 = section2.node();
    for(let i = s2.childElementCount - 1; i > -1 ; i--){
        s2.removeChild(s2.childNodes[i]);
    }
}

/** Function trying to avoid layer name collision by adding a suffix
* to the layer name if already exists and incrementing it if necessary
* (MyLayer -> MyLayer_1 -> MyLayer_2 etc.)
*
* @param {string} name - The original wanted name of the layer to add
* @return {string} new_name - An available name to safely add the layer
*     (the input name if possible or a slightly modified
*        one to avoid collision or unwanted characters)
*/
function check_layer_name(name){
    if(!(current_layers.hasOwnProperty(name)))
        return name;
    else {
        let i = 1;
        if(name.match(/_\d+$/)){
            i = name.match(/\d+$/);
            name = name.substring(name, name.indexOf(i));
            return check_layer_name([name, parseInt(i) + 1].join(''));
        }
        else {
            name = [name, i].join('_');
            return check_layer_name(name);
        }
    }
}

function box_choice_symbol(sample_symbols){
    var newbox = d3.select("body")
                        .append("div").style("font-size", "10px")
                        .attrs({id: "box_choice_symbol", title: "Symbol selection"});

    newbox.append("h3").html(i18next.t("Symbol selection"));
    newbox.append("p").html(i18next.t("Select a symbol..."));

    var box_select = newbox.append("div")
                        .styles({width: "190px", height: "100px", overflow: "auto", border: "1.5px solid #1d588b"})
                        .attr("id", "symbols_select");

    box_select.selectAll("p")
            .data(sample_symbols)
            .enter()
            .append("p")
            .attr("id", d => "p_" + d[0].replace(".svg", ""))
            .attr("title", d => d[0])
            .html(d => d[1])
            .styles({width: "32px", height: "32px",
                    "margin": "auto", display: "inline-block"});

    box_select.selectAll("svg")
            .attr("id", function(){ return this.parentElement.id.slice(2) })
            .attrs({height: "32px", width: "32px"})
            .on("click", function(){
                box_select.selectAll("svg").each(function(){
                    this.parentElement.style.border = "";
                    this.parentElement.style.padding = "0px";
                })
                this.parentElement.style.padding = "-1px";
                this.parentElement.style.border = "1px dashed red";
                let svg_dataUrl = [
                    'url("data:image/svg+xml;base64,',
                    btoa(new XMLSerializer().serializeToString(this)),
                    '")'].join('');
                newbox.select("#current_symb").style("background-image", svg_dataUrl);
            });

    newbox.append("p")
        .attr("display", "inline")
        .html(i18next.t("Or upload your symbol "));
    newbox.append("button")
        .html("Browse")
        .on("click", function(){
            let input = document.createElement('input');
            input.setAttribute("type", "file");
            input.onchange = function(event){
                let file = event.target.files[0];
                let file_name = file.name;
                let reader = new FileReader()
                reader.onloadend = function(){
                    let result = reader.result;
                    let dataUrl_res = ['url("', result, '")'].join('');
                    newbox.select("#current_symb").style("background-image", dataUrl_res);
                }
                reader.readAsDataURL(file);
            }
            input.dispatchEvent(new MouseEvent("click"));
        });

    newbox.insert("p").html("Selected symbol :")
    newbox.insert("p").attr("id", "current_symb")
            .attr("class", "symbol_section")
            .style("margin", "auto")
            .style("background-image", "url('')")
            .style("vertical-align", "middle")
            .styles({width: "32px", height: "32px",
                    "border-radius": "10%",
                    display: "inline-block", "background-size": "32px 32px"
                  });
    var deferred = Q.defer();
    $("#box_choice_symbol").dialog({
        modal: true,
        resizable: true,
        buttons:[{
            text: "Confirm",
            click: function(){
                    let res_url = newbox.select("#current_symb").style("background-image");
                    deferred.resolve(res_url);
                    $(this).dialog("close");
                    }
                },
           {
            text: "Cancel",
            click: function(){
                $(this).dialog("close");
                $(this).remove();}
           }],
        close: function(event, ui){
                $(this).dialog("destroy").remove();
                if(deferred.promise.isPending()){
                    deferred.resolve(false);
                }
            }
    })
    return deferred.promise;
}

function make_style_box_indiv_symbol(label_node){
    let current_options = {size: label_node.getAttribute("width")};
    let ref_coords = {x: +label_node.getAttribute("x") + (+current_options.size.slice(0, -2) / 2),
                      y: +label_node.getAttribute("y") + (+current_options.size.slice(0, -2) / 2)};
    let new_params = {};
    let self = this;
    var a = make_confirm_dialog("", "Valid", "Cancel", "Label options", "styleTextAnnotation")
        .then(function(confirmed){
            if(!confirmed){
                label_node.setAttribute("width", current_options.size);
                label_node.setAttribute("height", current_options.size);
                label_node.setAttribute("x", ref_coords.x - (+current_options.size.slice(0, -2) / 2));
                label_node.setAttribute("y", ref_coords.y - (+current_options.size.slice(0, -2) / 2));
            }
        });
    let box_content = d3.select(".styleTextAnnotation").insert("div");
    box_content.append("p").html("Image size ")
            .append("input").attrs({type: "number", id: "font_size", min: 0, max: 150, step: "any", value: +label_node.getAttribute("width").slice(0,-2)})
            .on("change", function(){
                let new_val = this.value + "px";
                label_node.setAttribute("width", new_val);
                label_node.setAttribute("height", new_val);
                label_node.setAttribute("x", ref_coords.x - (+this.value / 2));
                label_node.setAttribute("y", ref_coords.y - (+this.value / 2));
            });
};


var fields_Symbol = {
    fill: function(layer){
        if(!layer) return;
        let fields_all = Object.getOwnPropertyNames(user_data[layer][0]),
            field_to_use = d3.select("#field_Symbol"),
            self = this;
        fields_all.forEach(function(field){
            field_to_use.append("option").text(field).attr("value", field);
        });
        d3.selectAll(".params").attr("disabled", null);
        field_to_use.on("change", function(){
            document.getElementById("yesTypoSymbols").disabled = true;
            self.box_typo = display_box_symbol_typo(layer, this.value);
        });
        self.box_typo = display_box_symbol_typo(layer, fields_all[0]);
    },
    unfill: function(){
        unfillSelectInput(document.getElementById("field_Symbol"));
        d3.selectAll(".params").attr("disabled", true);
    },
    box_typo: undefined
}

function fillMenu_TypoSymbol(){
    let dv2 = section2.append("p").attr("class", "form-rendering");

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    let field_selec = dv2.append("p").html(i18next.t("app_page.func_options.typosymbol.field"))
                    .insert('select')
                    .attrs({class: "params", id: "field_Symbol"});

    let rendering_params;
    dv2.insert('p').style("margin", "auto").html("")
        .append("button")
        .attrs({id: "selec_Symbol", class: "button_disc params"})
        .styles({"font-size": "0.8em", "text-align": "center"})
        .html(i18next.t("app_page.func_options.typosymbol.symbols_choice"))
        .on("click", function(){
            fields_Symbol.box_typo().then(function(confirmed){
                if(confirmed){
                    ok_button.attr("disabled", null);
                    rendering_params = {
                        nb_cat: confirmed[0],
                        symbols_map: confirmed[1],
                        field: field_selec.node().value
                    };
                }
            });
        });

    dv2.append('p').html(i18next.t("app_page.func_options.common.output"))
        .insert('input')
        .style("width", "200px")
        .attr('class', 'params')
        .attr("id", "TypoSymbols_output_name");

    let ok_button = dv2.append("p")
                      .styles({"text-align": "right", margin: "auto"})
                      .append('button')
                      .attr("disabled", true)
                      .attr('id', 'yesTypoSymbols')
                      .attr('class', 'button_st3')
                      .text(i18next.t('app_page.func_options.common.render'))
                      .on("click", function(){
                          let new_name = document.getElementById("TypoSymbols_output_name").value;
                          render_TypoSymbols(rendering_params, new_name);
                      });

    d3.selectAll(".params").attr("disabled", true);
}

function render_TypoSymbols(rendering_params, new_name){
    let layer_name = Object.getOwnPropertyNames(user_data)[0];
    let field = rendering_params.field;
    let layer_to_add = check_layer_name(new_name.length > 0 && /^\w+$/.test(new_name) ? new_name : ["Symbols", field, layer_name].join("_"));
    let new_layer_data = [];

    let ref_selection = document.getElementById(layer_name).querySelectorAll("path");
    let nb_ft = ref_selection.length;

    for(let i=0; i<nb_ft; i++){
        let ft = ref_selection[i].__data__;
        new_layer_data.push({Symbol_field: ft.properties[field], coords: path.centroid(ft)});
    }

    let context_menu = new ContextMenu(),
        getItems = (self_parent) => [
            {"name": "Edit style...", "action": () => { make_style_box_indiv_symbol(self_parent); }},
            {"name": "Delete", "action": () => {self_parent.style.display = "none"; }}
    ];

    map.append("g").attrs({id: layer_to_add, class: "layer"})
        .selectAll("image")
        .data(new_layer_data).enter()
        .insert("image")
        .attr("x", d => d.coords[0] - rendering_params.symbols_map.get(d.Symbol_field)[1] / 2)
        .attr("y", d => d.coords[1] - rendering_params.symbols_map.get(d.Symbol_field)[1] / 2)
        .attr("width", d => rendering_params.symbols_map.get(d.Symbol_field)[1] + "px")
        .attr("height", d => rendering_params.symbols_map.get(d.Symbol_field)[1] + "px")
        .attr("xlink:href", (d,i) => rendering_params.symbols_map.get(d.Symbol_field)[0])
        .on("mouseover", function(){ this.style.cursor = "pointer";})
        .on("mouseout", function(){ this.style.cursor = "initial";})
        .on("contextmenu dblclick", function(){
            context_menu.showMenu(d3.event, document.querySelector("body"), getItems(this));
            })
        .call(drag_elem_geo);

    create_li_layer_elem(layer_to_add, nb_ft, ["Point", "symbol"], "result");

    current_layers[layer_to_add] = {
        "n_features": current_layers[layer_name].n_features,
        "renderer": "TypoSymbols",
        "symbols_map": rendering_params.symbols_map,
        "rendered_field": field,
        "is_result": true,
        "symbol": "image",
        "ref_layer_name": layer_name,
        };
    up_legend();
    zoom_without_redraw();
    switch_accordion_section();
}

var fields_Discont = {
    fill: function(layer){
        if(!layer) return;
        let fields_num = type_col(layer, "number"),
            fields_all = Object.getOwnPropertyNames(user_data[layer][0]),
            field_discont = d3.select("#field_Discont"),
            field_id = d3.select("#field_id_Discont");

        if(fields_num.length == 0){
            display_error_num_field();
            return;
        }

        fields_num.forEach(function(field){
                field_discont.append("option").text(field).attr("value", field);
        });
        fields_all.forEach(function(field){
                field_id.append("option").text(field).attr("value", field);
        });
        d3.selectAll(".params").attr("disabled", null);
    },
    unfill: function(){
        unfillSelectInput(document.getElementById("field_Discont"));
        unfillSelectInput(document.getElementById("field_id_Discont"));
        d3.selectAll(".params").attr("disabled", true);
    }
}

function insert_legend_button(layer_name){
    let selec = d3.select("#sortable").select(['.', layer_name, ' .layer_buttons'].join('')),
        inner_html = selec.node().innerHTML,
        const_delim = ' <img src="/static/img/Inkscape_icons_zoom_fit_page.svg"',
        split_content = inner_html.split();
    selec.node().innerHTML = [split_content[0], button_legend, const_delim, split_content[1]].join('');
}

function fillMenu_Discont(){
    let dv2 = section2.append("p").attr("class", "form-rendering");

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    dv2.append('p').html(i18next.t("app_page.func_options.discont.field"))
                .insert('select')
                .attrs({class: 'params', id: "field_Discont"});

    dv2.append('p').html(i18next.t("app_page.func_options.discont.id_field"))
                .insert('select')
                .attrs({class: 'params', id: "field_id_Discont"});

    {
        let disc_kind = dv2.append('p')
                    .html(i18next.t("app_page.func_options.discont.type_discontinuity"))
                    .insert('select')
                    .attrs({class: 'params', id: "kind_Discont"});

        [[i18next.t("app_page.func_options.discont.type_relative"), "rel"],
          [i18next.t("app_page.func_options.discont.type_absolute"), "abs"]
        ].forEach(function(k){
            disc_kind.append("option").text(k[0]).attr("value", k[1]);
        });

        dv2.append('p').html(i18next.t("app_page.func_options.discont.nb_class"))
                .insert('input')
                .attrs({type: "number", class: 'params', id: "Discont_nbClass", min: 1, max: 33, value: 4})
                .style("width", "50px");

        let disc_type = dv2.append('p')
                            .html(i18next.t("app_page.func_options.discont.discretization"))
                            .insert('select')
                            .attrs({'class': 'params', "id": "Discont_discKind"});

        [
         [i18next.t("app_page.common.equal_interval"), "equal_interval"],
         [i18next.t("app_page.common.quantiles"), "quantiles"],
         [i18next.t("app_page.common.std_dev"), "std_dev"],
         [i18next.t("app_page.common.Q6"), "Q6"],
         [i18next.t("app_page.common.arithmetic_progression"), "arithmetic_progression"],
         [i18next.t("app_page.common.jenks"), "jenks"]
        ].forEach(field => {
             disc_type.append("option").text(field[0]).attr("value", field[1]);
        });
    }

    dv2.append('p').html(i18next.t("app_page.func_options.discont.color"))
                .insert('input')
                .attrs({class: 'params', id: "color_Discont",
                       type: "color", value: ColorsSelected.random()});

    let ok_button = dv2.append("p")
                      .styles({"text-align": "right", margin: "auto"})
                      .append('button')
                      .attr('id', 'yes')
                      .attr('class', 'params button_st3')
                      .text(i18next.t('app_page.func_options.common.render'));

    d3.selectAll(".params").attr("disabled", true);

    ok_button.on("click", function(){
//            let p1 = new Promise(function(resolve, reject){
//                document.getElementById("overlay").style.display = "";
//                resolve(true);
//            });
//            p1.then(render_discont()
//            ).then(() => {
//                document.getElementById("overlay").style.display = "none";
//            })
            // ^^^^^ Currently displaying the overlay during computation dont work as expected
            document.getElementById("overlay").style.display = "";
            console.time("discont");
            render_discont();
            console.timeEnd("discont");
            document.getElementById("overlay").style.display = "none";
            // ^^^^^ Currently displaying the overlay during computation dont work as expected

        });
}

var render_discont = function(){
//    return new Promise(function(resolve, reject){
    let layer = Object.getOwnPropertyNames(user_data)[0],
        field = document.getElementById("field_Discont").value,
        field_id = document.getElementById("field_id_Discont").value,
        min_size = 1,
        max_size = 10,
        threshold = 1,
        disc_kind = document.getElementById("kind_Discont").value,
        nb_class = +document.getElementById("Discont_nbClass").value,
        user_color = document.getElementById("color_Discont").value,
        method = document.getElementById("kind_Discont").value;

    let result_value = new Map(),
        result_geom = {},
        topo_mesh = topojson.mesh,
        math_max = Math.max;

    // Use topojson.mesh a first time to compute the discontinuity value
    // for each border (according to the given topology)
    // (Discontinuities could also be computed relativly fastly server side
    // which can be a better solution for large dataset..)
    if(disc_kind == "rel")
        topo_mesh(_target_layer_file, _target_layer_file.objects[layer], function(a, b){
                if(a !== b){
                    let new_id = [a.id, b.id].join('_'),
                        new_id_rev = [b.id, a.id].join('_');
                    if(!(result_value.get(new_id) || result_value.get(new_id_rev))){
                        let value = math_max(a.properties[field] / b.properties[field],
                                             b.properties[field] / a.properties[field]);
                        result_value.set(new_id, value);
                    }
                }
                return false; });
    else
        topo_mesh(_target_layer_file, _target_layer_file.objects[layer], function(a, b){
                if(a !== b){
                    let new_id = [a.id, b.id].join('_'),
                        new_id_rev = [b.id, a.id].join('_');
                    if(!(result_value.get(new_id) || result_value.get(new_id_rev))){
                        let value = math_max(a.properties[field] - b.properties[field],
                                             b.properties[field] - a.properties[field]);
                        result_value.set(new_id, value);
                    }
                }
                return false; });

    let arr_disc = [],
        arr_tmp = [];
    for(let kv of result_value.entries()){
        if(!isNaN(kv[1])){
            arr_disc.push(kv);
            arr_tmp.push(kv[1]);
        }
    }

    arr_disc.sort((a,b) => a[1] - b[1]);
    arr_tmp.sort((a,b) => a - b);

    let nb_ft = arr_tmp.length,
        step = (max_size - min_size) / (nb_class - 1),
        class_size = Array(nb_class).fill(0).map((d,i) => min_size + (i * step));

    let disc_result = discretize_to_size(arr_tmp, document.getElementById("Discont_discKind").value, nb_class, min_size, max_size);
    if(!disc_result || !disc_result[2]){
        let opt_nb_class = Math.floor(1 + 3.3 * Math.log10(nb_ft));
        let w = nb_class > opt_nb_class ? "smaller" : "larger"
        swal("Oops...", "Something went wrong with choosen discretization (try with a " + w + " number of class and/or another method)", "error");
        return;
    }
    let serie = disc_result[3],
        breaks = disc_result[2].map(ft => [ft[0], ft[1]]);

    let new_layer_name = check_layer_name(["Disc", layer, field, disc_kind].join('_')),
        result_layer = map.append("g").attr("id", new_layer_name)
            .styles({"stroke-linecap": "round", "stroke-linejoin": "round"})
            .attr("class", "result_layer layer");

    result_data[new_layer_name] = [];
    let data_result = result_data[new_layer_name],
        result_lyr_node = result_layer.node();

    // This is bad and should be replaced by somthing better as we are
    // traversing the whole topojson again and again
    // looking for each "border" from its "id" (though it isn't that slow)
//    let chunk_size = 450 > nb_ft ? nb_ft : 450,
//        _s = 0;
//
//    var compute = function(){
//        for(let i=_s; i<chunk_size; i++){
////            let id_ft = arr_disc[i][0],
////                val = arr_disc[i][1],
//            let [id_ft, val] = arr_disc[i],
//                p_size = class_size[serie.getClass(val)];
//            data_result.push({id: id_ft, disc_value: val, prop_value: p_size});
//            result_layer.append("path")
//                .datum(topo_mesh(_target_layer_file, _target_layer_file.objects[layer], function(a, b){
////                    let a_id = id_ft.split("_")[0], b_id = id_ft.split("_")[1];
//                    let [a_id, b_id] = id_ft.split("_");
//                    return a != b
//                        && (a.id == a_id && b.id == b_id || a.id == b_id && b.id == a_id); }))
//                .attrs({d: path, id: ["feature", i].join('_')})
//                .styles({stroke: user_color, "stroke-width": p_size, "fill": "transparent"})
//                .style("stroke-opacity", val >= threshold ? 1 : 0);
//            result_lyr_node.querySelector(["#feature", i].join('_')).__data__.properties = data_result[i];
//        }
//        _s = chunk_size;
//        if(_s < nb_ft){
//            chunk_size += 450;
//            if(chunk_size > nb_ft) chunk_size = nb_ft;
//            setTimeout(compute, 0);
//            return;
//        }
//    }
//
//    compute();

//    var datums = [];
    var d_res = [];
    var compute = function(){
        for(let i=0; i<nb_ft; i++){
            let id_ft = arr_disc[i][0],
                val = arr_disc[i][1],
                p_size = class_size[serie.getClass(val)],
                datum = topo_mesh(_target_layer_file, _target_layer_file.objects[layer], function(a, b){
                    let a_id = id_ft.split("_")[0], b_id = id_ft.split("_")[1];
                    return a != b
                        && (a.id == a_id && b.id == b_id || a.id == b_id && b.id == a_id); });
            d_res.push([val, {id: id_ft, disc_value: val, prop_value: p_size}, datum, p_size]);
        }
    }

    compute();
    d_res.sort((a,b) => b[0] - a[0]);

    for(let i=0; i<nb_ft; i++){
        let val = d_res[i][0];
        result_layer.append("path")
            .datum(d_res[i][2])
            .attrs({d: path, id: ["feature", i].join('_')})
            .styles({stroke: user_color, "stroke-width": d_res[i][3], "fill": "transparent"})
            .style("stroke-opacity", val >= threshold ? 1 : 0);
        data_result.push(d_res[i][1])
        result_lyr_node.querySelector(["#feature", i].join('_')).__data__.properties = data_result[i];
    }

    current_layers[new_layer_name] = {
        "renderer": "DiscLayer",
        "breaks": breaks,
        "min_display": threshold,
        "type": "Line",
        "rendered_field": field,
        "size": [0.5, 10],
        "is_result": true,
        "fixed_stroke": true,
        "ref_layer_name": layer,
        "fill_color": { "single": user_color },
        "n_features": nb_ft
        };
    create_li_layer_elem(new_layer_name, nb_ft, ["Line", "discont"], "result");
    send_layer_server(new_layer_name, "/layers/add");
    up_legend();
    zoom_without_redraw();
    switch_accordion_section();
//    resolve(true);
//});
}

/**
* Send a geo result layer computed client-side (currently only discontinuities)
* to the server in order to use it as other result layers computed server side
* @param {string} layer_name
* @param {string} url
*/
function send_layer_server(layer_name, url){
    var formToSend = new FormData();
    var JSON_layer = path_to_geojson(layer_name);
    formToSend.append("geojson", JSON_layer);
    formToSend.append("layer_name", layer_name);
    $.ajax({
        processData: false,
        contentType: false,
        url: url,
        data: formToSend,
        global: false,
        type: 'POST',
        error: function(error) {
            display_error_during_computation(); console.log(error);
        },
        success: function(data){
                let key = JSON.parse(data).key;
                current_layers[layer_name].key_name = key;
            }
        });
}

var fields_FlowMap = {
    fill: function(layer){
        if(joined_dataset.length > 0
            && document.getElementById("FlowMap_field_i").options.length == 0){
            let fields = Object.getOwnPropertyNames(joined_dataset[0][0]),
                field_i = d3.select('#FlowMap_field_i'),
                field_j = d3.select('#FlowMap_field_j'),
                field_fij = d3.select('#FlowMap_field_fij');

            fields.forEach(function(field){
                field_i.append("option").text(field).attr("value", field);
                field_j.append("option").text(field).attr("value", field);
                field_fij.append("option").text(field).attr("value", field);
            });
        }
        if(layer){
            let ref_fields = Object.getOwnPropertyNames(user_data[layer][0]),
                join_field = d3.select('#FlowMap_field_join');

            ref_fields.forEach(function(field){
                join_field.append("option").text(field).attr("value", field);
            });
        }
        if(layer || joined_dataset.length > 0)
            d3.selectAll(".params").attr("disabled", null);
    },

    unfill: function(){
        let field_i = document.getElementById('FlowMap_field_i'),
            field_j = document.getElementById('FlowMap_field_j'),
            field_fij = document.getElementById('FlowMap_field_fij'),
            join_field = document.getElementById('FlowMap_field_join');

        for(let i = field_i.childElementCount - 1; i > -1; --i){
            field_i.removeChild(field_i.children[i]);
            field_j.removeChild(field_j.children[i]);
            field_fij.removeChild(field_fij.children[i]);
        }
        unfillSelectInput(join_field);
        document.getElementById("FlowMap_discTable").innerHTML = "";
        d3.selectAll(".params").attr("disabled", true);

    }
};

function make_min_max_tableau(values, nb_class, disc_kind, min_size, max_size, id_parent, breaks){
    document.getElementById(id_parent).innerHTML = "";
    if(values && breaks == undefined){
        let disc_result = discretize_to_size(values, disc_kind, nb_class, min_size, max_size);
        breaks = disc_result[2];
        if(!breaks)
            return false;
    }

    let parent_nd = d3.select("#" + id_parent);

    parent_nd
        .append("p")
        .style("word-spacing", "1.8em")
        .html('Min - Max - Size');
    parent_nd
        .append("div")
        .selectAll("p")
        .data(breaks).enter()
        .append("p")
            .style("margin", "0px")
            .attr("class", "breaks_vals")
            .attr("id", (d,i) => ["line", i].join('_'));

    let selec = parent_nd.selectAll(".breaks_vals");

    for(let i = 0; i < selec._groups[0].length; i++){
        let selection = parent_nd.select('#line_' + i);
        selection
            .insert('input')
            .attr("type", "number")
            .attr("id", "min_class")
            .attr("step", 0.1)
            .attr("value", +breaks[i][0][0].toFixed(2))
            .style("width", "60px")

        selection
            .insert('input')
            .attr("type", "number")
            .attr("id", "max_class")
            .attr("step", 0.1)
            .attr("value", +breaks[i][0][1].toFixed(2))
            .style("width", "60px")

        selection
            .insert('input')
            .attr("type", "number")
            .attr("id", "size_class")
            .attr("step", 0.11)
            .attr("value", +breaks[i][1].toFixed(2))
            .style("margin-left", "20px")
            .style("width", "55px");

        selection
            .insert('span')
            .html(" px");
    }
    let mins = document.getElementById(id_parent).querySelectorAll("#min_class"),
        maxs = document.getElementById(id_parent).querySelectorAll("#max_class");

    for(let i = 0; i < mins.length; i++){
        if(i > 0){
            let prev_ix = i-1;
            mins[i].onchange = function(){ maxs[prev_ix].value = this.value };
        }
        if(i < mins.length - 1){
            let next_ix = i+1;
            maxs[i].onchange = function(){ mins[next_ix].value = this.value };
        }
    }
}

function fetch_min_max_table_value(parent_id){
    var parent_node = parent_id ? document.getElementById(parent_id)
                        : current_functionnality.name == "flow" ? document.getElementById("FlowMap_discTable")
                        : current_functionnality.name == "discont" ? document.getElementById("Discont_discTable")
                        : null;

    if(!parent_node) return;

    let mins = Array.prototype.map.call(parent_node.querySelectorAll("#min_class"), el => +el.value),
        maxs = Array.prototype.map.call(parent_node.querySelectorAll("#max_class"), el => +el.value),
        sizes = Array.prototype.map.call(parent_node.querySelectorAll("#size_class"), el => +el.value),
        nb_class = mins.length,
        comp_fun = (a,b) => a - b;

// Some verification regarding the input values provided by the user :
// - Values are ordered :
    if(mins != mins.sort(comp_fun)
            || maxs != maxs.sort(comp_fun)
            || sizes != sizes.sort(comp_fun)){
        swal("",
             i18next.t("app_page.common.error_values_order"),
             "error");
        return false;
    }

    return {"mins" : mins.sort(comp_fun), "maxs" : maxs.sort(comp_fun), "sizes" : sizes.sort(comp_fun)};
}

function fillMenu_FlowMap(){
    var dv2 = section2.append("p").attr("class", "form-rendering");

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    dv2.append('p').html('<b>' + i18next.t("app_page.func_options.flow.subtitle1") + '</b>');

    var field_i = dv2.append('p').html('<b><i> i </i></b> field ')
                        .insert('select').attr('class', 'params').attr("id", "FlowMap_field_i"),
        field_j = dv2.append('p').html('<b><i> j </i></b> field ')
                        .insert('select').attr('class', 'params').attr("id", "FlowMap_field_j"),
        field_fij = dv2.append('p').html('<b><i> fij </i></b> field ')
                        .insert('select').attr('class', 'params').attr("id", "FlowMap_field_fij");

    var disc_type = dv2.append('p').html(i18next.t("app_page.func_options.flow.discretization"))
                        .insert('select')
                        .attrs({class: 'params', id: "FlowMap_discKind"});
    [
     [i18next.t("app_page.common.equal_interval"), "equal_interval"],
     [i18next.t("app_page.common.quantiles"), "quantiles"],
     [i18next.t("app_page.common.std_dev"), "std_dev"],
     [i18next.t("app_page.common.Q6"), "Q6"],
     [i18next.t("app_page.common.arithmetic_progression"), "arithmetic_progression"],
     [i18next.t("app_page.common.jenks"), "jenks"]
    ].forEach(field => {
            disc_type.append("option").text(field[0]).attr("value", field[1])
        });

    var nb_class_input = dv2.append('p').html(i18next.t("app_page.func_options.flow.nb_class"))
                        .insert('input')
                        .attrs({type: "number", class: 'params', id: "FlowMap_nbClass", min: 1, max: 33, value: 8})
                        .style("width", "50px");

    var values_fij;

    field_fij.on("change", function(){
        let name = this.value,
            nclass = nb_class_input.node().value,
            disc = disc_type.node().value,
            min_size = 0.5,
            max_size = 10;
        values_fij = joined_dataset[0].map(obj => +obj[name]);
        make_min_max_tableau(values_fij, nclass, disc, min_size, max_size, "FlowMap_discTable");
    });

    disc_type.on("change", function(){
        let name = field_fij.node().value,
            nclass = nb_class_input.node().value,
            disc = this.value,
            min_size = 0.5,
            max_size = 10;
        if(disc == "Q6"){
            nclass = 6;
            nb_class_input.attr("value", 6);
        }
        make_min_max_tableau(values_fij, nclass, disc, min_size, max_size, "FlowMap_discTable");
    })

    nb_class_input.on("change", function(){
        let name = field_fij.node().value,
            nclass = this.value,
            disc = disc_type.node().value,
            min_size = 0.5,
            max_size = 10;
        make_min_max_tableau(values_fij, nclass, disc, min_size, max_size, "FlowMap_discTable");
    });

    dv2.append('p').attr("class", "params").attr("id", "FlowMap_discTable").html('');
    dv2.append('p').html('<b>Reference layer fields :</b>');

    var join_field = dv2.append('p').html('join field :')
                        .insert('select')
                        .attr('class', 'params')
                        .attr("id", "FlowMap_field_join");

    var uo_layer_name = dv2.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "FlowMap_output_name");

    let ok_button = dv2.append('button')
                        .attr('id', 'yes')
                        .attr('class', 'params button_st3')
                        .styles({"text-align": "right", margin: "auto"})
                        .text(i18next.t('app_page.func_options.common.render'));

    d3.selectAll(".params").attr("disabled", true);

    ok_button.on("click", function(){
            let ref_layer = Object.getOwnPropertyNames(user_data)[0],
                name_join_field = join_field.node().value,
                formToSend = new FormData(),
                join_field_to_send = {};

            let disc_params = fetch_min_max_table_value("FlowMap_discTable"),
                mins = disc_params.mins,
                maxs = disc_params.maxs,
                sizes = disc_params.sizes,
                nb_class = mins.length,
                user_breaks = [].concat(mins, maxs[nb_class - 1]),
                min_size = min_fast(sizes),
                max_size = max_fast(sizes);

            join_field_to_send[name_join_field] = user_data[ref_layer].map(obj => obj[name_join_field]);

            formToSend.append("json", JSON.stringify({
                "topojson": current_layers[ref_layer].key_name,
                "csv_table": JSON.stringify(joined_dataset[0]),
                "field_i": field_i.node().value,
                "field_j": field_j.node().value,
                "field_fij": field_fij.node().value,
                "join_field": join_field_to_send
                }));

            $.ajax({
                processData: false,
                contentType: false,
                url: '/compute/links',
                data: formToSend,
                type: 'POST',
                error: function(error) { display_error_during_computation(); console.log(error); },
                success: function(data){
                    let new_layer_name = add_layer_topojson(data, {result_layer_on_add: true});
                    if(!new_layer_name) return;
                    let layer_to_render = d3.select("#" + new_layer_name).selectAll("path"),
                        fij_field_name = field_fij.node().value,
                        fij_values = result_data[new_layer_name].map(obj => +obj[fij_field_name]),
                        nb_ft = fij_values.length,
                        serie = new geostats(fij_values);

                    if(user_breaks[0] < serie.min())
                        user_breaks[0] = serie.min();

                    if(user_breaks[nb_class] > serie.max())
                        user_breaks[nb_class] = serie.max();

                    serie.setClassManually(user_breaks);

                    current_layers[new_layer_name].fixed_stroke = true;
                    current_layers[new_layer_name].renderer = "Links";
                    current_layers[new_layer_name].breaks = [];
                    current_layers[new_layer_name].linksbyId = [];
                    current_layers[new_layer_name].size = [min_size, max_size];
                    current_layers[new_layer_name].rendered_field = fij_field_name;
                    current_layers[new_layer_name].ref_layer_name = ref_layer;
                    current_layers[new_layer_name].min_display = 0;

                    let links_byId = current_layers[new_layer_name].linksbyId;

                    for(let i = 0; i < nb_ft; ++i){
                        let val = +fij_values[i];
                        links_byId.push([i, val, sizes[serie.getClass(val)]]);
                    }

                    for(let i = 0; i<nb_class; ++i)
                        current_layers[new_layer_name].breaks.push([[user_breaks[i], user_breaks[i+1]], sizes[i]]);

                    layer_to_render.style('fill-opacity', 0)
                                   .style('stroke-opacity', 0.75)
                                   .style("stroke-width", (d,i) => {return links_byId[i][2]});

                    switch_accordion_section();
                }
            });
    });
}

var fields_Test = {
    fill: function(layer){
        if(layer){
            d3.selectAll(".params").attr("disabled", null);
            let fields = type_col(layer, "number"),
                nb_features = user_data[layer].length,
                field_selec = d3.select("#Test_field");

            fields.forEach(function(field){
                field_selec.append("option").text(field).attr("value", field);
            });
        }
    },
    unfill: function(){
        let field_selec = document.getElementById("#Test_field");
        unfillSelectInput(field_selec);
        d3.selectAll(".params").attr("disabled", true);
    }
};


var fields_PropSymbolChoro = {
    fill: function(layer){
        if(!layer) return;
        d3.selectAll(".params").attr("disabled", null);
        let fields = type_col(layer, "number"),
            nb_features = user_data[layer].length,
            field1_selec = d3.select("#PropSymbolChoro_field_1"),
            field2_selec = d3.select("#PropSymbolChoro_field_2");

        if(fields.length == 0){
            display_error_num_field();
            return;
        }

        fields.forEach(function(field){
            field1_selec.append("option").text(field).attr("value", field);
            field2_selec.append("option").text(field).attr("value", field);
        });

        field1_selec.on("change", function(){
            let field_name = this.value,
                max_val_field = max_fast(user_data[layer].map(obj => +obj[field_name])),
                ref_value_field = document.getElementById("PropSymbolChoro_ref_value");

            ref_value_field.setAttribute("max", max_val_field);
            ref_value_field.setAttribute("value", max_val_field);
        });
        setSelected(field1_selec.node(), fields[0]);
    },

    unfill: function(){
        let field1_selec = document.getElementById("PropSymbolChoro_field_1"),
            field2_selec = document.getElementById("PropSymbolChoro_field_2");

        for(let i = field1_selec.childElementCount - 1; i >= 0; i--){
            field1_selec.removeChild(field1_selec.children[i]);
            field2_selec.removeChild(field2_selec.children[i]);
        }
        d3.selectAll(".params").attr("disabled", true);
    },
    rendering_params: {}
};


function fillMenu_PropSymbolChoro(layer){
    var rendering_params = fields_PropSymbolChoro.rendering_params,
        dv2 = section2.append("p").attr("class", "form-rendering");

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    var field1_selec = dv2.append('p').html(i18next.t("app_page.func_options.choroprop.field1"))
                          .insert('select')
                          .attrs({class: 'params', id: 'PropSymbolChoro_field_1'});

    var ref_size = dv2.append('p').style("display", "inline").html(i18next.t("app_page.func_options.choroprop.fixed_size"))
                     .insert('input')
                     .attrs({type: 'number', class: 'params', id: 'PropSymbolChoro_ref_size'})
                     .attrs({min: 0.1, max: 66.0, value: 10.0, step: "any"})
                     .style("width", "50px");

    dv2.append('label-item').html(' px');

    var ref_value = dv2.append('p').html(i18next.t("app_page.func_options.choroprop.on_value"))
                     .insert('input')
                     .styles({'width': '100px', "margin-left": "10px"})
                     .attrs({type: 'number', class: 'params', id: 'PropSymbolChoro_ref_value'})
                     .attrs({min: 0.1, step: 0.1});

    // Other symbols could probably easily be proposed :
    var symb_selec = dv2.append('p')
                        .html(i18next.t("app_page.func_options.choroprop.symbol_type"))
                        .insert('select')
                        .attr('class', 'params');

    [[i18next.t("app_page.func_options.common.symbol_circle"), "circle"],
     [i18next.t("app_page.func_options.common.symbol_square"), "rect"]].forEach( symb => {
        symb_selec.append("option").text(symb[0]).attr("value", symb[1]);
    });

    var field2_selec = dv2.append('p').html(i18next.t("app_page.func_options.choroprop.field2"))
                        .insert('select').attrs({class: 'params', id: 'PropSymbolChoro_field_2'})
                        .on("change", function(){
                            let field_name = this.value;
                            if(rendering_params[field_name])
                                d3.select("#propChoro_yes").attr("disabled", null);
                            else
                                d3.select("#propChoro_yes").attr("disabled", true);
                        });

    dv2.insert('p').style("margin", "auto").html("")
                .append("button").attr('class', 'params button_disc')
                .styles({"font-size": "0.8em", "text-align": "center"})
                .html(i18next.t("app_page.func_options.common.discretization_choice"))
                .on("click", function(){
                    let layer = Object.getOwnPropertyNames(user_data)[0],
                        selected_field = field2_selec.node().value,
                        opt_nb_class = Math.floor(1 + 3.3 * Math.log10(user_data[layer].length)),
                        conf_disc_box;

                    if(rendering_params[selected_field])
                        conf_disc_box = display_discretization(layer,
                                                               selected_field,
                                                               rendering_params[selected_field].nb_class,
                                                               rendering_params[selected_field].type,
                                                               {schema: rendering_params[selected_field].schema,
                                                                colors: rendering_params[selected_field].colors,
                                                                no_data: rendering_params[selected_field].no_data});
                    else
                        conf_disc_box = display_discretization(layer, selected_field, opt_nb_class, "quantiles", {});

                    conf_disc_box.then(function(confirmed){
                        if(confirmed){
                            dv2.select('#propChoro_yes').attr("disabled", null);
                            rendering_params[selected_field] = {
                                nb_class: confirmed[0], type: confirmed[1],
                                schema: confirmed[5], no_data: confirmed[6],
                                breaks: confirmed[2], colors: confirmed[3],
                                colorsByFeature: confirmed[4],
                                renderer: "PropSymbolsChoro"
                                };
                        } else
                            return;
                    });
                });

    var uo_layer_name = dv2.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "PropSymbolChoro_output_name");

    var ok_button = dv2.insert("p").styles({"text-align": "right", margin: "auto"})
                        .append('button')
                        .attr('id', 'propChoro_yes')
                        .attr('class', 'button_st3')
                        .attr('disabled', true)
                        .text(i18next.t("app_page.func_options.common.render"));

    ok_button.on("click", function(){
        if(!ref_value.node().value) return
        if(rendering_params[field2_selec.node().value]){
            let layer = Object.getOwnPropertyNames(user_data)[0],
                nb_features = user_data[layer].length,
                rd_params = {},
                color_field = field2_selec.node().value,
                new_layer_name = uo_layer_name.node().value;

            new_layer_name = (new_layer_name.length > 0 && /^\w+$/.test(new_layer_name))
                            ? check_layer_name(new_layer_name) : check_layer_name(layer + "_PropSymbolsChoro");

            rd_params.field = field1_selec.node().value;
            rd_params.new_name = new_layer_name;
            rd_params.nb_features = nb_features;
            rd_params.ref_layer_name = layer;
            rd_params.symbol = symb_selec.node().value;
            rd_params.ref_value = +ref_value.node().value;
            rd_params.ref_size = +ref_size.node().value;
            rd_params.fill_color = rendering_params[color_field]['colorsByFeature'];

            let id_map = make_prop_symbols(rd_params),
                colors_breaks = [];

            for(let i = rendering_params[color_field]['breaks'].length-1; i > 0; --i){
                colors_breaks.push([
                        [rendering_params[color_field]['breaks'][i-1], " - ", rendering_params[color_field]['breaks'][i]].join(''),
                        rendering_params[color_field]['colors'][i-1]
                    ]);
            }

            let options_disc = {schema: rendering_params[color_field].schema,
                                colors: rendering_params[color_field].colors,
                                no_data: rendering_params[color_field].no_data}

            current_layers[new_layer_name] = {
                renderer: "PropSymbolsChoro",
                features_order: id_map,
                symbol: rd_params.symbol,
                ref_layer_name: layer,
                options_disc: options_disc,
                rendered_field: field1_selec.node().value,
                rendered_field2: field2_selec.node().value,
                size: [+ref_value.node().value, +ref_size.node().value],
                "stroke-width-const": 1,
                fill_color: { "class": id_map.map(obj => obj[3]) },
                colors_breaks: colors_breaks,
                is_result: true,
                n_features: nb_features
            };
            zoom_without_redraw();
            switch_accordion_section();
        }
    });
    d3.selectAll(".params").attr("disabled", true);
}

function display_error_num_field(){
    swal({title: "",
          text: "The targeted layer doesn't seems to contain any numerical field or contains too many empty values",
          type: "error"});
};

var fields_Choropleth = {
    fill: function(layer){
        if(!layer) return;
        let g_lyr_name = "#"+layer,
            fields = type_col(layer, "number"),
            field_selec = d3.select("#choro_field_1");

        if(fields.length === 0){
            display_error_num_field();
            return;
        }

        fields.forEach(field => {
            field_selec.append("option").text(field).attr("value", field);
        });

        field_selec.on("change", function(){
            document.getElementById("Choro_output_name").value = ["Choro", this.value, layer].join('_');
        });

        d3.selectAll(".params").attr("disabled", null);
    },

    unfill: function(){
        let field_selec = document.getElementById("choro_field_1"),
            nb_fields = field_selec.childElementCount;

        for(let i = nb_fields - 1; i > -1 ; --i){
//            delete this.rendering_params[field_selec.children[i]];
            field_selec.removeChild(field_selec.children[i]);
        }
        d3.selectAll(".params").attr("disabled", true);
    },
    rendering_params: {}
};

var fields_Typo = {
    fill: function(layer){
        if(!layer) return;
        let g_lyr_name = "#" + layer,
            fields = type_col(layer),
            fields_name = Object.getOwnPropertyNames(fields),
            field_selec = d3.select("#Typo_field_1");

        fields_name.forEach(f_name => {
            if(f_name != '_uid' && f_name != "UID")
                field_selec.append("option").text(f_name).attr("value", f_name);
        });

        field_selec.on("change", function(){
            document.getElementById("Typo_output_name").value = ["Typo", this.value, layer].join('_');
        });

        d3.selectAll(".params").attr("disabled", null);
    },
    unfill: function(){
        let field_selec = document.getElementById("Typo_field_1"),
            nb_fields = field_selec.childElementCount;

        for(let i = nb_fields - 1; i > -1 ; --i)
            field_selec.removeChild(field_selec.children[i]);

        d3.selectAll(".params").attr("disabled", true);
    }
};

var fields_Label = {
    fill: function(layer){
        if(!layer) return;
        let g_lyr_name = "#" + layer,
            fields = type_col(layer),
            fields_name = Object.getOwnPropertyNames(fields),
            field_selec = d3.select("#Label_field_1"),
            field_prop_selec = d3.select("#Label_field_prop");

        fields_name.forEach(f_name => {
            field_selec.append("option").text(f_name).attr("value", f_name);
            if(fields[f_name] == "number")
                field_prop_selec.append("option").text(f_name).attr("value", f_name);
        });
        document.getElementById("Label_output_name").value = "Labels_" + layer;
        d3.selectAll(".params").attr("disabled", null);
    },
    unfill: function(){
        let field_selec = document.getElementById("Label_field_1"),
            nb_fields = field_selec.childElementCount;

        for(let i = nb_fields - 1; i > -1 ; --i)
            field_selec.removeChild(field_selec.children[i]);

        d3.selectAll(".params").attr("disabled", true);
    }
};

var fillMenu_Label = function(){
    var dv2 = section2.append("p").attr("class", "form-rendering"),
        rendering_params = {};

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    var field_selec = dv2.append('p')
                            .html(i18next.t("app_page.func_options.label.field"))
                         .insert('select')
                            .attr('class', 'params')
                            .attr('id', 'Label_field_1');

    var prop_selec = dv2.append('p').html(i18next.t("app_page.func_options.label.prop_labels"))
                        .insert("input").attr("type", "checkbox")
                        .on("change", function(){
                            let display_style = this.checked ? "initial" : "none";
                            prop_menu.style("display", display_style);
                        });

    var prop_menu = dv2.append("div");

    var field_prop_selec = prop_menu.append("p").html("Proportional values field ")
                            .insert('select')
                            .attr('class', 'params')
                            .attr('id', 'Label_field_prop');

    var max_font_size = prop_menu.append("p").html("Maximum font size ")
                            .insert("input").attr("type", "number")
                            .attrs({min: 0, max: 70, value: 11, step: "any"});

    var ref_font_size = dv2.append("p").html(i18next.t("app_page.func_options.label.font_size"))
                            .insert("input").attr("type", "number")
                            .attrs({min: 0, max: 35, value: 9, step: "any"});


    var choice_font = dv2.append("p").html(i18next.t("app_page.func_options.label.font_type"))
                            .insert("select")
                            .attr("class", "params")
                            .attr("id", "Label_font_name");

    available_fonts.forEach( name => {
        choice_font.append("option").attr("value", name[1]).text(name[0]);
    });

    var choice_color = dv2.append("p").html(i18next.t("app_page.func_options.label.color"))
                            .insert("input").attr("type", "color")
                            .attr("class", "params")
                            .attr("id", "Label_color")
                            .attr("value", "#000");

    prop_menu.style("display", "none");

    var uo_layer_name = dv2.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "Label_output_name");

    dv2.insert("p").styles({"text-align": "right", margin: "auto"})
        .append("button")
        .attr('id', 'Label_yes')
        .attr('class', 'button_st3')
        .html(i18next.t("app_page.func_options.common.render"))
        .on("click", function(){
            rendering_params["label_field"] = field_selec.node().value;
            if(prop_selec.node().checked){
                rendering_params["prop_field"] = field_prop_selec.node().value;
                rendering_params["max_size"] = max_font_size.node().value;
            }

            let output_name = uo_layer_name.node().value;
            if(!(/^\w+$/.test(output_name))){
                output_name = "";
            }
            rendering_params["font"] = choice_font.node().value;
            rendering_params["ref_font_size"] = ref_font_size.node().value;
            rendering_params["color"] = choice_color.node().value;
            rendering_params["uo_layer_name"] = output_name;
            let layer = Object.getOwnPropertyNames(user_data)[0];
            let new_layer_name = render_label(layer, rendering_params);
            binds_layers_buttons(new_layer_name);
            switch_accordion_section();
         });
    d3.selectAll(".params").attr("disabled", true);
}

let drag_elem_geo = d3.drag()
         .subject(function() {
                var t = d3.select(this);
                return {
                    x: t.attr("x"), y: t.attr("y")
                };
            })
        .on("start", () => {
            d3.event.sourceEvent.stopPropagation();
            d3.event.sourceEvent.preventDefault();
            if(map_div.select("#hand_button").classed("active")) zoom.on("zoom", null);

          })
        .on("end", () => {
            if(map_div.select("#hand_button").classed("active"))
                zoom.on("zoom", zoom_without_redraw);
          })
        .on("drag", function(){
            d3.select(this).attr("x", d3.event.x).attr("y", d3.event.y);
          });

function make_style_box_indiv_label(label_node){
    let current_options = {size: label_node.style.fontSize,
                           content: label_node.textContent,
                           font: "",
                           color: label_node.style.fill};

    if(current_options.color.startsWith("rgb"))
        current_options.color = rgb2hex(current_options.color);

    let new_params = {};
    let self = this;
    var a = make_confirm_dialog("", "Valid", "Cancel", i18next.t("app_page.func_options.label.title_box_indiv"), "styleTextAnnotation")
        .then(function(confirmed){
            if(!confirmed){
                label_node.style.fontsize = current_options.size;
                label_node.textContent = current_options.content;
                label_node.style.fill = current_options.color;
            }
        });
    let box_content = d3.select(".styleTextAnnotation").insert("div");
    box_content.append("p").html(i18next.t("app_page.func_options.label.font_size"))
            .append("input").attrs({type: "number", id: "font_size", min: 0, max: 34, step: "any", value: +label_node.style.fontSize.slice(0,-2)})
            .on("change", function(){
                label_node.style.fontSize = this.value + "px";
            });
    box_content.append("p").html(i18next.t("app_page.func_options.label.content"))
            .append("input").attrs({"value": label_node.textContent, id: "label_content"})
            .on("keyup", function(){
                label_node.textContent = this.value;
            });
    box_content.append("p").html(i18next.t("app_page.func_options.common.color"))
            .append("input").attrs({"type": "color", "value": rgb2hex(label_node.style.fill), id: "label_color"})
            .on("change", function(){
                label_node.style.fill = this.value;
            });
};


var render_label = function(layer, rendering_params){
    let label_field = rendering_params.label_field;
    let txt_color = rendering_params.color;
    let selected_font = rendering_params.font;
    let font_size = rendering_params.ref_font_size + "px"
    let new_layer_data = [];
    let ref_selection = document.getElementById(layer).querySelectorAll("path");
    let layer_to_add = rendering_params.uo_layer_name && rendering_params.uo_layer_name.length > 0
                    ? check_layer_name(rendering_params.uo_layer_name)
                    : check_layer_name("Labels_" + layer);
    let nb_ft = ref_selection.length;
    for(let i=0; i<nb_ft; i++){
        let ft = ref_selection[i].__data__;
        new_layer_data.push({label: ft.properties[label_field], coords: path.centroid(ft)});
    }

    var context_menu = new ContextMenu(),
        getItems = (self_parent) =>  [
            {"name": "Edit style...", "action": () => { make_style_box_indiv_label(self_parent); }},
            {"name": "Delete", "action": () => { self_parent.style.display = "none"; }}
        ];

    map.append("g").attrs({id: layer_to_add, class: "layer result_layer"})
        .selectAll("text")
        .data(new_layer_data).enter()
        .insert("text")
        .attr("id", (d,i) => "Feature_" + i)
        .attr("x", d => d.coords[0])
        .attr("y", d => d.coords[1])
        .attrs({"alignment-baseline": "middle", "text-anchor": "middle"})
        .styles({"font-size": font_size, fill: txt_color})
        .text(d => d.label)
        .on("mouseover", function(){ this.style.cursor = "pointer";})
        .on("mouseout", function(){ this.style.cursor = "initial";})
        .on("dblclick contextmenu", function(){
            context_menu.showMenu(d3.event,
                                  document.querySelector("body"),
                                  getItems(this)); })
        .call(drag_elem_geo);

    create_li_layer_elem(layer_to_add, nb_ft, ["Point", "label"], "result");

    current_layers[layer_to_add] = {
        "n_features": current_layers[layer].n_features,
        "renderer": "Label",
        "symbol": "text",
        "fill_color" : txt_color,
        "rendered_field": label_field,
        "is_result": true,
        "ref_layer_name": layer,
        "default_size": font_size
        };
    up_legend();
    zoom_without_redraw();
    return layer_to_add;
}

var fillMenu_Typo = function(){
    var dv2 = section2.append("p").attr("class", "form-rendering"),
        rendering_params = {};

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    var field_selec = dv2.append('p')
                            .html(i18next.t("app_page.func_options.typo.color_choice"))
                         .insert('select')
                            .attr('class', 'params')
                            .attr('id', 'Typo_field_1');

    dv2.insert('p').style("margin", "auto").html("")
        .append("button")
        .attrs({id: "Typo_class", class: "button_disc params"})
        .styles({"font-size": "0.8em", "text-align": "center"})
        .html(i18next.t("app_page.func_options.typo.color_choice"))
        .on("click", function(){
            let layer = Object.getOwnPropertyNames(user_data)[0];
            let selected_field = field_selec.node().value;
            let new_layer_name = check_layer_name([layer, "Typo", selected_field].join('_'));
            display_categorical_box(layer, selected_field)
                .then(function(confirmed){
                    if(confirmed){
                        d3.select("#Typo_yes").attr("disabled", null)
                        rendering_params = {
                                nb_class: confirmed[0], color_map :confirmed[1], colorByFeature: confirmed[2],
                                renderer:"Categorical", rendered_field: selected_field, new_name: new_layer_name
                            }
                    }
                });
        });

    var uo_layer_name = dv2.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "Typo_output_name");

    dv2.insert("p").styles({"text-align": "right", margin: "auto"})
        .append("button")
        .attr('id', 'Typo_yes')
        .attr("disabled", true)
        .attr('class', 'button_st3')
        .html(i18next.t("app_page.func_options.common.render"))
        .on("click", function(){
            if(rendering_params){
                let layer = Object.getOwnPropertyNames(user_data)[0],
                    output_name = uo_layer_name.node().value;
                if(output_name.length > 0 && /^\w+$/.test(output_name)){
                    rendering_params.new_name = check_layer_name(output_name);
                } else {
                    rendering_params.new_name = check_layer_name([layer, "Typo", field_selec.node().value].join('_'));
                }
                render_categorical(layer, rendering_params);
                switch_accordion_section();
            }
         });
    d3.selectAll(".params").attr("disabled", true);
}

function fillMenu_Choropleth(){
    var dv2 = section2.append("p").attr("class", "form-rendering");
    let rendering_params = fields_Choropleth.rendering_params;

    dv2.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    var field_selec = dv2.append('p')
                            .html(i18next.t("app_page.func_options.common.field"))
                         .insert('select')
                            .attr('class', 'params')
                            .attr('id', 'choro_field_1')
                            .on("change", function(){
                                let field_name = this.value;
                                if(rendering_params[field_name])
                                    d3.select("#choro_yes").attr("disabled", null);
                                else
                                    d3.select("#choro_yes").attr("disabled", true);
                            });

    dv2.insert('p').style("margin", "auto").html("")
        .append("button")
        .attrs({id: "choro_class", class: "button_disc params"})
        .styles({"font-size": "0.8em", "text-align": "center"})
        .html(i18next.t("app_page.func_options.common.discretization_choice"))
        .on("click", function(){
            let layer_name = Object.getOwnPropertyNames(user_data)[0],
                selected_field = field_selec.node().value,
                opt_nb_class = Math.floor(1 + 3.3 * Math.log10(user_data[layer_name].length)),
                conf_disc_box;

            if(rendering_params[selected_field])
                conf_disc_box = display_discretization(layer_name, selected_field,
                                                       rendering_params[selected_field].nb_class,
                                                       rendering_params[selected_field].type,
                                                       {schema: rendering_params[selected_field].schema,
                                                        colors: rendering_params[selected_field].colors,
                                                        no_data: rendering_params[selected_field].no_data});

            else
                conf_disc_box = display_discretization(layer_name,
                                                       selected_field,
                                                       opt_nb_class,
                                                       "quantiles",
                                                       {});

            conf_disc_box.then(function(confirmed){
                if(confirmed){
                    d3.select("#choro_yes").attr("disabled", null);
                    rendering_params[selected_field] = {
                            nb_class: confirmed[0], type: confirmed[1],
                            breaks: confirmed[2], colors: confirmed[3],
                            schema: confirmed[5], no_data: confirmed[6],
                            colorsByFeature: confirmed[4], renderer:"Choropleth",
                            rendered_field: selected_field,
                            new_name: ""
                        };
                }
            });
        });

    dv2.append('p').html(i18next.t("app_page.func_options.common.output"))
        .insert('input')
        .style("width", "200px")
        .attr('class', 'params')
        .attr("id", "Choro_output_name");

    dv2.insert("p").styles({"text-align": "right", margin: "auto"})
        .append("button")
        .attr('id', 'choro_yes')
        .attr("disabled", true)
        .attr('class', 'button_st3')
        .html('Render')
        .on("click", function(){
            if(rendering_params){

                let layer = Object.getOwnPropertyNames(user_data)[0],
                    user_new_layer_name = document.getElementById("Choro_output_name").value,
                    field_to_render = field_selec.node().value;
                rendering_params[field_to_render].new_name = check_layer_name(
                    user_new_layer_name.length > 0 && /^\w+$/.test(user_new_layer_name)
                    ? user_new_layer_name : ["Choro", field_to_render, layer].join('_')
                    );
                render_choro(layer, rendering_params[field_to_render]);
                switch_accordion_section();
            }
         });
    d3.selectAll(".params").attr("disabled", true);
}

var get_first_guess_span = function(){
    let bbox = _target_layer_file.bbox,
        abs = Math.abs;
    let width_km = haversine_dist([bbox[0], abs(bbox[3]) - abs(bbox[1])],
                                  [bbox[2], abs(bbox[3]) - abs(bbox[1])]),
        height_km = haversine_dist([abs(bbox[2]) - abs(bbox[0]), bbox[1]],
                                   [abs(bbox[2]) - abs(bbox[0]), bbox[3]]);
    return Math.round((width_km + height_km) / 2 * 0.02);
}

var fields_Stewart = {
    fill: function(layer){
        let other_layers = get_other_layer_names(),
            mask_selec = d3.select("#stewart_mask");

        unfillSelectInput(mask_selec.node());
        mask_selec.append("option").text("None").attr("value", "None");
        for(let lyr_name of other_layers)
            if(current_layers[lyr_name].type === "Polygon")
                mask_selec.append("option").text(lyr_name).attr("value", lyr_name);

        if(layer){
            let fields = type_col(layer, "number"),
                field_selec = d3.select("#stewart_field"),
                field_selec2 = d3.select("#stewart_field2");

            if(fields.length == 0){
                display_error_num_field();
                return;
            }

            field_selec2.append("option").text(" ").attr("value", "None");
            fields.forEach(field => {
                field_selec.append("option").text(field).attr("value", field);
                field_selec2.append("option").text(field).attr("value", field);
            });
            document.getElementById("stewart_span").value = get_first_guess_span();

            field_selec.on("change", function(){
                document.getElementById("stewart_output_name").value = ["Smoothed", this.value, layer].join('_');
            });

        }
        d3.selectAll(".params").attr("disabled", null);
    },

    unfill: function(){
        let field_selec = document.getElementById("stewart_field"),
            field_selec2 = document.getElementById("stewart_field2"),
            mask_selec = document.getElementById("stewart_mask");
        unfillSelectInput(field_selec);
        unfillSelectInput(field_selec2);
        unfillSelectInput(mask_selec);
        d3.selectAll(".params").attr("disabled", true);
    }
};

function fillMenu_Stewart(){
    var dialog_content = section2.append("div").attr("class", "form-rendering");

    dialog_content.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});


    var field_selec = dialog_content.append('p')
                        .style("margin", "10px 0px 0px")
                        .html(i18next.t("app_page.func_options.smooth.field"))
                        .insert('select')
                        .attrs({class: 'params marg_auto', id: "stewart_field"});

    var field_selec2 = dialog_content.append('p')
                        .style("margin", "10px 0px 0px")
                        .html(i18next.t("app_page.func_options.smooth.divide_field"))
                        .insert('select')
                        .attrs({class: 'params marg_auto', id: "stewart_field2"});

    {
        let p_span = dialog_content
                        .append("p")
                            .style("float", "left")
                            .text(i18next.t("app_page.func_options.smooth.span"));
        var span = p_span.append('input')
                        .style("width", "60px")
                        .attrs({type: 'number', class: 'params', id: "stewart_span", value: 5, min: 0.001, max: 100000.000, step: "any"});
        p_span.insert("span").html(" km");

        var beta = dialog_content
                        .append('p')
                            .styles({"float": "right", "margin-right": "35px"})
                            .html(i18next.t("app_page.func_options.smooth.beta"))
                        .insert('input')
                            .style("width", "60px")
                            .attrs({type: 'number', class: 'params', id: "stewart_beta", value: 2, min: 0, max: 11, step: "any"});

        let p_reso = dialog_content
                        .append('p').text(i18next.t("app_page.func_options.smooth.resolution"));
        var resolution = p_reso.insert('input').style("width", "60px")
                            .attrs({type: 'number', class: 'params', id: "stewart_resolution", min: 1, max: 1000000, step: "any"});
        p_reso.insert("span").html(" km");
    }

    var func_selec = dialog_content.append('p').html(i18next.t("app_page.func_options.smooth.function"))
                                .insert('select').attrs({class: 'params', id: "stewart_func"}),
        nb_class = dialog_content.append("p").html(i18next.t("app_page.func_options.smooth.nb_class"))
                                .insert("input").style("width", "50px")
                                .attrs({type: "number", class: 'params', id: "stewart_nb_class", value: 8, min: 1, max: 22, step: 1}),
//        disc_kind = dialog_content.append("p").html(i18next.t("app_page.func_options.smooth.discretization"))
//                                .insert('select').attrs({class: 'params', id: "stewart_disc_kind"}),
        breaks_val = dialog_content.append("p").html(i18next.t("app_page.func_options.smooth.break_values"))
                                .insert("textarea").attrs({class: 'params', id: "stewart_breaks"})
                                .styles({"width": "260px", "height": "30px"}),
        mask_selec = dialog_content.append('p').html(i18next.t("app_page.func_options.smooth.mask"))
                                .insert('select').attrs({class: 'params', id: "stewart_mask"});

    [['exponential', i18next.t("app_page.func_options.smooth.func_exponential")],
     ['pareto', i18next.t("app_page.func_options.smooth.func_pareto")]].forEach(function(fun_name){
        func_selec.append("option").text(fun_name[1]).attr("value", fun_name[0]);
    });

//    disc_kind.append("option").text(i18next.t("app_page.common.jenks")).attr("value", "jenks");
//    disc_kind.append("option").text(i18next.t("app_page.common.quantiles")).attr("value", "percentiles");
//    disc_kind.append("option").text(i18next.t("app_page.common.equal_interval")).attr("value", "equal_interval");
//    disc_kind.append("option").text(i18next.t("app_page.common.geometric_progression")).attr("value", "prog_geom");

    dialog_content.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "stewart_output_name");

    dialog_content.insert("p").styles({"text-align": "right", margin: "auto"})
        .append('button')
        .attr('id', 'stewart_yes')
        .attr('class', "params button_st3")
        .text(i18next.t('app_page.func_options.common.render'))
        .on('click', function(){
            let formToSend = new FormData(),
                field1_n = field_selec.node().value,
                field2_n = field_selec2.node().value,
                var1_to_send = {},
                var2_to_send = {},
                layer = Object.getOwnPropertyNames(user_data)[0],
                bval = breaks_val.node().value.trim(),
                reso = +resolution.node().value * 1000,
                new_user_layer_name = document.getElementById("stewart_output_name").value;

            bval = bval.length > 0 ? bval.split('-').map(val => +val.trim()) : null;

            if(current_layers[layer].original_fields.has(field1_n))
                var1_to_send[field1_n] = [];
            else
                var1_to_send[field1_n] = user_data[layer].map(i => +i[field1_n]);

            if(field2_n != "None"){
                if(current_layers[layer].original_fields.has(field2_n))
                    var2_to_send[field2_n] = [];
                else
                    var2_to_send[field2_n] = user_data[layer].map(i => +i[field2_n]);
            }

            formToSend.append("json", JSON.stringify({
                "topojson": current_layers[layer].key_name,
                "variable1": var1_to_send,
                "variable2": var2_to_send,
                "span": +span.node().value * 1000,
                "beta": +beta.node().value,
                "typefct": func_selec.node().value,
                "resolution": reso > 0 ? reso : null,
                "nb_class": nb_class.node().value,
//                "disc_kind": disc_kind.node().value,
                "user_breaks": bval,
                "mask_layer": mask_selec.node().value !== "None" ? current_layers[mask_selec.node().value].key_name : ""}));

            $.ajax({
                processData: false,
                contentType: false,
                url: '/compute/stewart',
                data: formToSend,
                type: 'POST',
                error: function(error) { display_error_during_computation(); console.log(error); },
                success: function(data){
                    {
                        let data_split = data.split('|||'),
                            raw_topojson = data_split[0];
                        let options = {result_layer_on_add: true};
                        if(new_user_layer_name.length > 0 &&  /^\w+$/.test(new_user_layer_name)){
                            options["choosed_name"] = new_user_layer_name;
                        }
                        var n_layer_name = add_layer_topojson(raw_topojson, options);
                        if(!n_layer_name)
                            return;
                        var class_lim = JSON.parse(data_split[1]);
                    }
                    var col_pal = getColorBrewerArray(class_lim.min.length, "Oranges"),
                        nb_class = class_lim['min'].length,
                        colors_breaks = [];
                    for(let i = 0; i < nb_class; i++){
                         colors_breaks.push([class_lim['min'][i] + " - " + class_lim['max'][i], col_pal[nb_class - 1 - i]]);
                    }

                    current_layers[n_layer_name].fill_color = {"class": []};
                    current_layers[n_layer_name].renderer = "Stewart";
                    current_layers[n_layer_name].colors_breaks = colors_breaks;
                    current_layers[n_layer_name].rendered_field = field_selec.node().value;
                    current_layers[n_layer_name].color_palette = {name: "Oranges", reversed: true};
                    d3.select("#"+n_layer_name)
                            .selectAll("path")
                            .style("fill", (d,i) => col_pal[nb_class - 1 - i]);
                    // Todo : use the function render_choro to render the result from stewart too
                }
            });
        });
    d3.selectAll(".params").attr("disabled", true);
}

var fields_Anamorphose = {
    fill: function(layer){
        if(!layer) return;
        let fields = type_col(layer, "number"),
            field_selec = d3.select("#Anamorph_field");

        if(fields.length == 0){
            display_error_num_field();
            return;
        }

        d3.selectAll(".params").attr("disabled", null);
        fields.forEach(function(field){
            field_selec.append("option").text(field).attr("value", field);
        });

        field_selec.on("change", function(){
            let field_name = this.value,
                ref_value_field = document.getElementById("Anamorph_opt3");

            document.getElementById("Anamorph_output_name").value = ["Cartogram", this.value, layer].join('_');

            if(ref_value_field){
                let max_val_field = max_fast(user_data[layer].map(obj => +obj[field_name]));
                ref_value_field.setAttribute("max", max_val_field);
                ref_value_field.value = max_val_field;
            }
        });
        setSelected(field_selec.node(), field_selec.node().options[0].value);


    },
    unfill: function(){
        let field_selec = document.getElementById("Anamorph_field");
        d3.selectAll(".params").attr("disabled", true);
        unfillSelectInput(field_selec);
    }
}


function fillMenu_Anamorphose(){
    var make_opt_dorling = function(){

        option1_txt.html(i18next.t("app_page.func_options.cartogram.dorling_symbol"));
        option2_txt.html(i18next.t("app_page.func_options.cartogram.dorling_fixed_size"));
        option1_val = option1_txt.insert("select").attrs({class: "params", id: "Anamorph_opt"});
        option2_val = option2_txt.insert("input").attrs({type: "range", min: 0, max: 30, step: 0.1, value: 10, id: "Anamorph_opt2", class: "params"}).style("width", "50px");
        option2_txt.insert("span").attr("id", "Anamorph_ref_size_txt").html(" 10 px");
        option2_txt2.html(i18next.t("app_page.func_options.cartogram.dorling_on_value"));
        option2_val2 = option2_txt2.insert("input").attr("type", "number").attrs({class: "params", id: "Anamorph_opt3"}).style("width", "100px");

        symbols.forEach(function(symb){
            option1_val.append("option").text(symb[0]).attr("value", symb[1]);
        });

        field_selec.on("change", function(){
            let field_name = this.value,
                layer = Object.getOwnPropertyNames(user_data)[0],
                max_val_field = max_fast(user_data[layer].map(obj => +obj[field_name])),
                ref_value_field = document.getElementById("Anamorph_opt3");

            ref_value_field.setAttribute("max", max_val_field);
            ref_value_field.value = max_val_field;
        });
        setSelected(field_selec.node(), field_selec.node().options[0].value);

        option2_val.on("change", function(){
            document.getElementById("Anamorph_ref_size_txt").innerHTML = this.value + " px";
        });

    };

    var make_opt_iter = function(){
        option1_txt.html(i18next.t("app_page.func_options.cartogram.dougenik_iterations"));
        option2_txt.html("");
        option2_txt2.html("");
        option1_val = option1_txt.insert('input')
                        .attrs({type: 'number', class: 'params', value: 5, min: 1, max: 12, step: 1});
    };

    var make_opt_olson = function(){
        option1_txt.html(i18next.t("app_page.func_options.cartogram.olson_scale_txt"));
        option2_txt.html(i18next.t("app_page.func_options.cartogram.olson_scale_max_scale"));
        option1_val = option1_txt.insert("select").attrs({class: "params", id: "Anamorph_opt"});
        [[i18next.t("app_page.func_options.cartogram.olson_scale_max"), "max"],
         [i18next.t("app_page.func_options.cartogram.olson_scale_mean"), "mean"]].forEach(function(opt_field){
            option1_val.append("option").attr("value", opt_field[1]).text(opt_field[0]);
        });
        option2_val = option2_txt.insert('input')
                        .style("width", "60px")
                        .attrs({type: 'number', class: 'params', id: "Anamorph_opt2", value: 50, min: 0, max: 100, step: 1});
        option2_txt2.html("");
    };

    var dialog_content = section2.append("div").attr("class", "form-rendering");

    dialog_content.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    var algo_selec = dialog_content.append('p').html(i18next.t("app_page.func_options.cartogram.algo")).insert('select').attr('class', 'params'),
        field_selec = dialog_content.append('p').html(i18next.t("app_page.func_options.cartogram.field")).insert('select').attrs({class: 'params', id: 'Anamorph_field'}),
        option1_txt = dialog_content.append('p').attr("id", "Anamorph_opt_txt").html(i18next.t("app_page.func_options.cartogram.dorling_symbol")),
        option1_val = option1_txt.insert("select").attrs({class: "params", id: "Anamorph_opt"}),
        option2_txt = dialog_content.append('p').attr("id", "Anamorph_opt_txt2").html(i18next.t("app_page.func_options.cartogram.dorling_fixed_size")),
        option2_val = option2_txt.insert("input").attrs({type: "range", min: 0, max: 30, step: 0.1, value: 10, id: "Anamorph_opt2", class: "params"}).style("width", "50px"),
        option2_txt2 = dialog_content.append("p").attr("id", "Anamorph_opt_txt3").html(i18next.t("app_page.func_options.cartogram.dorling_on_value")),
        option2_val2 = option2_txt2.insert("input").attrs({type: "number", min: 0, step: 0.1}).attrs({class: "params", id: "Anamorph_opt3"}),
        symbols = [
            [i18next.t("app_page.func_options.common.symbol_circle"), "circle"],
            [i18next.t("app_page.func_options.common.symbol_square"), "rect"]
        ];

    option2_txt.insert("span").attr("id", "Anamorph_ref_size_txt").html(" 10 px");

    option2_val.on("change", function(){
        document.getElementById("Anamorph_ref_size_txt").innerHTML = " " + this.value + " px";
    });

    symbols.forEach(function(symb){
        option1_val.append("option").text(symb[0]).attr("value", symb[1]);
    });

    algo_selec.on("change", function(){
        if(this.value == "dorling")
            make_opt_dorling();
        else if(this.value == "olson")
            make_opt_olson();
        else
            make_opt_iter();
    });

    [['Pseudo-Dorling', 'dorling'],
     ['Dougenik & al. (1985)', 'dougenik'],
     ['Olson (2005)', 'olson']].forEach(function(fun_name){
        algo_selec.append("option").text(fun_name[0]).attr("value", fun_name[1]); });

    var uo_layer_name = dialog_content.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "Anamorph_output_name");

    dialog_content.insert("p").styles({"text-align": "right", margin: "auto"})
        .append("button")
        .attrs({id: 'Anamorph_yes', class: "params button_st3"})
        .html('Compute')
        .on("click", function(){
            let layer = Object.getOwnPropertyNames(user_data)[0],
                algo = algo_selec.node().value,
                nb_features = user_data[layer].length,
                field_name = field_selec.node().value,
                new_user_layer_name = document.getElementById("Anamorph_output_name").value;

            if (algo === "olson"){
                let field_n = field_selec.node().value,
                    layer = Object.getOwnPropertyNames(user_data)[0],
                    ref_size = option1_val.node().value,
                    scale_max = +option2_val.node().value / 100,
                    nb_ft = current_layers[layer].n_features,
                    dataset = user_data[layer];

                let layer_select = document.getElementById(layer).querySelectorAll("path"),
                    sqrt = Math.sqrt,
                    abs = Math.abs,
                    d_values = [],
                    area_values = [];

                for(let i = 0; i < nb_ft; ++i){
                    d_values.push(sqrt(+dataset[i][field_n]));
                    area_values.push(+path.area(layer_select[i].__data__.geometry));
                }

                let mean = d3.mean(d_values),
                    min = d3.min(d_values),
                    max = d3.max(d_values),
                    transform = [];
                if(ref_size == "mean"){
                    let low_ = abs(mean-min),
                        up_ = abs(max-mean),
                        max_dif = low_ > up_ ? low_ : up_;

                    for(let i= 0; i < nb_ft; ++i){
                        let val = d_values[i],
                            scale_area;
                        if(val > mean)
                            scale_area = 1 + scale_max / (max_dif / abs(val-mean));
                        else if(val == mean)
                            scale_area = 1;
                        else
                            scale_area = 1 - scale_max / (max_dif / abs(mean-val));
                        transform.push(scale_area);
                    }
                } else if (ref_size == "max"){
                    let max_dif = abs(max-min);

                    for(let i= 0; i < nb_ft; ++i){
                        let val = d_values[i],
                            val_dif = max_dif / val,
                            scale_area;
                        if(val_dif < 1)
                            scale_area = 1;
                        else
                            scale_area = 1 - (scale_max / val_dif);
                        transform.push(scale_area);
                    }

                }
                let formToSend = new FormData();
                formToSend.append("json",
                    JSON.stringify({
                        topojson: current_layers[layer].key_name,
                        scale_values: transform,
                        field_name: field_n,
                        scale_max: scale_max})
                    );
                $.ajax({
                    processData: false,
                    contentType: false,
                    url: '/compute/olson',
                    data: formToSend,
                    type: 'POST',
                    error: function(error) { display_error_during_computation(); console.log(error); },
                    success: function(result){
                        let options = {result_layer_on_add: true};
                        if(new_user_layer_name.length > 0 && /^\w+$/.test(new_user_layer_name)){
                            options["choosed_name"] = new_user_layer_name;
                        }
                        let n_layer_name = add_layer_topojson(result, options);
                        current_layers[n_layer_name].renderer = "OlsonCarto";
                        current_layers[n_layer_name].rendered_field = field_n;
                        current_layers[n_layer_name].scale_max = scale_max;
                        current_layers[n_layer_name].ref_layer_name = layer;
                        current_layers[n_layer_name].scale_byFeature = transform;
                        d3.select("#" + n_layer_name)
                                .selectAll("path")
                                .style("fill-opacity", 0.8)
                                .style("stroke", "black")
                                .style("stroke-opacity", 0.8);
                    }
                });
            } else if (algo === "dougenik"){
                let formToSend = new FormData(),
                    field_n = field_selec.node().value,
                    layer = Object.getOwnPropertyNames(user_data)[0],
                    var_to_send = {},
                    nb_iter = option1_val.node().value;

                var_to_send[field_name] = [];
                if(!current_layers[layer].original_fields.has(field_name)){
                    let table = user_data[layer],
                        to_send = var_to_send[field_name];
                    for(let i=0, i_len=table.length; i<i_len; ++i){
                        to_send.push(+table[i][field_name])
                    }
                }
                formToSend.append("json", JSON.stringify({
                    "topojson": current_layers[layer].key_name,
                    "var_name": var_to_send,
                    "iterations": nb_iter }));

                $.ajax({
                    processData: false,
                    contentType: false,
                    url: '/compute/carto_doug',
                    data: formToSend,
                    type: 'POST',
                    error: function(error) { display_error_during_computation(); console.log(error); },
                    success: function(data){
                        let options = {result_layer_on_add: true};
                        if(new_user_layer_name.length > 0 && /^\w+$/.test(new_user_layer_name)){
                            options["choosed_name"] = new_user_layer_name;
                        }
                        let n_layer_name = add_layer_topojson(data, options);
                        current_layers[n_layer_name].fill_color = { "random": true };
                        current_layers[n_layer_name].is_result = true;
                        current_layers[n_layer_name]['stroke-width-const'] = 0.8;
                        current_layers[n_layer_name].renderer = "Carto_doug";
                        current_layers[n_layer_name].rendered_field = field_name;
                        d3.select("#" + n_layer_name)
                            .selectAll("path")
                            .style("fill", function(){ return Colors.random(); })
                            .style("fill-opacity", 0.8)
                            .style("stroke", "black")
                            .style("stroke-opacity", 0.8);
                    }
                });
            } else if (algo === "dorling"){
                let fixed_value = +document.getElementById("Anamorph_opt3").value,
                    fixed_size = +document.getElementById("Anamorph_opt2").value,
                    shape_symbol = option1_val.node().value;

                let layer_to_add = check_layer_name(
                        new_user_layer_name.length > 0 && /^\w+$/.test(new_user_layer_name)
                        ? new_user_layer_name : ["DorlingCarto", field_name, layer].join('_')
                    );

                let [features_order, animation] = make_dorling_demers(layer, field_name, fixed_value, fixed_size, shape_symbol, layer_to_add);
                current_layers[layer_to_add] = {
                    "renderer": "DorlingCarto",
                    "type": "Point",
                    "symbol": shape_symbol,
                    "rendered_field": field_name,
                    "size": [fixed_value, fixed_size],
                    "stroke-width-const": 1,
                    "is_result": true,
                    "features_order": features_order,
                    "ref_layer_name": layer,
                    "fill_color": {"random": true},
                    "animation": animation
                    };
                create_li_layer_elem(layer_to_add, current_layers[layer].n_features, ["Point", "cartogram"], "result");
                up_legend();
                zoom_without_redraw();
                switch_accordion_section();
                }
    });
    d3.selectAll(".params").attr("disabled", true);
}


function make_dorling_demers(layer, field_name, fixed_value, fixed_size, shape_symbol, layer_to_add){
    let ref_layer_selection = document.getElementById(layer).querySelectorAll("path"),
        nb_features = current_layers[layer].n_features,
        d_values = [],
        symbol_layer = undefined,
        comp = (a,b) => b[1] - a[1],
        tmp = [];

    for(let i = 0; i < nb_features; ++i){
        let val = +user_data[layer][i][field_name];
        let pt = path.centroid(ref_layer_selection[i].__data__.geometry);
        d_values.push([i, val, pt]);
    }
    d_values = prop_sizer3(d_values, fixed_value, fixed_size, shape_symbol);
    d_values.sort(comp);
    let min_value = +d_values[nb_features - 1][1],
        max_value = +d_values[0][1];

    let nodes = d_values.map(function(d, i){
        let val = (+ref_layer_selection[d[0]].__data__.properties[field_name] - min_value) / (max_value - min_value);
        return {x: d[2][0], y: d[2][1],
                x0: d[2][0], y0: d[2][1],
                r: d[1],
                value: val,
                ix: d[0]};
        });

    let animation = d3.forceSimulation(nodes)
                .force("x", d3.forceX(d => d.x0).strength(0.5))
                .force("y", d3.forceY(d => d.y0).strength(0.5))
                .force("charge", d3.forceManyBody().distanceMin(0).distanceMax(0).strength(d => -0.1 * d.value))
                .force("collide", d3.forceCollide().radius(function(d) { return d.r; }).strength(0.5).iterations(1))
                .on("tick", tick);


    let bg_color = Colors.random(),
        stroke_color = "black";

    if(shape_symbol == "circle") {
        symbol_layer = map.append("g").attr("id", layer_to_add)
                          .attr("class", "result_layer layer")
                          .selectAll("circle")
                          .data(nodes).enter()
                          .append("circle")
                            .attr("id", (d,i) => ["PropSymbol_", i, " feature_", d.ix].join(''))
                            .attr("r", function(d){ return d.r; })
                            .style("fill", function(){ return Colors.random();})
                            .style("stroke", "black");
    } else {
        symbol_layer = map.append("g").attr("id", layer_to_add)
                          .attr("class", "result_layer layer")
                          .selectAll("rect")
                          .data(nodes).enter()
                          .append("rect")
                            .attr("id", (d,i) => ["PropSymbol_", i, " feature_", d.ix].join(''))
                            .attr("height", function(d){ return d.r * 2; })
                            .attr("width", function(d){ return d.r * 2; })
                            .style("fill", function(){ return Colors.random();})
                            .style("stroke", "black");
    }

    function tick(e){
        if(shape_symbol == "circle")
            symbol_layer
                .attr("cx", d => d.x)
                .attr("cy", d => d.y);
        else
            symbol_layer
                .attr("x", d => d.x - d.r)
                .attr("y", d => d.y - d.r)
    }
    return [d_values, animation];
}


var boxExplore = {
    display_table: function(table_name){
        document.querySelector("body").style.cursor = "";
        let the_table = this.layer_names.get(table_name)[1];
        this.current_table = table_name;
        this.nb_features = the_table.length;
        this.columns_names = Object.getOwnPropertyNames(the_table[0]);
        this.columns_headers = [];
        for(let i=0, col=this.columns_names, len = col.length; i<len; ++i)
            this.columns_headers.push({data: col[i], title: col[i]});
        if(this.top_buttons.select("#add_field_button").node()){
            this.top_buttons.select("#add_field_button").remove()
            document.getElementById("table_intro").remove();
            document.getElementById("myTable").remove();
            document.getElementById("myTable_wrapper").remove();
        }
        let self = this;
        this.top_buttons
             .insert("button")
             .attrs({id: "add_field_button", class: "button_st3"})
             .html(i18next.t("app_page.explore_box.button_add_field"))
             .on('click', function(){
                add_table_field(the_table, table_name, self);
             });
        let txt_intro = [
             "<b>", table_name, "</b><br>",
             this.nb_features, " ", i18next.t("app_page.common.feature"), " - ",
             this.columns_names.length, " ", i18next.t("app_page.common.field")
            ].join('');
        this.box_table.append("p").attr('id', 'table_intro').html(txt_intro);
        this.box_table.append("table")
                      .attrs({class: "display compact", id: "myTable"})
                      .style("width", "80%");
        let myTable = $('#myTable').DataTable({
            data: the_table,
            columns: this.columns_headers,
        });
    },
    get_available_tables: function(){
        let target_layer = Object.getOwnPropertyNames(user_data),
            ext_dataset = dataset_name,
            result_layers = Object.getOwnPropertyNames(result_data),
            available = new Map();
        for(let lyr_name of target_layer)
            available.set(lyr_name, [i18next.t("app_page.common.target_layer"), user_data[lyr_name]]);
        if(ext_dataset)
            available.set(dataset_name, [i18next.t("app_page.common.ext_dataset"), joined_dataset[0]]);
        for(let lyr_name of result_layers)
            available.set(lyr_name, [i18next.t("app_page.common.result_layer"), result_data[lyr_name]]);
        return available;
    },
    create: function(){
        this.layer_names = this.get_available_tables()
        if(this.layer_names.size == 0) return;
        this.columns_headers = [];
        this.nb_features = undefined;
        this.columns_names = undefined;
        this.current_table = undefined,
        this.box_table = d3.select("body").append("div")
                            .style("font-size", "0.75em")
                            .attrs({id: "browse_data_box", title: i18next.t("app_page.explore_box.title")});

        let self = this;

        this.top_buttons = this.box_table.append('p')
                                    .styles({"margin-left": "15px", "display": "inline", "font-size": "12px"});

        let select_a_table = this.box_table
                                .append('p').html(i18next.t("app_page.explore_box.available_table"))
                                .insert("select").attr("id", "select_table")
                                .on("change", function(){
                                    self.display_table(this.value);
                                });

        this.layer_names.forEach( (value, key) => {
            let txt = [key, " (", value[0], ")"].join('');
            select_a_table.append("option").attr("value", key).text(txt);
        });
        setSelected(select_a_table.node(), select_a_table.node().options[0].value);
        var deferred = Q.defer();
        $("#browse_data_box").dialog({
            modal:false,
            resizable: true,
            width: Math.round(window.innerWidth * 0.8),
            buttons:[{
                    text: "Close",
                    click: function(){deferred.resolve([true, true]);$(this).dialog("close");}
                        }],
            close: function(event, ui){
                    $(this).dialog("destroy").remove();
                    if(deferred.promise.isPending()) deferred.resolve(false);
                }
        });
        return deferred.promise;
    }
};


var fields_PropSymbol = {
    fill: function(layer){
        if(!layer) return;
        d3.selectAll(".params").attr("disabled", null);
        let fields = type_col(layer, "number"),
            nb_features = user_data[layer].length,
            field_selec = d3.select("#PropSymbol_field_1");

        fields.forEach(function(field){
            field_selec.append("option").text(field).attr("value", field);
        });

        field_selec.on("change", function(){
            let field_name = this.value,
                data_layer = user_data[layer],
                field_values = data_layer.map(obj => +obj[field_name]),
                max_val_field = max_fast(field_values),
                has_neg = has_negative(field_values),
                ref_value_field = document.getElementById("PropSymbol_ref_value").querySelector('input');

            document.getElementById("PropSymbol_output_name").value = ["PropSymbol", this.value, layer].join('_');

            ref_value_field.setAttribute("max", max_val_field);
            ref_value_field.setAttribute("value", max_val_field);
            if(has_neg){
                setSelected(document.getElementById("PropSymbol_nb_colors"), 2);
                document.getElementById("PropSymbol_break_val").value = 0;
            } else {
                setSelected(document.getElementById("PropSymbol_nb_colors"), 1);
            }
        });
        setSelected(field_selec.node(), fields[0]);
    },

    unfill: function(){
        let field_selec = document.getElementById("PropSymbol_field_1");
        unfillSelectInput(field_selec);
        d3.selectAll(".params").attr("disabled", true);
    }
};

function fillMenu_PropSymbol(layer){
    var max_allowed_size = Math.round(h/2 - h/20),
        dialog_content = section2.append("p").attr("class", "form-rendering");

    dialog_content.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});


    var field_selec = dialog_content.append('p')
                          .html(i18next.t("app_page.func_options.common.field"))
                          .insert('select')
                          .attrs({class: 'params', 'id': "PropSymbol_field_1"}),
        ref_size = dialog_content.append('p')
                         .style("display", "inline")
                         .html(i18next.t("app_page.func_options.prop.fixed_size"))
                         .insert('input')
                         .attrs({type: 'number', class: 'params'})
                         .attrs({min: 0.2, max: max_allowed_size, value: 10.0, step: 0.1})
                         .style("width", "50px");

    dialog_content.append('span').html(" px");

    var ref_value = dialog_content.append('p').attr("id", "PropSymbol_ref_value")
                            .html(i18next.t("app_page.func_options.prop.on_value"))
                            .insert('input')
                            .styles({'width': '100px', "margin-left": "10px"})
                            .attrs({type: 'number', class: "params", min: 0.1, step: 0.1});

    var symb_selec = dialog_content
                        .append('p').html(i18next.t("app_page.func_options.prop.symbol_type"))
                        .insert('select').attr('class', 'params');

    [[i18next.t("app_page.func_options.common.symbol_circle"), "circle"],
     [i18next.t("app_page.func_options.common.symbol_square"), "rect"]
    ].forEach(function(symb){
        symb_selec.append("option").text(symb[0]).attr("value", symb[1]);});

    dialog_content.append('p').html(i18next.t("app_page.func_options.prop.symbol_color"));
    let color_par = dialog_content.append('select')
                            .attr("class", "params")
                            .attr("id", "PropSymbol_nb_colors")
                            .style("margin-right", "15px");
    color_par.append("option").attr("value", 1).text(i18next.t("app_page.func_options.prop.options_one_color"));
    color_par.append("option").attr("value", 2).text(i18next.t("app_page.func_options.prop.options_two_colors"));

    color_par.on("change", function(){
        if(this.value == 1){
            fill_color2.style("display", "none");
            fill_color_opt.style("display", "none");
            fill_color_text.style("display", "none");
        } else {
            fill_color2.style("display", null);
            fill_color_opt.style("display", null);
            fill_color_text.style("display", "inline");
        }
    });
    var col_p = dialog_content.append("p").style("display", "inline");
    var fill_color = col_p.insert('input')
                                .attr('type', 'color')
                                .attrs({class: "params", id: "PropSymbol_color1", value: ColorsSelected.random()});
    var fill_color2 = col_p.insert('input')
                                .attr('type', 'color')
                                .style("display", "none")
                                .attrs({class: "params", id: "PropSymbol_color2", value: ColorsSelected.random()});
    var col_b = dialog_content.insert("p");
    var fill_color_text = col_b.insert("span").style("display", "none")
                                .html(i18next.t("app_page.func_options.prop.options_break_two_colors"));
    var fill_color_opt = col_b.insert('input')
                                .attr('type', 'number')
                                .attrs({class: "params", "id": "PropSymbol_break_val"})
                                .style("display", "none")
                                .style("width", "75px");

    var uo_layer_name = dialog_content.append('p').html(i18next.t("app_page.func_options.common.output"))
        .insert('input')
        .style("width", "200px")
        .attr('class', 'params')
        .attr("id", "PropSymbol_output_name");

    dialog_content.insert("p").styles({"text-align": "right", margin: "auto"})
        .append('button')
        .attr('id', 'yes')
        .attr("class", "params button_st3")
        .html(i18next.t('app_page.func_options.common.render'))
        .on("click", function(){
            let layer = Object.getOwnPropertyNames(user_data)[0],
                nb_features = user_data[layer].length,
                field_to_render = field_selec.node().value,
                user_new_layer_name = uo_layer_name.node().value,
                new_layer_name = check_layer_name(user_new_layer_name.length > 0 && /^\w+$/.test(user_new_layer_name) ? user_new_layer_name : ["PropSymbols", field_to_render, layer].join('_')),
                rendering_params = { "field": field_to_render,
                                     "nb_features": nb_features,
                                     "new_name": new_layer_name,
                                     "ref_layer_name": layer,
                                     "symbol": symb_selec.node().value,
                                     "ref_size": +ref_size.node().value,
                                     "ref_value": +ref_value.node().value,
                                     "fill_color": fill_color.node().value };
            if(+color_par.node().value == 2){
                rendering_params["break_val"] = +fill_color_opt.node().value;
                rendering_params["fill_color"] = {"two" : [fill_color.node().value, fill_color2.node().value]};
            }
            console.log(rendering_params)
            make_prop_symbols(rendering_params);
            binds_layers_buttons(new_layer_name);
            zoom_without_redraw();
            switch_accordion_section();

        });
    d3.selectAll(".params").attr("disabled", true);
}


function make_prop_symbols(rendering_params){
    let layer = rendering_params.ref_layer_name,
        field = rendering_params.field,
        nb_features = rendering_params.nb_features,
        values_to_use = rendering_params.values_to_use,
        _values = [],
        abs = Math.abs,
        comp = function(a,b){ return abs(b[1])-abs(a[1]); },
        ref_layer_selection = document.getElementById(layer).querySelectorAll("path"),
        ref_size = rendering_params.ref_size,
        ref_value = rendering_params.ref_value,
        symbol_type = rendering_params.symbol,
        layer_to_add = rendering_params.new_name,
        zs = d3.zoomTransform(svg_map).k;

    let res_data = [];
    if(values_to_use)
        for(let i = 0; i < nb_features; ++i){
//            let centr = path.centroid(ref_layer_selection[i].__data__);
            _values.push([i, +values_to_use[i],
                           path.centroid(ref_layer_selection[i].__data__)]);
        }
    else {
        let data_table = user_data[layer];
        for(let i = 0; i < nb_features; ++i){
//            let centr = path.centroid(ref_layer_selection[i].__data__);
            _values.push([i, +data_table[i][field],
                           path.centroid(ref_layer_selection[i].__data__)]);
        }
    }

    if(rendering_params.break_val != undefined && rendering_params.fill_color.two){
        let col1 = rendering_params.fill_color.two[0],
            col2 = rendering_params.fill_color.two[1];
        var tmp_fill_color = [];
        for(let i = 0; i < nb_features; ++i){
            tmp_fill_color.push(_values[i][1] > rendering_params.break_val ? col2 : col1)
        }
    } else {
        var tmp_fill_color = rendering_params.fill_color;
    }

    var d_values = prop_sizer3(_values, ref_value, ref_size, symbol_type);
    d_values.sort(comp);

    /*
        Values have been sorted (descendant order on the absolute values) to have larger symbols
        displayed under the smaller, so now d_values is an array like :
        [
         [id_ref_feature, value, [x_centroid, y_centroid]],
         [id_ref_feature, value, [x_centroid, y_centroid]],
         [id_ref_feature, value, [x_centroid, y_centroid]],
         [...]
        ]
    */

    if(!(rendering_params.fill_color instanceof Array) && !(rendering_params.fill_color.two)){
        for(let i=0; i<nb_features; ++i)
            d_values[i].push(rendering_params.fill_color);
    } else {
        for(let i=0; i<nb_features; ++i){
//            let idx = d_values[i][0];
            d_values[i].push(tmp_fill_color[d_values[i][0]]);
        }
    }

    var symbol_layer = map.append("g").attr("id", layer_to_add)
                          .attr("class", "result_layer layer");

    if(symbol_type === "circle"){
        for(let i = 0; i < nb_features; i++){
            let params = d_values[i];
            let id_ref = params[0];
            symbol_layer.append('circle')
                .attr('cx', params[2][0])
                .attr("cy", params[2][1])
                .attr("r", params[1])
                .attr("id", ["PropSymbol_", i , " feature_", id_ref].join(''))
                .style("fill", params[3])
                .style("stroke", "black")
                .style("stroke-width", 1 / zs);
            let res_obj = {};
            res_obj["uid"] = i;
            res_obj["id_layer_reference"] = id_ref;
            res_obj[field] = _values[id_ref][1];
            res_data.push(res_obj);
        }
    } else if(symbol_type === "rect"){
        for(let i = 0; i < nb_features; i++){
            let params = d_values[i],
                id_ref = params[0],
                size = params[1];

            symbol_layer.append('rect')
                .attr('x', params[2][0] - size/2)
                .attr("y", params[2][1] - size/2)
                .attr("height", size)
                .attr("width", size)
                .attr("id", ["PropSymbol_", i , " feature_", params[0]].join(''))
                .style("fill", params[3])
                .style("stroke", "black")
                .style("stroke-width", 1 / zs);
            let res_obj = {};
            res_obj["uid"] = i;
            res_obj["id_layer_reference"] = id_ref;
            res_obj[field] = _values[id_ref][1];
            res_data.push(res_obj);
        };
    }

    let fill_color = rendering_params.fill_color.two != undefined
                    ? rendering_params.fill_color
                    : rendering_params.fill_color instanceof Array
                    ? {"class": rendering_params.fill_color}
                    : {"single" : rendering_params.fill_color};
    current_layers[layer_to_add] = {
        "n_features": nb_features,
        "renderer": rendering_params.renderer || "PropSymbols",
        "symbol": symbol_type,
        "fill_color" : fill_color,
        "rendered_field": field,
        "size": [ref_value, ref_size],
        "stroke-width-const": 1,
        "is_result": true,
        "ref_layer_name": layer,
        "features_order": d_values
        };
    if(rendering_params.break_val != undefined){
        current_layers[layer_to_add]["break_val"] = rendering_params.break_val;
    }
    up_legend();
    result_data[layer_to_add] = res_data;
    create_li_layer_elem(layer_to_add, nb_features, ["Point", "prop"], "result");
    return d_values;
}

var fields_griddedMap = {
    fill: function(layer){
        if(!layer) return;

        let fields = type_col(layer, "number"),
            field_selec = d3.select("#Gridded_field");

        fields.forEach(function(field){
            field_selec.append("option").text(field).attr("value", field); });
        field_selec.on("change", function(){
            document.getElementById("Gridded_output_name").value = ["Gridded", this.value, layer].join('_');
        });
        d3.selectAll(".params").attr("disabled", null);
        document.getElementById("Gridded_cellsize").value = get_first_guess_span();
    },
    unfill: function(){
        let field_selec = document.getElementById("Gridded_field");
        unfillSelectInput(field_selec);
        d3.selectAll(".params").attr("disabled", true);
    }
}

function fillMenu_griddedMap(layer){
    var dialog_content = section2.append("p").attr("class", "form-rendering");

    dialog_content.append("img")
        .attrs({id: "btn_info", src: "/static/img/Information.png", width: "17", height: "17", alt: "Informations",
                class: "help_tooltip", "data-tooltip_help": " "})
        .styles({"cursor": "pointer", "vertical-align": "bottom", "float": "right"});

    var field_selec = dialog_content.append('p')
                        .html(i18next.t("app_page.func_options.common.field"))
                        .insert('select')
                        .attrs({class: 'params', id: "Gridded_field"});

    var cellsize = dialog_content.append('p')
                        .html(i18next.t("app_page.func_options.grid.cellsize"))
                        .insert('input')
                        .style("width", "100px")
                        .attrs({
                            type: 'number', class: 'params', id: "Gridded_cellsize",
                            value: 10.0, min: 1.000, max: 7000, step: "any"});

    var grid_shape = dialog_content.append('p')
                        .html(i18next.t("app_page.func_options.grid.shape"))
                        .insert('select')
                        .attrs({class: 'params', id: "Gridded_shape"});

    var col_pal = dialog_content.append('p')
                        .html(i18next.t("app_page.func_options.grid.coloramp"))
                        .insert('select')
                        .attr('class', 'params');

    ['Blues', 'BuGn', 'BuPu', 'GnBu', 'OrRd', 'PuBu', 'PuBuGn',
    'PuRd', 'RdPu', 'YlGn', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds']
    .forEach( d => { col_pal.append("option").text(d).attr("value", d); });

    ['Square', 'Diamond', 'Hexagon'].forEach( d => {
        grid_shape.append("option").text(d).attr("value",d);
    });

    var uo_layer_name = dialog_content.append('p').html(i18next.t("app_page.func_options.common.output"))
                        .insert('input')
                        .style("width", "200px")
                        .attr('class', 'params')
                        .attr("id", "Gridded_output_name");

    dialog_content.insert("p")
        .styles({"text-align": "right", margin: "auto"})
        .append('button')
        .attr("class", "params button_st3")
        .attr('id', 'Gridded_yes')
        .html(i18next.t('app_page.func_options.common.render'))
        .on("click", function(){
            let field_n = field_selec.node().value,
                layer = Object.getOwnPropertyNames(user_data)[0],
                formToSend = new FormData(),
                var_to_send = {},
                new_user_layer_name = document.getElementById("Gridded_output_name").value;

            if(current_layers[layer].original_fields.has(field_n))
                var_to_send[field_n] = [];
            else
                var_to_send[field_n] = user_data[layer].map(i => +i[field_n]);

            formToSend.append("json", JSON.stringify({
                "topojson": current_layers[layer].key_name,
                "var_name": var_to_send,
                "cellsize": +cellsize.node().value * 1000,
                "grid_shape": grid_shape.node().value
                }));
            $.ajax({
                processData: false,
                contentType: false,
                url: '/compute/gridded',
                data: formToSend,
                type: 'POST',
                error: function(error) { display_error_during_computation(); console.log(error); },
                success: function(data){
                    let options = {result_layer_on_add: true};
                    if(new_user_layer_name.length > 0 &&  /^\w+$/.test(new_user_layer_name)){
                        options["choosed_name"] = new_user_layer_name;
                    }

                    let n_layer_name = add_layer_topojson(data, options);
                    if(!n_layer_name)
                        return;
                    let res_data = result_data[n_layer_name],
                        nb_ft = res_data.length,
                        opt_nb_class = Math.floor(1 + 3.3 * Math.log10(nb_ft)),
                        d_values = [];

                    for(let i=0; i < nb_ft; i++){
                        d_values.push(+res_data[i]["densitykm"])
                    }

                    current_layers[n_layer_name].renderer = "Gridded";
                    let disc_result = discretize_to_colors(d_values, "quantiles", opt_nb_class, col_pal.node().value),
                        rendering_params = {
                            nb_class: opt_nb_class,
                            type: "quantiles",
                            schema: [col_pal.node().value],
                            breaks: disc_result[2],
                            colors: disc_result[3],
                            colorsByFeature: disc_result[4],
                            renderer: "Gridded",
                            rendered_field: "densitykm",
                                };
                    render_choro(n_layer_name, rendering_params);
                }
            });
        });
    d3.selectAll(".params").attr("disabled", true);
}

function copy_layer(ref_layer, new_name, type_result){
    svg_map.appendChild(document.getElementById("svg_map").querySelector("#"+ref_layer).cloneNode(true));
    svg_map.lastChild.setAttribute("id", new_name);
    svg_map.lastChild.setAttribute("class", "result_layer layer");
    current_layers[new_name] = {n_features: current_layers[ref_layer].n_features,
                             type: current_layers[ref_layer].type,
                             ref_layer_name: ref_layer};
    let selec_src = document.getElementById(ref_layer).querySelectorAll("path");
    let selec_dest = document.getElementById(new_name).querySelectorAll("path");
    for(let i = 0; i < selec_src.length; i++)
        selec_dest[i].__data__ = selec_src[i].__data__;
    up_legend();
    create_li_layer_elem(new_name, current_layers[new_name].n_features, [current_layers[new_name].type, type_result], "result");
}

function render_categorical(layer, rendering_params){
    if(rendering_params.new_name){
        copy_layer(layer, rendering_params.new_name, "typo");
        layer = rendering_params.new_name;
    }
    map.select("#" + layer).style("opacity", 1)
            .style("stroke-width", 0.75/d3.zoomTransform(svg_map).k + "px");

    var colorsByFeature = rendering_params.colorByFeature,
        color_map = rendering_params.color_map,
        field = rendering_params.rendered_field,
        layer_to_render = map.select("#" + layer).selectAll("path");

    layer_to_render.style("fill", (d,i) => colorsByFeature[i])
                    .style("fill-opacity", 0.9)
                    .style("stroke-opacity", 0.9)
                    .style("stroke", "black");
    current_layers[layer].renderer = rendering_params['renderer'];
    current_layers[layer].rendered_field = field;
    current_layers[layer].fill_color = {"class": rendering_params['colorByFeature']};
    current_layers[layer]['stroke-width-const'] = 0.75;
    current_layers[layer].is_result = true;
    current_layers[layer].color_map = color_map;
    zoom_without_redraw();
}

function create_li_layer_elem(layer_name, nb_ft, type_geom, type_layer){
    let _list_display_name = get_display_name_on_layer_list(layer_name),
        layers_listed = layer_list.node(),
        li = document.createElement("li");

    li.setAttribute("layer_name", layer_name);
    if(type_layer == "result"){
        li.setAttribute("class", ["ui-state-default sortable_result ", layer_name].join(''));
        li.setAttribute("layer-tooltip",
                ["<b>", layer_name, "</b> - ", type_geom[0] ," - ", nb_ft, " features"].join(''));
        li.innerHTML = ['<div class="layer_buttons">', sys_run_button_t2,
                        button_trash, button_zoom_fit, eye_open0, button_legend,
                        button_result_type.get(type_geom[1]), "</div> ", _list_display_name].join('');
    } else if(type_layer == "sample"){
        li.setAttribute("class", ["ui-state-default ", layer_name].join(''));
        li.setAttribute("layer-tooltip",
                ["<b>", layer_name, "</b> - Sample layout layer"].join(''));
        li.innerHTML = ['<div class="layer_buttons">', button_style,
                        button_trash, button_zoom_fit, eye_open0,
                        button_type.get(type_geom), "</div> ", _list_display_name].join('');
    }
    layers_listed.insertBefore(li, layers_listed.childNodes[0]);
    binds_layers_buttons(layer_name);
}
// Function to render the `layer` according to the `rendering_params`
// (layer should be the name of group of path, ie. not a PropSymbol layer)
// Currently used fo "choropleth", "MTA - relative deviations", "gridded map" functionnality
function render_choro(layer, rendering_params){
    if(rendering_params.new_name){
        copy_layer(layer, rendering_params.new_name, "choro");
        //Assign the same key to the cloned layer so it could be used transparently on server side
        // after deletion of the reference layer if needed :
        current_layers[rendering_params.new_name].key_name = current_layers[layer].key_name;
        layer = rendering_params.new_name;
    }
    let breaks = rendering_params["breaks"];
    let options_disc = {schema: rendering_params.schema,
                        colors: rendering_params.colors,
                        no_data: rendering_params.no_data}
    var layer_to_render = map.select("#"+layer).selectAll("path");
    map.select("#"+layer)
            .style("opacity", 1)
            .style("stroke-width", 0.75/d3.zoomTransform(svg_map).k, + "px");
    layer_to_render.style('fill-opacity', 0.9)
                   .style("fill", function(d, i){ return rendering_params['colorsByFeature'][i] })
                   .style('stroke-opacity', 0.9)
                   .style("stroke", "black");
    current_layers[layer].renderer = rendering_params['renderer'];
    current_layers[layer].rendered_field = rendering_params['rendered_field'];
    current_layers[layer].fill_color = {"class": rendering_params['colorsByFeature']};
    current_layers[layer]['stroke-width-const'] = 0.75;
    current_layers[layer].is_result = true;
    current_layers[layer].options_disc = options_disc;
    let colors_breaks = [];
    for(let i = breaks.length-1; i > 0; --i){
        colors_breaks.push([
                [breaks[i-1], " - ", breaks[i]].join(''),
                rendering_params['colors'][i-1]
            ]);
        }
    current_layers[layer].colors_breaks = colors_breaks;
    zoom_without_redraw();
}

// Function returning the name of all current layers (excepted the sample layers used as layout)
function get_other_layer_names(){
    let other_layers = Object.getOwnPropertyNames(current_layers),
        tmp_idx = null;

    tmp_idx = other_layers.indexOf("Graticule");
    if(tmp_idx > -1) other_layers.splice(tmp_idx, 1);

    tmp_idx = other_layers.indexOf("Simplified_land_polygons");
    if(tmp_idx > -1) other_layers.splice(tmp_idx, 1);

    tmp_idx = other_layers.indexOf("Sphere");
    if(tmp_idx > -1) other_layers.splice(tmp_idx, 1);

    return other_layers;
}

// Function to remove each node (each <option>) of a <select> HTML element :
function unfillSelectInput(select_node){
    for(let i = select_node.childElementCount - 1; i > -1; i--)
        select_node.removeChild(select_node.children[i]);
}

function prop_sizer3_e(arr, fixed_value, fixed_size, type_symbol){
    let pi = Math.PI,
        abs = Math.abs,
        sqrt = Math.sqrt,
        arr_len = arr.length,
        res = [];

    if(!fixed_value || fixed_value == 0)
        fixed_value = max_fast(arr);

    if(type_symbol == "circle"){
        let smax = fixed_size * fixed_size * pi;
        for(let i=0; i < arr_len; ++i)
            res.push(sqrt(abs(arr[i]) * smax / fixed_value) / pi);

    } else {
        let smax = fixed_size * fixed_size;
        for(let i=0; i < arr_len; ++i)
            res.push(sqrt(abs(arr[i]) * smax / fixed_value));
    }
    return res;
}

function prop_sizer3(arr, fixed_value, fixed_size, type_symbol){
    let pi = Math.PI,
        abs = Math.abs,
        sqrt = Math.sqrt,
        arr_len = arr.length,
        res = [];

    if(!fixed_value || fixed_value == 0)
        fixed_value = max_fast(arr);

    if(type_symbol == "circle") {
        let smax = fixed_size * fixed_size * pi;
        for(let i=0; i < arr_len; ++i){
            let val = arr[i];
            res.push(
                [val[0], sqrt(abs(val[1]) * smax / fixed_value) / pi, val[2]]
                );
        }
    } else {
        let smax = fixed_size * fixed_size;
        for(let i=0; i < arr_len; ++i){
            let val = arr[i];
            res.push(
                [val[0], sqrt(abs(val[1]) * smax / fixed_value), val[2]]
                );
        }
    }
    return res
}

var type_col = function(layer_name, target, skip_if_empty_values=false){
// Function returning an object like {"field1": "field_type", "field2": "field_type"},
//  for the fields of the selected layer.
// If target is set to "number" it should return an array containing only the name of the numerical fields
// ------------------- "string" ---------------------------------------------------------non-numerial ----
    var table = user_data.hasOwnProperty(layer_name) ? user_data[layer_name]
                    : result_data.hasOwnProperty(layer_name) ? result_data[layer_name]
                    : joined_dataset[0],
        fields = Object.getOwnPropertyNames(table[0]),
        nb_features = table.length,
        deepth_test = 100 < nb_features ? 100 : nb_features - 1,
        result = {},
        field = undefined,
        tmp_type = undefined;
    for(let j = 0, len = fields.length; j < len; ++j){
        field = fields[j];
        result[field] = [];
        for(let i=0; i < deepth_test; ++i){
            tmp_type = typeof table[i][field];
            if(tmp_type == "string" && table[i][field].length == 0)
                tmp_type = "empty";
            else if(tmp_type === "string" && !isNaN(Number(table[i][field])))
                tmp_type = "number";
            else if(tmp_type === "object" && isFinite(table[i][field]))
                tmp_type = "empty"
            result[fields[j]].push(tmp_type);
        }
    }

    for(let j = 0, len = fields.length; j < len; ++j){
        field = fields[j];
        if(result[field].every(function(ft){return ft === "number" || ft === "empty";})
            && result[field].indexOf("number") > -1)
            result[field] = "number";
        else
            result[field] = "string";
    }
    if(target){
        let res = [];
        for(let k in result)
            if(result[k] === target && k != "_uid")
                res.push(k);
        return res;
    } else
        return result;
}

/**
* Return a basic operator as a function, each one taking two numbers in arguments
*
* @param {String} operator
* @return {function}
*/
function get_fun_operator(operator){
    let operators = new Map([
        ["+", function(a, b){ return a + b; }],
        ["-", function(a, b){ return a - b; }],
        ["/", function(a, b){ return a / b; }],
        ["*", function(a, b){ return a * b; }],
        ["^", function(a, b){ return Math.pow(a, b); }],
    ]);
    return operators.get(operator);
}

/**
* Function to add a field to the targeted layer
*
* @param {Array} table - A reference to the "table" to work on
* @param {String} layer - The name of the layer
* @param {Object} parent - A reference to the parent box in order to redisplay the table according to the changes
*
*/
function add_table_field(table, layer_name, parent){
    function check_name(){
        if(regexp_name.test(this.value) || this.value == "")
            chooses_handler.new_name = this.value;
        else { // Rollback to the last correct name  :
            this.value = chooses_handler.new_name;
            swal({title: i18next.t("Error") + "!",
                  text: i18next.t("Unauthorized character!"),
                  type: "error",
                  allowOutsideClick: false});
        }
    };

    function compute_and_add(){
        let options = chooses_handler,
            fi1 = options.field1,
            fi2 = options.field2,
            new_name_field = options.new_name,
            operation = options.operator,
            opt_val = options.opt_val;

        if(!regexp_name.test(new_name_field)){
            swal({title: "",
                  text: i18next.t("app_page.explore_box.add_field_box.invalid_name"),
                  type: "error",
                  allowOutsideClick: false});
            return Promise.reject("Invalid name");
        }

        if(options.type_operation === "math_compute" && table.length > 3200){
            let formToSend = new FormData();
            let var1 = [],
                var2 = (fi2 == "user_const_value") ? +opt_val : [];
            for(let i=0; i<table.length; i++){
                var1.push(+table[i][fi1])
            }
            if(fi2 != "user_const_value"){
                for(let i=0; i<table.length; i++){
                    var2.push(+table[i][fi2])
                }
            }
            formToSend.append('var1', JSON.stringify(var1));
            formToSend.append('var2', JSON.stringify(var2));
            formToSend.append('operator', operation);
            return request_data("POST", "/helpers/calc", formToSend).then(function(e){
                let data = JSON.parse(e.target.responseText);
                for(let i=0; i<table.length; i++)
                    table[i][new_name_field] = data[i];

                return true;
            });
        }
        else if(options.type_operation === "math_compute"){
            let math_func = get_fun_operator(operation)
            if(fi2 != "user_const_value"){
                for(let i=0; i<table.length; i++){
                    if(table[i][fi1] != null && table[i][fi2] != null){
                        table[i][new_name_field] = math_func(+table[i][fi1], +table[i][fi2]);
                    } else {
                        table[i][new_name_field] = null;
                    }
                }
            } else {
                opt_val = +opt_val;
                for(let i=0; i<table.length; i++){
                    if(table[i][fi1] != null){
                        table[i][new_name_field] = math_func(+table[i][fi1], opt_val);
                    } else {
                        table[i][new_name_field] = null;
                    }
                }
            }
            return Promise.resolve(true);
        } else {
            if(operation == "truncate"){
                for(let i=0; i < table.length; i++)
                    table[i][new_name_field] = table[i][fi1].substring(0, +opt_val);

            } else if (operation == "concatenate"){
                for(let i=0; i < table.length; i++)
                    table[i][new_name_field] = [table[i][fi1], table[i][fi2]].join(opt_val);
            }
            return Promise.resolve(true);
        }
        return Promise.reject("Unknown error")
    };


    function refresh_type_content(type){
        field1.node().remove(); operator.node().remove(); field2.node().remove();
        field1 = div1.append("select")
                    .on("change", function(){ chooses_handler.field1 = this.value; });
        operator = div1.append("select")
                    .on("change", function(){
                        chooses_handler.operator=this.value;
                        refresh_subtype_content(chooses_handler.type_operation, this.value);
                        });
        field2 = div1.append("select")
                    .on("change", function(){
                        chooses_handler.field2 = this.value;
                        if(this.value == "user_const_value"){
                            val_opt.style("display", null);
                        }
                    });
        if(type == "math_compute"){
            math_operation.forEach(function(op){ operator.append("option").text(op).attr("value", op); })
            for(let k in fields_type){
                if(fields_type[k] == "number"){
                    field1.append("option").text(k).attr("value", k);
                    field2.append("option").text(k).attr("value", k);
                }
            }
            field2.append("option").text("Constant value...").attr("value", "user_const_value");
            val_opt.style("display", "none");
            txt_op.text("");
            chooses_handler.operator = math_operation[0];
        } else {
            string_operation.forEach(function(op){
                operator.append("option").text(op[0]).attr("value", op[1]);
            })
            for(let k in fields_type){
                if(fields_type[k] == "string"){
                    field1.append("option").text(k).attr("value", k);
                    field2.append("option").text(k).attr("value", k);
                }
            }
            val_opt.style("display", null);
            txt_op.html(i18next.t("app_page.explore_box.add_field_box.join_char"));
            chooses_handler.operator = string_operation[0];
        }
        chooses_handler.field1 = field1.node().value;
        chooses_handler.field2 = field2.node().value;
    };

    function refresh_subtype_content(type, subtype){
        if(type != "string_field"){
            if(field2.node().value != "user_const_value"){
                val_opt.style("display", "none");
                txt_op.text("");
            }
        } else {
            if(subtype == "truncate"){
                txt_op.html(i18next.t("app_page.explore_box.add_field_box.keep_char"));
                field2.attr("disabled", true);
            } else {
                txt_op.html("app_page.explore_box.add_field_box.join_char");
                field2.attr("disabled", null);
            }
        }
    };

    var chooses_handler = {
        field1: undefined, field2: undefined,
        operator: undefined, type_operation: undefined,
        opt_val: undefined, new_name: 'NewFieldName'
        }

    var box = make_confirm_dialog("", "Valid", "Cancel", i18next.t("app_page.explore_box.button_add_field"),
                    "addFieldBox", 430 < w ? 430 : undefined, 280 < h ? 280 : undefined).then(function(valid){
            if(valid){
                document.querySelector("body").style.cursor = "wait";
                compute_and_add(chooses_handler).then(
                    function(resolved){
                        if(window.fields_handler && current_layers[layer_name].targeted){
                            fields_handler.unfill();
                            fields_handler.fill(layer_name);
                        }
                        if(parent)
                            parent.display_table(layer_name);
                    }, function(error){
                        if(error != "Invalid name")
                            display_error_during_computation();
                        console.log(error);
                        document.querySelector("body").style.cursor = "";
                }).done(()=> { document.querySelector("body").style.cursor = ""; });
            }
        });

    var current_fields = Object.getOwnPropertyNames(table),
        fields_type = type_col(layer_name),
        regexp_name = new RegExp(/^[a-z0-9_]+$/i), // Only allow letters (lower & upper cases), number and underscore in the field name
        box_content = d3.select(".addFieldBox").append("div"),
        div1 = box_content.append("div").attr("id", "field_div1"),
        div2 = box_content.append("div").attr("id", "field_div2");

    var new_name = div1.append("p").html(i18next.t("app_page.explore_box.add_field_box.new_name"))
                            .insert("input").attr('value', 'NewFieldName')
                            .on("keyup", check_name);
    var type_content = div1.append("p").html(i18next.t("app_page.explore_box.add_field_box.new_content"))
                            .insert("select").attr("id", "type_content_select")
                            .on("change", function(){
                                chooses_handler.type_operation = this.value;
                                refresh_type_content(this.value); });

    [[i18next.t("app_page.explore_box.add_field_box.between_numerical"), "math_compute"],
     [i18next.t("app_page.explore_box.add_field_box.between_string"), "string_field"]
    ].forEach(function(d,i){
        type_content.append("option").text(d[0]).attr("value", d[1]);
    });

    var field1 = div1.append("select").on("change", function(){ chooses_handler.field1 = this.value; }),
        operator = div1.append("select").on("change", function(){
                            chooses_handler.operator = this.value;
                            refresh_subtype_content(chooses_handler.type_operation, this.value);
                            }),
        field2 = div1.append("select").on("change", function(){ chooses_handler.field2 = this.value; });

    var txt_op = div2.append("p").attr("id", "txt_opt").text(""),
        val_opt = div2.append("input").attr("id", "val_opt")
                        .style("display", "none")
                        .on("change", function(){ chooses_handler.opt_val = this.value;});

    var math_operation = ["+", "-", "*", "/", "^"];

    var string_operation = [
         [i18next.t("app_page.explore_box.add_field_box.concatenate"), "concatenate"],
         [i18next.t("app_page.explore_box.add_field_box.truncate"), "truncate"]
        ];

    {
        let a = type_content.node(),
            b = false;
        for(let fi in fields_type){
            if(fields_type[fi] == "number"){
                b = true;
                break;
            }
        }
        a.value = b ? "math_compute" : "string_field";
        a.dispatchEvent(new Event('change'));
    }

    return box;
}


// Function to be called after clicking on "render" in order to close the section 2
// and to have the section 3 opened
function switch_accordion_section(id_to_close="accordion2", id_to_open="accordion3"){
    let section2 = document.getElementById(id_to_close).firstChild,
        section3 = document.getElementById(id_to_open).firstChild;
    if(section2.getAttribute("aria-expanded") == "true")
        section2.dispatchEvent(new Event("click"));
    if(section3.getAttribute("aria-expanded") == "false")
        section3.dispatchEvent(new Event("click"));
}

/**
* Return the haversine distance in kilometers between two points (lat/long coordinates)
*
* @param {Array} A - Coordinates of the 1st point as [latitude, longitude]
* @param {Array} B - Coordinates of the 2nd point as [latitude, longitude]
* @return {Number} distance - The distance in km between A and B
*/
function haversine_dist(A, B){
    let pi_dr = Math.PI / 180;

    let lat1 = A[0], lon1 = A[1],
        lat2 = B[0], lon2 = B[1];

    let x1 = lat2 - lat1,
        dLat = x1 * pi_dr,
        x2 = lon2 - lon1,
        dLon = x2 * pi_dr;

    let a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * pi_dr) * Math.cos(lat2 * pi_dr) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
    return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function path_to_geojson(id_layer){
    if(id_layer.indexOf('#') != 0)
        id_layer = ["#", id_layer].join('');
    var result_geojson = [];
    d3.select(id_layer)
        .selectAll("path")
        .each(function(d,i){
            result_geojson.push({
                type: "Feature",
                id: i,
                properties: d.properties,
                geometry: {type: d.type, coordinates: d.coordinates}
            });
        });
    return JSON.stringify({
        type: "FeatureCollection",
        crs: { type: "name", properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        features: result_geojson
    });
}

function display_error_during_computation(msg){
    msg = msg ? "Details : " + msg : "",
    swal({title: i18next.t("Error") + "!",
          text: i18next.t("Something wrong happened - Current operation has been aborted") + msg,
          type: "error",
          allowOutsideClick: false});
}

/**
* Perform an asynchronous request
*
* @param {String} method - the method like "GET" or "POST"
* @param {String} url - the targeted url
* @param {FormData} data - Optionnal, the data to be send
* @return {Promise} response
*/
function request_data(method, url, data){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open(method, url, true);
        request.onload = resolve;
        request.onerror = reject;
        request.send(data);
    });
}

/**
* Function computing the min of an array of values (tking care of empty/null/undefined slot)
*  - no fancy functionnalities here (it doesn't add anything comparing to Math.min.apply()
*    or d3.min() except a little speed-up)
*
* @param {Array} arr
* @return {Number} min
*/
function min_fast(arr){
  let min = arr[0];
  for(let i = 1; i < arr.length; ++i){
    let val = +arr[i];
    if(val && val < min)
       min = val;
  }
  return min;
}

/**
* Return the maximum value of an array of numbers
*
* @param {Array} arr - the array of numbers
* @return {Number} max
*/
function max_fast(arr){
  let max = arr[0];
  for(let i = 1; i < arr.length; ++i){
    let val = +arr[i];
    if(val > max)
       max = arr[i];
  }
  return max;
}

/**
* Test an array of numbers for negative values
*
* @param {Array} arr - the array of numbers
* @return {Bool} result - True or False, whether it contains negatives values or not
*/
function has_negative(arr){
  for(let i = 0; i < arr.length; ++i)
    if(+arr[i] < 0)
       return true;
  return false;
}

/**
* @param {Array} arr - The array to test
* @return {Boolean} result - True or False, according to whether it contains empty values or not
*/
var contains_empty_val = function(arr){
    for(let i = arr.length - 1; i > -1; --i)
        if(arr[i] == null) return true;
    return false;
}

var round_value = function(val, nb){
    if(nb == undefined)
        return val;
    let dec_mult = +["1", Array(Math.abs(nb)).fill("0").join('')].join('');
    return nb >= 0
        ? Math.round(+val * dec_mult) / dec_mult
        : Math.round(+val / dec_mult) * dec_mult;
}

function get_nb_decimals(nb){
    let tmp = nb.toString().split('.');
    return tmp.length < 2 ? 0 : tmp[1].length;
}

function get_nb_left_separator(nb){
    let tmp = nb.toString().split('.');
    return tmp[0].length;
}

function getDecimalSeparator(){
    return 1.1.toLocaleString().substr(1,1)
}

function make_content_summary(serie, precision=6){
    return [
        i18next.t("app_page.stat_summary.population"), " : ", round_value(serie.pop(), precision), "<br>",
        i18next.t("app_page.stat_summary.min"), " : ", round_value(serie.min(), precision), " | ",
        i18next.t("app_page.stat_summary.max"), " : ", round_value(serie.max(), precision), "<br>",
        i18next.t("app_page.stat_summary.mean"), " : ", round_value(serie.mean(), precision), "<br>",
        i18next.t("app_page.stat_summary.median"), " : ", round_value(serie.median(), precision), "<br>",
        i18next.t("app_page.stat_summary.variance"), " : ", round_value(serie.variance(), precision), "<br>",
        i18next.t("app_page.stat_summary.stddev"), " : ", round_value(serie.stddev(), precision), "<br>",
        i18next.t("app_page.stat_summary.cov"), " : ", round_value(serie.cov(), precision)
    ].join('')
}