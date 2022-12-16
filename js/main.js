/**
 * Kanban Board built with Web Components Custom Elements API
 * @version 0.2.0
 * @author Aonghas MacKay
 * @license GPL-3.0
 * 
 * @todo allow cards to be drag and dropped between columns
 * @todo allow cards to be edited
 * @todo allow cards to be deleted
 */

//when dom has loaded...
document.addEventListener("DOMContentLoaded", function(event) {
    customElements.define('kanban-column', KanbanColumn);
    customElements.define('kanban-card', KanbanCard);
    customElements.define('add-kanban-column', AddKanbanColumn);
    customElements.define('kanban-card-popup', KanbanCardPopup);

    new KanbanBoard();
});

/**
 * Extends the HTMLElement as the section element has no specific class
 * https://html.spec.whatwg.org/multipage/dom.html#elements-in-the-dom
 * 
 * @extends HTMLElement
 */
class KanbanColumn extends HTMLElement {
    constructor(columnName = 'To Do') {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();

        this.name = columnName;

        //get the template from the dom and clone it
        const kanbanColumnTemplate = document.getElementById('kanban-column-template');
        const kanbanColumnClone = kanbanColumnTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(kanbanColumnClone);

        //set the id of the column
        this.id = this.setId(shadowRoot);

        //add event listeners to the shadow DOM
        this.addColumnEventListeners(shadowRoot);
        //set the column name
        this.setColumnName(shadowRoot, columnName);
    }

    /**
     * Sets the elements id as a unique string
     * 
     * @returns {String} id
     */
    setId() {
        let id = 1;
        const kanbanColumns = document.querySelectorAll('kanban-column');
        if (kanbanColumns.length > 0) {
            id = kanbanColumns.length + 1;
            return `column-${id}`;
        } else {
            return `column-${id}`;
        }
    }

    /**
     * Set the column name
     * 
     * @param {ShadowRoot} shadowRoot 
     * @param {String} columnName 
     */
    setColumnName(shadowRoot, columnName) {
        shadowRoot.querySelector('[name="kanban-column-title"]').value = columnName;
    }

    /**
     * Add event listeners to the elements in the shadow DOM
     * 
     * @param {ShadowRoot} shadowRoot 
     */
    addColumnEventListeners(shadowRoot) {
        const kanbanColumn = this;
        const deleteKanbanColumnButton = shadowRoot.querySelector('.kanban-column-delete-button');
        deleteKanbanColumnButton.addEventListener('click', function(event) {
            kanbanColumn.deleteKanbanColumn();
        });

        const addKanbanCardButton = shadowRoot.querySelector('.add-kanban-card-button');
        addKanbanCardButton.addEventListener('click', function(event) {
            //const kanbanCardContainer = shadowRoot.querySelector('.kanban-card-container');
            //kanbanCardContainer.appendChild(new KanbanCard());
            document.querySelector('body').appendChild(new KanbanCardPopup(kanbanColumn.id));
        });

        const columnNameInput = shadowRoot.querySelector('[name="kanban-column-title"]');
        columnNameInput.addEventListener('input', function(event) {
            kanbanColumn.name = event.target.value;
        });
    }

    /**
     * Delete the kanban-column element from the DOM
     */
    deleteKanbanColumn() {
        this.remove();
    }
}


class AddKanbanColumn extends HTMLElement {
    constructor() {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();
        
        //get the template from the dom and clone it
        const addKanbanColumnTemplate = document.getElementById('add-kanban-column-template');
        const addKanbanColumnClone = addKanbanColumnTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(addKanbanColumnClone);

        //add event listener to the shadow DOM
        this.addEventListener(shadowRoot);
    }

    /**
     * Adds a new KanbanColumn to the DOM before the add-kanban-column element
     * 
     * @param {ShadowRoot} shadowRoot 
     */
    addEventListener(shadowRoot) {
        shadowRoot.querySelector('.add-kanban-column-button').addEventListener('click', function(event) {
            KanbanBoard.addNewKanbanColumn();
        });
    }
}


