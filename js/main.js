/**
 * Kanban Board built with Web Components Custom Elements API
 * @version 0.0.1
 * @author Aonghas MacKay
 * 
 * @todo break custom elements up into seperate module files. See: https://stackoverflow.com/questions/55080103/how-to-separate-web-components-to-individual-files-and-load-them
 * @todo style columns and cards - must be done from within shadow DOM
 * @todo define a custom element for kanban card
 * @todo allow new columns and cards to be added to the board
 * @todo allow cards to be drag and dropped between columns
 * @todo allow cards to be edited
 * @todo allow cards to be deleted
 * @todo allow columns to be deleted
 * @todo allow column names to be edited
 */

//when dom has loaded...
document.addEventListener("DOMContentLoaded", function(event) {
    customElements.define('kanban-column', KanbanColumn);
});

/**
 * Extends the HTMLElement as the section element has no specific class
 * https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom
 * 
 * @extends HTMLElement
 * 
 * @todo allow constructor to accept a name for the column
 * @todo add a new card button functionality
 */
class KanbanColumn extends HTMLElement {
    constructor() {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();

        //get the template from the dom and clone it
        const KanbanColumnTemplate = document.getElementById('kanban-column-template');
        const KanbanColumnClone = KanbanColumnTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(KanbanColumnClone);
    }
}