class ParticipantesList extends HTMLElement {
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

            .edit-form-container {
                background-color: #ecf0f1;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .edit-form-container form {
                display: flex;
                flex-direction: column;
            }

            .edit-form-container label {
                font-size: 1rem;
                margin-bottom: 8px;
            }

            .edit-form-container input, .edit-form-container textarea {
                padding: 10px;
                font-size: 1rem;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
            }

            .edit-form-container button {
                padding: 10px;
                background-color: #2c3e50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                transition: background-color 0.3s;
            }

            .edit-form-container button:hover {
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
            const participantes = data || [];
            this.render(participantes);
        } catch (error) {
            console.log(`Error al realizar fetch: ${error}`);
            this.container.innerHTML = `
                <p class="error-alert">Error con la API</p>
            `;
        }
    };

    render = (participantes) => {
        if (participantes.length === 0) {
            this.container.innerHTML = `
                <p class="empty-alert">No existen participantes</p>
            `;
            return;
        }

        const tableTemplate = document.createElement('template');
        tableTemplate.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Id Participante</th>
                            <th>Nombre</th>
                            <th>Edad</th>
                            <th>Email</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${participantes.map(participante => `
                            <tr id="row-${participante.id_participante}">
                                <td>${participante.id_participante}</td>
                                <td>${participante.nombre}</td>
                                <td>${participante.edad}</td>
                                <td>${participante.email}</td>
                                <td>
                                    <button class="btn-actualizar" data-id="${participante.id_participante}">Actualizar</button>
                                    <button class="btn-delete" data-id="${participante.id_participante}">Eliminar</button>
                                </td>
                            </tr>
                            <tr id="edit-form-${participante.id_participante}" class="edit-form-row" style="display: none;">
                                <td colspan="5">
                                    <div class="edit-form-container"></div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        this.container.innerHTML = '';
        this.container.appendChild(tableTemplate.content);

        this.container.querySelectorAll('.btn-actualizar').forEach(button => {
            button.addEventListener('click', (e) => this.showEditForm(e.target.dataset.id));
        });
        this.container.querySelectorAll('.btn-delete').forEach(button => {
            button.addEventListener('click', () => this.handleDelete(button.dataset.id));
        });
    };

    showEditForm = (id) => {
        const formRow = this.container.querySelector(`#edit-form-${id}`);
        const formContainer = formRow.querySelector('.edit-form-container');

        formRow.style.display = formRow.style.display === 'none' ? 'table-row' : 'none';

        if (formContainer.innerHTML.trim() !== '') return;

        formContainer.innerHTML = `
            <form id="form-${id}" class="edit-form">
                <label for="nombre-${id}">Nombre:</label>
                <input type="text" id="nombre-${id}" value="">
                <label for="edad-${id}">Edad:</label>
                <input type="number" id="edad-${id}" value="">
                <label for="email-${id}">Email:</label>
                <input type="email" id="email-${id}" value="">
                <button type="submit">Guardar Cambios</button>
            </form>
        `;

        const participante = this.getParticipanteById(id);
        this.shadowRoot.querySelector(`#nombre-${id}`).value = participante.nombre;
        this.shadowRoot.querySelector(`#edad-${id}`).value = participante.edad;
        this.shadowRoot.querySelector(`#email-${id}`).value = participante.email;

        const form = formContainer.querySelector(`#form-${id}`);
        form.addEventListener('submit', (e) => this.handleUpdate(e, id));
    };

    getParticipanteById = (id) => {
        const participantes = this.container.querySelectorAll('tr[id^="row-"]');
        for (const participanteRow of participantes) {
            const participanteId = participanteRow.querySelector('td').innerText;
            if (participanteId === id) {
                return {
                    id_participante: id,
                    nombre: participanteRow.cells[1].innerText,
                    edad: participanteRow.cells[2].innerText,
                    email: participanteRow.cells[3].innerText
                };
            }
        }
        return null; 
    };

    handleUpdate = async (event, id) => {
        event.preventDefault();

        const nombre = this.shadowRoot.querySelector(`#nombre-${id}`).value;
        const edad = this.shadowRoot.querySelector(`#edad-${id}`).value;
        const email = this.shadowRoot.querySelector(`#email-${id}`).value;

        const updatedParticipante = { nombre, edad, email };
        const apiURL = this.getAttribute('api-url');

        try {
            const response = await fetch(`${apiURL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedParticipante),
            });

            if (response.ok) {
                alert('Participante actualizado con éxito');
                this.fetchData(apiURL); 
            } else {
                alert('Error al actualizar el participante');
            }
        } catch (error) {
            console.error('Error al actualizar participante:', error);
            alert('Error al conectar con la API');
        }
    };

    handleDelete = async (id) => {
        const confirmDelete = confirm(`¿Estás seguro de eliminar el participante con ID: ${id}?`);
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8000/participantes/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    alert('Participante eliminado con éxito');
                    const apiUrl = this.getAttribute('api-url');
                    this.fetchData(apiUrl);
                } else {
                    alert('Error al eliminar el participante');
                }
            } catch (error) {
                console.error("Error al eliminar", error);
                alert('Error al conectar con la API');
            }
        }
    };
}

window.customElements.define('participante-list', ParticipantesList);