/**
 * The popup that appears when the user clicks on the add card button or an existing card
 * 
 * @extends HTMLElement
 */
class KanbanCardPopup extends HTMLElement {
    constructor(id, name = 'New Card', description = 'New Card Description') {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();
        this.name = name;
        this.description = description;
        this.columnId = id;
        
        //get the template from the dom and clone it
        const kanbanCardPopupTemplate = document.getElementById('kanban-card-popup-template');
        const kanbanCardPopupClone = kanbanCardPopupTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(kanbanCardPopupClone);

        //show dialog modal
        shadowRoot.querySelector('dialog').show();

        //fill the form with the provided values
        this.fillForm(shadowRoot);

        //add event listeners to the shadow DOM
        this.addEventListeners(shadowRoot);
    }

    /**
     * Fills the popup form with the provided values
     * 
     * @param {ShadowRoot} shadowRoot 
     */
    fillForm(shadowRoot) {
        shadowRoot.querySelector('[name="kanban-card-title"]').value = this.name;
        shadowRoot.querySelector('[name="kanban-card-description"]').value = this.description;
    }

    /**
     * Adds event listeners to the elements in the shadow DOM
     * 
     * @param {ShadowRoot} shadowRoot 
     */
    addEventListeners(shadowRoot) {
        const self = this;
        shadowRoot.querySelector('.kanban-card-popup-close-button').addEventListener('click', function(event) {
            self.closeCardPopup();
        });

        shadowRoot.querySelector('.kanban-card-popup-save-button').addEventListener('click', function(event) {
            self.saveCard();
        });
    }

    /**
     * Saves the card to the DOM
     */
    saveCard() {
        //get column card container by id
        const column = document.querySelector(`#${this.columnId}`);
        const shadowRoot = column.shadowRoot;
        const kanbanCardContainer = shadowRoot.querySelector('.kanban-card-container');
        kanbanCardContainer.appendChild(new KanbanCard(this.name, this.description));

        this.closeCardPopup();
    }

    /**
     * Closes the popup
     */
    closeCardPopup() {
        this.remove();
    }
}

class KanbanCard extends HTMLElement {
    constructor(name, description) {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();
        this.name = name;
        this.description = description;

        //get the template from the dom and clone it
        const kanbanCardTemplate = document.getElementById('kanban-card-template');
        const kanbanCardClone = kanbanCardTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(kanbanCardClone);

        this.fillCard(shadowRoot);
    }

    fillCard(shadowRoot) {
        shadowRoot.querySelector('.card-title').innerHTML = this.name;
        shadowRoot.querySelector('.card-description').innerHTML = this.description;
    }
}

/**
 * Accepts an array of column names and creates a KanbanColumn for each within the main element
 * 
 * @param {Array} kanbanColumns
 */
class KanbanBoard {
    constructor(kanbanColumns = ['To Do', 'In Progress', 'Testing', 'Done']) {
        const self = this;
        this.main = document.querySelector('main');

        //create a new column for each column name provided
        kanbanColumns.forEach(function(columnName) {
            self.addKanbanColumn(columnName);
        });

        //add the add column button to the DOM after the last column
        this.main.appendChild(new AddKanbanColumn());
    }

    /**
     * Adds a new kanban-column element to the DOM
     * 
     * @param {String} columnName 
     */
    addKanbanColumn(columnName) {
        this.main.appendChild(new KanbanColumn(columnName));
    }

    /**
     * Adds a new kanban-column element to the DOM before the add-kanban-column element
     * 
     * @static
     * @param {String} columnName 
     */
    static addNewKanbanColumn(columnName) {
        const addNewColumnButton = document.querySelector('add-kanban-column');
        document.querySelector('main').insertBefore(new KanbanColumn(columnName), addNewColumnButton);
    }
}