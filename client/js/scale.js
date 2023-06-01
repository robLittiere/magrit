export function scale_elements(){

    const lm_buttons = [
        { id: 'zoom_out', i18n: '[data-ot]app_page.lm_buttons.zoom-', class: 'zoom_button i18n tt', html: '-' },
        { id: 'zoom_in', i18n: '[data-ot]app_page.lm_buttons.zoom+', class: 'zoom_button i18n tt', html: '+' }]


    let div = map_div
    .insert("div", ":first-child")
    .attrs({"class":"light-menu", "id":"demo"})
    .styles({
        "z-index":"999",
        "position" :"absolute",
        "bottom" : "0",
        "left" : "0",
        "width":"20%",
        "background":"no-background"
    })

    div
    .append("button")
    .text("+")
    .attrs({"id":"scale_in"})

    const sliderContainer = div.append("div").attr('class', 'slider_container')
    console.log(sliderContainer)
    sliderContainer.append("input")
        .attr('type', 'range')
        .attr('id', 'zoom-slider')
        .attr('min', 0)
        .attr('max', 2)
        .attr('value', 1)
        .attr('step', 0.1 )
        .style('width', '100px')


    div
    .append("button")
    .text("-")
    .attrs({"id":"scale_out"})


    var map = d3.select("#svg_map").nodes()[0].childNodes

    var scale_in = document.getElementById("scale_in");
    var scale_out = document.getElementById("scale_out");
    var slider = document.getElementById("zoom-slider")

    slider.oninput = function(event){
        console.log(event.target.value)
        for(let i = 1 ; i < map.length; i ++){
            if( !(map[i].classList.value.split(" ").includes("targeted_layer") || map[i].classList.value.split(" ").includes("legend"))){
                                
                for(let children of map[i].children){

                    if(children.id.includes("PropSymbol")){
                        console.log("prop")
                        // Get original r (size)
                        let old_r = children.getAttribute("old_r")   
                        // If we only have the original size, we copy it  
                        if(!old_r){
                            children.setAttribute("old_r", children.getAttribute("r"))
                            old_r = children.getAttribute("r")
                        }
                        let base_size = parseFloat(old_r)    
                        console.log(base_size)          
                    
                        let new_size = base_size * event.target.value
                        children.setAttribute("r", new_size); 
                        }
                    else if(children.id.includes("Picto")){
                        console.log("symol")
                        // Same logic as above
                        let original_height = children.getAttribute("old_height")
                        let original_width = children.getAttribute("old_width")
                        if(!original_height && !original_width){
                            children.setAttribute("old_height", children.getAttribute("height"))
                            children.setAttribute("old_width", children.getAttribute("width"))
                            original_height = children.getAttribute("height")
                            original_width = children.getAttribute("width")
                        }

                        
                        let height = parseFloat(original_height) 
                        let width = parseFloat(original_width)                   
                    
                        let update_height = height * event.target.value
                        let update_width = width * event.target.value

                        children.setAttribute("height", update_height); 
                        children.setAttribute("width", update_width); 
                        }
                               
                    }

                    let legendes = document.querySelectorAll(`[class*=${map[i].id}][class*=legend]`)
                    for(let svg_tag of legendes){
                        for(let element of svg_tag.childNodes){
                            if(element.tagName == "g"){

                            let currentTransform = parseFloat(element.firstChild.getAttribute("r"))                  
                    
                            let updatedTransform = currentTransform * event.target.value
                            element.firstChild.setAttribute("r", updatedTransform); }}
                        }   
                }
        } 
    }


    

    scale_in.onclick=function(){       
        for(let i = 1 ; i < map.length; i ++){
            if( !(map[i].classList.value.split(" ").includes("targeted_layer") || map[i].classList.value.split(" ").includes("legend"))){
                                
                for(let children of map[i].children){

                    if(children.id.includes("PropSymbol")){
                        
                        let currentTransform = parseFloat(children.getAttribute("r"))                  
                    
                        let updatedTransform = currentTransform * 1.1
                        children.setAttribute("r", updatedTransform); 
                        }
                    else if(children.id.includes("Picto")){
                        
                        let height = parseFloat(children.getAttribute("height")) 
                        let width = parseFloat(children.getAttribute("width"))                   
                    
                        let update_height = height * 1.1
                        let update_width = width * 1.1

                        children.setAttribute("height", update_height); 
                        children.setAttribute("width", update_width); 
                        }
                               
                    }
                    let legendes = document.querySelectorAll(`[class*=${map[i].id}][class*=legend]`)
                    for(let svg_tag of legendes){
                        for(let element of svg_tag.childNodes){
                            if(element.tagName == "g"){

                            let currentTransform = parseFloat(element.firstChild.getAttribute("r"))                  
                    
                            let updatedTransform = currentTransform * 1.1
                            element.firstChild.setAttribute("r", updatedTransform); }}
                        }                    
                }             
        } 
        slider.value = parseFloat(slider.value) + parseFloat(slider.getAttribute("step"))
    }

    scale_out.onclick=function(){       
        for(let i = 1 ; i < map.length; i ++){
            if( !(map[i].classList.value.split(" ").includes("targeted_layer") || map[i].classList.value.split(" ").includes("legend"))){
                                
                for(let children of map[i].children){

                    if(children.id.includes("PropSymbol")){
                        console.log("prop")
                        let currentTransform = parseFloat(children.getAttribute("r"))                  
                    
                        let updatedTransform = currentTransform * 0.9
                        children.setAttribute("r", updatedTransform); 
                        }
                    else if(children.id.includes("Picto")){
                        console.log("symol")
                        
                        let height = parseFloat(children.getAttribute("height")) 
                        let width = parseFloat(children.getAttribute("width"))                   
                    
                        let update_height = height * 0.9
                        let update_width = width * 0.9

                        children.setAttribute("height", update_height); 
                        children.setAttribute("width", update_width); 
                        }
                               
                    }

                    let legendes = document.querySelectorAll(`[class*=${map[i].id}][class*=legend]`)
                    for(let svg_tag of legendes){
                        for(let element of svg_tag.childNodes){
                            if(element.tagName == "g"){

                            let currentTransform = parseFloat(element.firstChild.getAttribute("r"))                  
                    
                            let updatedTransform = currentTransform * 0.9
                            element.firstChild.setAttribute("r", updatedTransform); }}
                        }   
                }
        } 
        slider.value = parseFloat(slider.value) - parseFloat(slider.getAttribute("step"))

    }
}
