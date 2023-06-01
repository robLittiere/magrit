import { default as Sortable } from "sortablejs";
import { filter } from "topojson";
import {
    make_dialog_container,
    make_confirm_dialog2,
    overlay_under_modal,
    reOpenParent,
} from "./dialogs";
import { cloneObj } from "./helpers";

export const display_box_symbol_typo = function (layer, field, categories) {
    const fetch_symbol_categories = function () {
        // Add the list of unchecked checkboxes
        let symbol_filter = fetch_unchecked_images();    
        const categ = document.getElementsByClassName("typo_class");
        const symbol_map = new Map();
        for (let i = 0; i < categ.length; i++) {
            const selec = categ[i].querySelector(".symbol_section");
            const new_name = categ[i].querySelector(".typo_name").value;

            // If the new name is not in the list of unchecked checkboxes, add the symbol to the map
            // Otherwise user has unchecked the checkbox, so we don't want to display the symbol
            if(!symbol_filter.includes(new_name)){
                if (selec.style.backgroundImage.length > 7) {
                    const img = selec.style.backgroundImage
                        .split("url(")[1]
                        .substring(1)
                        .slice(0, -2);
                    const size = +categ[i].querySelector("#symbol_size").value;
                    symbol_map.set(categ[i].__data__.name, [
                        img,
                        size,
                        new_name,
                        cats[i].nb_elem,
                    ]);
                } else {  
                    symbol_map.set(categ[i].__data__.name, [
                        null,
                        0,
                        new_name,
                        cats[i].nb_elem,
                    ]);
                }
            }
        }
          
        return [symbol_map, symbol_filter]; 
    };

    /**
     * Armel Vidali - 2023-03-05
     * Fetch all checked checkboxes, allow to not display pictograms for certain field values (ex : no images for Asia)
     * 
     * @returns List of field values not to display
     */
    const fetch_unchecked_images = function(){
        const label_checkbox = document.querySelectorAll(".image_hide_check");
        let images_to_hide = [];
        for (let i = 0; i < label_checkbox.length; i++){
            if (label_checkbox[i].checked == false){
                // This is not best practice since we are getting the category name from id
                // We would prefer to put it in a data attribute or something for a future amelioration 
                let value_toRemove = document.getElementById(`line_${i}`).querySelector('.typo_name').id
                images_to_hide.push(value_toRemove)
            }
        }
        return images_to_hide;
    }    

    const nb_features = data_manager.current_layers[layer].n_features,
        data_layer = data_manager.user_data[layer],
        cats = [],
        res_symbols = _app.default_symbols;

    if (!categories) {
        categories = new Map();
        for (let i = 0; i < nb_features; ++i) {
            let value = data_layer[i][field];
            // Replace the entry in the color map by 'undefined_category'
            // when the field value is null
            if (value === null || value === "" || value === undefined) {
                value = "undefined_category";
            }
            const ret_val = categories.get(value);
            if (ret_val) {
                categories.set(value, [ret_val[0] + 1, [i].concat(ret_val[1])]);
            } else {
                categories.set(value, [1, [i]]);
            }
        }
        let n_cat = 0;
        let filtered_list;
        categories.forEach((v, k) => {
            // The default name of the category is value contained in the category field
            // (stored as strings)
            const name = `${k}`;
            // But if it's an undefined category we use the sentence
            // "Undefined category" in the current language.
            const new_name =
                k === "undefined_category"
                    ? _tr("app_page.common.undefined_category")
                    : k;
            cats.push({
                    name,
                    new_name,
                    nb_elem: v[0],
                    img: `url(${res_symbols[n_cat][1]})`,
                });
            n_cat += 1;
        });
        // Sort categories by name for the first time the picto panel
        // will be displayed
        cats.sort((a, b) => a.name.localeCompare(b.name));
    } else {
        categories.forEach((v, k) => {
            cats.push({
                name: k,
                new_name: v[2],
                nb_elem: v[3],
                img: `url(${v[0]})`,
            });
        });
    }
    const nb_class = cats.length ;

    const modal_box = make_dialog_container(
        "symbol_box",
        _tr("app_page.symbol_typo_box.title", { layer, nb_features }),
        "dialog"
    );
    const newbox = d3
        .select("#symbol_box")
        .select(".modal-body")
        .styles({
            "overflow-y": "scroll",
            "max-height": `${window.innerHeight - 145}px`,
        });

    newbox.append("h3").html("");
    newbox.append("p").html(
        _tr("app_page.symbol_typo_box.field_categ", {
            field,
            nb_class,
            nb_features,
        })
    );
    newbox.append("div")
        .attr("class", "typo_container")
        .append("p")
        .styles({
            float: "left",
            "margin-bottom": "5px",
        })
        // Here add the label text for checkbox
        .html(
            _tr("app_page.symbol_typo_box.checkbox_desc")
        )

    // Append ul to container instead of newbox
    newbox.selectAll(".typo_container")
        .append("ul")
        .styles({
            padding: "unset",
            "list-style": "none",
        })
        .attr("id", "typo_categories")
        .selectAll("li")
        .data(cats)
        .enter()
        .append("li")
        .attr("class", "typo_class")
        .attr("id", (_, i) => ["line", i].join("_"))

    newbox
        .selectAll(".typo_class")
        .insert("span")
        .styles({
            "margin-left": "10px",
        })
        .append("input")
        .attrs((d,i) => {
            return{
                id : `hide_${i}`,
                class : "image_hide_check",
                type : "checkbox"

            }
        })
        // Check the box by default
        .property('checked', true)
        .styles({
            margin: 0,
        })
        .on("click", function() {
            let box =  document.getElementById(`line_${this.id.replace("hide_","")}`)
            if(this.checked){
                box.style.opacity = 1

            }
            else{
                box.style.opacity = 0.6
            }
        })   

    newbox
        .selectAll(".typo_class")
        .append("input")
        .styles({
            width: "200px",
            height: "30px",
            "vertical-align": "middle",
            "margin-left": "10px"
        })
        .attrs((d) => ({ class: "typo_name", id: d.name }))
        .property("value", (d) => d.new_name);

    newbox
        .selectAll(".typo_class")
        .insert("p")
        .attrs({
            class: "symbol_section",
            title: _tr("app_page.symbol_typo_box.title_click"),
        })
        .style("background-image", (d) => d.img)
        .styles({
            width: "32px",
            height: "32px",
            "margin-left": "10px",
            "border-radius": "10%",
            border: "1px dashed blue",
            display: "inline-block",
            "background-size": "32px 32px",
            "vertical-align": "middle",
            "margin": "0 0 0 10px"
        })
        .on("click", function () {
            modal_box.hide();
            box_choice_symbol(res_symbols, ".dialog").then((confirmed) => {
                modal_box.show();
                if (confirmed) {
                    this.style.backgroundImage = confirmed;
                }
            });
        });

    newbox
        .selectAll(".typo_class")
        .insert("input")
        .attrs({ type: "number", id: "symbol_size" })
        .styles({ width: "50px", "margin-left": "25px", height: "30px" })
        .property("value", 50);

    newbox
        .selectAll(".typo_class")
        .insert("span")
        .style("margin-left", "5px")
        .html(" px");

    newbox
        .selectAll(".typo_class")
        .insert("span")
        .style("margin-left", "25px")
        .html((d) =>
            _tr("app_page.symbol_typo_box.count_feature", { count: d.nb_elem })
        );

    new Sortable(document.getElementById("typo_categories"));

    return new Promise((resolve, reject) => {
        const container = document.getElementById("symbol_box");
        const fn_cb = (evt) => {
            helper_esc_key_twbs_cb(evt, _onclose);
        };
        const clean_up_box = function () {
            container.remove();
            overlay_under_modal.hide();
            document.removeEventListener("keydown", fn_cb);
        };
        let _onclose = () => {
            resolve(false);
            clean_up_box();
        };
        container.querySelector(".btn_ok").onclick = function () {
            const symbol_and_filter = fetch_symbol_categories();
            const symbol_map = symbol_and_filter[0];
            // List of fields for which the user doesn't want images 
            const symbol_filter = symbol_and_filter[1]; 
            resolve([nb_class, symbol_map, symbol_filter]);
            clean_up_box();
        };
        container.querySelector(".btn_cancel").onclick = _onclose;
        container.querySelector("#xclose").onclick = _onclose;
        document.addEventListener("keydown", fn_cb);
        overlay_under_modal.display();
    });
};

