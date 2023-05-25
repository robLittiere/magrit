import { AutoScroll } from 'sortablejs';
import { Mround } from './../helpers_math';
import { export_compo_png, export_compo_svg, export_layer_geo } from './../map_export';


export function makeSection6() {
  const dv6 = map_div.insert('div');

  dv6.attrs({
    class : "light-menu"
  })
  dv6.styles({
    "position":"absolute",
    "right" : 0,
    "top" : 0,
    "border" : "solid black 2px",
    "height" : "min-content",
    "border-radius" : "8px",
    "background-color" : "#efefef"

  })
  
  


  // Bouton reset, décoche toutes les checkbox et retire le display none
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
  .text("Reinitialiser")


  

  // menu de selection de couche
  dv6
  .append("p")
  .text("Couche")
  .styles({
    "background-color" : "#595959",
    "color" : "#fff",
    "margin-top" : "0px",
    "margin-bottom" : "0px",
    "font-family": "Baloo Bhaina",
    "text-align" :"center"
       
  })

  const layer_selection = dv6.append('div');
  layer_selection.styles({
    "display" : "flex",
    "flex-direction" : "column",
    "justify-content" : "center"
  })
  /* section choix de la couche */

  layer_selection
    .append('select')
    .attrs({
        "id" : "layer_choice",
        "size" :"2"
    })
    .styles({
      "max-height" : "calc(100% - 4px)",
      "height" : "min-content",
    });

  
  /* section choix de la colonne */
  dv6
  .append("p")
  .text("Dimensions")
  .styles({
    "background-color" : "#595959",
    "color" : "#fff",
    "margin-top" : "0px",
    "margin-bottom" : "0px",
    "font-family": "Baloo Bhaina",
    "text-align" :"center"
       
  })

  const field_choice = dv6.append('div')
  field_choice.styles({
    "display" : "flex",
    "flex-direction" : "column",
    "justify-content" : "center",
    "height" :"min-content"
    
    
  })


  field_choice
    .append('select')
    .attrs({
        'id' : 'field_choice',
        "size": 4
    })
    .styles({ 
      "overflow-y" : "auto",

    })



  /* section choix des valeurs */


  dv6
    .append("p")
    .text("Choix des valeurs")
    .styles({
      "background-color" : "#595959",
      "color" : "#fff",
      "margin-top" : "0px",
      "margin-bottom" : "0px",
      "font-family": "Baloo Bhaina",
      "text-align" :"center"
         
    })
  
  const value_choice = dv6.append("div")
  value_choice.styles({
    
    "height" : "100px",
    "overflow-y" : "auto",
    "padding" :"0px"
    
  })


  
  value_choice
    .append('ul')
    .attrs({
        'id' : "value_choice"
    })
    .styles({
      "list-style" : "none",
      "height" : "max-content"
      
    })
}


// variable stockant les couches déjà présentes sur l'UI, utilisé quand on ajoute une nouvelle couche pour ne pas avoir de doublons
var options = []
// Objet stockant les entités filtrées, utilisé pour recocher les checkbox après changement de menus
export var checked_boxes = {}

/**
 * Met à jour les menus de la section après ajout de couches/selection de couche ou catégories
 * 
 * Contient la fonction pour filtrer les entités sur la carte
 */
export function update_section_6(){

    var layer_choice = document.getElementById("layer_choice")
    var field_choice = document.getElementById("field_choice")

    // A l'execution, rajoute la liste des couches présentes à la liste des couches présentes
    for(let i = 0; i < layer_choice.options.length; i++){
        options.push(layer_choice.options[i].text)        
      }  

    // ajout de chaque couche de l'UI a un menu déroulant 
    for(let i = 0; i < Object.keys(data_manager.current_layers).length ; i++){

      let layer_name = Object.keys(data_manager.current_layers)[i]

      // Si la couche n'est pas déjà présente, on l'ajoute au menu déourlant
      if( options.includes(layer_name) == false){
        let option = document.createElement("option")
        option.setAttribute("id", `layer_name_${layer_name}`)
        option.textContent = layer_name
        // Met a jour le choix des colonnes et valeurs après selection d'une couche différente
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

  
// Supprime tous les html_tag spécifiés d'un menu, utilisé lors du changement de couche/catégorie
  function reset_menu (menu_element, html_tag){
    let sub_menu = document.getElementById(menu_element)
    let children_elements = sub_menu.querySelectorAll(html_tag)

    for(let element of children_elements){
      element.remove()
    }
  }

  // Insertion des catégories correspondante à la couche active dans le menu déroulant
  function update_fields(){
    let layer_choice = document.getElementById("layer_choice")

    if(layer_choice.value != ""){
      var set_layer = layer_choice.value
    } 
    else{
      var set_layer = layer_choice.firstChild.value
    }

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

  // Ajout des valeurs lors du changement de couche
  function update_values(){
    let layer_choice = document.getElementById("layer_choice")
    if(layer_choice.value != ""){
      var set_layer = layer_choice.value
    } 
    else{
      var set_layer = layer_choice.firstChild.value
    }

    let unique_values = get_unique_value(set_layer)
    if(field_choice.value != ""){
      var set_field = field_choice.value
    } 
    else{
      var set_field = field_choice.firstChild.value
    }
      
    for(let value of unique_values[set_field].sort()){

        const liElement = document.createElement("li");
        liElement.style.alignSelf = "flex-end";
        
        const textNode = document.createTextNode(value);
        liElement.appendChild(textNode);
        
        const inputElement = document.createElement("input");
        inputElement.type = "checkbox";
        inputElement.value = value;

        // Si la valeur à été précedemment coché par un utilisateur, elle est recochée lorsqu'on revient sur la catéogrie correspondante
        if(JSON.stringify(checked_boxes[set_layer][set_field]).includes(value) == true ){
          inputElement.checked = true
        }
        
        liElement.appendChild(inputElement);
        value_choice.appendChild(liElement);


        inputElement.addEventListener("click",function(){
          let shapes_to_filter = filter_values(set_layer ,set_field, this.value)

          // pour chaque ID, Filtrage ou défiltrage via display none du shape correspondant à la case cochée
          for(let shape of shapes_to_filter){ 
            // selection par ID compris à l'interrieur un groupe de path (une couche sur l'UI)
            let filtered_shape =  document.querySelector(`#L_${set_layer} #feature_${shape}`)           
            if(this.checked == true){
              filtered_shape.setAttribute("display", "none")
              manage_checked_boxes(true, set_layer,set_field, this.value)
              }
            else{
              filtered_shape.setAttribute("display" , "")
              manage_checked_boxes(false, set_layer , set_field, this.value)
            }            
            }
          })
    }
  } 

  // Ajoute ou supprime des valeurs cochées/décochées de la variable checked_boxes
  function manage_checked_boxes (add, layer, field, value){
    let checked_boxes_stringified = JSON.stringify(checked_boxes)

    if (add == true){
      checked_boxes[layer][field].push(value)
    }
    if (add == false){
      checked_boxes[layer][field] = checked_boxes[layer][field].filter(value => value != value)
    }

  }
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
 * par l'utilisateur pour masquer.
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
