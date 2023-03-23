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

  value_choice
    .append("ul")
    .attrs({
        "id" : "value_choice"
    })

}


/* armel : fonction pour peupler le menu de selection avec la list des couches présentent sur la carte */
export function update_section_6(){

    const layer_choice = d3.select('#layer_choice');
    const field_choice = d3.select('#field_choice')
    
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
            }
        }
    ) 

    

}