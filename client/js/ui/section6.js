import { Mround } from './../helpers_math';
import { export_compo_png, export_compo_svg, export_layer_geo } from './../map_export';


export function makeSection6() {
  const section6 = d3.select('#section6');
  const dv6 = section6.append('div');

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


/* armel : fonction pour peupler le menu de selection avec la list des couches présentent sur la carte */
export function update_section_6(){

    const layer_choice = d3.select('#layer_choice');
    const field_choice = d3.select('#field_choice');
    const value_choice = d3.select("#value_choice");
    
    const options = []
    for(let i = 0; i < document.getElementById("layer_choice").options.length; i++   ){
        options.push(document.getElementById("layer_choice").options[i].text)
    }

    /* ajout de chaque couche de l'UI a un menu déroulant */
    for(let i = 0; i < Object.keys(data_manager.current_layers).length ; i++){

        let layer_name = Object.keys(data_manager.current_layers)[i]
        
        if( options.includes(layer_name) == false){
        layer_choice
            .append("option")
            .attrs({
                'id' : `layer_name${layer_name}`
            })
            .text(layer_name)}   
             

    }


    /* let original_fields =  Array.from(data_manager.current_layers[layer_choice.property("value")].original_fields)

    for(let i = 0; i < original_fields.length; i ++){

        field_choice
          .append("option")
          .text(original_fields[i])
    } */
    

    
    

    

    

    // peuple le menu déoulant "dimension" lorsqu'on change de couche
    layer_choice
        .selectAll('option')
        .on("click" , function(){

            field_choice
                .selectAll('option')
                .remove()

            let option_text = this.text
            let original_fields =  Array.from(data_manager.current_layers[option_text].original_fields)

            for(let i = 0; i < original_fields.length; i ++){

                field_choice
                    .append("option")
                    .text(original_fields[i])
            update_section_6()
            }
        }
    ) 

    // peuple le menu déroulant avec la liste des valeurs correspondante au champ selectionnée
    field_choice
        .selectAll('option')
        .on("click" , function(){
            value_choice.selectAll("li").remove()

            var unique_values = Array.from(get_unique_value(layer_choice.property("value"))[this.text]) 
            console.log(layer_choice.property("value"));

            for(let value of unique_values){
                value_choice
                    .append("li")
                    .styles({
                      "align-self" : "flex-end"
                    })
                    .text(value)
                    .append("input")
                    .attrs({"type" :"checkbox", "value" : value})
                    

            }
            
            
        }
    ) 

    value_choice
        .selectAll("li")
        .selectAll("input")
        .on("click",  function(){
          let shapes_to_filter = filter_values(layer_choice.property("value"), field_choice.property("value"), this.value)



          for(let shape of shapes_to_filter){

            let filtered_shape = document.getElementById(`feature_${shape}`)

            
            if(this.checked == true){
              filtered_shape.setAttribute("display", "none")
            }
            else{
              filtered_shape.setAttribute("display" , "")
            }
            
          }  
        } 
        )






}

function get_unique_value(layer){

  var user_data = data_manager.user_data[layer]
  var user_values = {}
  var original_fields = data_manager.current_layers[layer].original_fields

  //pour chaque champ de la couche
  for(let current_field of original_fields){
    //récupérer les valeurs uniques du champ
    let unique_values = new Set()
    for(let i  = 0; i < user_data.length ; i++){
        unique_values.add(user_data[i][current_field])
        
    }
    original_fields[current_field] = unique_values
  }

  // retourne un objet avec clef = nom du champ, valeur = set de values
  return original_fields
}


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