export function box_choice_symbol(sample_symbols, parent_css_selector) {
    make_dialog_container(
        "box_choice_symbol",
        _tr("app_page.box_choice_symbol.title"),
        "dialog"
    );
    overlay_under_modal.display();
    const container = document.getElementById("box_choice_symbol");
    const btn_ok = container.querySelector(".btn_ok");
    container.querySelector(".modal-dialog").classList.add("fitContent");
    btn_ok.disabled = "disabled";
    const newbox = d3
        .select(container)
        .select(".modal-body")
        .style("width", "220px");
    newbox
        .append("p")
        .html(`<b>${_tr("app_page.box_choice_symbol.select_symbol")}</b>`);

    const box_select = newbox
        .append("div")
        .styles({
            width: "190px",
            height: "100px",
            overflow: "auto",
            border: "1.5px solid #1d588b",
        })
        .attr("id", "symbols_select");

    box_select
        .selectAll("p")
        .data(sample_symbols)
        .enter()
        .append("p")
        .attrs((d) => ({
            id: `p_${d[0].replace(".png", "")}`,
            title: d[0],
        }))
        .styles((d) => ({
            width: "32px",
            height: "32px",
            margin: "auto",
            display: "inline-block",
            "background-size": "32px 32px",
            "background-image": `url("${d[1]}")`, // ['url("', d[1], '")'].join('')
        }))
        .on("click", function () {
            box_select.selectAll("p").each(function () {
                this.style.border = "";
                this.style.padding = "0px";
            });
            this.style.padding = "-1px";
            this.style.border = "1px dashed red";
            btn_ok.disabled = false;
            newbox
                .select("#current_symb")
                .style("background-image", this.style.backgroundImage);
        });

    newbox
        .append("p")
        .attr("display", "inline")
        .html(`<b>${_tr("app_page.box_choice_symbol.upload_symbol")}</b>`);
    newbox
        .append("p")
        .styles({ margin: "auto", "text-align": "center" })
        .append("button")
        .html(_tr("app_page.box_choice_symbol.browse"))
        .on("click", () => {
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", ".jpeg,.jpg,.svg,.png,.gif");
            input.onchange = function (event) {
                const file = event.target.files[0];
                // const file_name = file.name;
                const reader = new FileReader();
                reader.onloadend = function () {
                    const dataUrl_res = ['url("', reader.result, '")'].join("");
                    btn_ok.disabled = false;
                    newbox
                        .select("#current_symb")
                        .style("background-image", dataUrl_res);
                };
                reader.readAsDataURL(file);
            };
            input.dispatchEvent(new MouseEvent("click"));
        });

    newbox
        .insert("p")
        .style("text-align", "center")
        .html(_tr("app_page.box_choice_symbol.selected_symbol"));
    newbox
        .insert("div")
        .style("text-align", "center")
        .append("p")
        .attrs({ class: "symbol_section", id: "current_symb" })
        .styles({
            width: "32px",
            height: "32px",
            margin: "auto",
            display: "inline-block",
            "border-radius": "10%",
            "background-size": "32px 32px",
            "vertical-align": "middle",
            "background-image": "url('')",
        });
    return new Promise((resolve, reject) => {
        const fn_cb = (evt) => {
            helper_esc_key_twbs_cb(evt, _onclose);
        };
        const clean_up_box = function () {
            container.remove();
            if (parent_css_selector) {
                reOpenParent(parent_css_selector);
            } else {
                overlay_under_modal.hide();
            }
            document.removeEventListener("keydown", fn_cb);
        };
        container.querySelector(".btn_ok").onclick = function () {
            const res_url = newbox
                .select("#current_symb")
                .style("background-image");
            resolve(res_url);
            clean_up_box();
        };
        let _onclose = () => {
            resolve(false);
            clean_up_box();
        };
        container.querySelector(".btn_cancel").onclick = _onclose;
        container.querySelector("#xclose").onclick = _onclose;
        document.addEventListener("keydown", fn_cb);
    });
}

