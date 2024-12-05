class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.container = document.createElement('div');
        this.estilo = document.createElement('style');
        
        this.estilo.textContent = `
            .nav-container {
                background-color: #2c3e50;
                padding: 1rem 2rem;
                display: flex;
                justify-content: center;
                align-items: center;
                color: white;
                font-size: 1.2rem;
                border-bottom: 2px solid #34495e;
                position: relative;
            }

            .nav-container a {
                color: white;
                text-decoration: none;
                margin: 0 20px;
                padding: 10px;
                border-radius: 5px;
                transition: all 0.3s ease;
                font-weight: normal;
                position: relative;
            }

            .nav-container a:hover {
                background-color: #ffbb33;
                color: #2c3e50;
                transform: translateY(-3px);
            }

            .nav-container a.active {
                background-color: #ffbb33;
                color: #2c3e50;
                font-weight: bold;
                transform: translateY(-3px);
            }

            .dropdown {
                position: relative;
            }

            .dropdown-content {
                display: none;
                position: absolute;
                background-color: #2c3e50;
                min-width: 160px;
                z-index: 1;
                top: 100%;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .dropdown:hover .dropdown-content {
                display: block;
                opacity: 1;
            }

            .dropdown-content a {
                padding: 10px;
                color: white;
                text-decoration: none;
                display: block;
                transition: background-color 0.3s ease;
            }

            .dropdown-content a:hover {
                background-color: #ffbb33;
            }

            .hamburger {
                display: none;
                flex-direction: column;
                cursor: pointer;
            }

            .hamburger div {
                width: 30px;
                height: 4px;
                margin: 6px;
                background-color: white;
                transition: all 0.3s ease;
            }

            .menu {
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .menu.open {
                display: flex;
                flex-direction: column;
                width: 100%;
                position: absolute;
                top: 70px;
                left: 0;
                background-color: #2c3e50;
                padding: 20px;
                border-radius: 8px;
            }

            @media (max-width: 768px) {
                .hamburger {
                    display: flex;
                }

                .nav-container {
                    width: 100%;
                }

                .menu {
                    display: none;
                    width: 100%;
                    text-align: center;
                }

                .menu.open {
                    display: flex;
                }
            }
        `;
        
        this.shadowRoot.appendChild(this.estilo);
        this.shadowRoot.appendChild(this.container);
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        this.container.innerHTML = `
            <div class="nav-container">
                <div class="hamburger">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <div class="menu">
                    <slot name="home">
                        <a href="index.html" id="home">Inicio</a>
                    </slot>
                    <slot name="participants">
                        <a href="participantes.html" id="participants">Participantes</a>
                    </slot>
                    <slot name="activities">
                        <a href="actividades.html" id="activities">Actividades</a>
                    </slot>
                    <slot name="enrollments">
                        <a href="inscripciones.html" id="enrollments">Inscripciones</a>
                    </slot>
                    <slot name="about">
                        <a href="acerca.html" id="about">Acerca de</a>
                    </slot>
                </div>
            </div>
        `;
    }

    addEventListeners() {
        const hamburger = this.shadowRoot.querySelector('.hamburger');
        const menu = this.shadowRoot.querySelector('.menu');
        hamburger.addEventListener('click', () => {
            menu.classList.toggle('open');
        });

        const links = this.shadowRoot.querySelectorAll('.nav-container a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                this.navigateTo(link.id);
            });
        });
    }

    navigateTo(view) {
        const links = this.shadowRoot.querySelectorAll('.nav-container a');
        links.forEach(link => link.classList.remove('active'));
        const activeLink = this.shadowRoot.querySelector(`#${view}`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        console.log(`Navegando a: ${view}`);
    }
}

window.customElements.define('nav-bar', NavBar);
