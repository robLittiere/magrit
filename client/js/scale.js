export function scale_elements() {

    let div = map_div
        .insert("div", ":first-child")
        .attrs({ id: "demo" })
        .styles({
            "z-index": "999",
            width: "min-content",
            background: "transparent",
            position : "absolute",
            left: "0px",
            bottom : "5px"
        });

    

    // Add the slider
    const sliderContainer = div.append("div").attr("class", "slider_container");
    sliderContainer
        .append("input")
        .attr("type", "range")
        .attr("id", "zoom-slider")
        .attr("min", 0.1)
        .attr("max", 4)
        .attr("value", 2)
        .attr("step", 0.1)
        .styles({
            width : "150px",
            
        });
    
    let button_section = div
        .append("div")
        .attrs({id:"scale_buttons_section"})
        .styles({
            "display" : "flex",
            "gap" : "1vw",
            "justify-content":"center",
            "height":"20px"
            
        })
    
    // scale out button
    button_section
        .append("button")
        .text("-")
        .attrs({ id: "scale_out" })
        .styles({
            height:"100%",
            width:"20px",
             "background-image":"linear-gradient(rgb(136, 136, 136), rgb(85, 85, 85))",
             color:"white",
             border : "0px",
             "border-radius": "3px"

            });

    // span showing the slider value
    button_section
        .append("span")
        .attrs({ id: "scale_value" })
        .text("2")
        .styles({
            height:"100%",
            width:"fit-content",                              
        });

    // scale in button
    button_section
        .append("button")
        .text("+")
        .attrs({ id: "scale_in" })
        .styles({
             height:"100%",
             width:"20px",
             "background-image":"linear-gradient(rgb(136, 136, 136), rgb(85, 85, 85))",
             color:"white",
             border : "0px",
             "border-radius": "3px"

            });
    

    const map = d3.select("#svg_map").nodes()[0].childNodes;

    const scale_in = document.getElementById("scale_in");
    const scale_out = document.getElementById("scale_out");
    const slider = document.getElementById("zoom-slider");
    const scale_value_span = document.getElementById("scale_value")
      
    

    /**
     * 
     * We need to figure out a way to know if the user has already used the slider
     * If they use the button first and not the slider, we need to add the original sizes
     * from symbols, legends and pictograms in the dom
     * We only need to add old attributes one time so we dont update it on every user click
     * 
     * We use those attributes for the slider scaling because it scales based on the original size
     * The scaling is asserted from the value of the slider, the chosen step is 0.1.
     * for exemple: new_size = og_size * 1.2
     *              new_size = og_size * 1.3
     * 
     * 
     * Also it is important to note that the button adjust the slider 
     * We do this to preserve a sense cohesion between the scaling of the buttons
     * and the scaling of the slider
     */
    let scaleUsed = false;

    slider.oninput = function () {
        // scaling is used so the mod will get modified
        scaleUsed = true;
        for (let i = 1; i < map.length; i++) {
            if (
                !(
                    map[i].classList.value.split(" ").includes("targeted_layer") ||
                    map[i].classList.value.split(" ").includes("legend")
                )
            ) {
                for (let children of map[i].children) {
                    if (children.id.includes("PropSymbol")) {
                        // Get original size r
                        let old_r = children.getAttribute("old_r");
                        // If we only have the original size, we copy it
                        if (!old_r) {
                            children.setAttribute("old_r", children.getAttribute("r"));
                            old_r = children.getAttribute("r");
                        }
                        let base_size = parseFloat(old_r);

                        let new_size = base_size * slider.value;
                        children.setAttribute("r", new_size);
                    } else if (children.id.includes("Picto")) {
                        // Same logic as above
                        let original_height = children.getAttribute("old_height");
                        let original_width = children.getAttribute("old_width");
                        if (!original_height && !original_width) {
                            children.setAttribute(
                                "old_height",
                                children.getAttribute("height")
                            );
                            children.setAttribute(
                                "old_width",
                                children.getAttribute("width")
                            );
                            original_height = children.getAttribute("height");
                            original_width = children.getAttribute("width");
                        }

                        let height = parseFloat(original_height);
                        let width = parseFloat(original_width);

                        let update_height = height * slider.value;
                        let update_width = width * slider.value;

                        children.setAttribute("height", update_height);
                        children.setAttribute("width", update_width);                       
                    }
                }

                let legendes = document.querySelectorAll(
                    `[class*=${map[i].id}][class*=legend]`
                );
                for (let svg_tag of legendes) {
                    for (let element of svg_tag.childNodes) {
                        if (element.tagName == "g") {
                            let original_size = element.firstChild.getAttribute("old_r");
                            if (!original_size) {
                                element.firstChild.setAttribute(
                                    "old_r",
                                    element.firstChild.getAttribute("r")
                                );
                                original_size = element.firstChild.getAttribute("r");
                            }
                            let currentTransform = parseFloat(original_size);

                            let updatedTransform =
                                currentTransform * parseFloat(slider.value);
                            element.firstChild.setAttribute("r", updatedTransform);
                        }
                    }
                }
            }
        }
    document.getElementById("scale_value").textContent = slider.value
    };

    /**
     * Listen onclick events of buttons 
     * We scale all the shapes of the map and we adjust the slider accordingly
     */
    scale_in.onclick = function () {
        scaleElements("in");
        adjustSlider("in");
    };

    scale_out.onclick = function () {
        scaleElements("out");
        adjustSlider("out");
    };

    function scaleElements(scaleType) {
        if (!scaleUsed) {
            updateDomAttributes();
            scaleUsed = true
        }

        let scale = 1;
        switch (scaleType) {
            case "in":
                scale = 1.1;
                break;

            case "out":
                scale = 0.9;
                break;

            default:
                scale = 1;
                break;
        }
        for (let i = 1; i < map.length; i++) {
            if (
                !(
                    map[i].classList.value.split(" ").includes("targeted_layer") ||
                    map[i].classList.value.split(" ").includes("legend")
                )
            ) {
                for (let children of map[i].children) {
                    if (children.id.includes("PropSymbol")) {

                        let currentTransform = parseFloat(children.getAttribute("r"));

                        let updatedTransform = currentTransform * scale;
                        children.setAttribute("r", updatedTransform);
                    } else if (children.id.includes("Picto")) {

                        let height = parseFloat(children.getAttribute("height"));
                        let width = parseFloat(children.getAttribute("width"));

                        let update_height = height * scale;
                        let update_width = width * scale;

                        children.setAttribute("height", update_height);
                        children.setAttribute("width", update_width);
                    }
                }

                let legendes = document.querySelectorAll(
                    `[class*=${map[i].id}][class*=legend]`
                );
                for (let svg_tag of legendes) {
                    for (let element of svg_tag.childNodes) {
                        if (element.tagName == "g") {
                            let currentTransform = parseFloat(
                                element.firstChild.getAttribute("r")
                            );

                            let updatedTransform = currentTransform * scale;
                            element.firstChild.setAttribute("r", updatedTransform);
                        }
                    }
                }
            }
        }
    }

    function adjustSlider(scaleType) {
        switch (scaleType) {
            case "in":
                slider.value =
                    parseFloat(slider.value) + parseFloat(slider.getAttribute("step"));
                    scale_value_span.textContent = slider.value
                break;

            case "out":
                slider.value =
                    parseFloat(slider.value) - parseFloat(slider.getAttribute("step"));
                    scale_value_span.textContent = slider.value
                break;
        }
    }

    function updateDomAttributes() {
        for (let i = 1; i < map.length; i++) {
            if (
                !(
                    map[i].classList.value.split(" ").includes("targeted_layer") ||
                    map[i].classList.value.split(" ").includes("legend")
                )
            ) {
                for (let children of map[i].children) {
                    if (children.id.includes("PropSymbol")) {
                        // Get original r (size)
                        children.setAttribute("old_r", children.getAttribute("r"));

                    } else if (children.id.includes("Picto")) {
                        children.setAttribute(
                            "old_height",
                            children.getAttribute("height")
                        );
                        children.setAttribute(
                            "old_width",
                            children.getAttribute("width")
                        );
                    }
                }

                let legendes = document.querySelectorAll(
                    `[class*=${map[i].id}][class*=legend]`
                );
                for (let svg_tag of legendes) {
                    for (let element of svg_tag.childNodes) {
                        if (element.tagName == "g") {
                            element.firstChild.setAttribute(
                                "old_r",
                                element.firstChild.getAttribute("r")
                            );
                        }
                    }
                }
            }
        }
    }
}