export function make_style_box_indiv_symbol(symbol_node) {
    const parent = symbol_node.parentElement;
    const type_obj = parent.classList.contains("layer") ? "layer" : "layout";
    const current_options = {
        size: +symbol_node.getAttribute("width").replace("px", ""),
        scalable: !!(
            type_obj === "layout" &&
            parent.classList.contains("scalable-legend")
        ),
    };
    const ref_coords = {
        x: +symbol_node.getAttribute("x") + current_options.size / 2,
        y: +symbol_node.getAttribute("y") + current_options.size / 2,
    };
    const ref_coords2 = cloneObj(ref_coords);
    // const new_params = {};
    // const self = this;
    make_confirm_dialog2(
        "styleSingleSymbol",
        _tr("app_page.single_symbol_edit_box.title"),
        { widthFitContent: true }
    ).then((confirmed) => {
        if (!confirmed) {
            symbol_node.setAttribute("width", `${current_options.size}px`);
            symbol_node.setAttribute("height", `${current_options.size}px`);
            symbol_node.setAttribute(
                "x",
                ref_coords.x - current_options.size / 2
            );
            symbol_node.setAttribute(
                "y",
                ref_coords.y - current_options.size / 2
            );
            if (current_options.scalable) {
                const zoom_scale = svg_map.__zoom;
                parent.setAttribute(
                    "transform",
                    `translate(${zoom_scale.x},${zoom_scale.y}) scale(${zoom_scale.k},${zoom_scale.k})`
                );
                if (!parent.classList.contains("scalable-legend")) {
                    parent.classList.add("scalable-legend");
                }
            } else if (!parent.classList.contains("layer")) {
                parent.removeAttribute("transform", undefined);
                if (parent.classList.contains("scalable-legend")) {
                    parent.classList.remove("scalable-legend");
                }
            }
        }
    });
    const box_content = d3
        .select(".styleSingleSymbol")
        .select(".modal-body")
        .style("width", "295px")
        .insert("div");

    const a = box_content.append("div").attr("class", "line_elem");

    a.append("span").html(_tr("app_page.single_symbol_edit_box.image_size"));
    a.append("input")
        .styles({ width: "70px" })
        .attrs({
            type: "number",
            id: "font_size",
            min: 0,
            max: 150,
            step: "any",
        })
        .property("value", current_options.size)
        .on("change", function () {
            const val = +this.value;
            symbol_node.setAttribute("width", `${val}px`);
            symbol_node.setAttribute("height", `${val}px`);
            symbol_node.setAttribute("x", ref_coords2.x - val / 2);
            symbol_node.setAttribute("y", ref_coords2.y - val / 2);
        });

    if (type_obj === "layout") {
        // const current_state = parent.classList.contains('scalable-legend');
        const b = box_content.append("div").attr("class", "line_elem");

        b.append("label")
            .attrs({
                for: "checkbox_symbol_zoom_scale",
                class: "i18n",
                "data-i18n":
                    "[html]app_page.single_symbol_edit_box.scale_on_zoom",
            })
            .html(_tr("app_page.single_symbol_edit_box.scale_on_zoom"));

        b.append("input")
            .attrs({ type: "checkbox", id: "checkbox_symbol_zoom_scale" })
            .on("change", function () {
                const zoom_scale = svg_map.__zoom;
                if (this.checked) {
                    symbol_node.setAttribute(
                        "x",
                        (symbol_node.x.baseVal.value - zoom_scale.x) /
                            zoom_scale.k
                    );
                    symbol_node.setAttribute(
                        "y",
                        (symbol_node.y.baseVal.value - zoom_scale.y) /
                            zoom_scale.k
                    );
                    parent.setAttribute(
                        "transform",
                        `translate(${zoom_scale.x},${zoom_scale.y}) scale(${zoom_scale.k},${zoom_scale.k})`
                    );
                    parent.classList.add("scalable-legend");
                } else {
                    symbol_node.setAttribute(
                        "x",
                        symbol_node.x.baseVal.value * zoom_scale.k +
                            zoom_scale.x
                    );
                    symbol_node.setAttribute(
                        "y",
                        symbol_node.y.baseVal.value * zoom_scale.k +
                            zoom_scale.y
                    );
                    parent.removeAttribute("transform");
                    parent.classList.remove("scalable-legend");
                }
                ref_coords2.x = +symbol_node.getAttribute("x");
                ref_coords2.y = +symbol_node.getAttribute("y");
            });
        document.getElementById("checkbox_symbol_zoom_scale").checked =
            current_options.scalable;
    }
}