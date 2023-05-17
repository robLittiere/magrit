import { Mround } from './../helpers_math';
import { export_compo_png, export_compo_svg, export_layer_geo } from './../map_export';


export function makeSection6() {
  const section6 = d3.select('#section6');
  const dv6 = section6.append('div');


  dv6
  .append("button")
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

export function update_section_6(){
  console.log("execution update seciton 6")
  const options = []
    // A l'execution, rajoute la liste des couches présentes au menu déroulant des couches
    for(let i = 0; i < document.getElementById("layer_choice").options.length; i++){
        options.push(document.getElementById("layer_choice").options[i].text)
      }

    var layer_choice = document.getElementById("layer_choice")
    var field_choice = document.getElementById("field_choice")

    console.log("layer choice", layer_choice)

    /* ajout de chaque couche de l'UI a un menu déroulant */
    for(let i = 0; i < Object.keys(data_manager.current_layers).length ; i++){

      let layer_name = Object.keys(data_manager.current_layers)[i]
      
      if( options.includes(layer_name) == false){
        let option = document.createElement("option")
        option.setAttribute("id", `layer_name_${layer_name}`)
        option.textContent = layer_name
        layer_choice.appendChild(option)

      }

      // Ajout de chaque catégorie pour la couche selectionnée
      let set_layer = layer_choice.value
      let original_fields =  Array.from(data_manager.current_layers[set_layer].original_fields)

      for(let i = 0; i < original_fields.length; i ++){
        let category = document.createElement("option")
        category.textContent = original_fields[i]
        field_choice.appendChild(category)
        }    

      // Ajout des valeurs uniques pour la catégorie selectionnée
      let unique_values = get_unique_value(set_layer)
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
        value_choice.appendChild(liElement)
      }

  }

  var layer_choice = document.getElementById("layer_choice")


  layer_choice.addEventListener("click",function(){console.log(this)}, false)
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

