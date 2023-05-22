import { Mround } from './../helpers_math';
import { export_compo_png, export_compo_svg, export_layer_geo } from './../map_export';


export function makeSection6() {
  const section6 = d3.select('#section6');
  const dv6 = section6.append('div');


  dv6
  .append("button")
  .on("click", function(){
    var value_choice = document.querySelectorAll("#value_choice input") 
    for(let checkbox of value_choice){
      checkbox.checked = false
    }
    var svg_map = document.getElementById("svg_map")

    // pour chaque couche de la carte
    for(let node of svg_map.childNodes){
      if(node.nodeName == "defs"){/* do nothing */}
      else{
        // pour chaque svg de chaque couche
        for(let path of node.childNodes){
          path.setAttribute("display" , "")
        }
      }
    }
  })
  .attrs({
    id : "reset_button"
  })
  .style("text-align", "center")
  .style("display", "flex")
  .style("justify-content", "center")
  .style("align-items", "center")
  .text("Reinitialiser")

  

  const layer_selection = dv6.append('div');
  layer_selection.styles({
    "display" : "flex",
    "flex-direction" : "column",
    "justify-content" : "center"
  })



  /* section choix de la couche */
  layer_selection.append('p')
    .attrs({
      class: 'i18n', 'data-i18n': '[html]app_page.section5b.type', 'id' : 'layer_selection'
    })
    .styles({
        "align-self" : "center"
    })

  layer_selection
    .append('select')
    .attrs({
        "id" : "layer_choice"
    })

  
  /* section choix de la colonne */
  const field_choice = dv6.append('div')
  field_choice.styles({
    "display" : "flex",
    "flex-direction" : "column",
    "justify-content" : "center"
  })


  field_choice
    .append('p')
    .text('Dimension')
    .styles({
        "align-self" : "center"
    })
    

  field_choice
    .append('select')
    .attrs({
        'id' : 'field_choice'
    })



  /* section choix des valeurs */
  
  const value_choice = dv6.append("div")

  value_choice.append("p")
  .text("Choix des valeurs")
  .styles({
    "display" : "flex",
    "align-self" : "center"
  })

  value_choice.styles({
    "display" : "flex",
    "flex-direction" : "column",
    "justify-content" : "center"
  })

  value_choice
    .append('ul')
    .attrs({
        'id' : "value_choice"
    })
    .styles({
      "list-style" : "none",
      "align-self" : "center"
    })
}

var options = []
var checked_boxes = {}

export function update_section_6(){
  console.log("execution update seciton 6")

    var layer_choice = document.getElementById("layer_choice")
    var field_choice = document.getElementById("field_choice")

    // A l'execution, rajoute la liste des couches présentes à la liste des couches présentes
    for(let i = 0; i < layer_choice.options.length; i++){
        options.push(layer_choice.options[i].text)
      }  

    /* ajout de chaque couche de l'UI a un menu déroulant */
    for(let i = 0; i < Object.keys(data_manager.current_layers).length ; i++){

      let layer_name = Object.keys(data_manager.current_layers)[i]

      if( options.includes(layer_name) == false){
        let option = document.createElement("option")
        option.setAttribute("id", `layer_name_${layer_name}`)
        option.textContent = layer_name
        option.addEventListener("click",function(){
          reset_menu("field_choice","option")
          reset_menu("value_choice","li")
          update_fields()
        })
        layer_choice.appendChild(option)
      }

    // Ajout de chaque catégorie pour la couche selectionnée
    update_fields() 

    // Ajout des valeurs uniques pour la catégorie selectionnée
    update_values()

  }

  function reset_menu (menu_element, html_tag){
    console.log("execution function reset menu")
    let sub_menu = document.getElementById(menu_element)
    let children_elements = sub_menu.querySelectorAll(html_tag)

    for(let element of children_elements){
      element.remove()
    }
  }

  function update_fields(){
    let set_layer = document.getElementById("layer_choice").value
    let original_fields =  Array.from(data_manager.current_layers[set_layer].original_fields)
  
    for(let i = 0; i < original_fields.length; i ++){
        let category = document.createElement("option")
        category.textContent = original_fields[i]
        field_choice.appendChild(category)

        category.addEventListener("click", function(){
          reset_menu("value_choice","li")
          update_values()
        })
      }   
    update_values()
  }

  function update_values(){
    let unique_values = get_unique_value(document.getElementById("layer_choice").value)
    let set_field = field_choice.value
      
    for(let value of unique_values[set_field].sort()){
        const liElement = document.createElement("li");
        liElement.style.alignSelf = "flex-end";
        
        const textNode = document.createTextNode(value);
        liElement.appendChild(textNode);
        
        const inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.value = value;
        
        liElement.appendChild(inputElement);
        value_choice.appendChild(liElement);


        inputElement.addEventListener("click",function(){
          let shapes_to_filter = filter_values(layer_choice.value,field_choice.value, this.value)

          // pour chaque ID
          for(let shape of shapes_to_filter){ 
            // selection par ID compris à l'interrieur un groupe de path (une couche sur l'UI)
            let filtered_shape =  document.querySelector(`#L_${layer_choice.value} #feature_${shape}`)           
            if(this.checked == true){
              filtered_shape.setAttribute("display", "none")
              }
            else{
              filtered_shape.setAttribute("display" , "")
              }            
            }
          })
    }
  } 

  /* layer_choice.querySelector("option").addEventListener("click",function(){
    reset_menu("field_choice", "option")
    reset_menu("value_choice","li")  
  }, false) */

}


/**
 * Récupère la liste des valeurs unique pour chaque champs pour une couche données depuis le 
 * data manager.
 * @param layer : nom de la couche 
 * @returns Object : key = champ, value = liste de valeurs uniques
 */
function get_unique_value(layer){
  var user_values = {}

  var user_data = data_manager.user_data[layer]
  var original_fields = data_manager.current_layers[layer].original_fields

  //pour chaque champ de la couche
  for(let current_field of original_fields){
    //récupérer les valeurs uniques du champ
    let unique_values = new Set()
    for(let i  = 0; i < user_data.length ; i++){
        unique_values.add(user_data[i][current_field])
    }    
    user_values[current_field] = Array.from(unique_values)
  } 
  return user_values
}

/**
 * Récupère la liste des id des entités donc la valeur d'un champ donné match la valeur selectionnée 
 * par l'utilisateur pour masquer
 * 
 * @returns liste d'ID d'entités a filtrer 
 */
function filter_values(layer, field, value){
  var user_data = data_manager.user_data[layer]
  var shapes_to_filter = []

  for(let i = 0 ; i < user_data.length; i ++){
    if (user_data[i][field] == value){
      shapes_to_filter.push(i)
    }
  }
  return shapes_to_filter
}
