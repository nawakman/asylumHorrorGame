import { Graph } from "../data/graph"

export class ButtonInteraction{
    static goBackButton;

    constructor(){
        // Find the button by its ID and tell it to run the function
        ButtonInteraction.goBackButton = document.getElementById('goBack');
        ButtonInteraction.goBackButton.addEventListener('click', Graph.GoBack);
        ButtonInteraction.goBackButton.addEventListener('click', ()=>{ButtonInteraction.SetGoBackButtonVisibility(false)});//first argument is click event
    }

    static SetGoBackButtonVisibility(isVisible){
        ButtonInteraction.goBackButton.style.visibility=isVisible?'visible':'hidden'//calling from Graph instead of this because goBackButton.addEventListener('click', SetGoBackButtonVisibility) detaches SetGoBackButtonVisibility from the ButtonInteraction class(if that makes sense)
    }
}