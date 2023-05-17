
/* armel : fonction pour peupler le menu de selection avec la list des couches présentent sur la carte */
export function update_section_6(){
    /**
     * Fonction pour pallier à la selection D3 qui n'est pas live 
     */
    function return_d3_live_selection(id){
      var element = d3.select(`#${id}`)
      return element
    }
    var checked_inputs = {}
    
    const options = []
    // A l'execution, rajoute la liste des couches présentes au menu déroulant des couches
    for(let i = 0; i < document.getElementById("layer_choice").options.length; i++   ){
        options.push(document.getElementById("layer_choice").options[i].text)
    }

    /* ajout de chaque couche de l'UI a un menu déroulant */
    for(let i = 0; i < Object.keys(data_manager.current_layers).length ; i++){

        let layer_name = Object.keys(data_manager.current_layers)[i]
        
        if( options.includes(layer_name) == false){
          return_d3_live_selection("layer_choice")
            .append("option")
            .attrs({
                'id' : `layer_name_${layer_name}`
            })
            .text(layer_name)}   
    }
    // peuple le menu déoulant "dimension" lorsqu'on change de couche
    return_d3_live_selection("layer_choice")
        .selectAll('option')
        .on("click" , function(){

            //au changement de couches, suppression des champs et valeurs de la couche précedente
            return_d3_live_selection("field_choice")
                .selectAll('option')
                .remove()

            return_d3_live_selection("value_choice")
              .selectAll("li")
              .remove()    
            // valeur du menu choix de couche
            let option_text = this.text
            // liste des champs disponibles pour chaque couche
            let original_fields =  Array.from(data_manager.current_layers[option_text].original_fields)

            //ajout des chamsp au menu déroulant
            for(let i = 0; i < original_fields.length; i ++){
              return_d3_live_selection("field_choice")
                    .append("option")
                    .text(original_fields[i])
            // mise a jour du menu, je suis pas sur pourquoi ca fonctionne
            update_section_6()
            }
        }
    ) 

    // peuple le menu déroulant avec la liste des valeurs correspondante au champ selectionnée
    return_d3_live_selection("field_choice")
        .selectAll('option')
        .on("click" , function(){
            // retire toutes les valeurs du champs/couche précédente
            return_d3_live_selection("value_choice").selectAll("li").remove()
            //couche selectionnée
            let choosed_layer = return_d3_live_selection("layer_choice")
            //récupère les valeurs uniques pour chaque champ
            var unique_values = get_unique_value(choosed_layer.property("value"))

          
            
            //ajout des valeurs
            for(let value of unique_values[this.text].sort()){
              return_d3_live_selection("value_choice")
                    .append("li")
                    .styles({
                      "align-self" : "flex-end"
                    })
                    .text(value)
                    .append("input")
                    .attrs({"type" :"checkbox", "value" : value})
            }
          //maj du menu            
         update_section_6();  
        }
    ) 

    //filtrage des données après click sur les checkbox
    return_d3_live_selection("value_choice")
        .selectAll("input")
        .on("click",  function(){

          //couche selectionnée
          var choosed_layer = return_d3_live_selection("layer_choice").property("value") 

          //id de chaque entitées à filtrer 
          let shapes_to_filter = filter_values(
            choosed_layer,
            return_d3_live_selection("field_choice").property("value"), this.value
            )
          // pour chaque ID
          for(let shape of shapes_to_filter){ 
            // selection par ID compris à l'interrieur un groupe de path (une couche sur l'UI)
            let filtered_shape =  document.querySelector(`#L_${choosed_layer} #feature_${shape}`)           
            if(this.checked == true){
              filtered_shape.setAttribute("display", "none")
            }
            else{
              filtered_shape.setAttribute("display" , "")
            }            
          }  
        } 
     )

    
    var reset_button = d3.select("#reset_button").on("click", function(){
      reset_filter();
      
    })

      /**
   * Reinitialise tous les filtres pour tout afficher
   */

  function reset_filter(){
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
  }

  /**
   * Récupère toutes les checkbox cochées pour pouvoir les garder affichées en naviguant dans les couches
   */
  function get_index_checked_box(){
    var value_choice = document.querySelectorAll("#value_choice input") 
    var seleced_layer = d3.select("#layer_choice").property("value")
    var seleced_field = d3.select("#field_choice").property("value")

    checked_inputs[seleced_layer] = {}
    checked_inputs[seleced_layer][seleced_field] = []

    for(let i = 0; i < value_choice.length ; i++){
      if(value_choice[i].checked == true){
        checked_inputs[seleced_layer][seleced_field].push(i)
      }
    }
  }

  /**
   * Recheck tous les checkbox précédemment cochées
   */
  function recheck_inputs(layer){
    let inputs_to_check = checked_inputs[layer]
    var value_choice = document.querySelectorAll("#value_choice input") 

    for(let i = 0; i < value_choice.length ; i++){
      if(inputs_to_check.includes(i)){
      value_choice[i].checked == true}
    }
    
  }


}