/**
 * JavaScript para la página de error 404
 * Funcionalidades: navegación, búsqueda, animaciones
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Página 404 cargada');
    
    // Animación de entrada para el contenido
    const contenido = document.querySelector('.text-center');
    if (contenido) {
        contenido.style.opacity = '0';
        contenido.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            contenido.style.transition = 'all 0.6s ease';
            contenido.style.opacity = '1';
            contenido.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Animación del ícono de error
    const icono = document.querySelector('.fa-exclamation-triangle');
    if (icono) {
        icono.style.animation = 'pulse 2s infinite';
    }
    
    // Configurar auto-redirección opcional
    configurarAutoRedireccion();
    
    // Agregar funcionalidad de búsqueda
    configurarBusqueda();
});

/**
 * Configura la auto-redirección después de un tiempo
 */
function configurarAutoRedireccion() {
    let contador = 10; // segundos
    const elementoContador = document.createElement('div');
    elementoContador.className = 'alert alert-info mt-3';
    elementoContador.innerHTML = `
        <i class="fas fa-clock me-2"></i>
        Serás redirigido automáticamente en <span id="contador-redireccion">${contador}</span> segundos
        <button class="btn btn-sm btn-outline-secondary ms-2" onclick="cancelarRedireccion()">Cancelar</button>
    `;
    
    const contenedor = document.querySelector('.text-center');
    contenedor.appendChild(elementoContador);
    
    const intervalo = setInterval(() => {
        contador--;
        const spanContador = document.getElementById('contador-redireccion');
        if (spanContador) {
            spanContador.textContent = contador;
        }
        
        if (contador <= 0) {
            clearInterval(intervalo);
            window.location.href = '/alumnos';
        }
    }, 1000);
    
    // Guardar referencia para poder cancelar
    window.intervaloRedireccion = intervalo;
}

/**
 * Cancela la auto-redirección
 */
function cancelarRedireccion() {
    if (window.intervaloRedireccion) {
        clearInterval(window.intervaloRedireccion);
        const elementoContador = document.querySelector('.alert-info');
        if (elementoContador) {
            elementoContador.remove();
        }
    }
}

/**
 * Configura la funcionalidad de búsqueda
 */
function configurarBusqueda() {
    const contenedor = document.querySelector('.text-center');
    const barraBusqueda = document.createElement('div');
    barraBusqueda.className = 'mt-4';
    barraBusqueda.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="input-group">
                    <input type="text" class="form-control" id="buscar-404" placeholder="Buscar alumno por legajo o nombre...">
                    <button class="btn btn-primary" type="button" onclick="buscarAlumno()">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <small class="text-muted d-block mt-2">
                    <i class="fas fa-info-circle me-1"></i>
                    Ingresa el legajo o nombre del alumno que buscas
                </small>
            </div>
        </div>
    `;
    
    contenedor.appendChild(barraBusqueda);
    
    // Event listener para búsqueda con Enter
    const inputBusqueda = document.getElementById('buscar-404');
    inputBusqueda.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarAlumno();
        }
    });
}

/**
 * Busca un alumno y redirige si lo encuentra
 */
function buscarAlumno() {
    const termino = document.getElementById('buscar-404').value.trim();
    
    if (!termino) {
        mostrarNotificacion('Por favor, ingresa un término de búsqueda', 'warning');
        return;
    }
    
    // Mostrar indicador de carga
    const btnBuscar = document.querySelector('#buscar-404 + button');
    const iconoOriginal = btnBuscar.innerHTML;
    btnBuscar.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    btnBuscar.disabled = true;
    
    // Simular búsqueda (en una implementación real, harías una petición AJAX)
    setTimeout(() => {
        // Restaurar botón
        btnBuscar.innerHTML = iconoOriginal;
        btnBuscar.disabled = false;
        
        // Por ahora, redirigir a la lista con un parámetro de búsqueda
        window.location.href = `/alumnos?buscar=${encodeURIComponent(termino)}`;
    }, 1000);
}

/**
 * Muestra una notificación toast
 * @param {string} mensaje - Mensaje a mostrar
 * @param {string} tipo - Tipo de notificación (success, error, warning, info)
 */
function mostrarNotificacion(mensaje, tipo = 'info') {
    const toastContainer = document.getElementById('toast-container') || crearToastContainer();
    
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${tipo} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function crearToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '1055';
    document.body.appendChild(container);
    return container;
}

/**
 * Navega a una URL específica
 * @param {string} url - URL a la que navegar
 */
function navegarA(url) {
    window.location.href = url;
}

/**
 * Actualiza la página
 */
function actualizarPagina() {
    window.location.reload();
}

// Event listeners para atajos de teclado
document.addEventListener('keydown', function(e) {
    // Ctrl + H para ir al inicio
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        navegarA('/alumnos');
    }
    
    // Ctrl + F para buscar
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        const inputBusqueda = document.getElementById('buscar-404');
        if (inputBusqueda) {
            inputBusqueda.focus();
        }
    }
    
    // F5 para actualizar
    if (e.key === 'F5') {
        e.preventDefault();
        actualizarPagina();
    }
    
    // Escape para ir al inicio
    if (e.key === 'Escape') {
        navegarA('/alumnos');
    }
});

// Agregar estilos CSS para animaciones
const estilos = document.createElement('style');
estilos.textContent = `
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    .fade-in {
        animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(estilos);
