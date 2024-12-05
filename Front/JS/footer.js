class CustomFooter extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.estilo = document.createElement("style");
        this.estilo.textContent = `
            .footer-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background-color: #1E2A38;
                color: white;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .footer-bottom {
                font-size: 0.9rem;
                opacity: 0.8;
            }
        `;

        this.template = document.createElement('template');
        this.template.innerHTML = `
            <div class="footer-container">
                <div class="footer-bottom">
                    <slot name="footer-bottom">© 2024 Todos los derechos reservados</slot>
                </div>
            </div>
        `;

        this.shadow.appendChild(this.estilo);
        this.shadow.appendChild(this.template.content.cloneNode(true));
    }
}

window.customElements.define('custom-footer', CustomFooter);
