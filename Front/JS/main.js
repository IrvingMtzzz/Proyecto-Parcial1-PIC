class MainContainer extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });

        this.estilo = document.createElement("style");
        this.estilo.textContent = `
            .main-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-between; 
                min-height: 70vh; 
                padding: 20px;
                background-color: #f5f5f5;
            }

            .main-content {
                flex-grow: 1; /* Hace que el contenido ocupe el espacio disponible */
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
                padding: 10px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                text-align: center;
            }

            .project-info {
                font-family: Arial, sans-serif;
                color: #333;
            }

            .project-info h2 {
                font-size: 2rem;
                color: #2c3e50;
                margin-bottom: 15px;
            }

            .project-info p {
                font-size: 1.2rem;
                color: #34495e;
                margin-bottom: 10px;
            }

            .project-info .info-detail {
                font-size: 1rem;
                color: #7f8c8d;
                margin-top: 10px;
            }
        `;

        this.template = document.createElement('template');
        this.template.innerHTML = `
            <div class="main-container">
                <div class="main-content">
                    <slot name="content">
                        <div class="project-info">
                            <h2>Proyecto Final - Programación Integrativa</h2>
                            <p>Este proyecto demuestra el uso de Custom Elements, Shadow DOM, API REST y más en el desarrollo de componentes web.</p>
                            <div class="info-detail">
                                <p><strong>Nombre:</strong> Irving Martinez</p>
                                <p><strong>Fecha:</strong> 02 de Diciembre 2024</p>
                                <p><strong>NRC:</strong> 3822</p>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        `;

        this.shadow.appendChild(this.estilo);
        this.shadow.appendChild(this.template.content.cloneNode(true));
    }
}

window.customElements.define('main-container', MainContainer);
