import { Graph } from "../data/graph"

export class ButtonInteraction{
    constructor(){
        // Find the button by its ID and tell it to run the function
        const goBackButton = document.getElementById('goBack');
        goBackButton.addEventListener('click', Graph.GoBack);
    }
}