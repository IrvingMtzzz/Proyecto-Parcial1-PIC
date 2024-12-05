class ParticipanteForm extends HTMLElement {
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
                flex-direction: column;
                align-items: center;
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

            input {
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
        this.container.innerHTML = `
            <div class="form-container">
                <h2>Registro de Participante</h2>
                <form id="participante-form">
                    <label for="nombre">Nombre:</label>
                    <input type="text" id="nombre" name="nombre" placeholder="Ingresa el nombre" required>

                    <label for="edad">Edad:</label>
                    <input type="number" id="edad" name="edad" placeholder="Ingresa la edad" required>

                    <label for="email">Email:</label>
                    <input type="email" id="email" name="email" placeholder="Ingresa el correo electrónico" required>

                    <button type="submit">Registrar Participante</button>
                </form>
            </div>
        `;
    }

    addSubmitEvent() {
        const form = this.shadowRoot.querySelector('#participante-form');
        form.addEventListener('submit', this.handleSubmit);
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const nombre = this.shadowRoot.querySelector('#nombre').value;
        const edad = parseInt(this.shadowRoot.querySelector('#edad').value, 10);
        const email = this.shadowRoot.querySelector('#email').value;

        const newParticipante = {
            nombre,
            edad,
            email
        };

        try {
            const response = await fetch('http://localhost:8000/participantes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newParticipante)
            });

            if (response.ok) {
                alert('Participante registrado');
                this.shadowRoot.querySelector('#participante-form').reset();
            } else {
                alert('Error al registrar');
            }

        } catch (error) {
            console.log(`Error al realizar fetch: ${error}`);
            this.container.innerHTML = `
                <p class="error-alert">Error con la API</p>
            `;
        }
    };
}

window.customElements.define('participante-form', ParticipanteForm);
