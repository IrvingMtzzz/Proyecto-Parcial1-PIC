class InscripcionesList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.estilo = document.createElement('style');
        this.estilo.textContent = `
            .container {
                padding: 20px;
                font-family: Arial, sans-serif;
                background-color: #f4f4f9;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .table-container {
                overflow-x: auto;
                margin-top: 20px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                background-color: #fff;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            th, td {
                padding: 12px 15px;
                text-align: left;
                border-bottom: 1px solid #ddd;
            }

            th {
                background-color: #2c3e50;
                color: white;
            }

            tr:hover {
                background-color: #f1f1f1;
            }

            .btn-actualizar, .btn-delete {
                background-color: #3498db;
                color: white;
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .btn-actualizar:hover, .btn-delete:hover {
                background-color: #2980b9;
            }

            .alert {
                text-align: center;
                color: #e74c3c;
                font-weight: bold;
            }

            .empty-alert {
                color: #7f8c8d;
            }

            .error-alert {
                color: #e74c3c;
            }
        `;
        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        const apiURL = this.getAttribute('api-url');
        this.fetchData(apiURL);
    }

    fetchData = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            const inscripciones = data || [];
            this.render(inscripciones);
        } catch (error) {
            this.container.innerHTML = `
                <p class="error-alert">Error al cargar las inscripciones</p>
            `;
        }
    };

    render = (inscripciones) => {
        if (inscripciones.length === 0) {
            this.container.innerHTML = `
                <p class="empty-alert">No existen inscripciones</p>
            `;
            return;
        }

        const tableTemplate = document.createElement('template');
        tableTemplate.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Nombre Participante</th>
                            <th>Nombre Actividad</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${inscripciones.map(inscripcion => `
                            <tr>
                                <td>${inscripcion.nombre_participante}</td>
                                <td>${inscripcion.nombre_actividad}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.container.innerHTML = '';
        this.container.appendChild(tableTemplate.content);
    };
}

window.customElements.define('inscripciones-list', InscripcionesList);
