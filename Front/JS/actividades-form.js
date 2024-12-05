class ActividadesForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.estilo = document.createElement('style');
        
        this.estilo.textContent = `
            .form-container {
                background-color: #f4f4f9;
                padding: 30px;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                width: 100%;
                max-width: 800px;
                margin: 30px auto;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
            }

            .form-container div {
                flex: 1;
                padding: 10px;
            }

            h2 {
                text-align: center;
                color: #2c3e50;
                margin-bottom: 20px;
                width: 100%;
            }

            label {
                font-size: 1rem;
                margin-bottom: 8px;
                color: #2c3e50;
            }

            input, textarea {
                width: 100%;
                padding: 10px;
                font-size: 1rem;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }

            button {
                padding: 12px;
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
                width: 100%;
            }

            button:hover {
                background-color: #2980b9;
            }

            .error-alert {
                text-align: center;
                color: #e74c3c;
                font-weight: bold;
            }
        `;
        
        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        this.render();
        this.addSubmitEvent();
    }

    render() {
        const formTemplate = document.createElement('template');
        formTemplate.innerHTML = `
            <div class="form-container">
                <div>
                    <h2>Registro de Actividad</h2>
                    <form id="actividad-form">
                        <label for="nombre_actividad">Nombre de la Actividad:</label>
                        <input type="text" id="nombre_actividad" name="nombre_actividad" placeholder="Ingresa el nombre de la actividad" required>

                        <label for="descripcion">Descripción:</label>
                        <textarea id="descripcion" name="descripcion" placeholder="Ingresa la descripción" required></textarea>

                        <button type="submit">Registrar Actividad</button>
                    </form>
                </div>
            </div>
        `;
        
        this.container.innerHTML = '';
        this.container.appendChild(formTemplate.content);
    }

    addSubmitEvent() {
        const form = this.shadowRoot.querySelector('#actividad-form');
        form.addEventListener('submit', this.handleSubmit);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const nombre_actividad = this.shadowRoot.querySelector('#nombre_actividad').value;
        const descripcion = this.shadowRoot.querySelector('#descripcion').value;

        const newActividad = {
            nombre_actividad,
            descripcion
        };

        try {
            const response = await fetch('http://localhost:8000/actividades', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newActividad)
            });

            if (response.ok) {
                alert('Actividad registrada');
                this.shadowRoot.querySelector('#actividad-form').reset();
            } else {
                alert('Error al registrar la actividad');
            }

        } catch (error) {
            this.container.innerHTML = `<p class="error-alert">Error con la API</p>`;
        }
    };
}

window.customElements.define('actividades-form', ActividadesForm);
