class CustomHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                header {
                    top: 0;
                    left: 0;
                    width: 100%;
                    background-color: #1E2A38;
                    color: white;
                    padding: 20px 0;
                    text-align: center;
                    font-size: 1.8em;
                    font-weight: 600;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    z-index: 1000;
                }
                /* Agregar margen superior al body para evitar que el contenido se esconda debajo del header */
                body {
                    margin-top: 80px;
                }
            </style>
            <header>
                <slot name="title">Proyecto Parcial - Programación Integrativa</slot>
            </header>
        `;
    }
}

customElements.define('custom-header', CustomHeader);
