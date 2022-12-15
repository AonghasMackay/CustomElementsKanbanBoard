/**
 * Kanban Board built with Web Components Custom Elements API
 * @version 0.0.1
 * @author Aonghas MacKay
 * @license GPL-3.0
 * 
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
    customElements.define('kanban-card', KanbanCard, { extends: 'div' });

    new KanbanBoard();
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
    constructor(columnName = 'To Do') {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();

        //get the template from the dom and clone it
        const kanbanColumnTemplate = document.getElementById('kanban-column-template');
        const kanbanColumnClone = kanbanColumnTemplate.content.cloneNode(true);

        //create a shadow DOM root and append the cloned template to it
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(kanbanColumnClone);

        this.addColumnEventListeners(shadowRoot);
        this.setColumnName(shadowRoot, columnName);
    }

    setColumnName(shadowRoot, columnName) {
        shadowRoot.querySelector('[name="kanban-column-title"]').textContent = columnName;
    }

    addColumnEventListeners(shadowRoot) {
        const kanbanColumn = this;
        const deleteKanbanColumnButton = shadowRoot.querySelector('.kanban-column-delete-button');
        deleteKanbanColumnButton.addEventListener('click', function(event) {
            kanbanColumn.deleteKanbanColumn();
        });
    }

    deleteKanbanColumn() {
        this.remove();
        return true;
    }
}


class KanbanCard extends HTMLDivElement {
    constructor() {
        //Calls the parent class's constructor and binds the parent class's public fields, 
        //after which the derived class's constructor can further access and modify 'this'.
        //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
        super();
    }
}

class KanbanBoard {
    constructor(kanbanColumns = ['To Do', 'In Progress', 'Testing', 'Done']) {
        const self = this;
        this.main = document.querySelector('main');

        kanbanColumns.forEach(function(columnName) {
            self.addKanbanColumn(columnName);
        });
    }

    addKanbanColumn(columnName) {
        this.main.appendChild(new KanbanColumn(columnName));
    }
}