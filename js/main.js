/**
 * Kanban Board built with Web Components Custom Elements API
 * @version 0.1.0
 * @author Aonghas MacKay
 * @license GPL-3.0
 * 
 * @todo style cards
 * @todo allow new cards to be added to the board
 * @todo allow cards to be drag and dropped between columns
 * @todo allow cards to be edited
 * @todo allow cards to be deleted
 */

//when dom has loaded...
document.addEventListener("DOMContentLoaded", function(event) {
    customElements.define('kanban-column', KanbanColumn);
    customElements.define('kanban-card', KanbanCard, { extends: 'div' });
    customElements.define('add-kanban-column', addKanbanColumn);

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

        //add event listeners to the shadow DOM
        this.addColumnEventListeners(shadowRoot);
        //set the column name
        this.setColumnName(shadowRoot, columnName);
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
            const kanbanCardContainer = shadowRoot.querySelector('.kanban-card-container');
            kanbanCardContainer.appendChild(new KanbanCard());
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


class addKanbanColumn extends HTMLElement {
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
 * @extends HTMLDivElement
 */
class KanbanCard extends HTMLDivElement {
    constructor() {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();

        //get the template from the dom and clone it
        const kanbanColumnTemplate = document.getElementById('kanban-card-template');
        const kanbanColumnClone = kanbanColumnTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(kanbanColumnClone);
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

        this.main.appendChild(new addKanbanColumn());
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